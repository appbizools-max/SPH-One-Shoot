import React from 'react';
import { Target, Award, TrendingUp } from 'lucide-react';

interface TargetProgressWebUIProps {
  monthlyTarget?: number;
  targetReached?: number;
  branchName?: string;
}

export const TargetProgressWebUI: React.FC<TargetProgressWebUIProps> = ({
  monthlyTarget = 100000,
  targetReached = 75000,
  branchName,
}) => {
  const targetNum = Number(monthlyTarget) || 0;
  const reachedNum = Number(targetReached) || 0;
  const remaining = Math.max(targetNum - reachedNum, 0);
  const percentage = targetNum > 0 ? Math.min(Math.round((reachedNum / targetNum) * 100), 100) : 0;
  const isReached = reachedNum >= targetNum;

  return (
    <div style={{
      backgroundColor: isReached ? '#f0fdf4' : '#ffffff',
      border: `1px solid ${isReached ? '#4ade80' : '#e2e8f0'}`,
      borderRadius: '12px',
      padding: '12px 16px',
      margin: '10px 0',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={18} color={isReached ? '#16a34a' : '#258ec8'} />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: isReached ? '#166534' : '#0f172a' }}>
            {branchName ? `${branchName} Target` : 'Monthly Target'}
          </h3>
        </div>
        {isReached ? (
          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Award size={13} /> 🏆 Target Reached!
          </span>
        ) : (
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} /> {percentage}% Achieved
          </span>
        )}
      </div>

      {/* Numbers Breakdown */}
      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Target Goal</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>₹{targetNum.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Target Reached</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>₹{reachedNum.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ width: '1px', backgroundColor: '#e2e8f0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Remaining</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: remaining > 0 ? '#258ec8' : '#16a34a', marginTop: '2px' }}>₹{remaining.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '7px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: isReached ? '#16a34a' : '#258ec8', borderRadius: '4px', transition: 'width 0.5s ease' }} />
      </div>

      {/* Subtext */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
        <span>{isReached ? '🎉 Target achieved!' : `₹${remaining.toLocaleString('en-IN')} needed to complete target.`}</span>
        <strong style={{ color: '#0f172a' }}>{percentage}%</strong>
      </div>
    </div>
  );
};
