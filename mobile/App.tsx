import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth Screen
import { AuthScreen, LoginSuccessData } from './src/screens/AuthScreen/AuthScreen';

// Reception Sub-Screens & Side Drawer
import { ReceptionSideDrawer } from './src/screens/Reception/ReceptionSideDrawer';
import { ReceptionDashboardScreen } from './src/screens/Reception/Dashboard/ReceptionDashboardScreen';
import { BookAppointmentScreen } from './src/screens/Reception/BookAppointment/BookAppointmentScreen';
import { AllPatientsScreen } from './src/screens/Reception/AllPatients/AllPatientsScreen';
import { FollowUpsScreen } from './src/screens/Reception/FollowUps/FollowUpsScreen';
import { MedicineRequestsScreen } from './src/screens/Reception/MedicineRequests/MedicineRequestsScreen';
import { ProductBillingScreen } from './src/screens/Reception/ProductBilling/ProductBillingScreen';
import { DoctorNoShowScreen } from './src/screens/Reception/DoctorNoShow/DoctorNoShowScreen';
import { MediaManagerScreen } from './src/screens/Reception/MediaManager/MediaManagerScreen';
import { CleaningPhotosScreen } from './src/screens/Reception/CleaningPhotos/CleaningPhotosScreen';

// Admin & HR Screens
import { AdminScreen } from './src/screens/Admin/AdminScreen';
import { HRScreen } from './src/screens/HR/HRScreen';

import { UserRole, signOutUser } from '@app/shared';

