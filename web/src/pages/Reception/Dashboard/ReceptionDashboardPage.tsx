import React from 'react';
import { ClipboardList, Clock, CreditCard, Search, Calendar, UserPlus, CheckCircle, ArrowRightLeft, UserX, UserCheck } from 'lucide-react';

export const ReceptionDashboardPage: React.FC = () => {
  const totalBookings = 0;
  const waiting = 0;
  const paymentPending = 0;
  const completed = 0;
  const appointmentsCompleted = 0;
  const followupOpted = 0;
  const followupNotOpted = 0;

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(37, 142, 200, 0.12)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(37, 142, 200, 0.25)' }}>
            <ClipboardList color="#258ec8" size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px !important', fontWeight: 800, color: '#1e293b' }}>
              Reception Desk Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '11.5px !important', marginTop: '2px' }}>
              Real-time patient check-ins, queue status, payment track & appointments summary
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            background: '#258ec8',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '11.5px !important',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 10px rgba(37, 142, 200, 0.25)'
          }}>
            <UserPlus size={14} /> Register New Patient
          </button>
          <button style={{
            background: '#a8ce3a',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '11.5px !important',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 10px rgba(168, 206, 58, 0.3)'
          }}>
            <Calendar size={14} /> Book Appointment
          </button>
        </div>
      </div>

      {/* 7 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Total Bookings</span>
            <Calendar color="#258ec8" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#258ec8' }}>{totalBookings}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>Bookings Today</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Waiting</span>
            <Clock color="#d97706" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#d97706' }}>{waiting}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>In Waiting Lounge</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Payment Pending</span>
            <CreditCard color="#ef4444" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#ef4444' }}>{paymentPending}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>Unpaid Invoices</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Completed</span>
            <CheckCircle color="#a8ce3a" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#638012' }}>{completed}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>Visits Concluded</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Appointments Completed</span>
            <UserCheck color="#258ec8" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#1d72a3' }}>{appointmentsCompleted}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>Fulfilled Sessions</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Follow-up Opted</span>
            <ArrowRightLeft color="#a8ce3a" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#7a9e1e' }}>{followupOpted}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>Next Visit Booked</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px !important', fontWeight: 600, color: '#64748b' }}>Follow-up Not Opted</span>
            <UserX color="#64748b" size={16} />
          </div>
          <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#64748b' }}>{followupNotOpted}</span>
          <p style={{ fontSize: '10.5px !important', color: '#94a3b8', marginTop: '4px' }}>No Next Visit</p>
        </div>
      </div>

      {/* Full-Width Spacious Live Waiting Queue Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '15px !important', fontWeight: 700, color: '#1e293b' }}>
            Live Patient Queue
          </h2>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '8px' }} />
            <input 
              type="text" 
              placeholder="Search patient..." 
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '11.5px !important',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px !important' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 700 }}>
              <th style={{ padding: '10px 6px' }}>TOKEN / PATIENT</th>
              <th style={{ padding: '10px 6px' }}>DOCTOR</th>
              <th style={{ padding: '10px 6px' }}>TIME</th>
              <th style={{ padding: '10px 6px' }}>STATUS</th>
              <th style={{ padding: '10px 6px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '12px 6px', fontWeight: 600, color: '#1e293b' }}>#T-101 • Sarah Jenkins</td>
              <td style={{ padding: '12px 6px', color: '#64748b' }}>Dr. Homeo Specialist</td>
              <td style={{ padding: '12px 6px', color: '#64748b' }}>10:30 AM</td>
              <td style={{ padding: '12px 6px' }}>
                <span style={{ background: '#fffbeb', color: '#d97706', padding: '3px 8px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                  Waiting
                </span>
              </td>
              <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                <button style={{ background: '#258ec8', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  Send to Doctor
                </button>
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '12px 6px', fontWeight: 600, color: '#1e293b' }}>#T-102 • Ramesh Kumar</td>
              <td style={{ padding: '12px 6px', color: '#64748b' }}>Dr. Spiritual Guide</td>
              <td style={{ padding: '12px 6px', color: '#64748b' }}>10:45 AM</td>
              <td style={{ padding: '12px 6px' }}>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '10px', fontSize: '10.5px', fontWeight: 700 }}>
                  In Consultation
                </span>
              </td>
              <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                <button style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  View Record
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
