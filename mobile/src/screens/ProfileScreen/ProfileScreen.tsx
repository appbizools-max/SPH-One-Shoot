import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spiritual Wellness Profile</Text>
      
      <View style={styles.card}>
        <Text style={styles.userName}>Valued Spiritual Homeo Member</Text>
        <Text style={styles.userSub}>Patient ID: #SH-9042</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>📋 Active Remedy Tracker</Text>
        <Text style={styles.emptyText}>No active remedy schedules yet.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>📅 Consultation History</Text>
        <Text style={styles.emptyText}>No previous appointments found.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginVertical: 12,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38bdf8',
  },
  userSub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
  },
});
