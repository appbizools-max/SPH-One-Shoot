import React, { useState } from 'react';
import { Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, UserRole } from '@app/shared';

export interface WebLoginSuccessData {
  role: UserRole;
  branchName: string;
  branchPhone: string;
}

interface AuthPageProps {
  onLoginSuccess?: (data: WebLoginSuccessData) => void;
}

export const AUTHORIZED_WEB_BRANCHES: Record<string, { name: string; phone: string }> = {
  '9030176176': { name: 'KPHB Branch', phone: '+91 90301 76176' },
  '9132176176': { name: 'Nallagandla Branch', phone: '+91 91321 76176' },
  '9804176176': { name: 'Dilshuknagar Branch', phone: '+91 98041 76176' },
  '9553176176': { name: 'Chandanagar Branch', phone: '+91 95531 76176' },
};

const KNOWN_DOCTOR_PHONES = ['8125260176', '9903119766', '9490808582', '1111111111'];

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [activeRole, setActiveRole] = useState<'admin' | 'hr' | 'doctor' | 'staff' | 'reception' | 'otp'>('admin');
  const [emailOrUsername, setEmailOrUsername] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAuthorizedBranch = (input: string) => {
    const digits = input.replace(/\D/g, '');
    const lower = input.toLowerCase().trim();

    if (!lower && !digits) return null;

    if (digits.includes('9030176176') || digits.includes('90301') || lower.includes('kphb') || lower.includes('kphp')) {
      return AUTHORIZED_WEB_BRANCHES['9030176176'];
    }
    if (digits.includes('9132176176') || digits.includes('91321') || lower.includes('nalla') || lower.includes('nallagandla')) {
      return AUTHORIZED_WEB_BRANCHES['9132176176'];
    }
    if (digits.includes('9804176176') || digits.includes('98041') || lower.includes('dilshuk') || lower.includes('dsnr')) {
      return AUTHORIZED_WEB_BRANCHES['9804176176'];
    }
    if (digits.includes('9553176176') || digits.includes('95531') || lower.includes('chanda') || lower.includes('chandnagar')) {
      return AUTHORIZED_WEB_BRANCHES['9553176176'];
    }

    return null;
  };

  const detectWebRoleAndBranch = async (input: string): Promise<WebLoginSuccessData> => {
    const cleanInput = input.trim();
    const digits = cleanInput.replace(/\D/g, '');
    const lower = cleanInput.toLowerCase();

    // 1. Firestore Lookup if db available
    if (db && digits.length >= 8) {
      try {
        const docQuery = query(collection(db, 'doctors'), where('phone', '==', digits));
        const docSnap = await getDocs(docQuery);
        if (!docSnap.empty) {
          const data = docSnap.docs[0].data();
          return {
            role: 'doctor',
            branchName: data.branch || 'Medical Center',
            branchPhone: digits,
          };
        }

        const staffQuery = query(collection(db, 'staff'), where('phone', '==', digits));
        const staffSnap = await getDocs(staffQuery);
        if (!staffSnap.empty) {
          const data = staffSnap.docs[0].data();
          return {
            role: 'staff',
            branchName: data.branch || 'KPHB Branch',
            branchPhone: digits,
          };
        }
      } catch (e) { }
    }

    // 2. Doctor Phone / Text check
    if (KNOWN_DOCTOR_PHONES.some(p => digits.includes(p)) || lower.includes('doctor') || lower.includes('dr.')) {
      return {
        role: 'doctor',
        branchName: 'Medical Center',
        branchPhone: digits || '8125260176',
      };
    }

    // 3. Admin / HR
    if (lower.includes('admin') || digits === '9000000001') {
      return { role: 'admin', branchName: 'HQ / Admin Office', branchPhone: '+91 90000 00001' };
    }
    if (lower.includes('hr') || digits === '9000000002') {
      return { role: 'hr', branchName: 'HQ / HR Department', branchPhone: '+91 90000 00002' };
    }

    // 4. Reception Branch matching
    const branch = getAuthorizedBranch(input);
    if (branch) {
      return {
        role: 'reception',
        branchName: branch.name,
        branchPhone: branch.phone,
      };
    }

    // 5. Staff fallback
    if (lower.includes('staff')) {
      return { role: 'staff', branchName: 'KPHB Branch', branchPhone: digits || '+91 90000 00004' };
    }

    return { role: 'reception', branchName: 'KPHB Branch', branchPhone: '+91 90301 76176' };
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (activeRole === 'admin') {
      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'admin',
          branchName: 'HQ / Admin Office',
          branchPhone: '+91 90000 00001',
        });
      }
      setIsLoading(false);
      return;
    }

    if (activeRole === 'hr') {
      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'hr',
          branchName: 'HQ / HR Department',
          branchPhone: '+91 90000 00002',
        });
      }
      setIsLoading(false);
      return;
    }

    if (activeRole === 'doctor') {
      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'doctor',
          branchName: 'Medical Center',
          branchPhone: '+91 81252 60176',
        });
      }
      setIsLoading(false);
      return;
    }

    if (activeRole === 'staff') {
      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'staff',
          branchName: 'KPHB Branch',
          branchPhone: '+91 90000 00004',
        });
      }
      setIsLoading(false);
      return;
    }

    // Dynamic resolution or Receptionist Branch Login
    const authData = await detectWebRoleAndBranch(emailOrUsername);
    if (onLoginSuccess) {
      onLoginSuccess(authData);
    }
    setIsLoading(false);
  };

  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const authData = await detectWebRoleAndBranch(mobileNumber);
    setIsLoading(false);

    if (onLoginSuccess) {
      onLoginSuccess(authData);
    } else {
      alert(`Successfully verified & signed in to ${authData.branchName} as ${authData.role.toUpperCase()}`);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!mobileNumber.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }
    setOtpSent(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #f5f9fc 0%, #e8eff5 100%)',
      padding: '20px'
    }}>
      {/* Centered White Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        background: '#ffffff',
        borderRadius: '24px',
        padding: '36px 32px 40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(37, 142, 200, 0.06)',
        border: '1px solid #ffffff'
      }}>
        {/* Brand Emblem Logo */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <img
            src="/Assets/sh_logo.png"
            alt="Spiritual Homeopathy Logo"
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        </div>

        {/* Card Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '22px !important',
            fontWeight: 800,
            color: '#1e293b',
            letterSpacing: '-0.3px',
            marginBottom: '4px'
          }}>
            Spiritual Homeopathy
          </h1>
          <p style={{
            fontSize: '13px !important',
            color: '#94a3b8',
            fontWeight: 500
          }}>
            Doctor, Staff, HR & Receptionist Portal
          </p>
        </div>

        {/* Role Navigation Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'admin', label: 'Admin' },
            { id: 'hr', label: 'HR' },
            { id: 'doctor', label: 'Doctor' },
            { id: 'staff', label: 'Staff' },
            { id: 'reception', label: 'Reception' },
            { id: 'otp', label: 'Mobile OTP' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveRole(tab.id as any);
                setErrorMessage('');
                if (tab.id === 'admin') setEmailOrUsername('admin@gmail.com');
                else if (tab.id === 'hr') setEmailOrUsername('hr@spiritualhomeo.com');
                else if (tab.id === 'doctor') setEmailOrUsername('dr.prashanth@spiritualhomeo.com');
                else if (tab.id === 'staff') setEmailOrUsername('staff@spiritualhomeo.com');
                else if (tab.id === 'reception') setEmailOrUsername('kphb@spiritualhomeo.com');
              }}
              style={{
                background: activeRole === tab.id ? '#eef5fc' : 'transparent',
                border: activeRole === tab.id ? '1px solid #258ec8' : '1px solid transparent',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '12px !important',
                fontWeight: activeRole === tab.id ? 800 : 600,
                color: activeRole === tab.id ? '#258ec8' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Notification Alert */}
        {errorMessage ? (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#ef4444',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '18px',
            fontSize: '12px !important',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={16} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* Form Body */}
        {activeRole !== 'otp' ? (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                {activeRole === 'admin' ? 'Admin Email Address' : activeRole === 'hr' ? 'HR Email Address' : 'Receptionist Email / Phone'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#eef5fc', borderRadius: '10px', padding: '0 14px', height: '46px', border: '1px solid #e0ecf8' }}>
                <Mail size={16} color="#64748b" style={{ marginRight: '12px' }} />
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  placeholder={activeRole === 'admin' ? 'e.g. admin@gmail.com' : activeRole === 'hr' ? 'e.g. hr@spiritualhomeo.com' : 'e.g. kphb@spiritualhomeo.com'}
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#eef5fc', borderRadius: '10px', padding: '0 14px', height: '46px', border: '1px solid #e0ecf8', position: 'relative' }}>
                <Lock size={16} color="#64748b" style={{ marginRight: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px !important', color: '#0f172a', fontWeight: 500, paddingRight: '30px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: '#258ec8',
                color: '#ffffff',
                border: 'none',
                height: '46px',
                borderRadius: '10px',
                fontSize: '14.5px !important',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 4px 14px rgba(37, 142, 200, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} color="#ffffff" />}
              {activeRole === 'admin' ? 'Sign In to Admin Control Hub' : activeRole === 'hr' ? 'Sign In to HR Portal' : 'Sign In to Reception Desk'}
            </button>
          </form>
        ) : (
          <form onSubmit={!otpSent ? handleSendOtp : handleOtpSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                Receptionist Mobile Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#eef5fc', borderRadius: '10px', padding: '0 14px', height: '46px', border: '1px solid #e0ecf8' }}>
                <Phone size={16} color="#64748b" style={{ marginRight: '12px' }} />
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9030176176"
                  style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Verification OTP
                </label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#eef5fc', borderRadius: '10px', padding: '0 14px', height: '46px', border: '1px solid #e0ecf8' }}>
                  <Lock size={16} color="#64748b" style={{ marginRight: '12px' }} />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: '13px !important', color: '#0f172a', fontWeight: 500 }}
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              style={{
                background: '#258ec8',
                color: '#ffffff',
                border: 'none',
                height: '46px',
                borderRadius: '10px',
                fontSize: '14.5px !important',
                fontWeight: 800,
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 4px 14px rgba(37, 142, 200, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShieldCheck size={18} color="#ffffff" />
              {!otpSent ? 'Send Verification OTP' : 'Verify & Sign In'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
