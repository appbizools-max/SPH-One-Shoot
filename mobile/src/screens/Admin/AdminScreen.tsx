import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'branches' | 'patients' | 'doctors' | 'staff' | 'medicine'>('analytics');

  // Medicine Edit Form
  const [medName, setMedName] = useState('');
  const [medPotency, setMedPotency] = useState('200C');
  const [medStock, setMedStock] = useState('150');

  const branchesData = [
    { name: 'KPHB Branch', phone: '+91 90301 76176', target: '₹12,00,000', achieved: '₹9,80,000' },
    { name: 'Nallagandla Branch', phone: '+91 91321 76176', target: '₹10,00,000', achieved: '₹8,40,000' },
    { name: 'Dilshuknagar Branch', phone: '+91 98041 76176', target: '₹14,00,000', achieved: '₹11,50,000' },
    { name: 'Chandanagar Branch', phone: '+91 95531 76176', target: '₹9,00,000', achieved: '₹7,20,000' },
  ];

  const doctorsData = [
    { name: 'Dr. Prashanth k vaidya', phone: '8125260176', shift: '10:00 AM - 02:00 PM (KPHB)' },
    { name: 'Dr. Jobeadh parveej', phone: '9903119766', shift: '10:00 AM - 02:00 PM (Nallagandla)' },
    { name: 'Dr. Padma priya', phone: '9490808582', shift: '10:00 AM - 08:00 PM (General)' },
    { name: 'Dr. Ramakrishna chanduri', phone: '1111111111', shift: '10:00 AM - 02:00 PM (Dilshuknagar)' },
  ];

  const staffData = [
    { name: 'Anil Kumar M', role: 'Reception', branch: 'KPHB', hours: '8.5 Hours/Day', salary: '₹22,000' },
    { name: 'Ashwini Begari', role: 'Front Desk', branch: 'Chandanagar', hours: '8.0 Hours/Day', salary: '₹17,000' },
    { name: 'Vaishnavi Peri', role: 'Manager', branch: 'Nallagandla', hours: '8.5 Hours/Day', salary: '₹17,000' },
    { name: 'Nandini Gottelli', role: 'Chemist', branch: 'Dilshuknagar', hours: '8.5 Hours/Day', salary: '₹15,000' },
  ];

  const handleSaveMedicine = () => {
    if (!medName) {
      Alert.alert('Required Field', 'Please enter medicine name.');
      return;
    }
    Alert.alert('Saved 🎉', `Medicine ${medName} saved successfully.`);
    setMedName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
      
      {/* Title Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="shield-account" size={24} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Admin Control Center</Text>
          <Text style={styles.headerSub}>Global Patients, Revenue, Branches & Timings</Text>
        </View>
      </View>

      {/* Horizontal Tab Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={styles.tabRow}>
          {[
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'branches', label: '🏢 Branches & Targets' },
            { id: 'patients', label: '👥 Global Patients' },
            { id: 'doctors', label: '👨‍⚕️ Doctor Timings' },
            { id: 'staff', label: '👔 Staff & Hours' },
            { id: 'medicine', label: '💊 Edit Medicine' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabChip, activeTab === tab.id && styles.tabChipActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabChipText, activeTab === tab.id && styles.tabChipTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* TAB 1: ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <View style={{ gap: 12 }}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL REVENUE</Text>
            <Text style={styles.statVal}>₹36,90,000</Text>
            <Text style={styles.statSub}>+14.2% Growth vs Last Month</Text>
          </View>

          <View style={[styles.statCard, { borderColor: '#fca5a5' }]}>
            <Text style={[styles.statLabel, { color: '#ef4444' }]}>PENDING PAYMENTS</Text>
            <Text style={[styles.statVal, { color: '#ef4444' }]}>₹1,45,000</Text>
            <Text style={styles.statSub}>12 Pending Patient Invoices</Text>
          </View>

          <View style={[styles.statCard, { borderColor: '#86efac' }]}>
            <Text style={[styles.statLabel, { color: '#16a34a' }]}>NUTRITION REVENUE</Text>
            <Text style={[styles.statVal, { color: '#16a34a' }]}>₹4,85,000</Text>
            <Text style={styles.statSub}>Homeopathic Supplements & Wellness</Text>
          </View>
        </View>
      )}

      {/* TAB 2: BRANCHES & TARGETS */}
      {activeTab === 'branches' && (
        <View style={{ gap: 12 }}>
          {branchesData.map(b => (
            <View key={b.name} style={styles.card}>
              <Text style={styles.cardTitle}>{b.name}</Text>
              <Text style={styles.cardSub}>📞 {b.phone}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={styles.infoText}>Target: <Text style={{ fontWeight: '800', color: '#3b82f6' }}>{b.target}</Text></Text>
                <Text style={styles.infoText}>Achieved: <Text style={{ fontWeight: '800', color: '#16a34a' }}>{b.achieved}</Text></Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB 3: GLOBAL PATIENTS */}
      {activeTab === 'patients' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Global Patients Summary</Text>
          <Text style={{ fontSize: 13, color: '#0f172a', fontWeight: '800', marginTop: 6 }}>
            Total Registered Patients: 1,250
          </Text>
          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Packages: Platinum Annual Wellness, Classical Care, Pediatric Care
          </Text>
        </View>
      )}

      {/* TAB 4: DOCTOR TIMINGS */}
      {activeTab === 'doctors' && (
        <View style={{ gap: 10 }}>
          {doctorsData.map(doc => (
            <View key={doc.name} style={styles.card}>
              <Text style={styles.cardTitle}>{doc.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>📱 {doc.phone}</Text>
              <Text style={{ fontSize: 12.5, color: '#3b82f6', fontWeight: '700', marginTop: 6 }}>
                🕒 {doc.shift}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* TAB 5: STAFF & WORKING HOURS */}
      {activeTab === 'staff' && (
        <View style={{ gap: 10 }}>
          {staffData.map(stf => (
            <View key={stf.name} style={styles.card}>
              <Text style={styles.cardTitle}>{stf.name} ({stf.branch})</Text>
              <Text style={{ fontSize: 12, color: '#64748b' }}>Role: {stf.role}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '700' }}>⏱️ {stf.hours}</Text>
                <Text style={{ fontSize: 12.5, color: '#0f172a', fontWeight: '800' }}>💰 {stf.salary}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB 6: EDIT MEDICINE FORM */}
      {activeTab === 'medicine' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edit Medicine / Remedy Form</Text>
          
          <Text style={styles.fieldLabel}>Medicine Name</Text>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.inputText}
              placeholder="e.g. Arnica Montana"
              placeholderTextColor="#94a3b8"
              value={medName}
              onChangeText={setMedName}
            />
          </View>

          <Text style={styles.fieldLabel}>Potency</Text>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.inputText}
              value={medPotency}
              onChangeText={setMedPotency}
            />
          </View>

          <Text style={styles.fieldLabel}>Stock Quantity</Text>
          <View style={styles.inputBox}>
            <TextInput 
              style={styles.inputText}
              keyboardType="number-pad"
              value={medStock}
              onChangeText={setMedStock}
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMedicine}>
            <Text style={styles.saveBtnText}>Save Medicine</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  iconCircle: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 11.5, color: '#64748b' },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0' },
  tabChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  tabChipText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  tabChipTextActive: { color: '#ffffff', fontWeight: '800' },
  statCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 16, padding: 16 },
  statLabel: { fontSize: 11.5, fontWeight: '800', color: '#64748b' },
  statVal: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginVertical: 4 },
  statSub: { fontSize: 11, color: '#64748b' },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  cardSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  infoText: { fontSize: 12, color: '#475569' },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#0f172a', marginTop: 10, marginBottom: 4 },
  inputBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, height: 44, justifyContent: 'center' },
  inputText: { fontSize: 13, color: '#0f172a' },
  saveBtn: { backgroundColor: '#3b82f6', borderRadius: 12, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  saveBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
