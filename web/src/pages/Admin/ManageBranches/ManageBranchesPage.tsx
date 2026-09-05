import React from 'react';
import { Building2 } from 'lucide-react';

export const ManageBranchesPage: React.FC = () => {
  const branches = [
    { name: 'KPHB Branch', phone: '+91 90301 76176', target: '₹12,00,000', achieved: '₹9,80,000' },
    { name: 'Nallagandla Branch', phone: '+91 91321 76176', target: '₹10,00,000', achieved: '₹8,40,000' },
    { name: 'Dilshuknagar Branch', phone: '+91 98041 76176', target: '₹14,00,000', achieved: '₹11,50,000' },
    { name: 'Chandanagar Branch', phone: '+91 95531 76176', target: '₹9,00,000', achieved: '₹7,20,000' },
  ];

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Building2 size={24} color="#258ec8" />
        <h1 style={{ fontSize: '18px !important', fontWeight: 800, color: '#0f172a' }}>
          Manage Branches & Target Management
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {branches.map(b => (
          <div key={b.name} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
            <h3 style={{ fontSize: '14.5px !important', fontWeight: 800, color: '#0f172a' }}>{b.name}</h3>
            <p style={{ fontSize: '12px !important', color: '#64748b', margin: '4px 0 10px' }}>📞 {b.phone}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px !important' }}>
              <span>Target: <b style={{ color: '#258ec8' }}>{b.target}</b></span>
              <span>Achieved: <b style={{ color: '#16a34a' }}>{b.achieved}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
