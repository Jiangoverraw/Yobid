import React from 'react';
import { Crown } from 'lucide-react';

const ROLE_META = {
  ADMIN:           { label: 'Admin',           color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: '#ef444433' },
  PROJECT_MANAGER: { label: 'Project Manager', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: '#7c3aed33' },
  MEMBER:          { label: 'Member',           color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  border: '#06b6d433' },
  GUEST:           { label: 'Guest',            color: '#9ca3af', bg: 'rgba(156,163,175,0.1)',border: '#9ca3af33' },
};

export default function RoleDistribution({ stats }) {
  if (!stats?.byRole?.length) return null;

  return (
    <div className="dash-profile-card" style={{ marginBottom: 24 }}>
      <div className="dash-profile-card-header">
        <h3 className="dash-section-title">Role Distribution</h3>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>Total: {stats.totalUsers}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', padding: '4px 0' }}>
        {stats.byRole.map(r => {
          const m = ROLE_META[r.role] ?? ROLE_META.MEMBER;
          const pct = Math.round((r.count / stats.totalUsers) * 100);
          return (
            <div key={r.role} style={{
              flex: '1 1 160px', padding: '12px 16px',
              borderRadius: 12, background: m.bg,
              border: `1px solid ${m.border}`,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.label}</span>
                <Crown size={13} style={{ color: m.color }} />
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{r.count}</span>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.05)' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: m.color }} />
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{pct}% of total</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
