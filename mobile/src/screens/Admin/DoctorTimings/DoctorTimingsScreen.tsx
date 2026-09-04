import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export const DoctorTimingsScreen: React.FC = () => {
  const doctors = [
    { name: 'Dr. Prashanth k vaidya', phone: '8125260176', shift: '10:00 AM - 02:00 PM (KPHB) / 03:00 PM - 08:30 PM (Chandanagar)' },
    { name: 'Dr. Jobeadh parveej', phone: '9903119766', shift: '10:00 AM - 02:00 PM (Nallagandla) / 05:00 PM - 08:30 PM (KPHB)' },
    { name: 'Dr. Padma priya', phone: '9490808582', shift: '10:00 AM - 08:00 PM (General Consultation)' },
    { name: 'Dr. Ramakrishna chanduri', phone: '1111111111', shift: '10:00 AM - 02:00 PM (Dilshuknagar) / 05:00 PM - 09:00 PM (Nallagandla)' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>👨‍⚕️ Doctor Timings & Master Roster</Text>
      <Text style={styles.subTitle}>Consultation hours and branch schedules for doctors.</Text>

      {doctors.map(d => (
        <View key={d.name} style={styles.card}>
          <Text style={styles.cardTitle}>{d.name}</Text>
          <Text style={styles.cardPhone}>📱 {d.phone}</Text>
          <Text style={styles.cardShift}>🕒 {d.shift}</Text>
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
  cardPhone: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cardShift: { fontSize: 12.5, fontWeight: '700', color: '#3b82f6', marginTop: 6 },
});
