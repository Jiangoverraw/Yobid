import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import Alert from '../Alert';

export default function ForgotEmailStep({
  email, setEmail, loading, alert,
  focusedField, setFocusedField, onSubmit
}) {
  return (
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

      <form onSubmit={onSubmit} className="cu-form" id="form-forgot-password-step1">
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
  );
}
