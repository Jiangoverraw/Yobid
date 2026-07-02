import React from 'react';
import { FolderOpen, Plus, Pencil, Trash2, CheckSquare, Users } from 'lucide-react';

export default function ProjectTab({
  projects, canManage, openCreateProject, openEditProject, handleDeleteProject
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 15, fontWeight: 600 }}>
          {projects.length} Project{projects.length !== 1 ? 's' : ''}
        </h3>
        {canManage && (
          <button onClick={openCreateProject}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>
          No projects yet. {canManage && 'Create one to get started.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {projects.map(p => {
            const taskCount = p._count?.tasks ?? 0;
            const memberCount = p._count?.members ?? 0;
            return (
              <div key={p.id} style={{
                borderRadius: 12, border: '1px solid rgba(99,102,241,0.15)',
                background: 'rgba(15,15,25,0.7)', padding: 18,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #06b6d488, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={16} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>{p.name}</h4>
                      {p.description && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>{p.description}</p>}
                    </div>
                  </div>
                  {canManage && (
                    <div style={{ display: 'flex', gap: 3 }}>
                      <button onClick={() => openEditProject(p)}
                        style={{ padding: '3px 5px', borderRadius: 5, border: '1px solid rgba(99,102,241,0.2)', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <Pencil size={11} />
                      </button>
                      <button onClick={() => handleDeleteProject(p.id)}
                        style={{ padding: '3px 5px', borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                    <CheckSquare size={11} style={{ color: '#06b6d4' }} /> {taskCount} tasks
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                    <Users size={11} style={{ color: '#7c3aed' }} /> {memberCount} members
                  </span>
                </div>

                <div style={{ height: 1, background: 'rgba(99,102,241,0.08)' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Created {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
