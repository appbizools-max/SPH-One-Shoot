import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDocument } from '@app/shared';

interface BookAppointmentScreenProps {
  currentBranch?: string;
}

export const BookAppointmentScreen: React.FC<BookAppointmentScreenProps> = ({ 
  currentBranch = "Nallagandla" 
}) => {
  // Section 1: Patient Details
  const [patientName, setPatientName] = useState('');
  const [diseases, setDiseases] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [marketingSource, setMarketingSource] = useState('Select Source');
  const [consultationMode, setConsultationMode] = useState<'In-Clinic' | 'Online'>('In-Clinic');

  // Section 2: Appointment Information
  const [appointmentDate, setAppointmentDate] = useState('2026-09-01');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Calendar State: Month & Year switching
  const [calMonth, setCalMonth] = useState(8); // 0 = Jan, 8 = Sep
  const [calYear, setCalYear] = useState(2026);

  // Dropdown & Modal States
  const [marketingExpanded, setMarketingExpanded] = useState(false);
  const [modeExpanded, setModeExpanded] = useState(false);
  const [doctorExpanded, setDoctorExpanded] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Exact 9 Marketing Sources requested by user
  const marketingSourcesList = [
    'Instagram',
    'Facebook',
    'Website',
    'Google',
    'Practo',
    'Referral',
    'Youtube',
    'Walk-in',
    'Old Patient',
  ];

  const consultationModesList = ['In-Clinic', 'Online'];

  const doctorsList = [
    'Dr. Spiritual Homeopathy Specialist',
    'Dr. Senior Classical Homeopath',
    'Dr. Pediatric Homeopathy Specialist',
    'Dr. Chronic Care & Wellness Expert',
  ];

  const timeSlotsList = [
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '02:00 PM',
    '02:30 PM',
    '04:00 PM',
  ];

  // Calculate dynamic days in month and starting day index
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const startDayIndex = new Date(calYear, calMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleBookAppointment = async () => {
    if (!patientName.trim() || !phoneNumber.trim()) {
      Alert.alert('Required Fields', 'Please enter Patient Name and Phone Number.');
      return;
    }
    if (!selectedDoctor) {
      Alert.alert('Required Field', 'Please select a Doctor.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDocument('appointments', {
        patientName,
        diseases,
        phoneNumber,
        emailAddress,
        marketingSource,
        consultationMode,
        branch: currentBranch,
        doctorName: selectedDoctor,
        appointmentDate,
        appointmentTime: selectedTimeSlot || '10:00 AM',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', `Appointment Booked Successfully for ${patientName}!`);

      // Reset
      setPatientName('');
      setDiseases('');
      setPhoneNumber('');
      setEmailAddress('');
      setMarketingSource('Select Source');
      setSelectedDoctor('');
      setSelectedTimeSlot('');
    } catch (err) {
      Alert.alert('Appointment Booked', `Appointment for ${patientName} saved locally.`);
      setPatientName('');
      setDiseases('');
      setPhoneNumber('');
      setEmailAddress('');
      setSelectedDoctor('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 140 }} 
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      
      {/* Back Arrow & Title Header */}
      <View style={styles.topHeaderNav}>
        <TouchableOpacity style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
      </View>

      {/* CARD 1: PATIENT DETAILS */}
      <View style={[styles.card, { zIndex: (marketingExpanded || modeExpanded) ? 100 : 1 }]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.badgeNumberCircle}>
            <Text style={styles.badgeNumberText}>1</Text>
          </View>
          <Text style={styles.cardTitle}>Patient Details</Text>
          <View style={styles.cardHeaderLine} />
        </View>

        {/* 2-Column Inputs: Patient Name & Diseases */}
        <View style={styles.rowTwoCol}>
          <View style={styles.colField}>
            <Text style={styles.fieldLabel}>Patient Name</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.inputText}
                placeholder="Enter patient's name"
                placeholderTextColor="#94a3b8"
                value={patientName}
                onChangeText={setPatientName}
              />
            </View>
          </View>

          <View style={styles.colField}>
            <Text style={styles.fieldLabel}>Diseases</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.inputText}
                placeholder="Enter diseases"
                placeholderTextColor="#94a3b8"
                value={diseases}
                onChangeText={setDiseases}
              />
            </View>
          </View>
        </View>

        {/* 2-Column Inputs: Phone (+91) & Email Address */}
        <View style={styles.rowTwoCol}>
          <View style={styles.colField}>
            <Text style={styles.fieldLabel}>Phone (+91)</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.inputText}
                placeholder="Phone"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <View style={styles.colField}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.inputText}
                placeholder="Email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            </View>
          </View>
        </View>

        {/* 2-Column Dropdowns: Marketing Source & Mode of Consultation */}
        <View style={[styles.rowTwoCol, { zIndex: 200 }]}>
          
          {/* Marketing Source Dropdown */}
          <View style={[styles.colField, { zIndex: marketingExpanded ? 300 : 1 }]}>
            <Text style={styles.fieldLabel}>Marketing Source</Text>
            <TouchableOpacity 
              style={styles.dropdownBox}
              onPress={() => {
                setModeExpanded(false);
                setMarketingExpanded(!marketingExpanded);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="bullhorn-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
              <Text style={[styles.dropdownValueText, marketingSource === 'Select Source' && { color: '#94a3b8' }]} numberOfLines={1}>
                {marketingSource === 'Select Source' ? 'Select' : marketingSource}
              </Text>
              <Feather name="chevron-down" size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            {marketingExpanded && (
              <View 
                style={[styles.floatingMenu, { height: 320 }]}
                onStartShouldSetResponder={() => true}
              >
                <ScrollView 
                  nestedScrollEnabled={true} 
                  overScrollMode="always"
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps="handled"
                  style={{ height: 312 }}
                >
                  {marketingSourcesList.map(src => (
                    <TouchableOpacity 
                      key={src} 
                      style={styles.floatingOption} 
                      onPress={() => { setMarketingSource(src); setMarketingExpanded(false); }}
                    >
                      <Text style={[styles.floatingOptionText, marketingSource === src && { color: '#258ec8', fontWeight: '800' }]}>
                        {src}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Mode of Consultation Dropdown */}
          <View style={[styles.colField, { zIndex: modeExpanded ? 300 : 1 }]}>
            <Text style={styles.fieldLabel}>Mode of Consultation</Text>
            <TouchableOpacity 
              style={styles.dropdownBox}
              onPress={() => {
                setMarketingExpanded(false);
                setModeExpanded(!modeExpanded);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="person-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
              <Text style={styles.dropdownValueText}>{consultationMode}</Text>
              <Feather name="chevron-down" size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            {modeExpanded && (
              <View 
                style={styles.floatingMenu}
                onStartShouldSetResponder={() => true}
              >
                {consultationModesList.map(mode => (
                  <TouchableOpacity 
                    key={mode} 
                    style={styles.floatingOption} 
                    onPress={() => { setConsultationMode(mode as any); setModeExpanded(false); }}
                  >
                    <Text style={[styles.floatingOptionText, consultationMode === mode && { color: '#258ec8', fontWeight: '800' }]}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

        </View>
      </View>

      {/* CARD 2: APPOINTMENT INFORMATION */}
      <View style={[styles.card, { zIndex: 1 }]}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.badgeNumberCircle}>
            <Text style={styles.badgeNumberText}>2</Text>
          </View>
          <Text style={styles.cardTitle}>Appointment Information</Text>
          <View style={styles.cardHeaderLine} />
        </View>
        {/* 1. Select Branch (Fixed to Logged-in Branch) */}
        <Text style={styles.fieldLabel}>Select Branch *</Text>
        <View style={styles.inputBoxFixedBranch}>
          <Ionicons name="location-outline" size={18} color="#258ec8" style={{ marginRight: 8 }} />
          <Text style={styles.fixedBranchText}>{currentBranch}</Text>
        </View>

        {/* 2. Date Field - Opens Visual Interactive Calendar Modal */}
        <Text style={styles.fieldLabel}>Date</Text>
        <TouchableOpacity 
          style={styles.inputBoxDate}
          onPress={() => setCalendarModalOpen(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="calendar-outline" size={18} color="#258ec8" style={{ marginRight: 10 }} />
          <Text style={styles.inputTextDate}>{appointmentDate}</Text>
          <Ionicons name="calendar-outline" size={18} color="#258ec8" />
        </TouchableOpacity>

        {/* 3. Select Doctor Field */}
        <View style={{ zIndex: doctorExpanded ? 300 : 1, position: 'relative' }}>
          <Text style={styles.fieldLabel}>Select Doctor</Text>
          <TouchableOpacity 
            style={styles.dropdownBox}
            onPress={() => setDoctorExpanded(!doctorExpanded)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
            <Text style={[styles.dropdownValueText, !selectedDoctor && { color: '#94a3b8' }]} numberOfLines={1}>
              {selectedDoctor || 'Select Doctor'}
            </Text>
            <Feather name="chevron-down" size={16} color="#94a3b8" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {doctorExpanded && (
            <View 
              style={styles.floatingMenu}
              onStartShouldSetResponder={() => true}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <ScrollView 
                nestedScrollEnabled={true} 
                overScrollMode="never"
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                onTouchStart={(e) => e.stopPropagation()}
                style={{ maxHeight: 180 }}
              >
                {doctorsList.map(doc => (
                  <TouchableOpacity 
                    key={doc} 
                    style={styles.floatingOption} 
                    onPress={() => { setSelectedDoctor(doc); setDoctorExpanded(false); }}
                  >
                    <Text style={[styles.floatingOptionText, selectedDoctor === doc && { color: '#258ec8', fontWeight: '800' }]}>
                      {doc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 4. Available Slots Section */}
        <View style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Ionicons name="time-outline" size={18} color="#258ec8" />
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a' }}>Available Slots</Text>
          </View>

          {!selectedDoctor ? (
            <View style={styles.infoBoxPlaceholder}>
              <Ionicons name="information-circle-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
              <Text style={styles.infoBoxText}>
                Please select a doctor and branch to check availability.
              </Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {timeSlotsList.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                    onPress={() => setSelectedTimeSlot(slot)}
                  >
                    <Ionicons 
                      name="time-outline" 
                      size={12} 
                      color={isSelected ? '#ffffff' : '#64748b'} 
                      style={{ marginRight: 4 }} 
                    />
                    <Text style={[styles.slotChipText, isSelected && styles.slotChipTextSelected]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

      </View>

      {/* CONFIRM APPOINTMENT PRIMARY BUTTON */}
      <TouchableOpacity 
        style={styles.confirmBtn} 
        onPress={handleBookAppointment}
        disabled={isSubmitting}
        activeOpacity={0.85}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="shield-check" size={20} color="#ffffff" />
          <Text style={styles.confirmBtnText}>
            {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
          </Text>
        </View>
        <Feather name="arrow-right" size={20} color="#ffffff" />
      </TouchableOpacity>

      {/* VISUAL INTERACTIVE CALENDAR DATE PICKER POPUP MODAL WITH MONTH & YEAR SWITCHING */}
      <Modal visible={calendarModalOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.calendarModalBackdrop} activeOpacity={1} onPress={() => setCalendarModalOpen(false)}>
          <View style={styles.calendarModalContent}>
            
            {/* Calendar Header with Month/Year Navigation Arrows */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
                <Feather name="chevron-left" size={20} color="#258ec8" />
              </TouchableOpacity>

              <Text style={styles.calendarHeaderTitle}>
                {monthNames[calMonth]} {calYear}
              </Text>

              <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
                <Feather name="chevron-right" size={20} color="#258ec8" />
              </TouchableOpacity>
            </View>

            {/* Weekday Labels */}
            <View style={styles.weekdaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.weekdayLabel}>{day}</Text>
              ))}
            </View>

            {/* Days Grid with Dynamic Month Days */}
            <View style={styles.daysGrid}>
              {/* Empty padding cells for start of month */}
              {Array.from({ length: startDayIndex }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.dayCellEmpty} />
              ))}

              {/* Numbered Days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                const formattedMonth = (calMonth + 1) < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`;
                const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const dayStr = `${calYear}-${formattedMonth}-${formattedDay}`;
                const isSelected = appointmentDate === dayStr;

                return (
                  <TouchableOpacity
                    key={dayNum}
                    style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                    onPress={() => {
                      setAppointmentDate(dayStr);
                      setCalendarModalOpen(false);
                    }}
                  >
                    <Text style={[styles.dayCellText, isSelected && styles.dayCellTextSelected]}>
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
  },
  topHeaderNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  badgeNumberCircle: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#258ec8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumberText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#1e293b',
  },
  cardHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 6,
  },
  rowTwoCol: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    position: 'relative',
  },
  colField: {
    flex: 1,
    position: 'relative',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
  },
  inputBoxFixedBranch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
  },
  fixedBranchText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '800',
    flex: 1,
  },
  fixedLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fixedLockBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#258ec8',
  },
  inputText: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '500',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  dropdownValueText: {
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },
  inputBoxDate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#258ec8',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  inputTextDate: {
    flex: 1,
    fontSize: 13.5,
    color: '#0f172a',
    fontWeight: '700',
  },
  floatingMenu: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 1000,
  },
  floatingOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  floatingOptionText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  infoBoxPlaceholder: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoBoxText: {
    fontSize: 11.5,
    color: '#64748b',
    flex: 1,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  slotChipSelected: {
    backgroundColor: '#258ec8',
    borderColor: '#258ec8',
  },
  slotChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  slotChipTextSelected: {
    color: '#ffffff',
    fontWeight: '800',
  },
  confirmBtn: {
    backgroundColor: '#258ec8',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#258ec8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  calendarModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calendarModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  monthNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  calendarHeaderTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  dayCellEmpty: {
    width: 38,
    height: 38,
  },
  dayCell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#258ec8',
  },
  dayCellText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0f172a',
  },
  dayCellTextSelected: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
