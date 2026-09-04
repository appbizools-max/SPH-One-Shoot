import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { Remedy } from '@app/shared';

const initialRemedies: Remedy[] = [
  {
    id: '1',
    name: 'Arnica Montana',
    latinName: 'Leopard\'s Bane',
    category: 'Acute',
    symptoms: ['Physical trauma', 'Bruising', 'Shock'],
    potencyOptions: ['30C', '200C'],
    description: 'First remedy for trauma, soreness, and physical injuries.',
    spiritualInsight: 'Restores the subtle energy field after emotional shock.'
  },
  {
    id: '2',
    name: 'Ignatia Amara',
    latinName: 'St. Ignatius Bean',
    category: 'Spiritual',
    symptoms: ['Grief', 'Emotional heartbreak', 'Sorrows'],
    potencyOptions: ['200C', '1M'],
    description: 'Essential remedy for acute grief and silent emotional sorrow.',
    spiritualInsight: 'Releases emotional tension and brings inner tranquility.'
  }
];

export const RemediesScreen: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = initialRemedies.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.symptoms.some(s => s.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homeopathic Directory</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Search remedy or symptom..." 
        placeholderTextColor="#94a3b8"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.remedyName}>{item.name}</Text>
              <Text style={styles.badge}>{item.category}</Text>
            </View>
            <Text style={styles.latin}>{item.latinName}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            {item.spiritualInsight && (
              <View style={styles.insightBox}>
                <Text style={styles.insightTitle}>✨ Spiritual Insight</Text>
                <Text style={styles.insightText}>{item.spiritualInsight}</Text>
              </View>
            )}
          </View>
        )}
      />
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
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    color: '#ffffff',
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remedyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#38bdf8',
  },
  badge: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  latin: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 8,
  },
  insightBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  insightTitle: {
    color: '#c084fc',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  insightText: {
    color: '#e9d5ff',
    fontSize: 12,
  },
});
