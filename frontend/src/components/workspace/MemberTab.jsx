import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

export default function MemberTab({
  workspace, canManage, currentUser, setShowMemberModal, handleRemoveMember
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 15, fontWeight: 600 }}>
          {workspace?.members?.length ?? 0} Member{workspace?.members?.length !== 1 ? 's' : ''}
        </h3>
        {canManage && (
          <button onClick={() => setShowMemberModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <UserPlus size={14} /> Add Member
          </button>
        )}
      </div>

      {(!workspace?.members || workspace.members.length === 0) ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>
          No members yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workspace.members.map(m => {
            const u = m.user ?? m;
            const displayName = u.name || u.email?.split('@')[0] || 'User';
            return (
              <div key={m.id ?? u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.12)', background: 'rgba(15,15,25,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed88, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999, background: 'rgba(6,182,212,0.1)', color: '#06b6d4', fontWeight: 600 }}>
                    {m.role ?? 'MEMBER'}
                  </span>
                  {canManage && u.id !== currentUser?.id && (
                    <button
                      onClick={() => handleRemoveMember(u.id)}
                      style={{ padding: '3px 6px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
