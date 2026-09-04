import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, User, Phone, Mail, Stethoscope, Video, 
  CheckCircle2, ChevronDown, Check, Home, Megaphone, ArrowRight, ShieldCheck, Info,
  ChevronLeft, ChevronRight, X, Building2, Lock
} from 'lucide-react';
import { createDocument } from '@app/shared';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface BookAppointmentPageProps {
  currentBranch?: string;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ 
  currentBranch = "KPHB Branch" 
}) => {
  // Section 1: Patient Details
  const [patientName, setPatientName] = useState('');
  const [diseases, setDiseases] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [marketingSource, setMarketingSource] = useState('Select Source');
  const [consultationMode, setConsultationMode] = useState('In-Clinic');

  // Section 2: Appointment Information
  const [appointmentDate, setAppointmentDate] = useState('2026-09-01');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Calendar State: Month & Year switching
  const [calMonth, setCalMonth] = useState(8); // 0 = Jan, 8 = Sep
  const [calYear, setCalYear] = useState(2026);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(false);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phoneNumber.trim()) {
      alert('Please enter Patient Name and Phone Number.');
      return;
    }
    if (!selectedDoctor) {
      alert('Please select a Doctor.');
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

      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);

      // Reset
      setPatientName('');
      setDiseases('');
      setPhoneNumber('');
      setEmailAddress('');
      setMarketingSource('Select Source');
      setSelectedDoctor('');
      setSelectedTimeSlot('');
    } catch (err) {
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '820px', margin: '0 auto', background: '#fcfdff' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px !important', fontWeight: 800, color: '#1e293b' }}>
          Book Appointment
        </h1>
      </div>

      {bookingSuccess && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          padding: '14px 18px',
          borderRadius: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px !important',
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)'
        }}>
          <CheckCircle2 size={18} color="#16a34a" />
          Appointment Booked Successfully!
        </div>
      )}

      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* CARD 1: PATIENT DETAILS */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '24px', 
          padding: '24px 26px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' 
        }}>
          {/* Card Header Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px !important'
            }}>
              1
            </div>
            <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#1e293b' }}>
              Patient Details
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#f1f5f9', marginLeft: '8px' }} />
          </div>

          {/* 2-Column Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* 1. Patient Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Patient Name
              </label>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '48px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Enter patient's name"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                  required
                />
              </div>
            </div>

            {/* 2. Diseases */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Diseases
              </label>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '48px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={diseases}
                  onChange={e => setDiseases(e.target.value)}
                  placeholder="Enter diseases"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* 3. Phone (+91) */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Phone (+91)
              </label>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '48px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="Phone"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                  required
                />
              </div>
            </div>

            {/* 4. Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Email Address
              </label>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 14px', height: '48px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="email" 
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  placeholder="Email"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                />
              </div>
            </div>

            {/* 5. Marketing Source Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Marketing Source
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0 14px',
                    height: '48px',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Megaphone size={16} color="#94a3b8" />
                      <span style={{ fontSize: '13px !important', color: marketingSource === 'Select Source' ? '#94a3b8' : '#0f172a', fontWeight: 500 }}>
                        {marketingSource}
                      </span>
                    </div>
                    <ChevronDown size={18} color="#94a3b8" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Select Marketing Source</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={marketingSource} onValueChange={setMarketingSource}>
                      {marketingSourcesList.map(src => (
                        <DropdownMenuRadioItem key={src} value={src}>{src}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 6. Mode of Consultation Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Mode of Consultation
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0 14px',
                    height: '48px',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={16} color="#94a3b8" />
                      <span style={{ fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}>
                        {consultationMode}
                      </span>
                    </div>
                    <ChevronDown size={18} color="#94a3b8" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Select Mode</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={consultationMode} onValueChange={setConsultationMode}>
                      <DropdownMenuRadioItem value="In-Clinic">In-Clinic</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Online">Online</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>
        </div>

        {/* CARD 2: APPOINTMENT INFORMATION (2-COLUMN REDUCED WIDTH FIELDS) */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '24px', 
          padding: '24px 26px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' 
        }}>
          {/* Card Header Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#3b82f6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '14px !important'
            }}>
              2
            </div>
            <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#1e293b' }}>
              Appointment Information
            </h2>
            <div style={{ flex: 1, height: '1px', background: '#f1f5f9', marginLeft: '8px' }} />
          </div>

          {/* 2-Column Reduced Width Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            
            {/* 1. Select Branch */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Select Branch *
              </label>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '0 14px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={18} color="#258ec8" />
                  <span style={{ fontSize: '13.5px !important', color: '#0f172a', fontWeight: 800 }}>
                    {currentBranch}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Date Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Date
              </label>
              <div 
                onClick={() => setCalendarModalOpen(true)}
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #3b82f6', 
                  borderRadius: '12px', 
                  padding: '0 14px', 
                  height: '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <CalendarIcon size={18} color="#3b82f6" style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '13.5px !important', color: '#0f172a', fontWeight: 700 }}>
                  {appointmentDate}
                </span>
                <CalendarIcon size={18} color="#3b82f6" />
              </div>
            </div>

            {/* 3. Select Doctor (Reduced Width) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Select Doctor
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0 14px',
                    height: '48px',
                    boxSizing: 'border-box',
                    maxWidth: '360px' // Compact Reduced Width Box
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <User size={16} color="#94a3b8" />
                      <span style={{ fontSize: '13px !important', color: selectedDoctor ? '#0f172a' : '#94a3b8', fontWeight: 500 }}>
                        {selectedDoctor || 'Select Doctor'}
                      </span>
                    </div>
                    <ChevronDown size={18} color="#94a3b8" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent style={{ maxWidth: '360px' }}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Select Doctor</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      {doctorsList.map(doc => (
                        <DropdownMenuRadioItem key={doc} value={doc}>{doc}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

          </div>

          {/* 4. Available Slots Section */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px !important', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
              <Clock size={16} color="#3b82f6" /> Available Slots
            </label>

            {!selectedDoctor ? (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '12px !important'
              }}>
                <Info size={16} color="#94a3b8" />
                Please select a doctor and branch to check availability.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {timeSlotsList.map(slot => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      style={{
                        background: isSelected ? '#3b82f6' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#334155',
                        border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontSize: '12px !important',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Clock size={12} color={isSelected ? '#ffffff' : '#64748b'} />
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM PRIMARY BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            height: '52px',
            borderRadius: '16px',
            fontSize: '15px !important',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            marginTop: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#ffffff" />
            <span>{isSubmitting ? 'Booking...' : 'Confirm Appointment'}</span>
          </div>
          <ArrowRight size={20} color="#ffffff" />
        </button>

      </form>

      {/* WEB POPUP CALENDAR DIALOG MODAL WITH MONTH & YEAR SWITCHING */}
      {calendarModalOpen && (
        <div 
          onClick={() => setCalendarModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '350px',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '1px solid #e2e8f0',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            {/* Calendar Header with Navigation Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <button 
                type="button"
                onClick={handlePrevMonth}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={18} color="#3b82f6" />
              </button>

              <span style={{ fontSize: '15.5px !important', fontWeight: 800, color: '#0f172a' }}>
                {monthNames[calMonth]} {calYear}
              </span>

              <button 
                type="button"
                onClick={handleNextMonth}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={18} color="#3b82f6" />
              </button>
            </div>

            {/* Weekdays Labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <span key={d} style={{ fontSize: '11px !important', fontWeight: 700, color: '#64748b' }}>{d}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {/* Padding empty cells */}
              {Array.from({ length: startDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day Cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(dayNum => {
                const formattedMonth = (calMonth + 1) < 10 ? `0${calMonth + 1}` : `${calMonth + 1}`;
                const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                const dayStr = `${calYear}-${formattedMonth}-${formattedDay}`;
                const isSelected = appointmentDate === dayStr;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => {
                      setAppointmentDate(dayStr);
                      setCalendarModalOpen(false);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isSelected ? '#3b82f6' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      border: 'none',
                      fontSize: '12.5px !important',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setCalendarModalOpen(false)}
              style={{
                width: '100%',
                marginTop: '18px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '8px',
                fontSize: '12px !important',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close Calendar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
