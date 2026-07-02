import { useState } from 'react';
import AuthLeftPanel from '../components/auth/AuthLeftPanel';
import ForgotEmailStep from '../components/auth/ForgotEmailStep';
import ForgotOtpStep from '../components/auth/ForgotOtpStep';
import ForgotNewPassStep from '../components/auth/ForgotNewPassStep';
import ForgotSuccessStep from '../components/auth/ForgotSuccessStep';
import { authApi } from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'error' });
  const [focusedField, setFocusedField] = useState(null);

  const clearAlert = () => setAlert({ message: '', type: 'error' });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    clearAlert();
    try {
      await authApi.forgotPassword(email);
      setAlert({ message: 'Verification code sent! Please check your email.', type: 'success' });
      setTimeout(() => {
        setStep(2);
        clearAlert();
      }, 1200);
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setAlert({ message: 'Please enter the 6-digit code.', type: 'error' });
      return;
    }
    setLoading(true);
    clearAlert();
    try {
      await authApi.verifyResetCode(email, code);
      setStep(3);
      clearAlert();
    } catch (err) {
      setAlert({ message: err.message || 'Invalid or expired code.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      setAlert({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    setLoading(true);
    clearAlert();
    try {
      await authApi.resetPassword(email, code, newPassword);
      setStep(4);
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const StepDots = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            width: s === step ? '24px' : '8px',
            height: '8px',
            borderRadius: '4px',
            background: s <= step ? '#6366f1' : 'rgba(99,102,241,0.2)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );

  const features = [
    'Secure 6-digit verification code',
    'Encrypted password reset mechanism',
    'Instant access recovery',
  ];

  const cards = [
    {
      avatarBg: 'linear-gradient(135deg, #EF4444, #F97316)',
      avatarLetter: '🔑',
      title: 'Password Reset Requested',
      sub: 'Verification code sent',
      badgeType: 'done',
      badge: 'Sent',
    }
  ];

  return (
    <div className="cu-page">
      <AuthLeftPanel
        badge="🔒 Account Security"
        title="Recover your"
        highlight=" workspace account"
        desc="Don't worry, it happens. Follow the simple steps to reset your password and gain back access to your tasks and workspaces."
        features={features}
        cards={cards}
      />

      <div className="cu-right-panel">
        <div className="cu-form-card">
          <div className="cu-mobile-logo">
            <div className="cu-brand-icon cu-brand-icon--sm">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M4 20L10 14L14 18L20 10L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="cu-brand-name">Yobid</span>
          </div>

          {step === 1 && (
            <ForgotEmailStep
              email={email} setEmail={setEmail}
              loading={loading} alert={alert}
              focusedField={focusedField} setFocusedField={setFocusedField}
              onSubmit={handleRequestOtp}
            />
          )}

          {step === 2 && (
            <ForgotOtpStep
              email={email} code={code} setCode={setCode}
              loading={loading} alert={alert}
              focusedField={focusedField} setFocusedField={setFocusedField}
              StepDots={StepDots}
              onSubmit={handleVerifyCode}
              onBack={() => { setStep(1); clearAlert(); }}
              onResend={handleRequestOtp}
            />
          )}

          {step === 3 && (
            <ForgotNewPassStep
              newPassword={newPassword} setNewPassword={setNewPassword}
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
              showPassword={showPassword} setShowPassword={setShowPassword}
              showConfirm={showConfirm} setShowConfirm={setShowConfirm}
              loading={loading} alert={alert}
              focusedField={focusedField} setFocusedField={setFocusedField}
              StepDots={StepDots}
              onSubmit={handleResetPassword}
              onBack={() => { setStep(2); clearAlert(); }}
            />
          )}

          {step === 4 && <ForgotSuccessStep />}
        </div>
      </div>
    </div>
  );
}
