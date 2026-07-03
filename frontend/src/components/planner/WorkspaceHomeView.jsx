import React from 'react';
import { Shield, Zap, CheckSquare, Users, BarChart2, TrendingUp, Flag, Trash2 } from 'lucide-react';

export default function WorkspaceHomeView({
  greeting,
  userDisplayName,
  tasks,
  spaces,
  setActiveSpaceId,
  openNewTaskModal,
  handleUpdateTaskStatus,
  handleDeleteTask
}) {
  const completedCount = tasks.filter(t => t.status === 'DONE').length;
  const pendingCount = tasks.filter(t => t.status !== 'DONE').length;
  const totalCount = tasks.length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 w-full" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stats Grid */}
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="dash-stat-card" style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="dash-stat-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', color: '#7c3aed', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={20} />
          </div>
          <div className="dash-stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="dash-stat-label" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Tasks Completed</span>
            <span className="dash-stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {completedCount}
            </span>
          </div>
        </div>

        <div className="dash-stat-card" style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="dash-stat-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', color: '#06b6d4', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div className="dash-stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="dash-stat-label" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Spaces</span>
            <span className="dash-stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {spaces.length}
            </span>
          </div>
        </div>

        <div className="dash-stat-card" style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="dash-stat-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', color: '#10b981', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={20} />
          </div>
          <div className="dash-stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="dash-stat-label" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pending Tasks</span>
            <span className="dash-stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {pendingCount}
            </span>
          </div>
        </div>

        <div className="dash-stat-card" style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="dash-stat-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} />
          </div>
          <div className="dash-stat-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="dash-stat-label" style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Task Success Rate</span>
            <span className="dash-stat-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              {successRate}%
            </span>
          </div>
        </div>
      </div>

      {/* All Workspace Tasks Table */}
      <div className="planner-list-group" style={{ margin: 0 }}>
        <div className="planner-list-header flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">All Tasks Overview</span>
            <span className="text-[10px] text-gray-400 font-bold bg-gray-200 px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{totalCount} total</span>
          </div>
          <button
            onClick={() => openNewTaskModal()}
            className="text-[11px] font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: 700 }}
          >
            + Create Task
          </button>
        </div>
        <div className="divide-y divide-gray-150" style={{ display: 'flex', flexDirection: 'column' }}>
          {tasks.map(task => {
            const space = spaces.find(s => s.id === task.spaceId);
            return (
              <div key={task.id} className="planner-list-row group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={task.status === 'DONE'}
                    onChange={() => handleUpdateTaskStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
                    className="w-4 h-4 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <div>
                    <span className={`text-xs font-bold text-gray-800 ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1" style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#94a3b8' }}>{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Space badge */}
                  <span
                    onClick={() => space && setActiveSpaceId(space.id)}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-sm hover:underline cursor-pointer"
                    style={{ backgroundColor: `${space?.color || '#cbd5e1'}15`, color: space?.color || '#475569', border: `1px solid ${space?.color || '#cbd5e1'}25`, padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}
                  >
                    {space?.name || 'Default Space'}
                  </span>

                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ${
                    task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                    <Flag size={8} />
                    {task.priority}
                  </span>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm ${
                    task.status === 'TODO' ? 'bg-gray-100 text-gray-600' : task.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                    {task.status === 'TODO' ? 'TO DO' : task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'DONE'}
                  </span>

                  {task.deadline && (
                    <span className="text-[9px] text-gray-500 font-medium" style={{ fontSize: '9px', color: '#64748b' }}>
                      {task.deadline}
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                    title="Delete task"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1' }}
                  >
                    <Trash2 size={13} className="hover:text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
          {totalCount === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">No tasks created yet. Click "+ Create Task" or select a Space to get started!</div>
          )}
        </div>
      </div>
    </div>
  );
}
