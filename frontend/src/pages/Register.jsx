import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLeftPanel from '../components/auth/AuthLeftPanel';
import RegisterForm from '../components/auth/RegisterForm';
import EmailVerifyForm from '../components/auth/EmailVerifyForm';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export default function Register() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'error' });
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const clearAlert = () => setAlert({ message: '', type: 'error' });

  const handleRegister = async (e) => {
    e.preventDefault();
    clearAlert();

    if (!email || !password || !confirmPassword) {
      setAlert({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }
    if (password.length < 6) {
      setAlert({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (!specialCharRegex.test(password)) {
      setAlert({ message: 'Password must contain at least one special character', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await authApi.register(email, password, name);
      setAlert({
        message: 'Account created! Check your email for the verification code.',
        type: 'success',
      });
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

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setAlert({ message: 'Please enter the 6-digit code', type: 'error' });
      return;
    }
    setLoading(true);
    clearAlert();
    try {
      const data = await authApi.verifyRegistration(email, code);
      localStorage.setItem('access_token', data.access_token);
      if (setUser) setUser(data.user);
      navigate('/workspaces', { replace: true });
    } catch (err) {
      setAlert({ message: err.message || 'Invalid or expired code', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    clearAlert();
    try {
      await authApi.resendRegistrationCode(email);
      setAlert({ message: 'New verification code sent!', type: 'success' });
    } catch (err) {
      setAlert({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const panelFeatures = [
    'Free forever — no credit card required',
    'Secure bcrypt password hashing',
    'Google & GitHub OAuth integration',
  ];

  const panelCards = [
    {
      avatarBg: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      avatarLetter: 'T',
      title: 'New Project Created',
      sub: 'Welcome aboard · Just now',
      badgeType: 'done',
      badge: 'New',
    },
    {
      avatarBg: 'linear-gradient(135deg, #059669, #10B981)',
      avatarLetter: 'S',
      title: 'Team collaboration',
      sub: 'Invite members · Setup workspace',
      badgeType: 'progress',
      badge: 'Active',
    },
  ];

  return (
    <div className="cu-page">
      <AuthLeftPanel
        badge="🚀 Join thousands of productive teams"
        title="Start your journey"
        highlight=" for free"
        desc="Create your account and unlock powerful project management tools built for modern teams."
        features={panelFeatures}
        cards={panelCards}
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

          {step === 1 ? (
            <RegisterForm
              name={name} setName={setName}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
              showPassword={showPassword} setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
              loading={loading} alert={alert}
              focusedField={focusedField} setFocusedField={setFocusedField}
              onSubmit={handleRegister}
            />
          ) : (
            <EmailVerifyForm
              email={email}
              code={code} setCode={setCode}
              loading={loading} alert={alert}
              focusedField={focusedField} setFocusedField={setFocusedField}
              onSubmit={handleVerify}
              onBack={() => { setStep(1); clearAlert(); }}
              onResend={handleResend}
            />
          )}
        </div>
      </div>
    </div>
  );
}
