import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TargetProgressUIProps {
  monthlyTarget?: number;
  targetReached?: number;
  branchName?: string;
}

export const TargetProgressUI: React.FC<TargetProgressUIProps> = ({
  monthlyTarget = 100000,
  targetReached = 75000,
  branchName,
}) => {
  const targetNum = Number(monthlyTarget) || 0;
  const reachedNum = Number(targetReached) || 0;
  const remaining = Math.max(targetNum - reachedNum, 0);
  const percentage = targetNum > 0 ? Math.min(Math.round((reachedNum / targetNum) * 100), 100) : 0;
  const isReached = reachedNum >= targetNum;

  // Dynamic Theme Colors
  const containerBg = isReached ? '#f0fdf4' : '#ffffff';
  const borderColor = isReached ? '#4ade80' : '#e2e8f0';
  const progressColor = isReached ? '#16a34a' : '#258ec8';

  return (
    <View style={[styles.cardContainer, { backgroundColor: containerBg, borderColor }]}>
      
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="target" size={18} color={isReached ? '#16a34a' : '#258ec8'} style={{ marginRight: 6 }} />
          <Text style={[styles.cardTitle, isReached && { color: '#166534' }]}>
            {branchName ? `${branchName} Target` : 'Monthly Target'}
          </Text>
        </View>
        {isReached ? (
          <View style={styles.badgeSuccess}>
            <Feather name="award" size={12} color="#15803d" style={{ marginRight: 4 }} />
            <Text style={styles.badgeSuccessText}>Target Reached!</Text>
          </View>
        ) : (
          <View style={styles.badgeNormal}>
            <Feather name="trending-up" size={12} color="#0284c7" style={{ marginRight: 4 }} />
            <Text style={styles.badgeNormalText}>{percentage}% Achieved</Text>
          </View>
        )}
      </View>

      {/* 3 Metric Columns: Target | Reached | Remaining */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Target Goal</Text>
          <Text style={styles.metricValue}>₹{targetNum.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Target Reached</Text>
          <Text style={[styles.metricValue, { color: '#16a34a' }]}>₹{reachedNum.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Remaining</Text>
          <Text style={[styles.metricValue, { color: remaining > 0 ? '#258ec8' : '#16a34a' }]}>
            ₹{remaining.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Visual Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: progressColor }]} />
      </View>

      {/* Progress Footer Subtext */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText} numberOfLines={1}>
          {isReached ? '🎉 Target achieved.' : `₹${remaining.toLocaleString('en-IN')} remaining.`}
        </Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 4,
    borderWidth: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  badgeNormal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  badgeNormalText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369a1',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  percentageText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 6,
  },
});
