import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Clock, CreditCard, Search, Calendar, UserPlus, CheckCircle,
  ArrowRightLeft, UserX, UserCheck, Activity, CheckCircle2, Play, AlertCircle
} from 'lucide-react';
import { db } from '@app/shared';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

interface ReceptionDashboardPageProps {
  currentBranch?: string;
  onNavigate?: (tab: string) => void;
}

export const ReceptionDashboardPage: React.FC<ReceptionDashboardPageProps> = ({ currentBranch, onNavigate }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'active' | 'completed'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Subscribe live to Firestore appointments collection
  useEffect(() => {
    try {
      const colRef = collection(db, 'appointments');
      const unsubscribe = onSnapshot(colRef, (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((snap) => {
          list.push({ id: snap.id, ...snap.data() });
        });

        // Sort chronologically by date & time
        list.sort((a, b) => {
          const dateA = a.appointmentDate || '';
          const dateB = b.appointmentDate || '';
          return dateB.localeCompare(dateA);
        });

        setAppointments(list);
      }, (err) => {
        console.warn('Appointments snapshot listener notice:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Appointments listener setup notice:', e);
    }
  }, []);

  // Status update handler
  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    setActionLoadingId(appId);
    try {
      await updateDoc(doc(db, 'appointments', appId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getTodayISO = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const isMatchingDate = (a: any) => {
    const rawDate = a.appointmentDate || a.date || a.bookingDate;
    if (!rawDate) {
      // If document has no explicit date, show on Today's dashboard
      return selectedDate === getTodayISO();
    }
    const clean = String(rawDate).trim();
    if (!clean) {
      return selectedDate === getTodayISO();
    }

    if (clean === selectedDate || clean.startsWith(selectedDate)) return true;

    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const ddmmyyyy = `${d}/${m}/${y}`;
      const dmy = `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
      if (clean === ddmmyyyy || clean === dmy) return true;
    }

    return false;
  };

  const isMatchingBranch = (a: any) => {
    if (!currentBranch || currentBranch === 'All Branches') return true;
    const appBranch = a.branch || a.targetBranch || a.branchName;
    if (!appBranch) return true; // Show if document has no explicit branch set
    const normAppBranch = String(appBranch).toLowerCase().replace(/\s*branch\s*/i, '').trim();
    const normCurrentBranch = String(currentBranch).toLowerCase().replace(/\s*branch\s*/i, '').trim();
    return normAppBranch.includes(normCurrentBranch) || normCurrentBranch.includes(normAppBranch);
  };

  // Filter ONLY appointments for the selected date AND current branch
  const filteredBranchDateAppointments = appointments.filter(a => {
    return isMatchingDate(a) && isMatchingBranch(a);
  });

  // Filter lists for 3 sections (Selected Date & Branch ONLY)
  const upcomingList = filteredBranchDateAppointments.filter(a => {
    const st = (a.status || 'scheduled').toLowerCase().trim();
    return st === 'scheduled' || st === 'confirmed' || st === 'waiting' || st === 'pending' || (st !== 'in-consultation' && st !== 'active' && st !== 'completed' && st !== 'cancelled');
  });

  const activeList = filteredBranchDateAppointments.filter(a => {
    const st = (a.status || '').toLowerCase().trim();
    return st === 'in-consultation' || st === 'active' || st === 'consulting';
  });

  const completedList = filteredBranchDateAppointments.filter(a => {
    const st = (a.status || '').toLowerCase().trim();
    return st === 'completed' || st === 'concluded' || st === 'finished';
  });

  // Dynamic statistics for selected date & branch
  const totalBookings = filteredBranchDateAppointments.length;
  const waitingCount = filteredBranchDateAppointments.filter(a => (a.status || '').toLowerCase() === 'waiting' || (a.status || '').toLowerCase() === 'scheduled').length;
  const paymentPendingCount = filteredBranchDateAppointments.filter(a => a.paymentStatus === 'pending' || a.paymentPending).length;
  const activeConsultationCount = activeList.length;
  const completedCount = completedList.length;
  const followupOptedCount = filteredBranchDateAppointments.filter(a => a.followUpOpted || a.followup === true).length;
  const followupNotOptedCount = filteredBranchDateAppointments.filter(a => a.followUpOpted === false || a.followup === false).length;

  // Active list based on selected section tab
  const getTabAppointments = () => {
    switch (activeTab) {
      case 'active':
        return activeList;
      case 'completed':
        return completedList;
      case 'upcoming':
      default:
        return upcomingList;
    }
  };

  const currentTabAppointments = getTabAppointments().filter(app => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const pName = (app.patientName || app.name || '').toLowerCase();
    const pPhone = (app.phoneNumber || app.phone || '').toLowerCase();
    const docName = (app.doctorName || app.doctor || '').toLowerCase();
    const dis = (app.diseases || '').toLowerCase();
    return pName.includes(term) || pPhone.includes(term) || docName.includes(term) || dis.includes(term);
  });

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(37, 142, 200, 0.12)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(37, 142, 200, 0.25)' }}>
            <ClipboardList color="#258ec8" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px !important', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Reception Desk Dashboard
            </h1>
          </div>
        </div>

        {/* Date Filter Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1.5px solid #258ec8', padding: '6px 14px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(37, 142, 200, 0.12)' }}>
          <Calendar size={16} color="#258ec8" />
          <span style={{ fontSize: '12px !important', fontWeight: 800, color: '#1e293b' }}>Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px !important',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              background: 'transparent'
            }}
          />
          {selectedDate !== getTodayISO() && (
            <button
              type="button"
              onClick={() => setSelectedDate(getTodayISO())}
              style={{
                background: '#258ec8',
                color: '#ffffff',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px !important',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Reset Today
            </button>
          )}
        </div>
      </div>

      {/* 7 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Total Bookings</span>
            <Calendar color="#258ec8" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#258ec8' }}>{totalBookings}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Bookings Today</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Waiting</span>
            <Clock color="#d97706" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#d97706' }}>{waitingCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>In Waiting Lounge</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Active Consultations</span>
            <Activity color="#d97706" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#d97706' }}>{activeConsultationCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>With Doctor Now</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Payment Pending</span>
            <CreditCard color="#ef4444" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#ef4444' }}>{paymentPendingCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Unpaid Invoices</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Completed</span>
            <CheckCircle color="#16a34a" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#16a34a' }}>{completedCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Visits Concluded</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Follow-up Opted</span>
            <ArrowRightLeft color="#258ec8" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#258ec8' }}>{followupOptedCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Next Visit Booked</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Follow-up Not Opted</span>
            <UserX color="#64748b" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#64748b' }}>{followupNotOptedCount}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px', margin: 0 }}>No Next Visit</p>
        </div>
      </div>

      {/* 3 SECTION TAB BUTTONS & APPOINTMENTS TABLE */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>

        {/* Section Tabs Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* 1. Upcoming Appointments Tab Button */}
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: activeTab === 'upcoming' ? '2px solid #258ec8' : '1px solid #cbd5e1',
                fontWeight: 800,
                fontSize: '13px !important',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'upcoming' ? '#258ec8' : '#ffffff',
                color: activeTab === 'upcoming' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'upcoming' ? '0 4px 12px rgba(37, 142, 200, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Calendar size={16} /> Upcoming Appointments
              <span style={{
                background: activeTab === 'upcoming' ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                color: activeTab === 'upcoming' ? '#ffffff' : '#0284c7',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px !important',
                fontWeight: 800
              }}>
                {upcomingList.length}
              </span>
            </button>

            {/* 2. Active Consultation Tab Button */}
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: activeTab === 'active' ? '2px solid #d97706' : '1px solid #cbd5e1',
                fontWeight: 800,
                fontSize: '13px !important',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'active' ? '#d97706' : '#ffffff',
                color: activeTab === 'active' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'active' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Activity size={16} /> Active Consultation
              <span style={{
                background: activeTab === 'active' ? 'rgba(255, 255, 255, 0.25)' : '#fef3c7',
                color: activeTab === 'active' ? '#ffffff' : '#b45309',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px !important',
                fontWeight: 800
              }}>
                {activeList.length}
              </span>
            </button>

            {/* 3. Completed Appointments Tab Button */}
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: activeTab === 'completed' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                fontWeight: 800,
                fontSize: '13px !important',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: activeTab === 'completed' ? '#16a34a' : '#ffffff',
                color: activeTab === 'completed' ? '#ffffff' : '#475569',
                boxShadow: activeTab === 'completed' ? '0 4px 12px rgba(22, 163, 74, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <CheckCircle size={16} /> Completed Appointments
              <span style={{
                background: activeTab === 'completed' ? 'rgba(255, 255, 255, 0.25)' : '#dcfce7',
                color: activeTab === 'completed' ? '#ffffff' : '#15803d',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px !important',
                fontWeight: 800
              }}>
                {completedList.length}
              </span>
            </button>
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by patient, phone, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12px !important',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Dynamic Appointments Table */}
        {currentTabAppointments.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
            <AlertCircle size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '13px !important', fontWeight: 600 }}>
              No {activeTab === 'upcoming' ? 'upcoming appointments' : activeTab === 'active' ? 'active consultations' : 'completed appointments'} found.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px !important' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 800 }}>
                <th style={{ padding: '12px 8px' }}>PATIENT DETAILS</th>
                <th style={{ padding: '12px 8px' }}>DOCTOR & BRANCH</th>
                <th style={{ padding: '12px 8px' }}>DATE & TIME</th>
                <th style={{ padding: '12px 8px' }}>MODE / DISEASE</th>
                <th style={{ padding: '12px 8px' }}>STATUS</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentTabAppointments.map((app) => {
                const isLoading = actionLoadingId === app.id;
                const status = (app.status || 'scheduled').toLowerCase();

                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{app.patientName || app.name || 'Unnamed Patient'}</div>
                      <div style={{ fontSize: '11px !important', color: '#64748b', marginTop: '2px' }}>{app.phoneNumber || app.phone || 'No phone'}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{app.doctorName || app.doctor || 'Unassigned'}</div>
                      <div style={{ fontSize: '11px !important', color: '#64748b', marginTop: '2px' }}>{app.branch || 'Main Branch'}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ fontWeight: 700, color: '#0284c7' }}>{app.appointmentTime || app.time || '10:00 AM'}</div>
                      <div style={{ fontSize: '11px !important', color: '#64748b', marginTop: '2px' }}>{app.appointmentDate || 'Today'}</div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        background: app.consultationMode === 'video' ? '#f0f9ff' : '#f8fafc',
                        color: app.consultationMode === 'video' ? '#0284c7' : '#475569',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px !important',
                        fontWeight: 700,
                        display: 'inline-block',
                        marginBottom: '2px'
                      }}>
                        {app.consultationMode === 'video' ? '📹 Video' : '🏥 In-Person'}
                      </span>
                      {app.diseases && (
                        <div style={{ fontSize: '11px !important', color: '#64748b' }}>{app.diseases}</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {status === 'in-consultation' || status === 'active' ? (
                        <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '11px !important', fontWeight: 800 }}>
                          ⚡ In Consultation
                        </span>
                      ) : status === 'completed' ? (
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '11px !important', fontWeight: 800 }}>
                          ✓ Completed
                        </span>
                      ) : (
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '11px !important', fontWeight: 800 }}>
                          🕒 Scheduled / Waiting
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      {activeTab === 'upcoming' && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleUpdateStatus(app.id, 'in-consultation')}
                          style={{
                            background: '#258ec8',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px !important',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(37, 142, 200, 0.2)'
                          }}
                        >
                          <Play size={12} /> Send to Doctor
                        </button>
                      )}

                      {activeTab === 'active' && (
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleUpdateStatus(app.id, 'completed')}
                          style={{
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px !important',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)'
                          }}
                        >
                          <CheckCircle2 size={12} /> Complete Visit
                        </button>
                      )}

                      {activeTab === 'completed' && (
                        <span style={{ fontSize: '11px !important', color: '#16a34a', fontWeight: 700 }}>
                          Finished
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
