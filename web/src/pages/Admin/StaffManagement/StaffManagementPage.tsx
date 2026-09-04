import React from 'react';
import { UserCheck } from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const staffMembers = [
    { name: 'Anil Kumar M', role: 'Reception & Operations', branch: 'KPHB', hours: '8.5 Hours/Day', salary: '₹22,000' },
    { name: 'Ashwini Begari', role: 'Front Desk Officer', branch: 'Chandanagar', hours: '8.0 Hours/Day', salary: '₹17,000' },
    { name: 'Vaishnavi Peri', role: 'Clinic Manager', branch: 'Nallagandla', hours: '8.5 Hours/Day', salary: '₹17,000' },
    { name: 'Nandini Gottelli', role: 'Assistant Chemist', branch: 'Dilshuknagar', hours: '8.5 Hours/Day', salary: '₹15,000' },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <UserCheck size={24} color="#3b82f6" />
        <h1 style={{ fontSize: '18px !important', fontWeight: 800, color: '#0f172a' }}>
          Staff Management & Working Hours
        </h1>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px', fontSize: '12px !important' }}>STAFF NAME</th>
              <th style={{ padding: '10px', fontSize: '12px !important' }}>ROLE</th>
              <th style={{ padding: '10px', fontSize: '12px !important' }}>BRANCH</th>
              <th style={{ padding: '10px', fontSize: '12px !important' }}>WORKING HOURS</th>
              <th style={{ padding: '10px', fontSize: '12px !important' }}>SALARY</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map(s => (
              <tr key={s.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px', fontSize: '13px !important', fontWeight: 700 }}>{s.name}</td>
                <td style={{ padding: '10px', fontSize: '12px !important' }}>{s.role}</td>
                <td style={{ padding: '10px', fontSize: '12px !important' }}>{s.branch}</td>
                <td style={{ padding: '10px', fontSize: '12px !important', color: '#16a34a', fontWeight: 700 }}>{s.hours}</td>
                <td style={{ padding: '10px', fontSize: '13px !important', fontWeight: 800, color: '#0f172a' }}>{s.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
