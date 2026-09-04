import React from 'react';
import { Clock } from 'lucide-react';

export const DoctorTimingsPage: React.FC = () => {
  const doctors = [
    { name: 'Dr. Prashanth k vaidya', phone: '8125260176', shift: '10:00 AM - 02:00 PM (KPHB) / 03:00 PM - 08:30 PM (Chandanagar)' },
    { name: 'Dr. Jobeadh parveej', phone: '9903119766', shift: '10:00 AM - 02:00 PM (Nallagandla) / 05:00 PM - 08:30 PM (KPHB)' },
    { name: 'Dr. Padma priya', phone: '9490808582', shift: '10:00 AM - 08:00 PM (General Consultation)' },
    { name: 'Dr. Ramakrishna chanduri', phone: '1111111111', shift: '10:00 AM - 02:00 PM (Dilshuknagar) / 05:00 PM - 09:00 PM (Nallagandla)' },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Clock size={24} color="#3b82f6" />
        <h1 style={{ fontSize: '18px !important', fontWeight: 800, color: '#0f172a' }}>
          Doctor Timings & Master Schedules
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {doctors.map(d => (
          <div key={d.name} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '14.5px !important', fontWeight: 800, color: '#0f172a' }}>{d.name}</h3>
            <p style={{ fontSize: '12px !important', color: '#64748b', marginTop: '2px' }}>📱 {d.phone}</p>
            <p style={{ fontSize: '12.5px !important', color: '#3b82f6', fontWeight: 700, marginTop: '6px' }}>🕒 {d.shift}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
