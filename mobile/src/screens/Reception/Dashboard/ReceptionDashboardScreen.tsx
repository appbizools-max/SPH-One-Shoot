import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReceptionDashboardScreenProps {
  onNavigate?: (tab: string) => void;
}

export const ReceptionDashboardScreen: React.FC<ReceptionDashboardScreenProps> = ({ onNavigate }) => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [payPending, setPayPending] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [apptsCompleted, setApptsCompleted] = useState(0);
  const [followupOpted, setFollowupOpted] = useState(0);
  const [followupNotOpted, setFollowupNotOpted] = useState(0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      
      {/* Professional Overview Header */}
      <View style={styles.overviewHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.todayFilterBtn}>
          <Ionicons name="calendar-outline" size={14} color="#258ec8" />
          <Text style={styles.todayFilterText}>Today</Text>
        </TouchableOpacity>
      </View>

      {/* Top Row: 4 Clean Metric Cards */}
      <View style={styles.metricsRow}>
        {/* Card 1: Total Bookings */}
        <View style={[styles.metricCard, { borderTopColor: '#258ec8' }]}>
          <Text style={styles.metricNum}>{totalBookings}</Text>
          <Text style={styles.metricLabel} numberOfLines={1}>Total Bookings</Text>
        </View>

        {/* Card 2: Waiting */}
        <View style={[styles.metricCard, { borderTopColor: '#f59e0b' }]}>
          <Text style={[styles.metricNum, { color: '#d97706' }]}>{waiting}</Text>
          <Text style={styles.metricLabel}>Waiting</Text>
        </View>

        {/* Card 3: Pay Pending */}
        <View style={[styles.metricCard, { borderTopColor: '#ef4444' }]}>
          <Text style={[styles.metricNum, { color: '#ef4444' }]}>{payPending}</Text>
          <Text style={styles.metricLabel}>Pay Pending</Text>
        </View>

        {/* Card 4: Completed */}
        <View style={[styles.metricCard, { borderTopColor: '#10b981' }]}>
          <Text style={[styles.metricNum, { color: '#10b981' }]}>{completed}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>
      </View>

      {/* Bottom Row: 3 Clean Metric Cards */}
      <View style={styles.metricsRowSecond}>
        {/* Card 5: Appointments Completed */}
        <View style={[styles.metricCardWide, { borderTopColor: '#6366f1' }]}>
          <Text style={[styles.metricNum, { color: '#4338ca' }]}>{apptsCompleted}</Text>
          <Text style={styles.metricLabel}>Appts Completed</Text>
        </View>

        {/* Card 6: Follow-up Opted */}
        <View style={[styles.metricCardWide, { borderTopColor: '#8b5cf6' }]}>
          <Text style={[styles.metricNum, { color: '#6d28d9' }]}>{followupOpted}</Text>
          <Text style={styles.metricLabel}>Follow-up Opted</Text>
        </View>

        {/* Card 7: Follow-up Not Opted */}
        <View style={[styles.metricCardWide, { borderTopColor: '#e11d48' }]}>
          <Text style={[styles.metricNum, { color: '#be123c' }]}>{followupNotOpted}</Text>
          <Text style={styles.metricLabel}>Follow-up Not Opted</Text>
        </View>
      </View>

      {/* Upcoming Appointments Section */}
      <View style={styles.sectionHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>0</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="refresh-outline" size={13} color="#d97706" />
            <Text style={{ color: '#d97706', fontSize: 12, fontWeight: '700' }}>Restore (24h)</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: '#258ec8', fontSize: 12, fontWeight: '700' }}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.emptyCardContainer}>
        <Ionicons name="calendar-outline" size={28} color="#cbd5e1" style={{ marginBottom: 6 }} />
        <Text style={styles.emptyCardText}>No upcoming waiting appointments.</Text>
        <TouchableOpacity 
          style={styles.limeGreenBtn} 
          onPress={() => onNavigate && onNavigate('reception_book')}
        >
          <Ionicons name="add-circle-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.limeGreenBtnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Active Consultations Section */}
      <View style={[styles.sectionHeaderRow, { marginTop: 22, marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.sectionTitle}>Active Consultations</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>0</Text>
          </View>
        </View>
      </View>
      <View style={styles.emptyCardSimple}>
        <Ionicons name="time-outline" size={26} color="#cbd5e1" style={{ marginBottom: 4 }} />
        <Text style={styles.emptyCardText}>No patients currently in consultation or awaiting payment.</Text>
      </View>

      {/* Completed Appointments Today Section */}
      <View style={[styles.sectionHeaderRow, { marginTop: 22, marginBottom: 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={styles.sectionTitle}>Completed Appointments Today</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>0</Text>
          </View>
        </View>
      </View>
      <View style={styles.emptyCardSimple}>
        <Ionicons name="checkmark-done-circle-outline" size={26} color="#cbd5e1" style={{ marginBottom: 4 }} />
        <Text style={styles.emptyCardText}>No completed appointments today yet.</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 14,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#16a34a',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  todayFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  todayFilterText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metricsRowSecond: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderTopWidth: 3.5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricCardWide: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderTopWidth: 3.5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  countBadge: {
    backgroundColor: '#eef5fc',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(37, 142, 200, 0.2)',
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#258ec8',
  },
  emptyCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyCardText: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
  limeGreenBtn: {
    backgroundColor: '#a8ce3a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#a8ce3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  limeGreenBtnText: {
    color: '#1e293b',
    fontWeight: '800',
    fontSize: 13,
  },
  emptyCardSimple: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
});
