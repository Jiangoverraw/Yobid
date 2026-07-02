import React from 'react';
import { X, Loader2, Save, UserPlus, Mail } from 'lucide-react';

export function ProjectModal({
  show, editProject, formName, setFormName, formDesc, setFormDesc, saving, onClose, onSubmit
}) {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'rgba(13,13,22,0.98)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>{editProject ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Project Name *</label>
            <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="My Project" required
              style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,15,25,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Description</label>
            <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What is this project about?" rows={3}
              style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,15,25,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            <button type="submit" disabled={saving || !formName.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={14} className="dash-spinner" /> : <Save size={14} />}
              {editProject ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MemberModal({
  show, memberEmail, setMemberEmail, saving, onClose, onSubmit
}) {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'rgba(13,13,22,0.98)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>Add Member</h3>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>Enter the user ID or email of the member you want to add.</p>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>User ID or Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="text" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="Enter user ID or email" required
                style={{ width: '100%', padding: '9px 10px 9px 32px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,15,25,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '9px 16px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            <button type="submit" disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={14} className="dash-spinner" /> : <UserPlus size={14} />}
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
