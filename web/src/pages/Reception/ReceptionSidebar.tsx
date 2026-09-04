import React from 'react';
import { ClipboardList, Calendar, Users, RefreshCw, Pill, CreditCard, UserX, Image, Camera, ChevronRight } from 'lucide-react';

interface ReceptionSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ReceptionSidebar: React.FC<ReceptionSidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'reception_dashboard', label: 'Dashboard', icon: ClipboardList },
    { id: 'reception_book', label: 'Book Appointment', icon: Calendar },
    { id: 'reception_patients', label: 'All Patients', icon: Users },
    { id: 'reception_followups', label: 'Follow Ups', icon: RefreshCw },
    { id: 'reception_medicines', label: 'Medicine Requests', icon: Pill },
    { id: 'reception_billing', label: 'Product Billing', icon: CreditCard },
    { id: 'reception_noshow', label: 'Doctor No Show', icon: UserX },
    { id: 'reception_media', label: 'Media Manager', icon: Image },
    { id: 'reception_cleaning', label: 'Cleaning Photos', icon: Camera },
  ];

  return (
    <aside style={{
      width: '200px',
      minWidth: '200px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      position: 'fixed',
      top: '67px',
      bottom: 0,
      left: 0,
      padding: '14px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
      overflow: 'hidden',
      zIndex: 40
    }}>
      <div style={{ padding: '0 6px', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '10px !important', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Reception Desk Menu
        </h3>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'reception_dashboard' && activeTab === 'reception');
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '7px 10px',
              borderRadius: '8px',
              border: isActive ? '1px solid rgba(37, 142, 200, 0.3)' : '1px solid transparent',
              background: isActive ? 'rgba(37, 142, 200, 0.1)' : 'transparent',
              color: isActive ? '#258ec8' : '#475569',
              fontWeight: isActive ? 700 : 500,
              fontSize: '11.5px !important',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={14} color={isActive ? '#258ec8' : '#64748b'} />
              <span>{item.label}</span>
            </div>
            {isActive && <ChevronRight size={13} color="#258ec8" />}
          </button>
        );
      })}
    </aside>
  );
};
