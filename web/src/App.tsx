import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home/HomePage';
import { RemediesPage } from './pages/Remedies/RemediesPage';
import { ConsultationPage } from './pages/Consultation/ConsultationPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AuthPage, WebLoginSuccessData } from './pages/Auth/AuthPage';

// Role Portals
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage';
import { DoctorDashboardPage } from './pages/Doctor/DoctorDashboardPage';

// Reception Layout & Sub-Pages
import { ReceptionLayout } from './pages/Reception/ReceptionLayout';
import { ReceptionDashboardPage } from './pages/Reception/Dashboard/ReceptionDashboardPage';
import { BookAppointmentPage } from './pages/Reception/BookAppointment/BookAppointmentPage';
import { AllPatientsPage } from './pages/Reception/AllPatients/AllPatientsPage';
import { FollowUpsPage } from './pages/Reception/FollowUps/FollowUpsPage';
import { MedicineRequestsPage } from './pages/Reception/MedicineRequests/MedicineRequestsPage';
import { ProductBillingPage } from './pages/Reception/ProductBilling/ProductBillingPage';
import { DoctorNoShowPage } from './pages/Reception/DoctorNoShow/DoctorNoShowPage';
import { MediaManagerPage } from './pages/Reception/MediaManager/MediaManagerPage';
import { CleaningPhotosPage } from './pages/Reception/CleaningPhotos/CleaningPhotosPage';

import { StaffDashboardPage } from './pages/Staff/StaffDashboardPage';
import { HRDashboardPage } from './pages/HR/HRDashboardPage';
import { signOutUser } from '@app/shared';

const AUTH_STORAGE_KEY = 'sph_auth_session';

export default function App() {
  // Read persistent auth session on initial load
  const [authSession, setAuthSession] = useState<{ role: string; branchName: string; branchPhone: string } | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role === 'admin') return 'admin';
        if (parsed?.role === 'hr') return 'hr';
        if (parsed?.role === 'doctor') return 'doctor';
        if (parsed?.role === 'staff') return 'staff';
        return 'reception_dashboard';
      }
    } catch (e) {}
    return 'auth';
  });

  const [branchName, setBranchName] = useState(authSession?.branchName || 'KPHB Branch');
  const [branchPhone, setBranchPhone] = useState(authSession?.branchPhone || '+91 90301 76176');

  const handleLoginSuccess = (data: WebLoginSuccessData) => {
    const sessionData = {
      role: data.role,
      branchName: data.branchName,
      branchPhone: data.branchPhone,
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {}

    setAuthSession(sessionData);
    setBranchName(data.branchName);
    setBranchPhone(data.branchPhone);

    if (data.role === 'admin') {
      setActiveTab('admin');
    } else if (data.role === 'hr') {
      setActiveTab('hr');
    } else if (data.role === 'doctor') {
      setActiveTab('doctor');
    } else if (data.role === 'staff') {
      setActiveTab('staff');
    } else {
      setActiveTab('reception_dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {}
    await signOutUser();
    setAuthSession(null);
    setActiveTab('auth');
  };

  // Sync tab navigation with logout
  useEffect(() => {
    if (activeTab === 'auth' && authSession) {
      handleLogout();
    }
  }, [activeTab]);

  const isAuthPage = activeTab === 'auth';
  const isReceptionRoute = activeTab.startsWith('reception');

  const renderReceptionSubPage = () => {
    switch (activeTab) {
      case 'reception':
      case 'reception_dashboard':
        return <ReceptionDashboardPage />;
      case 'reception_book':
        return <BookAppointmentPage currentBranch={branchName} />;
      case 'reception_patients':
        return <AllPatientsPage />;
      case 'reception_followups':
        return <FollowUpsPage />;
      case 'reception_medicines':
        return <MedicineRequestsPage />;
      case 'reception_billing':
        return <ProductBillingPage />;
      case 'reception_noshow':
        return <DoctorNoShowPage />;
      case 'reception_media':
        return <MediaManagerPage />;
      case 'reception_cleaning':
        return <CleaningPhotosPage />;
      default:
        return <ReceptionDashboardPage />;
    }
  };

  const renderCurrentPage = () => {
    if (isReceptionRoute) {
      return (
        <ReceptionLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {renderReceptionSubPage()}
        </ReceptionLayout>
      );
    }

    switch (activeTab) {
      case 'auth':
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'remedies':
        return <RemediesPage />;
      case 'consultation':
        return <ConsultationPage />;
      case 'profile':
        return <ProfilePage />;

      // Other Roles
      case 'admin':
        return <AdminDashboardPage />;
      case 'doctor':
        return <DoctorDashboardPage />;
      case 'staff':
        return <StaffDashboardPage />;
      case 'hr':
        return <HRDashboardPage />;

      default:
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Hide navbar on Login page */}
      {!isAuthPage && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            if (tab === 'auth') {
              handleLogout();
            } else {
              setActiveTab(tab);
            }
          }} 
          branchName={branchName}
          branchPhone={branchPhone}
          role={authSession?.role}
        />
      )}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Hide footer on Login page */}
      {!isAuthPage && (
        <footer style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '20px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px'
        }}>
          <p>© 2026 Spiritual Homeo Staff & Patient Portal</p>
        </footer>
      )}
    </div>
  );
}
