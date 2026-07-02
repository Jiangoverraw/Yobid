import React from 'react';
import { Save, Loader2 } from 'lucide-react';

/**
 * GeneralSettings – Workspace name, custom branding, custom URL, personal layout, danger zone.
 */
export default function GeneralSettings({
  wsName, setWsName, wsSlug, setWsSlug,
  customBranding, setCustomBranding,
  personalLayout, setPersonalLayout,
  selectedColor, setSelectedColor,
  savingWs, wsSaveMsg,
  onSave, onDelete,
}) {
  const COLORS = ['#4b5563', '#6366f1', '#3b82f6', '#ec4899', '#a855f7', '#3b82f6', '#f97316', '#a1a1aa', '#10b981'];

  return (
    <div className="set-content-inner">
      <h1 className="set-content-title">Workspace Settings</h1>

      {wsSaveMsg && (
        <div className="set-save-msg" style={{
          marginBottom: '1.5rem', display: 'block', padding: '0.75rem 1rem', borderRadius: '8px',
          background: wsSaveMsg.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
          border: wsSaveMsg.startsWith('Error') ? '1px solid #fee2e2' : '1px solid #dcfce7',
          color: wsSaveMsg.startsWith('Error') ? '#dc2626' : '#16a34a', fontSize: '0.85rem',
        }}>
          {wsSaveMsg}
        </div>
      )}

      {/* General Card */}
      <section className="set-section" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <h3 className="set-section-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>General</h3>
        </div>

        {/* Avatar preview */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Avatar</span>
          <div style={{ width: 32, height: 32, backgroundColor: selectedColor || '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontWeight: 'bold', fontSize: 14 }}>
            {wsName ? wsName.charAt(0).toUpperCase() : 'W'}
          </div>
        </div>

        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Name</span>
          <input type="text" className="set-input"
            style={{ width: 260, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            value={wsName} onChange={e => setWsName(e.target.value)}
          />
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem', background: '#f8fafc' }}>
          <button type="button" onClick={onSave} disabled={savingWs}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '8px', border: 'none', backgroundColor: '#7c3aed', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {savingWs ? <Loader2 size={14} className="dash-spinner" /> : <Save size={14} />}
            Save General Settings
          </button>
        </div>
      </section>

      {/* Custom Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '2.5rem', marginBottom: '1rem' }}>
        <h3 className="set-section-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Custom branding</h3>
        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: 4, fontWeight: 600 }}>Enterprise</span>
      </div>

      <section className="set-section" style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Enable custom branding</span>
          <button onClick={() => setCustomBranding(!customBranding)} className={`set-toggle ${customBranding ? 'set-toggle--on' : ''}`} type="button">
            <span className="set-toggle-knob" />
          </button>
        </div>

        <div style={{ opacity: customBranding ? 1 : 0.5, pointerEvents: customBranding ? 'auto' : 'none', transition: 'all 0.2s ease-in-out' }}>
          {[
            { label: 'Round logo', desc: 'We recommend a 72 x 72 px PNG file. This logo is used in-app as your Workspace avatar.' },
            { label: 'Rectangle logo', desc: 'We recommend a 232 x 48 px PNG file. This logo appears on emails, your login screen, and public links.' },
            { label: 'Social media graphic', desc: 'We recommend a 500 x 260 px PNG file. This graphic serves as the preview image when links are shared.' },
          ].map(({ label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ maxWidth: '75%' }}>
                <span style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{desc}</span>
              </div>
              <button disabled={!customBranding} type="button" style={{ padding: '0.35rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc', color: '#6b7280', fontSize: '0.8rem', cursor: customBranding ? 'pointer' : 'default' }}>Add</button>
            </div>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Color scheme</span>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {COLORS.map(color => (
                <button key={color} disabled={!customBranding} onClick={() => setSelectedColor(color)} type="button"
                  style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: color, border: selectedColor === color ? '2px solid #111827' : '1px solid #e2e8f0', boxShadow: selectedColor === color ? '0 0 0 2px #cbd5e1' : 'none', cursor: customBranding ? 'pointer' : 'default', padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom URL */}
      <div style={{ marginTop: '2rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Custom URL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="text" className="set-input"
              style={{ width: 140, padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'right' }}
              value={wsSlug} onChange={e => setWsSlug(e.target.value)}
            />
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>.yobid.com</span>
          </div>
        </div>
      </div>

      {/* Personal Layout */}
      <div style={{ marginTop: '2rem' }}>
        <h3 className="set-section-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>Personal Layout</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff' }}>
          <div style={{ maxWidth: '80%' }}>
            <span style={{ fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Personal Workspace Layout</span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Work by yourself? Turn this on to maximize your efficiency by removing features designed for team collaboration.</span>
          </div>
          <button onClick={() => setPersonalLayout(!personalLayout)} className={`set-toggle ${personalLayout ? 'set-toggle--on' : ''}`} type="button">
            <span className="set-toggle-knob" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 className="set-section-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', marginBottom: '1rem' }}>Danger zone</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid #fecaca', borderRadius: '12px', background: '#fff5f5' }}>
          <div>
            <span style={{ fontWeight: 700, color: '#991b1b', display: 'block', marginBottom: '0.25rem' }}>Delete this Workspace forever</span>
            <span style={{ fontSize: '0.8rem', color: '#b91c1c' }}>Once deleted, all data, projects, and tasks inside this workspace cannot be recovered.</span>
          </div>
          <button onClick={onDelete} type="button"
            style={{ border: 'none', backgroundColor: '#dc2626', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
