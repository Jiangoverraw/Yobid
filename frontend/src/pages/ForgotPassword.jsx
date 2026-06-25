import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, Key, ArrowLeft, ShieldCheck
} from 'lucide-react';
import Alert from '../components/Alert';
import { authApi } from '../services/api';

/**
 * Forgot Password – 4-step wizard
 *  Step 1  → Enter email, request OTP
 *  Step 2  → Enter 6-digit OTP code  (verify-reset-code)
 *  Step 3  → Enter new password & confirm  (reset-password)
 *  Step 4  → Success screen
 */
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

  const navigate = useNavigate();

  const clearAlert = () => setAlert({ message: '', type: 'error' });

  // ── Step 1: Request OTP ────────────────────────────────────────────────────
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

  // ── Step 2: Verify OTP code ────────────────────────────────────────────────
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

  // ── Step 3: Reset password ─────────────────────────────────────────────────
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

  // ── Shared step indicator ──────────────────────────────────────────────────
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

  return (
    <div className="cu-page">
      {/* Left decorative panel */}
      <div className="cu-left-panel">
        <div className="cu-left-inner">
          {/* Logo */}
          <div className="cu-brand-logo">
            <div className="cu-brand-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M4 20L10 14L14 18L20 10L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2" opacity="0.3"/>
              </svg>
            </div>
            <span className="cu-brand-name">Yobid</span>
          </div>

          {/* Hero content */}
          <div className="cu-hero">
            <div className="cu-hero-badge">🔒 Account Security</div>
            <h1 className="cu-hero-title">
              Recover your
              <span className="cu-hero-highlight"> workspace account</span>
            </h1>
            <p className="cu-hero-desc">
              Don't worry, it happens. Follow the simple steps to reset your password and gain back access to your tasks and workspaces.
            </p>

            <div className="cu-feature-list">
              {[
                'Secure 6-digit verification code',
                'Encrypted password reset mechanism',
                'Instant access recovery',
              ].map((feature, i) => (
                <div className="cu-feature-item" key={i}>
                  <CheckCircle2 size={16} className="cu-check-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mockups */}
          <div className="cu-mockup-cards">
            <div className="cu-mock-card cu-mock-card--top">
              <div className="cu-mock-avatar" style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)' }}>🔑</div>
              <div className="cu-mock-info">
                <div className="cu-mock-title">Password Reset Requested</div>
                <div className="cu-mock-sub">Verification code sent</div>
              </div>
              <div className="cu-mock-badge cu-mock-badge--done" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>Sent</div>
            </div>
          </div>

          {/* Footer */}
          <div className="cu-left-footer">
            © 2026 Yobid. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right: Wizard */}
      <div className="cu-right-panel">
        <div className="cu-form-card">
          {/* Mobile logo */}
          <div className="cu-mobile-logo">
            <div className="cu-brand-icon cu-brand-icon--sm">
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M4 20L10 14L14 18L20 10L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="cu-brand-name">Yobid</span>
          </div>

          {/* ── STEP 1: Enter Email ──────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="cu-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', color: '#6366f1', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to login
                  </Link>
                </div>
                <h2 className="cu-form-title">Forgot Password? 🔑</h2>
                <p className="cu-form-subtitle">Enter your email and we'll send you an OTP code to reset your password</p>
              </div>

              <Alert message={alert.message} type={alert.type} />

              <form onSubmit={handleRequestOtp} className="cu-form" id="form-forgot-password-step1">
                <div className={`cu-field ${focusedField === 'email' ? 'cu-field--focused' : ''} ${email ? 'cu-field--filled' : ''}`}>
                  <label className="cu-label" htmlFor="forgot-email">Email Address</label>
                  <div className="cu-input-wrap">
                    <Mail size={16} className="cu-input-icon" />
                    <input
                      id="forgot-email"
                      type="email"
                      className="cu-input"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="cu-submit-btn"
                  id="btn-send-reset-code"
                  disabled={loading || !email}
                >
                  {loading ? <Loader2 className="cu-spinner" size={18} /> : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: Enter OTP Code ───────────────────────────────────── */}
          {step === 2 && (
            <>
              <div className="cu-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep(1); clearAlert(); }}
                    style={{ display: 'flex', alignItems: 'center', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}
                  >
                    <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to email input
                  </button>
                </div>
                <StepDots />

                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                  }}>
                    <ShieldCheck size={28} color="white" />
                  </div>
                </div>

                <h2 className="cu-form-title">Check your inbox 📬</h2>
                <p className="cu-form-subtitle">
                  We sent a 6-digit code to <strong>{email}</strong>. Enter it below to continue.
                </p>
              </div>

              <Alert message={alert.message} type={alert.type} />

              <form onSubmit={handleVerifyCode} className="cu-form" id="form-forgot-password-step2">
                <div className={`cu-field ${focusedField === 'code' ? 'cu-field--focused' : ''} ${code ? 'cu-field--filled' : ''}`}>
                  <label className="cu-label" htmlFor="reset-code">Verification Code</label>
                  <div className="cu-input-wrap">
                    <Key size={16} className="cu-input-icon" />
                    <input
                      id="reset-code"
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      className="cu-input"
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      onFocus={() => setFocusedField('code')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                      autoComplete="one-time-code"
                      style={{ letterSpacing: '0.3em', fontSize: '1.1rem', textAlign: 'center' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="cu-submit-btn"
                  id="btn-verify-code"
                  disabled={loading || code.length < 6}
                >
                  {loading ? <Loader2 className="cu-spinner" size={18} /> : 'Verify Code'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8', marginTop: '1rem' }}>
                  Didn't receive it?{' '}
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontWeight: 600, fontSize: '0.82rem', padding: 0 }}
                  >
                    Resend code
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── STEP 3: Set New Password ──────────────────────────────────── */}
          {step === 3 && (
            <>
              <div className="cu-form-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep(2); clearAlert(); }}
                    style={{ display: 'flex', alignItems: 'center', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}
                  >
                    <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to code input
                  </button>
                </div>
                <StepDots />

                {/* Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                  }}>
                    <Lock size={28} color="white" />
                  </div>
                </div>

                <h2 className="cu-form-title">Set new password 🔒</h2>
                <p className="cu-form-subtitle">Code verified! Now choose a strong new password for your account.</p>
              </div>

              <Alert message={alert.message} type={alert.type} />

              <form onSubmit={handleResetPassword} className="cu-form" id="form-forgot-password-step3">
                {/* New Password */}
                <div className={`cu-field ${focusedField === 'newPassword' ? 'cu-field--focused' : ''} ${newPassword ? 'cu-field--filled' : ''}`}>
                  <label className="cu-label" htmlFor="reset-new-password">New Password</label>
                  <div className="cu-input-wrap">
                    <Lock size={16} className="cu-input-icon" />
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      className="cu-input cu-input--password"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setFocusedField('newPassword')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="cu-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className={`cu-field ${focusedField === 'confirmPassword' ? 'cu-field--focused' : ''} ${confirmPassword ? 'cu-field--filled' : ''}`}>
                  <label className="cu-label" htmlFor="reset-confirm-password">Confirm Password</label>
                  <div className="cu-input-wrap">
                    <Lock size={16} className="cu-input-icon" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      className="cu-input"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className="cu-eye-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="cu-submit-btn"
                  id="btn-perform-reset"
                  disabled={loading || !newPassword || !confirmPassword}
                >
                  {loading ? <Loader2 className="cu-spinner" size={18} /> : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Success ───────────────────────────────────────────── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }} id="success-forgot-password">
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', marginBottom: '1.5rem',
                boxShadow: '0 12px 32px rgba(16,185,129,0.4)',
                animation: 'pulse 2s infinite',
              }}>
                <CheckCircle2 size={40} />
              </div>
              <h2 className="cu-form-title" style={{ marginBottom: '0.75rem' }}>Password Reset Successful! 🎉</h2>
              <p className="cu-form-subtitle" style={{ marginBottom: '2rem' }}>
                Your password has been successfully reset. You can now use your new password to sign in to your workspace.
              </p>
              <Link
                to="/login"
                className="cu-submit-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', padding: '10px' }}
                id="btn-success-back-login"
              >
                Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
