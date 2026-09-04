import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export const AttendanceRosterScreen: React.FC = () => {
  const [staffList, setStaffList] = useState([
    { id: '1', name: 'Anil Kumar M', role: 'Receptionist', branch: 'KPHB', hours: '8.5 hrs', status: 'Present' },
    { id: '2', name: 'Ashwini Begari', role: 'Front Desk', branch: 'Chandanagar', hours: '8.0 hrs', status: 'Present' },
    { id: '3', name: 'Vaishnavi Peri', role: 'Manager', branch: 'Nallagandla', hours: '8.5 hrs', status: 'Present' },
    { id: '4', name: 'Nandini Gottelli', role: 'Chemist', branch: 'Dilshuknagar', hours: '0.0 hrs', status: 'On Leave' },
  ]);

  const toggleAttendance = (id: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Present' ? 'Absent' : s.status === 'Absent' ? 'On Leave' : 'Present';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📅 Daily Staff Attendance & Roster</Text>
      <Text style={styles.subTitle}>Check-in log and shift rosters for all staff.</Text>

      {staffList.map(stf => (
        <View key={stf.id} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={styles.cardTitle}>{stf.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>{stf.role} • {stf.branch}</Text>
              <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700', marginTop: 4 }}>⏱️ {stf.hours}</Text>
            </View>

            <TouchableOpacity 
              onPress={() => toggleAttendance(stf.id)}
              style={[
                styles.badge, 
                stf.status === 'Present' ? styles.bgGreen : stf.status === 'Absent' ? styles.bgRed : styles.bgYellow
              ]}
            >
              <Text style={[
                styles.badgeText,
                stf.status === 'Present' ? styles.textGreen : stf.status === 'Absent' ? styles.textRed : styles.textYellow
              ]}>
                {stf.status}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  subTitle: { fontSize: 12, color: '#64748b', marginBottom: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  cardTitle: { fontSize: 14.5, fontWeight: '800', color: '#0f172a' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  bgGreen: { backgroundColor: '#f0fdf4' },
  bgRed: { backgroundColor: '#fef2f2' },
  bgYellow: { backgroundColor: '#fefce8' },
  badgeText: { fontSize: 11.5, fontWeight: '800' },
  textGreen: { color: '#16a34a' },
  textRed: { color: '#ef4444' },
  textYellow: { color: '#ca8a04' },
});
