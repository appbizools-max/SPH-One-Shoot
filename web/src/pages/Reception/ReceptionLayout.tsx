import React from 'react';
import { ReceptionSidebar } from './ReceptionSidebar';

interface ReceptionLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const ReceptionLayout: React.FC<ReceptionLayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 67px)', background: '#f8fafc' }}>
      {/* Static Side Navigation */}
      <ReceptionSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '24px', marginLeft: '200px', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
};