const MOBILE_AUTH_KEY = '@sph_auth_session';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('auth');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('reception');
  
  // Authenticated User Branch State (Branch-Locked)
  const [branchName, setBranchName] = useState('Nallagandla');
  const [branchPhone, setBranchPhone] = useState('9553176176');
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Restore saved session on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = await AsyncStorage.getItem(MOBILE_AUTH_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.role) {
            setUserRole(parsed.role);
            setBranchName(parsed.branchName || 'Nallagandla');
            setBranchPhone(parsed.branchPhone || '9553176176');
            if (parsed.role === 'admin') {
              setActiveTab('admin');
            } else if (parsed.role === 'hr') {
              setActiveTab('hr');
            } else {
              setActiveTab('reception_dashboard');
            }
          }
        }
      } catch (e) {
        console.warn('Session restore note:', e);
      } finally {
        setIsLoadingSession(false);
      }
    };
    restoreSession();
  }, []);

  const handleLoginSuccess = async (data: LoginSuccessData) => {
    try {
      await AsyncStorage.setItem(MOBILE_AUTH_KEY, JSON.stringify({
        role: data.role,
        branchName: data.branchName,
        branchPhone: data.branchPhone,
      }));
    } catch (e) {}

    setUserRole(data.role);
    setBranchName(data.branchName);
    setBranchPhone(data.branchPhone);

    if (data.role === 'admin') {
      setActiveTab('admin');
    } else if (data.role === 'hr') {
      setActiveTab('hr');
    } else {
      setActiveTab('reception_dashboard');
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem(MOBILE_AUTH_KEY);
    } catch (e) {}
    await signOutUser();
    setActiveTab('auth');
    Alert.alert('Signed Out', 'You have been logged out of SPH Staff Portal.');
  };

  const isAuthScreen = activeTab === 'auth';

  const renderScreen = () => {
    switch (activeTab) {
      case 'auth':
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;

      // Admin & HR Dashboards
      case 'admin':
        return <AdminScreen />;
      case 'hr':
        return <HRScreen />;

      // Reception Modules
      case 'reception':
      case 'reception_dashboard':
        return <ReceptionDashboardScreen onNavigate={setActiveTab} />;
      case 'reception_book':
        return <BookAppointmentScreen currentBranch={branchName} />;
      case 'reception_patients':
        return <AllPatientsScreen />;
      case 'reception_followups':
        return <FollowUpsScreen />;
      case 'reception_medicines':
        return <MedicineRequestsScreen />;
      case 'reception_billing':
        return <ProductBillingScreen />;
      case 'reception_noshow':
        return <DoctorNoShowScreen />;
      case 'reception_media':
        return <MediaManagerScreen />;
      case 'reception_cleaning':
        return <CleaningPhotosScreen />;

      default:
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  // Bottom Nav Items tailored per role
  const bottomNavItems = userRole === 'admin' ? [
    { id: 'admin', label: 'Admin Hub', iconType: 'ionicons', iconName: 'shield-outline' },
    { id: 'logout', label: 'Logout', iconType: 'ionicons', iconName: 'log-out-outline' },
  ] : userRole === 'hr' ? [
    { id: 'hr', label: 'HR Hub', iconType: 'ionicons', iconName: 'people-outline' },
    { id: 'logout', label: 'Logout', iconType: 'ionicons', iconName: 'log-out-outline' },
  ] : [
    { id: 'reception_dashboard', label: 'Dashboard', iconType: 'ionicons', iconName: 'grid-outline' },
    { id: 'reception_book', label: 'Book Appt', iconType: 'ionicons', iconName: 'calendar-outline' },
    { id: 'reception_patients', label: 'Patient List', iconType: 'ionicons', iconName: 'people-outline' },
    { id: 'reception_medicines', label: 'Med Req', iconType: 'mci', iconName: 'pill' },
    { id: 'logout', label: 'Logout', iconType: 'ionicons', iconName: 'log-out-outline' },
  ];

  const handleBottomTabPress = (id: string) => {
    if (id === 'logout') {
      handleSignOut();
    } else {
      setActiveTab(id);
    }
  };

  if (isLoadingSession) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '600' }}>Restoring Session...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Header Bar Matching Screenshot */}
      {!isAuthScreen && (
        <View style={styles.topHeader}>
          {/* Left Side: Hamburger Menu + Avatar Circle + Branch Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity style={styles.menuDrawerBtn} onPress={() => setDrawerOpen(true)}>
              <Ionicons name="menu-outline" size={24} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#258ec8" />
            </View>

            <View>
              <Text style={styles.branchTitle}>{branchName}</Text>
              <Text style={styles.phoneSub}>{branchPhone}</Text>
              <View style={styles.tagRow}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{(userRole || 'reception').toUpperCase()}</Text>
                </View>
                <View style={styles.locBadge}>
                  <Ionicons name="location-outline" size={10} color="#64748b" style={{ marginRight: 2 }} />
                  <Text style={styles.locBadgeText}>{branchName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Side: Notification Bell + Red Logout Button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={18} color="#1e293b" />
              <View style={styles.redDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.signOutBtnCircle} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Mobile Side Drawer */}
      <ReceptionSideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* Edge-to-Edge Full Width Bottom Navigation Bar */}
      {!isAuthScreen && (
        <View style={styles.fullBottomNavContainer}>
          {bottomNavItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'reception_dashboard' && activeTab === 'reception');
            const isLogout = item.id === 'logout';
            const iconColor = isLogout ? '#ef4444' : isActive ? '#258ec8' : '#64748b';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.bottomTab}
                onPress={() => handleBottomTabPress(item.id)}
              >
                {item.iconType === 'ionicons' && (
                  <Ionicons name={item.iconName as any} size={22} color={iconColor} />
                )}
                {item.iconType === 'feather' && (
                  <Feather name={item.iconName as any} size={20} color={iconColor} />
                )}
                {item.iconType === 'mci' && (
                  <MaterialCommunityIcons name={item.iconName as any} size={22} color={iconColor} />
                )}

                <Text style={[
                  styles.bottomTabLabel, 
                  isActive && styles.bottomTabLabelActive,
                  isLogout && { color: '#ef4444' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  topHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  menuDrawerBtn: {
    padding: 4,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eef5fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
  },
  phoneSub: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284c7',
  },
  locBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locBadgeText: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    position: 'absolute',
    top: 6,
    right: 7,
  },
  signOutBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  fullBottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  bottomTabLabel: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 3,
  },
  bottomTabLabelActive: {
    color: '#258ec8',
    fontWeight: '800',
  },
});
