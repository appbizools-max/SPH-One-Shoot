import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export const DoctorScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Doctor Consultation Portal</Text>
      <Text style={styles.subtitle}>Patient queue & mobile prescription generator.</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>Current Waiting Patient</Text>
        <Text style={styles.patientName}>Patient: Sarah Jenkins</Text>
        <Text style={styles.patientReason}>Reason: Acute Anxiety & Chronic Insomnia</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Start Consultation & Prescribe</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  card: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  cardHeader: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#258ec8' },
  patientReason: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 12 },
  btn: { backgroundColor: '#258ec8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
