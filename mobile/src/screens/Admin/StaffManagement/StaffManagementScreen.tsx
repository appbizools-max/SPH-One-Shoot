import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export const StaffManagementScreen: React.FC = () => {
  const staffMembers = [
    { name: 'Anil Kumar M', role: 'Reception & Operations', branch: 'KPHB', hours: '8.5 Hours/Day', salary: '₹22,000' },
    { name: 'Ashwini Begari', role: 'Front Desk Officer', branch: 'Chandanagar', hours: '8.0 Hours/Day', salary: '₹17,000' },
    { name: 'Vaishnavi Peri', role: 'Clinic Manager', branch: 'Nallagandla', hours: '8.5 Hours/Day', salary: '₹17,000' },
    { name: 'Nandini Gottelli', role: 'Assistant Chemist', branch: 'Dilshuknagar', hours: '8.5 Hours/Day', salary: '₹15,000' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>👔 Staff Management</Text>
      <Text style={styles.subTitle}>Clinic staff roles, working hours, and salary details.</Text>

      {staffMembers.map(s => (
        <View key={s.name} style={styles.card}>
          <Text style={styles.cardTitle}>{s.name} ({s.branch})</Text>
          <Text style={styles.cardRole}>Role: {s.role}</Text>
          <Text style={styles.cardHours}>Working Hours: {s.hours}</Text>
          <Text style={styles.cardSalary}>Salary: {s.salary}</Text>
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
  cardRole: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cardHours: { fontSize: 12, color: '#16a34a', fontWeight: '700', marginTop: 4 },
  cardSalary: { fontSize: 12.5, color: '#3b82f6', fontWeight: '800', marginTop: 2 },
});
