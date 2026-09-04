import React, { useState } from 'react';
import { 
  Building2, Users, DollarSign, Clock, TrendingUp, AlertCircle, ShieldAlert, 
  UserCheck, Package, Pill, Search, Plus, Edit, CheckCircle2, Target, Calendar,
  PieChart, Award, FileText, ChevronRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  currentBranch?: string;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentBranch = "All Branches" }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'patients' | 'staff' | 'doctors' | 'finance' | 'medicines'>('overview');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');

  // Medicine Edit Form state
  const [remedyName, setRemedyName] = useState('');
  const [remedyPotency, setRemedyPotency] = useState('200C');
  const [remedyCategory, setRemedyCategory] = useState('Chronic');
  const [remedyStock, setRemedyStock] = useState('150');
  const [medicineSavedMsg, setMedicineSavedMsg] = useState(false);

  // Mock Branch Targets Data
  const [branchesList, setBranchesList] = useState([
    { id: 'kphb', name: 'KPHB Branch', phone: '+91 90301 76176', target: '₹12,00,000', achieved: '₹9,80,000', patients: 340, status: 'Active' },
    { id: 'nallagandla', name: 'Nallagandla Branch', phone: '+91 91321 76176', target: '₹10,00,000', achieved: '₹8,40,000', patients: 280, status: 'Active' },
    { id: 'dilshuknagar', name: 'Dilshuknagar Branch', phone: '+91 98041 76176', target: '₹14,00,000', achieved: '₹11,50,000', patients: 410, status: 'Active' },
    { id: 'chandanagar', name: 'Chandanagar Branch', phone: '+91 95531 76176', target: '₹9,00,000', achieved: '₹7,20,000', patients: 220, status: 'Active' },
  ]);

  // Global Patients Sample Data
  const globalPatientsList = [
    { id: 'PAT-101', name: 'Rajesh Kumar', phone: '+91 98490 12345', branch: 'KPHB Branch', package: 'Platinum Annual Wellness', source: 'Instagram', status: 'Active' },
    { id: 'PAT-102', name: 'Sneha Reddy', phone: '+91 91210 67890', branch: 'Nallagandla Branch', package: 'Classical Homeo Care', source: 'Google', status: 'Active' },
    { id: 'PAT-103', name: 'Venkatesh Rao', phone: '+91 94400 45678', branch: 'Dilshuknagar Branch', package: 'Pediatric Care Plan', source: 'Website', status: 'Active' },
    { id: 'PAT-104', name: 'Ananya Sharma', phone: '+91 99887 11223', branch: 'Chandanagar Branch', package: 'Chronic Skin Treatment', source: 'Referral', status: 'Active' },
  ];

  // Doctors & Timings Data
  const doctorsList = [
    { id: 'DOC-1', name: 'Dr. Prashanth k vaidya', phone: '8125260176', role: 'Head Doctor', timings: '10:00 AM - 02:00 PM (KPHB) / 03:00 PM - 08:30 PM (Chandanagar)' },
    { id: 'DOC-2', name: 'Dr. Jobeadh parveej', phone: '9903119766', role: 'Head Doctor', timings: '10:00 AM - 02:00 PM (Nallagandla) / 05:00 PM - 08:30 PM (KPHB)' },
    { id: 'DOC-3', name: 'Dr. Padma priya', phone: '9490808582', role: 'Employee Doctor', timings: '10:00 AM - 08:00 PM (General Consultation)' },
    { id: 'DOC-4', name: 'Dr. Ramakrishna chanduri', phone: '1111111111', role: 'Head Doctor', timings: '10:00 AM - 02:00 PM (Dilshuknagar) / 05:00 PM - 09:00 PM (Nallagandla)' },
  ];

  // Staff Working Hours Data
  const staffList = [
    { id: 'STF-1', name: 'Anil Kumar M', role: 'Reception & Operations', branch: 'KPHB', hours: '8.5 Hours/Day', shift: '10:00 AM - 08:30 PM', salary: '₹22,000' },
    { id: 'STF-2', name: 'Ashwini Begari', role: 'Front Desk Officer', branch: 'Chandanagar', hours: '8.0 Hours/Day', shift: '10:00 AM - 08:00 PM', salary: '₹17,000' },
    { id: 'STF-3', name: 'Vaishnavi Peri', role: 'Clinic Manager', branch: 'Nallagandla', hours: '8.5 Hours/Day', shift: '10:00 AM - 08:30 PM', salary: '₹17,000' },
    { id: 'STF-4', name: 'Nandini Gottelli', role: 'Assistant Chemist', branch: 'Dilshuknagar', hours: '8.5 Hours/Day', shift: '10:00 AM - 08:30 PM', salary: '₹15,000' },
  ];

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remedyName) return;
    setMedicineSavedMsg(true);
    setTimeout(() => setMedicineSavedMsg(false), 3000);
    setRemedyName('');
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1280px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#3b82f6', padding: '12px', borderRadius: '16px', color: '#ffffff', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)' }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px !important', fontWeight: 800, color: '#0f172a' }}>
              Admin Control Hub
            </h1>
            <p style={{ color: '#64748b', fontSize: '12px !important', marginTop: '2px' }}>
              Global Patients, Branch Targets, Staff Hours, Revenue & Doctor Schedules
            </p>
          </div>
        </div>

        {/* Global Quick Metrics */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={18} color="#3b82f6" />
            <div>
              <span style={{ display: 'block', fontSize: '10.5px !important', color: '#64748b', fontWeight: 700 }}>ACTIVE BRANCHES</span>
              <span style={{ fontSize: '14px !important', fontWeight: 800, color: '#0f172a' }}>4 Official</span>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={18} color="#10b981" />
            <div>
              <span style={{ display: 'block', fontSize: '10.5px !important', color: '#64748b', fontWeight: 700 }}>GLOBAL PATIENTS</span>
              <span style={{ fontSize: '14px !important', fontWeight: 800, color: '#0f172a' }}>1,250 Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        background: '#ffffff', 
        padding: '6px', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0', 
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: '📊 Dashboard Analytics', icon: PieChart },
          { id: 'branches', label: '🏢 Manage Branches & Targets', icon: Building2 },
          { id: 'patients', label: '👥 Global Patients & Packages', icon: Users },
          { id: 'doctors', label: '👨‍⚕️ Doctor Timings', icon: Clock },
          { id: 'staff', label: '👔 Staff & Working Hours', icon: UserCheck },
          { id: 'finance', label: '💰 Total & Nutrition Revenue', icon: DollarSign },
          { id: 'medicines', label: '💊 Edit Medicine Form', icon: Pill },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#64748b',
              fontWeight: activeTab === tab.id ? 800 : 600,
              fontSize: '12px !important',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD & ANALYTICS */}
      {activeTab === 'overview' && (
        <div>
          {/* Revenue & Financial Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px !important', fontWeight: 700, color: '#64748b' }}>TOTAL REVENUE</span>
                <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '10px' }}><DollarSign size={18} color="#3b82f6" /></div>
              </div>
              <span style={{ fontSize: '22px !important', fontWeight: 800, color: '#0f172a' }}>₹36,90,000</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#16a34a', fontSize: '11.5px !important', fontWeight: 700 }}>
                <TrendingUp size={14} /> +14.2% vs last month
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px !important', fontWeight: 700, color: '#64748b' }}>PENDING PAYMENTS</span>
                <div style={{ background: '#fef2f2', padding: '6px', borderRadius: '10px' }}><AlertCircle size={18} color="#ef4444" /></div>
              </div>
              <span style={{ fontSize: '22px !important', fontWeight: 800, color: '#ef4444' }}>₹1,45,000</span>
              <div style={{ marginTop: '8px', color: '#64748b', fontSize: '11.5px !important' }}>
                12 Pending Patient Invoices
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px !important', fontWeight: 700, color: '#64748b' }}>NUTRITION REVENUE</span>
                <div style={{ background: '#f0fdf4', padding: '6px', borderRadius: '10px' }}><Pill size={18} color="#16a34a" /></div>
              </div>
              <span style={{ fontSize: '22px !important', fontWeight: 800, color: '#16a34a' }}>₹4,85,000</span>
              <div style={{ marginTop: '8px', color: '#64748b', fontSize: '11.5px !important' }}>
                Homeopathic Supplements & Wellness
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '18px', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px !important', fontWeight: 700, color: '#64748b' }}>AVERAGE ANALYTICS</span>
                <div style={{ background: '#faf5ff', padding: '6px', borderRadius: '10px' }}><Target size={18} color="#a855f7" /></div>
              </div>
              <span style={{ fontSize: '22px !important', fontWeight: 800, color: '#a855f7' }}>₹3,200 / Patient</span>
              <div style={{ marginTop: '8px', color: '#64748b', fontSize: '11.5px !important' }}>
                Average Consultation Ticket Size
              </div>
            </div>
          </div>

          {/* Branch Performance Overview Grid */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px !important', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Branch Performance & Monthly Target Achievement
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {branchesList.map(b => (
                <div key={b.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13.5px !important', fontWeight: 800, color: '#0f172a' }}>{b.name}</span>
                    <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '8px', fontSize: '10.5px !important', fontWeight: 700 }}>
                      {b.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px !important', color: '#64748b', marginBottom: '4px' }}>
                    <span>Target: <b>{b.target}</b></span>
                    <span>Achieved: <b style={{ color: '#16a34a' }}>{b.achieved}</b></span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', margin: '8px 0' }}>
                    <div style={{ width: '82%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '11px !important', color: '#64748b', fontWeight: 600 }}>
                    📞 {b.phone} • {b.patients} Active Patients
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE BRANCHES & TARGET MANAGEMENT */}
      {activeTab === 'branches' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a' }}>
                Branch Management & Target Settings
              </h2>
              <p style={{ fontSize: '12px !important', color: '#64748b' }}>
                Manage official clinic branches, receptionist contacts, and set monthly revenue targets.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>BRANCH NAME</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>RECEPTIONIST PHONE</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>MONTHLY TARGET</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>REVENUE ACHIEVED</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>ACTIVE PATIENTS</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {branchesList.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px !important', fontWeight: 700, color: '#0f172a' }}>{b.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{b.phone}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', fontWeight: 700, color: '#3b82f6' }}>{b.target}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', fontWeight: 700, color: '#16a34a' }}>{b.achieved}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{b.patients} Patients</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px !important', fontWeight: 700, cursor: 'pointer', color: '#3b82f6' }}>
                        Edit Target
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL PATIENTS & PACKAGE MEMBERS */}
      {activeTab === 'patients' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a' }}>
                Global Patients & Package Members Directory
              </h2>
              <p style={{ fontSize: '12px !important', color: '#64748b' }}>
                Master patient registry, marketing sources, and package memberships.
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input 
                  type="text" 
                  placeholder="Search patient or phone..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '12px !important', outline: 'none' }}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>PATIENT ID</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>PATIENT NAME</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>PHONE</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>BRANCH</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>PACKAGE MEMBERSHIP</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>MARKETING SOURCE</th>
                </tr>
              </thead>
              <tbody>
                {globalPatientsList
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone.includes(searchQuery))
                  .map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#3b82f6' }}>{p.id}</td>
                      <td style={{ padding: '12px 14px', fontSize: '13px !important', fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{p.phone}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{p.branch}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px !important' }}>
                        <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                          {p.package}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#64748b' }}>{p.source}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DOCTOR TIMINGS & SCHEDULES */}
      {activeTab === 'doctors' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Doctor Timings & Master Schedules
          </h2>
          <p style={{ fontSize: '12px !important', color: '#64748b', marginBottom: '20px' }}>
            Overview of doctor consultation shifts and branch timings across all clinics.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {doctorsList.map(doc => (
              <div key={doc.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <Clock size={20} color="#3b82f6" />
                  <div>
                    <span style={{ fontSize: '14px !important', fontWeight: 800, color: '#0f172a', display: 'block' }}>{doc.name}</span>
                    <span style={{ fontSize: '11px !important', color: '#64748b' }}>{doc.role} • 📱 {doc.phone}</span>
                  </div>
                </div>
                <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px 12px', marginTop: '10px' }}>
                  <span style={{ fontSize: '11px !important', fontWeight: 700, color: '#3b82f6', display: 'block', marginBottom: '2px' }}>SHIFT TIMINGS</span>
                  <span style={{ fontSize: '12px !important', color: '#0f172a', fontWeight: 600 }}>{doc.timings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT & WORKING HOURS */}
      {activeTab === 'staff' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Staff Management & Working Hours
          </h2>
          <p style={{ fontSize: '12px !important', color: '#64748b', marginBottom: '20px' }}>
            Staff directory, shift rosters, daily working hours, and monthly salaries.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>STAFF NAME</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>ROLE</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>BRANCH</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>SHIFT HOURS</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>DAILY WORKING HOURS</th>
                  <th style={{ padding: '12px 14px', fontSize: '12px !important', fontWeight: 800, color: '#475569' }}>MONTHLY SALARY</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(stf => (
                  <tr key={stf.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontSize: '13px !important', fontWeight: 700, color: '#0f172a' }}>{stf.name}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{stf.role}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#334155' }}>{stf.branch}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#3b82f6', fontWeight: 600 }}>{stf.shift}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px !important', color: '#16a34a', fontWeight: 700 }}>{stf.hours}</td>
                    <td style={{ padding: '12px 14px', fontSize: '13px !important', fontWeight: 800, color: '#0f172a' }}>{stf.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: FINANCE, TOTAL & NUTRITION REVENUE */}
      {activeTab === 'finance' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Revenue & Financial Analytics
          </h2>
          <p style={{ fontSize: '12px !important', color: '#64748b', marginBottom: '20px' }}>
            Breakdown of consultation fees, nutrition revenue, and pending patient balances.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '13px !important', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                💰 Revenue Stream Breakdown
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px !important' }}>
                  <span>Consultations & Remedies:</span>
                  <b style={{ color: '#3b82f6' }}>₹30,60,000</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px !important' }}>
                  <span>Nutrition & Supplements:</span>
                  <b style={{ color: '#16a34a' }}>₹4,85,000</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px !important' }}>
                  <span>Package Subscriptions:</span>
                  <b style={{ color: '#a855f7' }}>₹1,45,000</b>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <span style={{ fontSize: '13px !important', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                ⚠️ Pending Payments Status
              </span>
              <span style={{ fontSize: '20px !important', fontWeight: 800, color: '#ef4444', display: 'block', marginBottom: '6px' }}>
                ₹1,45,000 Pending
              </span>
              <p style={{ fontSize: '12px !important', color: '#64748b' }}>
                Outstanding balances across 12 patient invoices scheduled for follow-up.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: EDIT MEDICINE FORM */}
      {activeTab === 'medicines' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Pill size={22} color="#3b82f6" />
            <h2 style={{ fontSize: '16px !important', fontWeight: 800, color: '#0f172a' }}>
              Edit Medicine & Remedy Inventory Form
            </h2>
          </div>

          {medicineSavedMsg && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px', fontSize: '12.5px !important', fontWeight: 700 }}>
              ✓ Medicine Details Saved Successfully!
            </div>
          )}

          <form onSubmit={handleSaveMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Medicine / Remedy Name *
              </label>
              <input 
                type="text"
                placeholder="e.g. Arnica Montana, Nux Vomica"
                value={remedyName}
                onChange={e => setRemedyName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px !important', outline: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Potency
                </label>
                <select 
                  value={remedyPotency}
                  onChange={e => setRemedyPotency(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px !important', outline: 'none', background: '#ffffff' }}
                >
                  <option value="30C">30C</option>
                  <option value="200C">200C</option>
                  <option value="1M">1M</option>
                  <option value="10M">10M</option>
                  <option value="Q (Mother Tincture)">Q (Mother Tincture)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Category
                </label>
                <select 
                  value={remedyCategory}
                  onChange={e => setRemedyCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px !important', outline: 'none', background: '#ffffff' }}
                >
                  <option value="Acute">Acute</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Spiritual">Spiritual</option>
                  <option value="General Wellness">General Wellness</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                Stock Quantity (Units)
              </label>
              <input 
                type="number"
                value={remedyStock}
                onChange={e => setRemedyStock(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px !important', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '13.5px !important',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                marginTop: '8px'
              }}
            >
              Save Medicine Details
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
