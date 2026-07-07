import React from 'react';
import { MessageSquare, List as ListIcon, FolderKanban, Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function PlannerHeader({
  activeSpaceId,
  activeSpace,
  activeTab,
  setActiveTab,
  tabDisplayLabel,
  openNewTaskModal
}) {
  if (activeSpaceId === 'home' || activeSpaceId === 'my-tasks') {
    return null; // Hide the Workspace Home and My Tasks header row completely!
  }

  return (
    <div className="planner-header" style={{ border: 'none', padding: '0.25rem 0 0.5rem 0' }}>
      {/* VIEW TABS SELECTOR ONLY */}
      <div className="planner-tab-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', margin: 0, paddingBottom: '0.25rem' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('chat')}
            className={`planner-tab-btn ${activeTab === 'chat' ? 'planner-tab-btn--active' : ''}`}
          >
            <MessageSquare size={14} />
            Chat
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`planner-tab-btn ${activeTab === 'list' ? 'planner-tab-btn--active' : ''}`}
          >
            <ListIcon size={14} />
            List
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`planner-tab-btn ${activeTab === 'board' ? 'planner-tab-btn--active' : ''}`}
          >
            <FolderKanban size={14} />
            Board
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`planner-tab-btn ${activeTab === 'calendar' ? 'planner-tab-btn--active' : ''}`}
          >
            <CalendarIcon size={14} />
            Calendar
          </button>
        </div>

        <button
          onClick={() => openNewTaskModal()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
          style={{ marginBottom: '4px' }}
        >
          <Plus size={13} />
          Task
        </button>
      </div>
    </div>
  );
}
