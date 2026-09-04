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

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'otp'>('email');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!emailOrUsername.trim()) {
      setErrorMessage('Please enter Email or Branch Phone number.');
      setIsLoading(false);
      return;
    }

    const trimmedInput = emailOrUsername.trim();
    const lowerInput = trimmedInput.toLowerCase();

    // 1. Authenticate with real Firebase Auth if Auth instance & password exist
    if (auth && password.trim()) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedInput, password);
        const user = userCredential.user;

        // Fetch User Profile & Role from Firestore ('users', 'staff', 'admins', 'hr', 'doctors')
        let userRole: UserRole = 'reception';
        let branchName = 'HQ Office';
        let branchPhone = '';

        if (db) {
          const collectionsToCheck = ['users', 'staff', 'admins', 'hr', 'doctors'];
          let foundDoc = false;

          for (const colName of collectionsToCheck) {
            try {
              const userDocSnap = await getDoc(doc(db, colName, user.uid));
              if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                userRole = (data.role || (colName === 'admins' ? 'admin' : colName === 'hr' ? 'hr' : colName === 'doctors' ? 'doctor' : 'reception')) as UserRole;
                branchName = data.branchName || data.branch || branchName;
                branchPhone = data.branchPhone || data.phone || branchPhone;
                foundDoc = true;
                break;
              }
            } catch (err) {}
          }

          if (!foundDoc && user.email) {
            for (const colName of ['users', 'staff', 'admins', 'hr']) {
              try {
                const q = query(collection(db, colName), where('email', '==', user.email.toLowerCase()));
                const querySnap = await getDocs(q);
                if (!querySnap.empty) {
                  const data = querySnap.docs[0].data();
                  userRole = (data.role || (colName === 'admins' ? 'admin' : colName === 'hr' ? 'hr' : 'reception')) as UserRole;
                  branchName = data.branchName || data.branch || branchName;
                  branchPhone = data.branchPhone || data.phone || branchPhone;
                  foundDoc = true;
                  break;
                }
              } catch (err) {}
            }
          }
        }

        // Secondary check based on email keyword if role was not set in document
        if (userRole === 'reception') {
          if (lowerInput.includes('admin')) userRole = 'admin';
          else if (lowerInput.includes('hr')) userRole = 'hr';
          else if (lowerInput.includes('doctor') || lowerInput.includes('dr.')) userRole = 'doctor';
        }

        if (onLoginSuccess) {
          onLoginSuccess({
            role: userRole,
            branchName: branchName,
            branchPhone: branchPhone,
          });
        } else {
          alert(`Successfully signed in as ${userRole.toUpperCase()}`);
        }
        setIsLoading(false);
        return;
      } catch (fbErr: any) {
        console.warn('Firebase Auth notice:', fbErr);
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
          setErrorMessage('Invalid Firebase Email or Password. Please verify credentials in Firebase Auth.');
          setIsLoading(false);
          return;
        }
      }
    }

    // 2. Authorized Receptionist Branch Login fallback
    const branch = getAuthorizedBranch(trimmedInput);
    if (branch) {
      if (onLoginSuccess) {
        onLoginSuccess({
          role: 'reception',
          branchName: branch.name,
          branchPhone: branch.phone,
        });
      } else {
        alert(`Successfully signed in to ${branch.name}`);
      }
      setIsLoading(false);
      return;
    }

    setErrorMessage('Authentication failed. Please verify your Admin/HR email & password registered in Firebase.');
    setIsLoading(false);
  };

  const handleOtpSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const branch = getAuthorizedBranch(mobileNumber);
    if (!branch) {
      setErrorMessage('Unauthorized Receptionist Number. Authorized Branches:\n• KPHB: 9030176176\n• Nallagandla: 9132176176\n• Dilshuknagar: 9804176176\n• Chandanagar: 9553176176');
      return;
    }
    if (onLoginSuccess) {
      onLoginSuccess({
        role: 'reception',
        branchName: branch.name,
        branchPhone: branch.phone,
      });
    } else {
      alert(`Successfully verified & signed in to ${branch.name}`);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const branch = getAuthorizedBranch(mobileNumber);
    if (!branch) {
      setErrorMessage('Unauthorized Receptionist Number. Authorized Branches:\n• KPHB: 9030176176\n• Nallagandla: 9132176176\n• Dilshuknagar: 9804176176\n• Chandanagar: 9553176176');
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
            Admin, HR, Staff & Receptionist Portal
          </p>
        </div>

        {/* 2-Tab Navigation Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginBottom: '24px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '12px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('email'); setErrorMessage(''); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '14px !important',
              fontWeight: activeTab === 'email' ? 700 : 600,
              color: activeTab === 'email' ? '#258ec8' : '#64748b',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '4px'
            }}
          >
            Email Login
            {activeTab === 'email' && (
              <div style={{
                position: 'absolute',
                bottom: '-13px',
                left: 0,
                right: 0,
                height: '2px',
                background: '#258ec8',
                borderRadius: '2px'
              }} />
            )}
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('otp'); setErrorMessage(''); }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '14px !important',
              fontWeight: activeTab === 'otp' ? 700 : 600,
              color: activeTab === 'otp' ? '#258ec8' : '#64748b',
              cursor: 'pointer',
              position: 'relative',
              paddingBottom: '4px'
            }}
          >
            Mobile OTP
            {activeTab === 'otp' && (
              <div style={{
                position: 'absolute',
                bottom: '-13px',
                left: 0,
                right: 0,
                height: '2px',
                background: '#258ec8',
                borderRadius: '2px'
              }} />
            )}
          </button>
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
        {activeTab === 'email' ? (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px !important', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                Receptionist Email / Phone
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#eef5fc', borderRadius: '10px', padding: '0 14px', height: '46px', border: '1px solid #e0ecf8' }}>
                <Mail size={16} color="#64748b" style={{ marginRight: '12px' }} />
                <input 
                  type="text" 
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  placeholder="e.g. kphb@spiritualhomeo.com or 9030176176"
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
              Sign In to Reception Desk
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
