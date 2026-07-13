import React from 'react';
import { Plus, MoreHorizontal, Flag, Search, ChevronRight } from 'lucide-react';

const PlannerLeftPanel = function PlannerLeftPanel() {
  return (
    <aside className="planner-left-panel" style={{ width: '250px', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '1rem', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>Planner</h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Plus size={16} style={{ color: '#64748b', cursor: 'pointer' }} />
          <MoreHorizontal size={16} style={{ color: '#64748b', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Priorities */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Priorities</span>
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Flag size={20} style={{ color: '#cbd5e1' }} />
          <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>Prioritize a Task to see it appear here</span>
          <button style={{ backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', color: '#64748b', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '4px', width: '100%' }}>
            + Add priority
          </button>
        </div>
      </div>

      {/* Meet with */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Meet with</span>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search for people..."
            style={{ width: '100%', padding: '6px 10px 6px 30px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px', backgroundColor: '#fff' }}
          />
        </div>
      </div>

      {/* Collapsible details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Assigned to me</span>
          <ChevronRight size={14} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Today &amp; overdue</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Backlog */}
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Backlog</span>
        <div style={{ border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1.5rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
          No tasks match these filters
        </div>
      </div>
    </aside>
  );
};

export default React.memo(PlannerLeftPanel);
