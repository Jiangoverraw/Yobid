import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function ForgotSuccessStep() {
  return (
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
  );
}
