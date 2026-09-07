import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@app/shared';

interface DoctorDashboardProps {
  doctorName?: string;
  doctorCategory?: string;
  onNavigateTab?: (tab: string) => void;
}

export const DoctorDashboardScreen: React.FC<DoctorDashboardProps> = ({
  doctorName = 'Dr. Prashanth K Vaidya',
  doctorCategory = 'Head Doctor',
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('KPHB Branch');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'waiting' | 'completed'>('all');

  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Helper: check if item is an actual appointment record (not just a static patient master profile)
  const isActualAppointment = (item: any, colName: string) => {
    if (colName === 'appointments') return true;
    const hasApptDate = Boolean(item.appointmentDate || item.date || item.slotDate);
    const hasApptStatus = Boolean(item.status && item.status !== 'registered');
    const hasDoctor = Boolean(item.doctorName || item.doctor || item.doctor_name);
    const hasQueueOrder = typeof item.queueOrder === 'number';
    return hasApptDate || hasApptStatus || hasDoctor || hasQueueOrder;
  };

  const normalizeToYYYYMMDD = (val: any): string => {
    if (!val) return '';
    let str = '';
    if (typeof val === 'string') str = val.trim();
    else if (typeof val === 'object' && typeof val.toDate === 'function') {
      try { str = val.toDate().toISOString(); } catch (e) { }
    } else if (typeof val === 'object' && val.seconds) {
      try { str = new Date(val.seconds * 1000).toISOString(); } catch (e) { }
    }

    if (!str) return '';
    if (str.includes('T')) str = str.split('T')[0];

    const parts = str.split(/[-/\s,]+/);
    if (parts.length >= 3) {
      if (parts[2].length === 4) {
        // DD-MM-YYYY format
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2];
        return `${y}-${m}-${d}`;
      }
      if (parts[0].length === 4) {
        // YYYY-MM-DD format
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    }

    const parsedDate = new Date(str);
    if (!isNaN(parsedDate.getTime())) {
      const y = parsedDate.getFullYear();
      const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const d = String(parsedDate.getDate()).padStart(2, '0');
      if (y > 2000) return `${y}-${m}-${d}`;
    }

    return str;
  };

  // Helper date matcher supporting DD-MM-YYYY, YYYY-MM-DD, and formatted string dates
  const checkDateMatch = (item: any, targetDate: string) => {
    const rawDate = item.appointmentDate || item.date || item.slotDate || item.bookingDate || item.createdAt;
    const statusStr = String(item.status || '').toLowerCase();

    // Always include active/waiting queue items if explicit appointment date is missing
    if ((statusStr === 'active' || statusStr === 'in_consultation' || statusStr === 'in consult' || statusStr === 'waiting' || statusStr === 'scheduled' || statusStr === 'confirmed' || statusStr === 'upcoming') && !item.appointmentDate && !item.date) {
      return true;
    }

    if (!rawDate) return false;

    const normItemDate = normalizeToYYYYMMDD(rawDate);
    const normTargetDate = normalizeToYYYYMMDD(targetDate);

    if (!normItemDate) return false;
    return normItemDate === normTargetDate;
  };

  // Helper to check if appointment is waiting / active (not completed / cancelled)
  const isWaitingOrActiveStatus = (status: string) => {
    const st = String(status || 'waiting').toLowerCase().trim();
    return st !== 'completed' && st !== 'done' && st !== 'finished' && st !== 'concluded' && st !== 'cancelled';
  };

  // 1. REAL-TIME LISTENER: Listens to appointments & allpatients for Today's Doctor Appointments (Fast <100ms load)
  useEffect(() => {
    setLoading(true);
    let unsubApp: (() => void) | null = null;
    let unsubAllPat: (() => void) | null = null;

    let appList: any[] = [];
    let allPatList: any[] = [];

    const mergeAndFilter = () => {
      const map = new Map<string, any>();
      const activeDocClean = doctorName.toLowerCase().replace(/^dr\.\s*/i, '').replace(/^dr\s*/i, '').replace(/[^a-z0-9]/g, '').trim();

      [...appList, ...allPatList].forEach((item) => {
        if (!item) return;

        // Skip non-appointment static profiles from allpatients/patients
        if (!isActualAppointment(item, item.collectionName)) return;

        // Doctor Name Matching & Today's Date Filter
        const docName = String(item.doctorName || item.doctor || item.doctor_name || '').toLowerCase().replace(/^dr\.\s*/i, '').replace(/^dr\s*/i, '').replace(/[^a-z0-9]/g, '').trim();
        const isDocMatch = !docName || docName === 'unassigned' || docName.includes(activeDocClean) || activeDocClean.includes(docName) || (docName.length >= 4 && activeDocClean.includes(docName.substring(0, 5)));
        const isDateMatch = checkDateMatch(item, todayStr);

        if (isDocMatch && isDateMatch) {
          const uniqueId = item.id || `${item.phone}_${item.patientName}`;
          map.set(uniqueId, {
            ...item,
            id: item.id || uniqueId,
            displayStatus: String(item.status || 'waiting').toLowerCase(),
          });
        }
      });

      const list = Array.from(map.values());

      // Sort by Reception Queue Order (Respects Up/Down Queue Arrow Reordering)
      list.sort((a, b) => {
        const orderA = typeof a.queueOrder === 'number' ? a.queueOrder : 99;
        const orderB = typeof b.queueOrder === 'number' ? b.queueOrder : 99;
        if (orderA !== orderB) return orderA - orderB;
        const strA = String(a.createdAt || a.id || '');
        const strB = String(b.createdAt || b.id || '');
        return strB.localeCompare(strA);
      });

      setAppointments(list);
      setLoading(false);
    };

    try {
      unsubApp = onSnapshot(collection(db, 'appointments'), (snapshot) => {
        appList = snapshot.docs.map((d) => ({ id: d.id, collectionName: 'appointments', ...d.data() }));
        mergeAndFilter();
      });
      unsubAllPat = onSnapshot(collection(db, 'allpatients'), (snapshot) => {
        allPatList = snapshot.docs.map((d) => ({ id: d.id, collectionName: 'allpatients', ...d.data() }));
        mergeAndFilter();
      });
    } catch (e) {
      console.warn('Error connecting to Firestore:', e);
      setLoading(false);
    }

    return () => {
      if (unsubApp) unsubApp();
      if (unsubAllPat) unsubAllPat();
    };
  }, [doctorName, todayStr]);

  // 2. Doctor Action: Update Status (Start Consultation / Complete)
  const handleUpdateStatus = async (docId: string, collectionName: string | undefined, newStatus: string) => {
    try {
      setAppointments((prev) =>
        prev.map((a) => (a.id === docId ? { ...a, displayStatus: newStatus.toLowerCase() } : a))
      );

      const payload = { status: newStatus, updatedAt: new Date().toISOString() };
      const targetCol = collectionName || 'appointments';
      await updateDoc(doc(db, targetCol, docId), payload).catch(() => { });
      await updateDoc(doc(db, 'appointments', docId), payload).catch(() => { });
      await updateDoc(doc(db, 'allpatients', docId), payload).catch(() => { });
      await updateDoc(doc(db, 'patients', docId), payload).catch(() => { });
      await updateDoc(doc(db, 'consultations', docId), payload).catch(() => { });
      Alert.alert('Status Updated', `Patient status changed to ${newStatus}.`);
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  // All Today Appointments for Logged-In Doctor
  const branchFilteredAppointments = appointments;

  const waitingQueue = branchFilteredAppointments.filter((a) => isWaitingOrActiveStatus(a.displayStatus));
  const completedQueue = branchFilteredAppointments.filter((a) => !isWaitingOrActiveStatus(a.displayStatus));

  const displayedList = branchFilteredAppointments.filter((a) => {
    if (activeFilter === 'waiting') return isWaitingOrActiveStatus(a.displayStatus);
    if (activeFilter === 'completed') return !isWaitingOrActiveStatus(a.displayStatus);
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
      {/* Doctor Header */}
      <View style={styles.headerCard}>
        <View style={styles.docHeaderTop}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{doctorName.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.docNameText}>{doctorName}</Text>
            <Text style={styles.docSubText}>{doctorCategory} • 📅 {formattedToday}</Text>
          </View>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <TouchableOpacity
          style={[styles.metricBox, { borderTopColor: '#258ec8' }, activeFilter === 'all' && styles.metricBoxActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.metricNum, { color: '#258ec8' }]}>{branchFilteredAppointments.length}</Text>
          <Text style={styles.metricLabel}>Total Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricBox, { borderTopColor: '#d97706' }, activeFilter === 'waiting' && styles.metricBoxActive]}
          onPress={() => setActiveFilter('waiting')}
        >
          <Text style={[styles.metricNum, { color: '#d97706' }]}>{waitingQueue.length}</Text>
          <Text style={styles.metricLabel}>Waiting Queue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.metricBox, { borderTopColor: '#16a34a' }, activeFilter === 'completed' && styles.metricBoxActive]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.metricNum, { color: '#16a34a' }]}>{completedQueue.length}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* TODAY'S DOCTOR PATIENT QUEUE */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.sectionHeader}>Today's Patient Queue ({selectedBranch})</Text>
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748b' }}>{displayedList.length} Patients</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#258ec8" style={{ marginTop: 30 }} />
      ) : displayedList.length > 0 ? (
        displayedList.map((patient, idx) => {
          const isDone = patient.displayStatus === 'completed' || patient.displayStatus === 'done';
          const isInConsult = patient.displayStatus === 'in_consultation' || patient.displayStatus === 'in consult';

          return (
            <View key={patient.id} style={[styles.patientCard, isInConsult && styles.patientCardInConsult]}>
              <View style={styles.cardHeader}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>{(patient.patientName || patient.name || 'P').substring(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.patientName}>{patient.patientName || patient.name}</Text>
                  <Text style={styles.patientSub}>
                    Reg ID: <Text style={{ color: '#258ec8', fontWeight: '800' }}>{patient.registrationId || patient.regId || `REG-${idx + 1001}`}</Text> • +91 {patient.phone || patient.phoneNumber || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, isDone ? { backgroundColor: '#dcfce7' } : isInConsult ? { backgroundColor: '#e0f2fe' } : { backgroundColor: '#fef3c7' }]}>
                  <Text style={[styles.statusBadgeText, isDone ? { color: '#166534' } : isInConsult ? { color: '#0284c7' } : { color: '#b45309' }]}>
                    {isDone ? 'DONE ✓' : isInConsult ? 'IN CONSULT' : 'WAITING'}
                  </Text>
                </View>
              </View>

              {/* Complaints / Symptoms */}
              {patient.diseases || patient.subject ? (
                <View style={styles.symptomBox}>
                  <Text style={styles.symptomText}>Complaints: {patient.diseases || patient.subject}</Text>
                </View>
              ) : null}

              {/* Doctor Action Buttons */}
              <View style={styles.cardActions}>
                {!isDone && (
                  <TouchableOpacity
                    style={[styles.startConsultBtn, isInConsult && { backgroundColor: '#16a34a' }]}
                    onPress={() => handleUpdateStatus(patient.id, patient.collectionName, isDone ? 'waiting' : isInConsult ? 'completed' : 'in_consultation')}
                  >
                    <MaterialCommunityIcons name={isInConsult ? "check-circle" : "stethoscope"} size={16} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.startConsultText}>
                      {isInConsult ? 'Mark Completed ✓' : 'Start Consultation'}
                    </Text>
                  </TouchableOpacity>
                )}
                {isDone && (
                  <View style={styles.completedTag}>
                    <Text style={styles.completedTagText}>Consultation Finished ✓</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyBox}>
          <Feather name="user-check" size={32} color="#cbd5e1" />
          <Text style={styles.emptyText}>No patient queue for {selectedBranch} today.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  headerCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  docHeaderTop: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#258ec8', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  docNameText: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  docSubText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  branchRow: { flexDirection: 'row', gap: 6, marginTop: 12, flexWrap: 'wrap' },
  branchPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  branchPillActive: { backgroundColor: '#258ec8', borderColor: '#0284c7' },
  branchPillText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  branchPillTextActive: { color: '#ffffff' },
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metricBox: { flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', borderTopWidth: 3, alignItems: 'center' },
  metricBoxActive: { backgroundColor: '#f0f9ff' },
  metricNum: { fontSize: 18, fontWeight: '800' },
  metricLabel: { fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 2 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  patientCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  patientCardInConsult: { borderColor: '#258ec8', backgroundColor: '#f0f9ff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  patientAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  patientAvatarText: { fontSize: 12, fontWeight: '800', color: '#258ec8' },
  patientName: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  patientSub: { fontSize: 11.5, color: '#64748b', marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },
  symptomBox: { marginTop: 8, backgroundColor: '#f8fafc', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#f1f5f9' },
  symptomText: { fontSize: 11.5, color: '#475569' },
  cardActions: { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  startConsultBtn: { backgroundColor: '#258ec8', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  startConsultText: { fontSize: 12, fontWeight: '800', color: '#ffffff' },
  completedTag: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  completedTagText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#94a3b8', marginTop: 8 },
});
