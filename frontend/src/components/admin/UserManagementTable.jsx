import React from 'react';
import { Search, ChevronDown, RefreshCw, Loader2, Shield, MoreVertical, Crown, UserX, UserCheck, AlertTriangle } from 'lucide-react';

const ROLE_META = {
  ADMIN:           { label: 'Admin',           color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: '#ef444433' },
  PROJECT_MANAGER: { label: 'Project Manager', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: '#7c3aed33' },
  MEMBER:          { label: 'Member',           color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  border: '#06b6d433' },
  GUEST:           { label: 'Guest',            color: '#9ca3af', bg: 'rgba(156,163,175,0.1)',border: '#9ca3af33' },
};

const ROLES = ['GUEST', 'MEMBER', 'PROJECT_MANAGER', 'ADMIN'];

export default function UserManagementTable({
  users, loading, search, setSearch,
  roleFilter, setRoleFilter, onRefresh,
  actionUserId, setActionUserId, dropdownRef,
  saving, currentUser, onChangeRole, onToggleActive
}) {
  return (
    <div className="dash-profile-card">
      <div className="dash-profile-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <h3 className="dash-section-title">User Management</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search users…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '7px 10px 7px 32px', borderRadius: 8,
                border: '1px solid rgba(99,102,241,0.2)',
                background: 'rgba(15,15,25,0.6)', color: '#e2e8f0',
                fontSize: 13, outline: 'none', width: 180,
              }}
            />
          </div>
          {/* Role filter */}
          <div style={{ position: 'relative' }}>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{
                padding: '7px 28px 7px 10px', borderRadius: 8, appearance: 'none',
                border: '1px solid rgba(99,102,241,0.2)',
                background: 'rgba(15,15,25,0.6)', color: '#e2e8f0',
                fontSize: 13, outline: 'none', cursor: 'pointer',
              }}
            >
              <option value="">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
          </div>
          {/* Refresh */}
          <button onClick={onRefresh} style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(15,15,25,0.6)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Loader2 size={28} className="dash-spinner" />
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>
          No users found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                {['User', 'Role', 'Status', 'Provider', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const m = ROLE_META[u.role] ?? ROLE_META.MEMBER;
                const isCurrentUser = u.id === currentUser?.id;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(99,102,241,0.06)', opacity: u.isActive ? 1 : 0.5 }}>
                    {/* User */}
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${m.color}88, ${m.color})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
                        }}>
                          {(u.name || u.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#e2e8f0', lineHeight: 1.2 }}>
                            {u.name || '—'} {isCurrentUser && <span style={{ fontSize: 10, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '1px 5px', borderRadius: 4 }}>you</span>}
                          </div>
                          <div style={{ color: '#64748b', fontSize: 12 }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
                        <Shield size={10} />{m.label}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: u.isActive ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive ? '#10b981' : '#ef4444', display: 'inline-block' }} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Provider */}
                    <td style={{ padding: '12px 12px', color: '#94a3b8', fontSize: 12 }}>
                      {u.provider === 'google' ? '🔵 Google' : u.provider === 'github' ? '⚫ GitHub' : '🔑 Local'}
                    </td>
                    {/* Joined */}
                    <td style={{ padding: '12px 12px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '12px 12px', position: 'relative' }} ref={actionUserId === u.id ? dropdownRef : null}>
                      {saving === u.id ? (
                        <Loader2 size={16} className="dash-spinner" />
                      ) : (
                        <>
                          <button
                            onClick={() => setActionUserId(actionUserId === u.id ? null : u.id)}
                            style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(15,15,25,0.6)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            aria-label="Actions"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {actionUserId === u.id && (
                            <div style={{
                              position: 'absolute', right: 0, top: '110%', zIndex: 50, minWidth: 200,
                              background: 'rgba(13,13,22,0.98)', border: '1px solid rgba(99,102,241,0.2)',
                              borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: 6,
                            }}>
                              <div style={{ padding: '4px 10px 6px', fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Change Role</div>
                              {ROLES.filter(r => r !== u.role).map(r => (
                                <button key={r} onClick={() => onChangeRole(u.id, r)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', color: ROLE_META[r].color, cursor: 'pointer', fontSize: 13, textAlign: 'left' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                  <Crown size={12} /> Set as {ROLE_META[r].label}
                                </button>
                              ))}
                              <div style={{ height: 1, background: 'rgba(99,102,241,0.1)', margin: '4px 0' }} />
                              {!isCurrentUser && (
                                <button onClick={() => onToggleActive(u)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 6, border: 'none', background: 'none', color: u.isActive ? '#ef4444' : '#10b981', cursor: 'pointer', fontSize: 13 }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                  {u.isActive ? <><UserX size={12} /> Deactivate</> : <><UserCheck size={12} /> Activate</>}
                                </button>
                              )}
                              {isCurrentUser && (
                                <div style={{ padding: '6px 10px', fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <AlertTriangle size={11} /> Cannot modify your own account
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
