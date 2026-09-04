import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';

interface ReceptionSideDrawerProps {
  visible: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string;
}

export const ReceptionSideDrawer: React.FC<ReceptionSideDrawerProps> = ({ visible, onClose, activeTab, setActiveTab, userRole = 'reception' }) => {
  const adminMenuItems = [
    { id: 'admin', label: 'Admin Control Hub', icon: '🛡️' },
  ];

  const hrMenuItems = [
    { id: 'hr', label: 'HR & Staff Portal', icon: '👥' },
  ];

  const receptionMenuItems = [
    { id: 'reception_dashboard', label: 'Dashboard', icon: '📋' },
    { id: 'reception_book', label: 'Book Appointment', icon: '📅' },
    { id: 'reception_patients', label: 'All Patients', icon: '👥' },
    { id: 'reception_followups', label: 'Follow Ups', icon: '🔄' },
    { id: 'reception_medicines', label: 'Medicine Requests', icon: '💊' },
    { id: 'reception_billing', label: 'Product Billing', icon: '💳' },
    { id: 'reception_noshow', label: 'Doctor No Show', icon: '🚫' },
    { id: 'reception_media', label: 'Media Manager', icon: '🖼️' },
    { id: 'reception_cleaning', label: 'Cleaning Photos', icon: '📷' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userRole === 'hr' ? hrMenuItems : receptionMenuItems;
  const brandSub = userRole === 'admin' ? 'ADMIN PORTAL' : userRole === 'hr' ? 'HR PORTAL' : 'RECEPTION DESK';

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.drawerContainer}>
          {/* Brand Header Banner */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Text style={{ fontSize: 18 }}>🌿</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>Spiritual Homeo</Text>
                <Text style={styles.brandSub}>{brandSub}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items List */}
          <ScrollView contentContainerStyle={{ paddingVertical: 14 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionHeading}>DESK NAVIGATION</Text>

            {menuItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'reception_dashboard' && activeTab === 'reception');
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleSelect(item.id)}
                >
                  <View style={[styles.iconBg, isActive && styles.iconBgActive]}>
                    <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    flexDirection: 'row',
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 310,
    backgroundColor: '#ffffff',
    height: '100%',
    paddingTop: 44,
    paddingHorizontal: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#258ec8',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 142, 200, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#258ec8',
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#a8ce3a',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: '#eef5fc',
    borderLeftWidth: 4,
    borderLeftColor: '#258ec8',
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBgActive: {
    backgroundColor: '#ffffff',
  },
  menuLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  menuLabelActive: {
    color: '#258ec8',
    fontWeight: '800',
  },
});
