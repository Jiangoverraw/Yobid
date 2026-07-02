import React from 'react';
import { User, Mail, Lock, Camera, Eye, EyeOff } from 'lucide-react';

const COLOR_OPTIONS = [
  '#4b5563', '#6366f1', '#3b82f6', '#ec4899', '#a855f7', '#f97316', '#10b981', '#ef4444',
  'linear-gradient(135deg, #7c3aed, #a855f7)',
  'linear-gradient(135deg, #ef4444, #f97316)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #059669)',
];

const isImageUrl = (val) =>
  val && (val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'));

export default function ProfileSettings({
  userDisplayName, avatarLetter, avatarVal, setAvatarVal,
  fullName, setFullName, email, setEmail,
  newPassword, setNewPassword, showPassword, setShowPassword,
  twoFAEnabled, setTwoFAEnabled, fileInputRef, onUploadClick,
}) {
  return (
    <div className="set-content-inner">
      <h1 className="set-content-title">My Settings</h1>

      <section className="set-section">
        <div className="set-section-left">
          <h3 className="set-section-heading">Profile</h3>
          <p className="set-section-desc">Your personal information and account security settings.</p>
        </div>

        <div className="set-section-right">
          {/* Avatar */}
          <div className="set-avatar-group">
            <label className="set-field-label">Avatar</label>
            <div className="set-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
              <div
                className="set-avatar-circle"
                onClick={onUploadClick}
                style={{
                  background: isImageUrl(avatarVal) ? `url(${avatarVal}) center/cover no-repeat` : (avatarVal || undefined),
                  color: isImageUrl(avatarVal) ? 'transparent' : '#fff',
                }}
              >
                {!isImageUrl(avatarVal) && avatarLetter}
                <div className="set-avatar-overlay"><Camera size={16} /></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div className="set-avatar-name" style={{ fontWeight: 600, fontSize: '1rem', color: '#111827' }}>{userDisplayName}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={onUploadClick}
                    style={{ padding: '0.35rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', color: '#374151', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                    Upload Photo
                  </button>
                  {avatarVal && (
                    <button type="button" onClick={() => setAvatarVal('')}
                      style={{ padding: '0.35rem 0.75rem', border: '1px solid #fca5a5', borderRadius: '6px', background: '#fff', color: '#ef4444', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden file input */}
            <input type="file" id="avatar-file-input" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} />

            {/* Color palette */}
            <div style={{ marginTop: '0.25rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Or choose an avatar color:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {COLOR_OPTIONS.map(color => (
                  <button key={color} type="button" onClick={() => setAvatarVal(color)}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, border: avatarVal === color ? '2px solid #111827' : '1px solid #e2e8f0', boxShadow: avatarVal === color ? '0 0 0 2px #cbd5e1' : 'none', cursor: 'pointer', padding: 0 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="set-field">
            <label className="set-field-label">Full Name</label>
            <div className="set-input-wrap">
              <User size={14} className="set-input-icon" />
              <input className="set-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" />
            </div>
          </div>

          {/* Email */}
          <div className="set-field">
            <label className="set-field-label">Email</label>
            <div className="set-input-wrap">
              <Mail size={14} className="set-input-icon" />
              <input className="set-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" />
            </div>
          </div>

          {/* Password */}
          <div className="set-field">
            <label className="set-field-label">Password</label>
            <div className="set-input-wrap">
              <Lock size={14} className="set-input-icon" />
              <input className="set-input set-input--password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
              <button type="button" className="set-eye-btn" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="set-divider" />

      {/* 2FA */}
      <section className="set-section">
        <div className="set-section-left">
          <h3 className="set-section-heading">Two-factor authentication (2FA)</h3>
          <p className="set-section-desc">Keep your account secure by enabling 2FA via SMS or using a temporary one-time passcode (TOTP) from an authenticator app.</p>
        </div>
        <div className="set-section-right">
          <div className="set-toggle-row">
            <button className={`set-toggle ${twoFAEnabled ? 'set-toggle--on' : ''}`} onClick={() => setTwoFAEnabled(!twoFAEnabled)} id="btn-toggle-2fa" aria-label="Toggle 2FA" type="button">
              <span className="set-toggle-knob" />
            </button>
            <div className="set-toggle-info">
              <span className="set-toggle-label">Text Message (SMS)</span>
              <span className="set-toggle-desc">Receive a one-time passcode via SMS each time you log in.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
