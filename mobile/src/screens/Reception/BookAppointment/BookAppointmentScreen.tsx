import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDocument, db } from '@app/shared';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface BookAppointmentScreenProps {
  currentBranch?: string;
  onNavigate?: (tab: string) => void;
  onBack?: () => void;
}

interface TimeSlot {
  startHour: string;
  startMinute: string;
  startAmPm: 'AM' | 'PM';
  endHour: string;
  endMinute: string;
  endAmPm: 'AM' | 'PM';
}

type DayName = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface DaySchedule {
  status: 'Available' | 'Closed';
  slots: TimeSlot[];
}

interface BranchSchedule {
  id: string;
  targetBranch: string;
  selectedDay: DayName;
  daySchedules: Record<DayName, DaySchedule>;
}

interface Doctor {
  id: string;
  name: string;
  phone: string;
  role: string;
  branchSchedules?: BranchSchedule[];
}

const DEFAULT_DOCTORS_SEED: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Prashanth K Vaidya',
    phone: '8125260176',
    role: 'Homeopathy Physician',
    branchSchedules: [
      {
        id: 'bs-1-kphb',
        targetBranch: 'KPHB Branch',
        selectedDay: 'Mon',
        daySchedules: {
          Mon: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }, { startHour: '05', startMinute: '00', startAmPm: 'PM', endHour: '07', endMinute: '00', endAmPm: 'PM' }] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }, { startHour: '05', startMinute: '00', startAmPm: 'PM', endHour: '07', endMinute: '00', endAmPm: 'PM' }] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }, { startHour: '05', startMinute: '00', startAmPm: 'PM', endHour: '07', endMinute: '00', endAmPm: 'PM' }] },
          Sat: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }, { startHour: '05', startMinute: '00', startAmPm: 'PM', endHour: '07', endMinute: '00', endAmPm: 'PM' }] },
          Sun: { status: 'Closed', slots: [] }
        }
      },
      {
        id: 'bs-1-chanda',
        targetBranch: 'Chandanagar Branch',
        selectedDay: 'Mon',
        daySchedules: {
          Mon: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '12', endMinute: '00', endAmPm: 'PM' }] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '12', endMinute: '00', endAmPm: 'PM' }] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '12', endMinute: '00', endAmPm: 'PM' }] },
          Sat: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '12', endMinute: '00', endAmPm: 'PM' }] },
          Sun: { status: 'Available', slots: [{ startHour: '11', startMinute: '00', startAmPm: 'AM', endHour: '01', endMinute: '00', endAmPm: 'PM' }] }
        }
      },
      {
        id: 'bs-1-nalla',
        targetBranch: 'Nallagandla Branch',
        selectedDay: 'Thu',
        daySchedules: {
          Mon: { status: 'Closed', slots: [] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Closed', slots: [] },
          Thu: { status: 'Available', slots: [{ startHour: '11', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Fri: { status: 'Closed', slots: [] },
          Sat: { status: 'Closed', slots: [] },
          Sun: { status: 'Available', slots: [{ startHour: '06', startMinute: '00', startAmPm: 'PM', endHour: '11', endMinute: '00', endAmPm: 'PM' }] }
        }
      }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. CH. Rama Krishna',
    phone: '9804176176',
    role: 'Homeopathy Physician',
    branchSchedules: [
      {
        id: 'bs-2-dsnr',
        targetBranch: 'Dilshuknagar Branch',
        selectedDay: 'Mon',
        daySchedules: {
          Mon: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Tue: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Wed: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Thu: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Fri: { status: 'Closed', slots: [] },
          Sat: { status: 'Closed', slots: [] },
          Sun: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] }
        }
      },
      {
        id: 'bs-2-nalla',
        targetBranch: 'Nallagandla Branch',
        selectedDay: 'Fri',
        daySchedules: {
          Mon: { status: 'Closed', slots: [] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Closed', slots: [] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Available', slots: [{ startHour: '10', startMinute: '30', startAmPm: 'AM', endHour: '02', endMinute: '30', endAmPm: 'PM' }] },
          Sat: { status: 'Available', slots: [{ startHour: '10', startMinute: '30', startAmPm: 'AM', endHour: '02', endMinute: '30', endAmPm: 'PM' }] },
          Sun: { status: 'Closed', slots: [] }
        }
      }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Jobedah Parveez',
    phone: '9903119766',
    role: 'Homeopathy Physician',
    branchSchedules: [
      {
        id: 'bs-3-nalla',
        targetBranch: 'Nallagandla Branch',
        selectedDay: 'Mon',
        daySchedules: {
          Mon: { status: 'Available', slots: [{ startHour: '11', startMinute: '00', startAmPm: 'AM', endHour: '01', endMinute: '00', endAmPm: 'PM' }] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Closed', slots: [] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Closed', slots: [] },
          Sat: { status: 'Closed', slots: [] },
          Sun: { status: 'Closed', slots: [] }
        }
      },
      {
        id: 'bs-3-kphb',
        targetBranch: 'KPHB Branch',
        selectedDay: 'Tue',
        daySchedules: {
          Mon: { status: 'Closed', slots: [] },
          Tue: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Wed: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Sat: { status: 'Available', slots: [{ startHour: '12', startMinute: '30', startAmPm: 'PM', endHour: '02', endMinute: '00', endAmPm: 'PM' }] },
          Sun: { status: 'Closed', slots: [] }
        }
      }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Padma Priya',
    phone: '9490808582',
    role: 'Homeopathy Physician',
    branchSchedules: [
      {
        id: 'bs-4-nalla',
        targetBranch: 'Nallagandla Branch',
        selectedDay: 'Tue',
        daySchedules: {
          Mon: { status: 'Closed', slots: [] },
          Tue: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] },
          Wed: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] },
          Thu: { status: 'Closed', slots: [] },
          Fri: { status: 'Closed', slots: [] },
          Sat: { status: 'Closed', slots: [] },
          Sun: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '05', endMinute: '00', endAmPm: 'PM' }] }
        }
      },
      {
        id: 'bs-4-chanda',
        targetBranch: 'Chandanagar Branch',
        selectedDay: 'Mon',
        daySchedules: {
          Mon: { status: 'Available', slots: [{ startHour: '12', startMinute: '00', startAmPm: 'PM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] },
          Tue: { status: 'Closed', slots: [] },
          Wed: { status: 'Closed', slots: [] },
          Thu: { status: 'Available', slots: [{ startHour: '10', startMinute: '00', startAmPm: 'AM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] },
          Fri: { status: 'Available', slots: [{ startHour: '12', startMinute: '00', startAmPm: 'PM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] },
          Sat: { status: 'Closed', slots: [] },
          Sun: { status: 'Available', slots: [{ startHour: '05', startMinute: '30', startAmPm: 'PM', endHour: '08', endMinute: '00', endAmPm: 'PM' }] }
        }
      }
    ]
  }
];

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
  const [appointmentDate, setAppointmentDate] = useState('01-09-2026');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Firestore Live Doctors List
  const [allDoctorsList, setAllDoctorsList] = useState<Doctor[]>(DEFAULT_DOCTORS_SEED);

  // Subscribe to real-time Firestore doctors collection
  useEffect(() => {
    try {
      const docColRef = collection(db, 'doctors');
      const unsubscribe = onSnapshot(docColRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetched: Doctor[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data();
            const seedFallback = DEFAULT_DOCTORS_SEED.find(s => s.id === snap.id || s.name === data.name || s.name === data.doctorName);
            fetched.push({
              id: snap.id,
              name: data.name || data.doctorName || seedFallback?.name || 'Doctor',
              phone: data.phone || data.mobile || seedFallback?.phone || '',
              role: data.role || seedFallback?.role || 'Homeopathy Physician',
              branch: data.branch || data.assignedBranch || '',
              branchSchedules: (data.branchSchedules && data.branchSchedules.length > 0)
                ? data.branchSchedules
                : (seedFallback?.branchSchedules || []),
            });
          });
          setAllDoctorsList(fetched);
        }
      }, (err) => {
        console.warn('Firestore doctors listener error:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore doctors subscribe notice:', e);
    }
  }, []);

  // Helper to convert DD-MM-YYYY to DayName
  const getSelectedDayName = (dateStr: string): DayName => {
    if (!dateStr) return 'Sat';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const d = new Date(year, month, day);
        const days: DayName[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()];
      }
    }
    return 'Sat';
  };

  const selectedDayName = getSelectedDayName(appointmentDate);

  // Dynamically filter doctors available for the selected branch and selected day
  const availableDoctors = allDoctorsList.filter((doc) => {
    const normCurrentBranch = (currentBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();

    if (doc.branchSchedules && doc.branchSchedules.length > 0) {
      const matchBs = doc.branchSchedules.find((bs) => {
        const normBsBranch = (bs.targetBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
        return normBsBranch.includes(normCurrentBranch) || normCurrentBranch.includes(normBsBranch);
      });

      if (!matchBs) return false;
      const daySched = matchBs.daySchedules?.[selectedDayName];
      if (!daySched) return false;

      return daySched.status === 'Available' && daySched.slots && daySched.slots.length > 0;
    }

    const docBranchStr = (doc.branch || doc.assignedBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
    if (docBranchStr) {
      return docBranchStr.includes(normCurrentBranch) || normCurrentBranch.includes(docBranchStr);
    }

    return false;
  });

  // Auto-reset selectedDoctor if no longer available on changed date/branch
  useEffect(() => {
    if (selectedDoctor && availableDoctors.length > 0) {
      const exists = availableDoctors.some((d) => d.name === selectedDoctor);
      if (!exists) {
        setSelectedDoctor('');
        setSelectedTimeSlot('');
      }
    }
  }, [appointmentDate, currentBranch, availableDoctors]);

  // Firestore Live Existing Appointments List for 15-min Slot Capacity Tracking
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  useEffect(() => {
    try {
      const appColRef = collection(db, 'appointments');
      const unsubscribe = onSnapshot(appColRef, (snapshot) => {
        const appList: any[] = [];
        snapshot.forEach((snap) => {
          appList.push({ id: snap.id, ...snap.data() });
        });
        setExistingAppointments(appList);
      }, (err) => {
        console.warn('Appointments snapshot warning:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Appointments listener notice:', e);
    }
  }, []);

  // Time conversion helpers for 15-min slot generation
  const parseTimeToMinutes = (hourStr: string, minStr: string, ampm: 'AM' | 'PM'): number => {
    let h = parseInt(hourStr, 10);
    const m = parseInt(minStr, 10) || 0;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const formatMinutesToTimeStr = (totalMins: number): string => {
    let h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const hhStr = h.toString().padStart(2, '0');
    const mmStr = m.toString().padStart(2, '0');
    return `${hhStr}:${mmStr} ${ampm}`;
  };

  const generate15MinSlotsFromRanges = (slotRanges: TimeSlot[]): string[] => {
    const result: string[] = [];
    slotRanges.forEach((range) => {
      const startMins = parseTimeToMinutes(range.startHour, range.startMinute, range.startAmPm);
      const endMins = parseTimeToMinutes(range.endHour, range.endMinute, range.endAmPm);

      for (let mins = startMins; mins < endMins; mins += 15) {
        const timeStr = formatMinutesToTimeStr(mins);
        if (!result.includes(timeStr)) {
          result.push(timeStr);
        }
      }
    });
    return result;
  };

  // Firestore Live Temporary Slots List
  interface TempSlotDoc {
    id?: string;
    doctorName: string;
    branch: string;
    appointmentDate: string;
    startHour: string;
    startMinute: string;
    startAmPm: 'AM' | 'PM';
    endHour: string;
    endMinute: string;
    endAmPm: 'AM' | 'PM';
  }

  const [tempSlotsList, setTempSlotsList] = useState<TempSlotDoc[]>([]);
  const [tempModalOpen, setTempModalOpen] = useState(false);

  // Temporary slot form states
  const [tempStartHour, setTempStartHour] = useState('09');
  const [tempStartMin, setTempStartMin] = useState('00');
  const [tempStartAmPm, setTempStartAmPm] = useState<'AM' | 'PM'>('AM');
  const [tempEndHour, setTempEndHour] = useState('10');
  const [tempEndMin, setTempEndMin] = useState('00');
  const [tempEndAmPm, setTempEndAmPm] = useState<'AM' | 'PM'>('AM');
  const [isSavingTempSlot, setIsSavingTempSlot] = useState(false);

  useEffect(() => {
    try {
      const tempColRef = collection(db, 'doctor_temp_slots');
      const unsubscribe = onSnapshot(tempColRef, (snapshot) => {
        const list: TempSlotDoc[] = [];
        snapshot.forEach((snap) => {
          list.push({ id: snap.id, ...snap.data() } as TempSlotDoc);
        });
        setTempSlotsList(list);
      }, (err) => {
        console.warn('Temp slots snapshot warning:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Temp slots listener notice:', e);
    }
  }, []);

  // Helper to add 15-min slot BEFORE regular/current start
  const handleAddSlotBefore = async () => {
    if (!selectedDoctor || timeSlotsList.length === 0) return;
    try {
      const earliestStr = timeSlotsList[0]; 
      const [timePart, ampm] = earliestStr.split(' ');
      const [h, m] = timePart.split(':');
      const totalMins = parseTimeToMinutes(h, m, ampm as 'AM' | 'PM');

      const newStartMins = Math.max(0, totalMins - 15);
      const newEndMins = totalMins;

      const startStr = formatMinutesToTimeStr(newStartMins);
      const endStr = formatMinutesToTimeStr(newEndMins);

      const [sHour, sMinAmpm] = startStr.split(':');
      const [sMin, sAmPm] = sMinAmpm.split(' ');

      const [eHour, eMinAmpm] = endStr.split(':');
      const [eMin, eAmPm] = eMinAmpm.split(' ');

      await addDoc(collection(db, 'doctor_temp_slots'), {
        doctorName: selectedDoctor,
        branch: currentBranch,
        appointmentDate: appointmentDate,
        startHour: sHour,
        startMinute: sMin,
        startAmPm: sAmPm,
        endHour: eHour,
        endMinute: eMin,
        endAmPm: eAmPm,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Error adding slot before:', e);
    }
  };

  // Helper to add 15-min slot AFTER regular/current end
  const handleAddSlotAfter = async () => {
    if (!selectedDoctor || timeSlotsList.length === 0) return;
    try {
      const latestStr = timeSlotsList[timeSlotsList.length - 1]; 
      const [timePart, ampm] = latestStr.split(' ');
      const [h, m] = timePart.split(':');
      const totalMins = parseTimeToMinutes(h, m, ampm as 'AM' | 'PM');

      const newStartMins = totalMins + 15;
      const newEndMins = newStartMins + 15;

      const startStr = formatMinutesToTimeStr(newStartMins);
      const endStr = formatMinutesToTimeStr(newEndMins);

      const [sHour, sMinAmpm] = startStr.split(':');
      const [sMin, sAmPm] = sMinAmpm.split(' ');

      const [eHour, eMinAmpm] = endStr.split(':');
      const [eMin, eAmPm] = eMinAmpm.split(' ');

      await addDoc(collection(db, 'doctor_temp_slots'), {
        doctorName: selectedDoctor,
        branch: currentBranch,
        appointmentDate: appointmentDate,
        startHour: sHour,
        startMinute: sMin,
        startAmPm: sAmPm,
        endHour: eHour,
        endMinute: eMin,
        endAmPm: eAmPm,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Error adding slot after:', e);
    }
  };

  const sortTimeSlotsChronologically = (slots: string[]): string[] => {
    return [...slots].sort((a, b) => {
      const parseSlotStr = (s: string) => {
        const [timePart, ampm] = s.split(' ');
        const [h, m] = timePart.split(':');
        return parseTimeToMinutes(h, m, ampm as 'AM' | 'PM');
      };
      return parseSlotStr(a) - parseSlotStr(b);
    });
  };

  // Compute available 15-minute time slots (Regular + Temporary) for selected doctor
  const selectedDocObj = availableDoctors.find((d) => d.name === selectedDoctor);
  const timeSlotsList = (() => {
    const defaultFallbackRanges: TimeSlot[] = [{
      startHour: '10', startMinute: '00', startAmPm: 'AM',
      endHour: '01', endMinute: '00', endAmPm: 'PM'
    }];

    let regularSlots: string[] = [];

    if (selectedDocObj && selectedDocObj.branchSchedules && selectedDocObj.branchSchedules.length > 0) {
      const normCurrentBranch = (currentBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
      const matchBs = selectedDocObj.branchSchedules.find((bs) => {
        const normBsBranch = (bs.targetBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
        return normBsBranch.includes(normCurrentBranch) || normCurrentBranch.includes(normBsBranch);
      });

      if (matchBs && matchBs.daySchedules?.[selectedDayName]) {
        const daySched = matchBs.daySchedules[selectedDayName];
        if (daySched.status === 'Available' && daySched.slots && daySched.slots.length > 0) {
          regularSlots = generate15MinSlotsFromRanges(daySched.slots);
        }
      }
    }

    if (regularSlots.length === 0) {
      regularSlots = generate15MinSlotsFromRanges(defaultFallbackRanges);
    }

    // Find temporary slots for selected doctor, appointment date, and branch
    const normSelectedDoc = (selectedDoctor || '').toLowerCase().trim();
    const normCurrentBranch = (currentBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();

    const matchedTempDocs = tempSlotsList.filter((ts) => {
      const sameDoc = (ts.doctorName || '').toLowerCase().trim() === normSelectedDoc;
      const sameDate = ts.appointmentDate === appointmentDate;
      const tsBranch = (ts.branch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
      const sameBranch = !tsBranch || tsBranch.includes(normCurrentBranch) || normCurrentBranch.includes(tsBranch);
      return sameDoc && sameDate && sameBranch;
    });

    const tempSlotsRanges: TimeSlot[] = matchedTempDocs.map((ts) => ({
      startHour: ts.startHour,
      startMinute: ts.startMinute,
      startAmPm: ts.startAmPm,
      endHour: ts.endHour,
      endMinute: ts.endMinute,
      endAmPm: ts.endAmPm
    }));

    const generatedTempSlots = generate15MinSlotsFromRanges(tempSlotsRanges);

    // Merge regular & temp slots, remove duplicates, and sort chronologically
    const combined = Array.from(new Set([...regularSlots, ...generatedTempSlots]));
    return sortTimeSlotsChronologically(combined);
  })();

  const normalizeTimeStr = (str: string): string => {
    if (!str) return '';
    const trimmed = str.trim().toUpperCase();
    const parts = trimmed.split(' ');
    if (parts.length < 2) return trimmed;
    const [timePart, ampm] = parts;
    const timeSub = timePart.split(':');
    if (timeSub.length < 2) return trimmed;
    const hNum = parseInt(timeSub[0], 10);
    const mNum = parseInt(timeSub[1], 10) || 0;
    const hStr = hNum.toString().padStart(2, '0');
    const mStr = mNum.toString().padStart(2, '0');
    return `${hStr}:${mStr} ${ampm}`;
  };

  // Map of slotTimeStr -> tempDocId for temporary slots
  const tempSlotMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!selectedDoctor) return map;
    const normSelectedDoc = (selectedDoctor || '').toLowerCase().trim();
    const normCurrentBranch = (currentBranch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();

    const matchedTempDocs = tempSlotsList.filter((ts) => {
      const sameDoc = (ts.doctorName || '').toLowerCase().trim() === normSelectedDoc;
      const sameDate = ts.appointmentDate === appointmentDate;
      const tsBranch = (ts.branch || '').toLowerCase().replace(/\s*branch\s*/i, '').trim();
      const sameBranch = !tsBranch || tsBranch.includes(normCurrentBranch) || normCurrentBranch.includes(tsBranch);
      return sameDoc && sameDate && sameBranch;
    });

    matchedTempDocs.forEach((ts) => {
      const slots = generate15MinSlotsFromRanges([{
        startHour: ts.startHour,
        startMinute: ts.startMinute,
        startAmPm: ts.startAmPm,
        endHour: ts.endHour,
        endMinute: ts.endMinute,
        endAmPm: ts.endAmPm
      }]);
      slots.forEach((sStr) => {
        if (ts.id) {
          map[normalizeTimeStr(sStr)] = ts.id;
          map[sStr.trim()] = ts.id;
        }
      });
    });

    return map;
  }, [selectedDoctor, currentBranch, appointmentDate, tempSlotsList]);

  // Helper to delete temporary slot from Firestore
  const handleDeleteTempSlot = async (tempDocId: string) => {
    try {
      await deleteDoc(doc(db, 'doctor_temp_slots', tempDocId));
    } catch (e) {
      console.warn('Error deleting temp slot:', e);
    }
  };

  // Helper to calculate remaining slots out of 3 capacity for a time slot
  const getSlotCapacityInfo = (slotTimeStr: string) => {
    const normSelectedDoc = (selectedDoctor || '').toLowerCase().trim();
    const bookedCount = existingAppointments.filter((app) => {
      const normAppDoc = (app.doctorName || app.doctor || '').toLowerCase().trim();
      const sameDoc = normAppDoc === normSelectedDoc;
      const sameDate = app.appointmentDate === appointmentDate;
      const sameTime = (app.appointmentTime || app.time || '').trim() === slotTimeStr.trim();
      const notCancelled = app.status !== 'cancelled';
      return sameDoc && sameDate && sameTime && notCancelled;
    }).length;

    const remainingSlots = Math.max(0, 3 - bookedCount);
    return {
      bookedCount,
      remainingSlots,
      isFull: remainingSlots === 0
    };
  };

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
      {/* Back Arrow < & Title Header */}
      <View style={styles.topHeaderNav}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('reception_dashboard');
          }}
        >
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
                {availableDoctors.length === 0 ? (
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                      No doctors available on {selectedDayName} for {currentBranch}
                    </Text>
                  </View>
                ) : (
                  availableDoctors.map(docObj => (
                    <TouchableOpacity
                      key={docObj.id || docObj.name}
                      style={styles.floatingOption}
                      onPress={() => {
                        setSelectedDoctor(docObj.name);
                        setDoctorExpanded(false);
                        setSelectedTimeSlot('');
                      }}
                    >
                      <Text style={[styles.floatingOptionText, selectedDoctor === docObj.name && { color: '#258ec8', fontWeight: '800' }]}>
                        {docObj.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 4. Available Slots Section */}
        <View style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="time-outline" size={18} color="#258ec8" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#0f172a' }}>Available Slots</Text>
            </View>

            {selectedDoctor ? (
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <TouchableOpacity
                  onPress={handleAddSlotBefore}
                  style={{
                    backgroundColor: '#e0f2fe',
                    borderColor: '#bae6fd',
                    borderWidth: 1,
                    borderRadius: 6,
                    paddingHorizontal: 7,
                    paddingVertical: 3.5,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#0284c7' }}>
                    + Slot Before
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleAddSlotAfter}
                  style={{
                    backgroundColor: '#e0f2fe',
                    borderColor: '#bae6fd',
                    borderWidth: 1,
                    borderRadius: 6,
                    paddingHorizontal: 7,
                    paddingVertical: 3.5,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#0284c7' }}>
                    + Slot After
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {!selectedDoctor ? (
            <View style={styles.infoBoxPlaceholder}>
              <Ionicons name="information-circle-outline" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
              <Text style={styles.infoBoxText}>
                Please select a doctor and branch to check availability.
              </Text>
            </View>
          ) : (
            <View style={[styles.slotsGrid, { overflow: 'visible', paddingTop: 8, paddingRight: 6 }]}>
              {timeSlotsList.map((slot) => {
                const isSelected = selectedTimeSlot === slot;
                const { remainingSlots, isFull } = getSlotCapacityInfo(slot);
                const normKey = normalizeTimeStr(slot);
                const tempDocId = tempSlotMap[normKey] || tempSlotMap[slot.trim()];
                const isTemp = !!tempDocId;

                return (
                  <View key={slot} style={{ width: '23.2%', position: 'relative', overflow: 'visible', marginBottom: 6 }}>
                    <TouchableOpacity
                      disabled={isFull}
                      style={[
                        styles.slotChipColumn,
                        isTemp && {
                          borderColor: '#dc2626',
                          borderWidth: 2,
                          backgroundColor: isSelected ? '#dc2626' : '#fff5f5',
                        },
                        isSelected && !isTemp && styles.slotChipSelected,
                        isSelected && isTemp && { backgroundColor: '#dc2626', borderColor: '#991b1b', borderWidth: 2 },
                        isFull && { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', opacity: 0.65 }
                      ]}
                      onPress={() => {
                        if (!isFull) {
                          setSelectedTimeSlot(slot);
                        }
                      }}
                      activeOpacity={isFull ? 1 : 0.8}
                    >
                      <Text style={[
                        styles.slotChipText,
                        isTemp && !isSelected && { color: '#dc2626', fontWeight: '800' },
                        isSelected && styles.slotChipTextSelected,
                        isFull && { color: '#94a3b8', textDecorationLine: 'line-through' }
                      ]}>
                        {slot}
                      </Text>
                      <View
                        style={{
                          marginTop: 2,
                          paddingHorizontal: 3,
                          paddingVertical: 1,
                          borderRadius: 4,
                          backgroundColor: isSelected
                            ? 'rgba(255, 255, 255, 0.25)'
                            : isTemp
                              ? '#fee2e2'
                              : isFull
                                ? '#fee2e2'
                                : remainingSlots === 1
                                  ? '#fef3c7'
                                  : '#e0f2fe'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8,
                            fontWeight: '800',
                            color: isSelected
                              ? '#ffffff'
                              : isTemp
                                ? '#dc2626'
                                : isFull
                                  ? '#ef4444'
                                  : remainingSlots === 1
                                    ? '#b45309'
                                    : '#0369a1'
                          }}
                        >
                          {isFull ? 'FULL' : `${remainingSlots} left`}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {isTemp && (
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteTempSlot(tempDocId);
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          backgroundColor: '#dc2626',
                          borderColor: '#ffffff',
                          borderWidth: 1.5,
                          borderRadius: 10,
                          width: 18,
                          height: 18,
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 99,
                          elevation: 6,
                        }}
                      >
                        <Ionicons name="close" size={11} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                  </View>
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
                const dayStr = `${formattedDay}-${formattedMonth}-${calYear}`;
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
    justifyContent: 'flex-start',
    gap: 6,
  },
  slotChipColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 5,
    width: '100%',
  },
  slotChipSelected: {
    backgroundColor: '#258ec8',
    borderColor: '#258ec8',
  },
  slotChipText: {
    fontSize: 10.5,
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
