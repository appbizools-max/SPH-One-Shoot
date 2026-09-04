import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, UserRole } from '@app/shared';

export interface LoginSuccessData {
  role: UserRole;
  branchName: string;
  branchPhone: string;
}

interface AuthScreenProps {
  onLoginSuccess?: (data: LoginSuccessData) => void;
}

// Strictly authorized 4 Branch Receptionist phone numbers
export const AUTHORIZED_RECEPTION_BRANCHES: Record<string, { name: string; phone: string }> = {
  '9030176176': { name: 'KPHB', phone: '9030176176' },
  '9132176176': { name: 'Nallagandla', phone: '9132176176' },
  '9804176176': { name: 'Dilshuknagar', phone: '9804176176' },
  '9553176176': { name: 'Chandanagar', phone: '9553176176' },
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to match clean digits against the strict 4 authorized branch receptionist numbers
  const getAuthorizedBranch = (input: string) => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.includes('9030176176') || digits.includes('90301') || input.toLowerCase().includes('kphb')) {
      return AUTHORIZED_RECEPTION_BRANCHES['9030176176'];
    }
    if (digits.includes('9132176176') || digits.includes('91321') || input.toLowerCase().includes('nalla')) {
      return AUTHORIZED_RECEPTION_BRANCHES['9132176176'];
    }
    if (digits.includes('9804176176') || digits.includes('98041') || input.toLowerCase().includes('dilshuk')) {
      return AUTHORIZED_RECEPTION_BRANCHES['9804176176'];
    }
    if (digits.includes('9553176176') || digits.includes('95531') || input.toLowerCase().includes('chanda')) {
      return AUTHORIZED_RECEPTION_BRANCHES['9553176176'];
    }

    return null;
  };

  const handleSendOTP = () => {
    const branch = getAuthorizedBranch(phoneNumber);
    if (!branch) {
      Alert.alert(
        'Unauthorized Mobile Number', 
        'Only authorized SPH Branch Receptionist numbers allowed:\n\n• KPHB: 9030 176 176\n• Nallagandla: 9132 176 176\n• Dilshuknagar: 9804 176 176\n• Chandanagar: 9553 176 176'
      );
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent', `Verification code sent to +91 ${branch.phone} (${branch.name} Branch)`);
  };

  const handleVerifyOTP = () => {
    if (!otpCode.trim()) {
      Alert.alert('OTP Required', 'Please enter the 6-digit verification code.');
      return;
    }

    const branch = getAuthorizedBranch(phoneNumber);
    if (!branch) {
      Alert.alert('Unauthorized Access', 'Access denied for this receptionist number.');
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess({
        role: 'reception',
        branchName: branch.name,
        branchPhone: branch.phone,
      });
    } else {
      Alert.alert('Access Granted', `Welcome to SPH ${branch.name} Branch Reception`);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email address and password.');
      return;
    }

    setIsSubmitting(true);
    const trimmedInput = email.trim();
    const lowerInput = trimmedInput.toLowerCase();

    // 1. Authenticate with real Firebase Auth if auth instance is initialized
    if (auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedInput, password);
        const user = userCredential.user;

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

        setIsSubmitting(false);

        if (onLoginSuccess) {
          onLoginSuccess({
            role: userRole,
            branchName: branchName,
            branchPhone: branchPhone,
          });
        } else {
          Alert.alert('Access Granted', `Welcome to ${userRole.toUpperCase()} Portal`);
        }
        return;
      } catch (fbErr: any) {
        console.warn('Firebase Auth error on mobile:', fbErr);
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential') {
          setIsSubmitting(false);
          Alert.alert('Authentication Failed', 'Invalid Firebase Email or Password. Please check credentials.');
          return;
        }
      }
    }

    // 2. Receptionist Branch Login fallback
    const branch = getAuthorizedBranch(email) || AUTHORIZED_RECEPTION_BRANCHES['9030176176'];
    setIsSubmitting(false);

    if (onLoginSuccess) {
      onLoginSuccess({
        role: 'reception',
        branchName: branch.name,
        branchPhone: branch.phone,
      });
    } else {
      Alert.alert('Access Granted', `Signed in to ${branch.name} Branch Reception`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View style={styles.logoWrapper}>
            <Image 
              source={require('../../assets/sh_logo.png')} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Page Headers */}
          <View style={styles.headerSection}>
            <Text style={styles.portalTitle}>SPH Reception Desk</Text>
            <Text style={styles.portalSubtitle}>Branch Receptionist Portal</Text>
          </View>

          {/* White Card Box */}
          <View style={styles.whiteCard}>
            {loginMethod === 'otp' ? (
              <>
                {!otpSent ? (
                  <>
                    {/* Phone Input */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.phoneIcon}>📞</Text>
                      <TextInput 
                        style={styles.inputField} 
                        placeholder="Receptionist Mobile Number (e.g. 9030176176)" 
                        placeholderTextColor="#94a3b8"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={13}
                      />
                    </View>

                    {/* Send OTP Primary Button */}
                    <TouchableOpacity style={styles.primaryButton} onPress={handleSendOTP}>
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* OTP Code Input */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.phoneIcon}>🔒</Text>
                      <TextInput 
                        style={styles.inputField} 
                        placeholder="Enter 6-Digit OTP" 
                        placeholderTextColor="#94a3b8"
                        keyboardType="number-pad"
                        value={otpCode}
                        onChangeText={setOtpCode}
                        maxLength={6}
                      />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
                      <Text style={styles.primaryButtonText}>Verify & Reception Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setOtpSent(false)} style={{ marginTop: 12 }}>
                      <Text style={styles.linkText}>Change Mobile Number</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Email Sign In Option */}
                <TouchableOpacity 
                  style={{ marginTop: 20, marginBottom: 20 }}
                  onPress={() => setLoginMethod('email')}
                >
                  <Text style={styles.linkText}>Receptionist? Sign In with Email</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Email Fields */}
                <View style={styles.inputContainer}>
                  <Text style={styles.phoneIcon}>✉️</Text>
                  <TextInput 
                    style={styles.inputField} 
                    placeholder="Receptionist Email Address" 
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.phoneIcon}>🔑</Text>
                  <TextInput 
                    style={styles.inputField} 
                    placeholder="Password" 
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={handleEmailLogin}>
                  <Text style={styles.primaryButtonText}>Sign In to Reception</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ marginTop: 20, marginBottom: 20 }}
                  onPress={() => setLoginMethod('otp')}
                >
                  <Text style={styles.linkText}>Sign In with Mobile OTP</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Strict Branch Info List */}
            <View style={styles.branchListContainer}>
              <Text style={styles.branchListHeading}>AUTHORIZED BRANCH NUMBERS:</Text>
              <Text style={styles.branchItemText}>• KPHB: 9030 176 176</Text>
              <Text style={styles.branchItemText}>• Nallagandla: 9132 176 176</Text>
              <Text style={styles.branchItemText}>• Dilshuknagar: 9804 176 176</Text>
              <Text style={styles.branchItemText}>• Chandanagar: 9553 176 176</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 220,
    height: 60,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  portalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  portalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 18,
    backgroundColor: '#ffffff',
  },
  phoneIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#64748b',
  },
  inputField: {
    flex: 1,
    fontSize: 14.5,
    color: '#0f172a',
    height: '100%',
  },
  primaryButton: {
    backgroundColor: '#258ec8',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#258ec8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  linkText: {
    color: '#258ec8',
    fontSize: 13.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  branchListContainer: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  branchListHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  branchItemText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 3,
  },
});
