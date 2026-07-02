import React from 'react';
import { Users, UserCheck, UserX, TrendingUp, Activity } from 'lucide-react';

export default function AdminStats({ stats, loading }) {
  const statCards = stats
    ? [
        { icon: <Users size={20} />,    label: 'Total Users',    value: stats.totalUsers,    color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
        { icon: <UserCheck size={20} />,label: 'Active Users',   value: stats.activeUsers,   color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        { icon: <UserX size={20} />,    label: 'Inactive Users', value: stats.inactiveUsers, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
        { icon: <TrendingUp size={20} />,label: 'Roles',         value: stats.byRole?.length ?? '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
      ]
    : [];

  return (
    <div className="dash-stats-grid" style={{ marginBottom: 24 }}>
      {loading && !stats
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dash-stat-card" style={{ opacity: 0.4 }}>
              <div className="dash-stat-icon" style={{ color: '#94a3b8', background: 'rgba(148,163,184,0.08)' }}>
                <Activity size={20} />
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">Loading…</span>
                <span className="dash-stat-value">—</span>
              </div>
            </div>
          ))
        : statCards.map((s, i) => (
            <div key={i} className="dash-stat-card">
              <div className="dash-stat-icon" style={{ color: s.color, background: s.bg }}>{s.icon}</div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">{s.label}</span>
                <span className="dash-stat-value">{s.value}</span>
              </div>
            </div>
          ))}
    </div>
  );
}
