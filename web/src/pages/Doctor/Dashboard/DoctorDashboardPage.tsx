import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  FileText
} from 'lucide-react';

interface DoctorDashboardPageProps {
  doctorCategory?: string;
  doctorName?: string;
  onNavigateTab?: (tab: string) => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = () => {
  const [selectedPatient, setSelectedPatient] = useState('Sarah Jenkins');

  const queueData = [
    { id: 'pat-1', name: 'Sarah Jenkins', age: 34, phone: '9848012345', reason: 'Acute Anxiety & Chronic Insomnia', status: 'Waiting', waitTime: '12 mins', gender: 'Female' },
    { id: 'pat-2', name: 'Rajesh Kumar', age: 48, phone: '9949023456', reason: 'Migraine & Cervical Spondylitis', status: 'In Consult', waitTime: 'Current', gender: 'Male' },
    { id: 'pat-3', name: 'Anita Sharma', age: 29, phone: '9876543210', reason: 'Eczema & Skin Allergic Flare-ups', status: 'Waiting', waitTime: '25 mins', gender: 'Female' },
    { id: 'pat-4', name: 'David Miller', age: 52, phone: '9123456789', reason: 'Hypertension & Acid Reflux', status: 'Completed', remedy: 'Arnica 200C', gender: 'Male' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 3 Metric Stat Cards in 1 Line */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        
        {/* Total Appointments */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Appointments
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '4px 0 0 0' }}>5</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#e0f2fe', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* Ongoing / Waiting */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ongoing / Waiting
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', margin: '4px 0 0 0' }}>4</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* Completed */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Completed
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#16a34a', margin: '4px 0 0 0' }}>1</h2>
          </div>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#dcfce7', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

      </div>

      {/* Today's Patient Queue Section (Full Width) */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Today's Patient Queue</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Current consultation queue for today</p>
            </div>
          </div>
          <span style={{ background: '#f1f5f9', color: '#334155', fontWeight: 800, fontSize: '12px', padding: '4px 12px', borderRadius: '20px' }}>
            4 Patients Registered
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {queueData.map((item) => {
            const isSelected = selectedPatient === item.name;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPatient(item.name)}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  background: isSelected ? '#f0f9ff' : '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{item.name}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>({item.age} yrs • {item.gender})</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', margin: 0 }}>Reason: {item.reason}</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', margin: 0, fontFamily: 'monospace' }}>📞 {item.phone} • Wait: {item.waitTime}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    background: item.status === 'Completed' ? '#dcfce7' : item.status === 'In Consult' ? '#e0f2fe' : '#fef3c7',
                    color: item.status === 'Completed' ? '#15803d' : item.status === 'In Consult' ? '#0369a1' : '#b45309'
                  }}>
                    {item.status}
                  </span>
                  <button style={{
                    background: isSelected ? '#0284c7' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? 'none' : '1px solid #cbd5e1',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}>
                    {isSelected ? 'Selected' : 'Select Patient'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
