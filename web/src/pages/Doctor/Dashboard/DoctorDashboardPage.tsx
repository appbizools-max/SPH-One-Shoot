import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  Stethoscope,
  Check,
  CheckCircle2,
  Clock,
  Calendar,
  UserCheck
} from 'lucide-react';
import { db } from '@app/shared';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

interface DoctorDashboardPageProps {
  doctorCategory?: string;
  doctorName?: string;
  onNavigateTab?: (tab: string) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({
  doctorCategory = 'Head Doctor',
  doctorName = 'Dr. Prashanth K Vaidya',
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

  const checkDateMatch = (item: any, targetDate: string) => {
    const rawDate = item.appointmentDate || item.date || item.slotDate || item.bookingDate || item.createdAt;
    const statusStr = String(item.status || '').toLowerCase();
    if ((statusStr === 'active' || statusStr === 'in_consultation' || statusStr === 'in consult' || statusStr === 'waiting' || statusStr === 'scheduled' || statusStr === 'confirmed' || statusStr === 'upcoming') && !item.appointmentDate && !item.date) {
      return true;
    }

    if (!rawDate) return false;

    const normItemDate = normalizeToYYYYMMDD(rawDate);
    const normTargetDate = normalizeToYYYYMMDD(targetDate);

    if (!normItemDate) return false;
    return normItemDate === normTargetDate;
  };

  const isWaitingOrActiveStatus = (status: string) => {
    const st = String(status || 'waiting').toLowerCase().trim();
    return st !== 'completed' && st !== 'done' && st !== 'finished' && st !== 'concluded' && st !== 'cancelled';
  };

  // 1. Real-time Firestore Appointments Listener Synced Live with Reception Queue & Re-ordering
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

        if (!isActualAppointment(item, item.collectionName)) return;

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
    } catch (err) {
      console.warn('Error subscribing to web doctor appointments:', err);
      setLoading(false);
    }

    return () => {
      if (unsubApp) unsubApp();
      if (unsubAllPat) unsubAllPat();
    };
  }, [doctorName, todayStr]);

  const handleUpdateStatus = async (appId: string, collectionName: string | undefined, newStatus: string) => {
    try {
      setAppointments((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, displayStatus: newStatus.toLowerCase() } : a))
      );

      const payload = { status: newStatus, updatedAt: new Date().toISOString() };
      const targetCol = collectionName || 'appointments';
      await updateDoc(doc(db, targetCol, appId), payload).catch(() => { });
      await updateDoc(doc(db, 'appointments', appId), payload).catch(() => { });
      await updateDoc(doc(db, 'allpatients', appId), payload).catch(() => { });
      await updateDoc(doc(db, 'patients', appId), payload).catch(() => { });
      await updateDoc(doc(db, 'consultations', appId), payload).catch(() => { });
    } catch (err) {
      console.error('Error updating status on web:', err);
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
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Top Banner Card: Doctor Info */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#258ec8', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
            {(doctorName || 'D').replace(/^Dr\.\s*/i, '').charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{doctorName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.78rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                {doctorCategory}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                📅 {formattedToday}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {/* Total Today */}
        <div
          onClick={() => setActiveFilter('all')}
          style={{
            background: activeFilter === 'all' ? '#f0f9ff' : '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            borderStyle: 'solid',
            borderWidth: activeFilter === 'all' ? '4px 2px 2px 2px' : '4px 1px 1px 1px',
            borderColor: activeFilter === 'all' ? '#258ec8' : '#258ec8 #e2e8f0 #e2e8f0 #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Today
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#258ec8', margin: '4px 0 0 0' }}>{branchFilteredAppointments.length}</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#258ec8' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* Waiting Queue */}
        <div
          onClick={() => setActiveFilter('waiting')}
          style={{
            background: activeFilter === 'waiting' ? '#fffbeb' : '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            borderStyle: 'solid',
            borderWidth: activeFilter === 'waiting' ? '4px 2px 2px 2px' : '4px 1px 1px 1px',
            borderColor: activeFilter === 'waiting' ? '#d97706' : '#d97706 #e2e8f0 #e2e8f0 #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Waiting Queue
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', margin: '4px 0 0 0' }}>{waitingQueue.length}</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => setActiveFilter('completed')}
          style={{
            background: activeFilter === 'completed' ? '#f0fdf4' : '#ffffff',
            borderRadius: '16px',
            padding: '20px',
            borderStyle: 'solid',
            borderWidth: activeFilter === 'completed' ? '4px 2px 2px 2px' : '4px 1px 1px 1px',
            borderColor: activeFilter === 'completed' ? '#16a34a' : '#16a34a #e2e8f0 #e2e8f0 #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Completed
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', margin: '4px 0 0 0' }}>{completedQueue.length}</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Today's Patient Queue Section */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#258ec8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Today's Patient Queue
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Live consultations assigned to {doctorName} • Real-time Sync
              </p>
            </div>
          </div>
          <span style={{ background: '#f1f5f9', color: '#334155', fontWeight: 800, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
            {displayedList.length} Patients
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              Syncing with Reception Queue...
            </div>
          ) : displayedList.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={32} color="#cbd5e1" />
              <span>No patient queue today.</span>
            </div>
          ) : (
            displayedList.map((item, index) => {
              const isDone = item.displayStatus === 'completed' || item.displayStatus === 'done';
              const isInConsult = item.displayStatus === 'in_consultation' || item.displayStatus === 'in consult';

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isInConsult ? '2px solid #258ec8' : '1px solid #e2e8f0',
                    background: isInConsult ? '#f0f9ff' : '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '18px', background: '#e0f2fe', color: '#258ec8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>
                      {(item.patientName || item.name || 'P').substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          {item.patientName || item.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                          Reg ID: <strong style={{ color: '#258ec8' }}>{item.registrationId || item.regId || `REG-${index + 1001}`}</strong> • +91 {item.phone || item.phoneNumber || 'N/A'}
                        </span>
                      </div>
                      {(item.diseases || item.subject) && (
                        <div style={{ marginTop: '6px', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f1f5f9', fontSize: '11.5px', color: '#475569' }}>
                          Complaints: {item.diseases || item.subject}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 800,
                      background: isDone ? '#dcfce7' : isInConsult ? '#e0f2fe' : '#fef3c7',
                      color: isDone ? '#166534' : isInConsult ? '#0284c7' : '#b45309'
                    }}>
                      {isDone ? 'DONE ✓' : isInConsult ? 'IN CONSULT' : 'WAITING'}
                    </span>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, item.collectionName, isInConsult ? 'completed' : 'in_consultation')}
                        style={{
                          background: isInConsult ? '#16a34a' : '#258ec8',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Stethoscope size={16} />
                        {isInConsult ? 'Mark Completed ✓' : 'Start Consultation'}
                      </button>
                    )}

                    {isDone && (
                      <div style={{ background: '#f0fdf4', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                        Consultation Finished ✓
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
