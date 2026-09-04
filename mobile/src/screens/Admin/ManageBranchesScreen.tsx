import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ManageBranchesScreen: React.FC = () => {
  const branches = [
    { name: 'KPHB Branch', phone: '+91 90301 76176', target: '₹12,00,000' },
    { name: 'Nallagandla Branch', phone: '+91 91321 76176', target: '₹10,00,000' },
    { name: 'Dilshuknagar Branch', phone: '+91 98041 76176', target: '₹14,00,000' },
    { name: 'Chandanagar Branch', phone: '+91 95531 76176', target: '₹9,00,000' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🏢 Manage Official Branches</Text>
      <Text style={styles.subTitle}>Configured receptionist phone lines and targets.</Text>

      {branches.map(b => (
        <View key={b.name} style={styles.card}>
          <Text style={styles.cardTitle}>{b.name}</Text>
          <Text style={styles.cardPhone}>📞 {b.phone}</Text>
          <Text style={styles.cardTarget}>Target: {b.target}</Text>
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
  cardPhone: { fontSize: 12, color: '#64748b', marginTop: 4 },
  cardTarget: { fontSize: 12.5, fontWeight: '700', color: '#3b82f6', marginTop: 4 },
});
