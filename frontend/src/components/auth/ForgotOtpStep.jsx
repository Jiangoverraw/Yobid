import React from 'react';
import { Key, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Alert from '../Alert';

export default function ForgotOtpStep({
  email, code, setCode, loading, alert,
  focusedField, setFocusedField, StepDots,
  onSubmit, onBack, onResend
}) {
  return (
    <>
      <div className="cu-form-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}
          >
            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to email input
          </button>
        </div>
        <StepDots />

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

      <form onSubmit={onSubmit} className="cu-form" id="form-forgot-password-step2">
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
            onClick={onResend}
            disabled={loading}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontWeight: 600, fontSize: '0.82rem', padding: 0 }}
          >
            Resend code
          </button>
        </p>
      </form>
    </>
  );
}
