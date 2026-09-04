import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export const DoctorScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🩺 Doctor Consultation Portal</Text>
      <Text style={styles.subtitle}>Patient queue & mobile prescription generator.</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>📋 Current Waiting Patient</Text>
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#38bdf8' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.3)', marginBottom: 12 },
  cardHeader: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
  patientName: { fontSize: 15, fontWeight: '700', color: '#38bdf8' },
  patientReason: { fontSize: 13, color: '#94a3b8', marginTop: 4, marginBottom: 12 },
  btn: { backgroundColor: '#06b6d4', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
});
