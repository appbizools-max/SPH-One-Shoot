import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DoctorDashboardScreenProps {
  doctorCategory?: string;
  doctorName?: string;
  onNavigateTab?: (tab: string) => void;
}

export const DoctorDashboardScreen: React.FC<DoctorDashboardScreenProps> = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 3 Small Boxes in 1 Horizontal Line */}
      <View style={styles.rowContainer}>
        {/* Total Appointments */}
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel} numberOfLines={1}>TOTAL APPTS</Text>
          <View style={styles.valRow}>
            <Text style={styles.smallVal}>5</Text>
            <View style={[styles.miniIcon, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="calendar-outline" size={14} color="#0284c7" />
            </View>
          </View>
        </View>

        {/* Ongoing / Waiting */}
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel} numberOfLines={1}>WAITING</Text>
          <View style={styles.valRow}>
            <Text style={[styles.smallVal, { color: '#d97706' }]}>4</Text>
            <View style={[styles.miniIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="time-outline" size={14} color="#d97706" />
            </View>
          </View>
        </View>

        {/* Completed */}
        <View style={styles.smallCard}>
          <Text style={styles.smallLabel} numberOfLines={1}>COMPLETED</Text>
          <View style={styles.valRow}>
            <Text style={[styles.smallVal, { color: '#16a34a' }]}>1</Text>
            <View style={[styles.miniIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="checkmark-circle-outline" size={14} color="#16a34a" />
            </View>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingTop: 10 },
  rowContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  smallLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  valRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  smallVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  miniIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
