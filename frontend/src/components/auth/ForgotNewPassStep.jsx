import React from 'react';
import { Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import Alert from '../Alert';

export default function ForgotNewPassStep({
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  showPassword, setShowPassword,
  showConfirm, setShowConfirm,
  loading, alert,
  focusedField, setFocusedField, StepDots,
  onSubmit, onBack
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
            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to code input
          </button>
        </div>
        <StepDots />

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

      <form onSubmit={onSubmit} className="cu-form" id="form-forgot-password-step3">
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
  );
}
