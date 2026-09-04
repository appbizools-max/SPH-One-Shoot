import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export const StaffScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📦 Clinic Staff & Inventory</Text>
      <Text style={styles.subtitle}>Remedy inventory & daily clinic tasks.</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeader}>💊 Dispensary Inventory</Text>
        <Text style={styles.stockText}>Arnica 30C: In Stock (42 bottles)</Text>
        <Text style={styles.lowStockText}>Ignatia 200C: Low Stock (3 left)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#fbbf24' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', marginBottom: 12 },
  cardHeader: { fontSize: 16, fontWeight: '700', color: '#f8fafc', marginBottom: 8 },
  stockText: { fontSize: 14, color: '#34d399', fontWeight: '600', marginBottom: 4 },
  lowStockText: { fontSize: 14, color: '#f87171', fontWeight: '600' },
});
