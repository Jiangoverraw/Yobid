import React from 'react';
import { MessageSquare, List as ListIcon, FolderKanban, Calendar as CalendarIcon, LayoutGrid, Plus } from 'lucide-react';

export default function PlannerHeader({
  activeSpaceId,
  activeSpace,
  activeTab,
  setActiveTab,
  tabDisplayLabel,
  openNewTaskModal
}) {
  if (activeSpaceId === 'home') {
    return (
      <div className="planner-header" style={{ paddingBottom: '0.75rem' }}>
        <div className="planner-workspace-title-row">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-purple-600" />
            <span className="font-bold text-gray-800 text-base tracking-tight">Workspace Home</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-header">
      <div className="planner-workspace-title-row">
        {/* ClickUp Dynamic Path Name: Space / View Tab */}
        <div className="flex items-center gap-2">
          <span className="planner-space-icon" style={{ backgroundColor: activeSpace.color, width: 22, height: 22, color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontWeight: 'bold', fontSize: 11 }}>
            {activeSpace.name.charAt(0)}
          </span>
          <span className="font-bold text-gray-800 text-sm tracking-tight">{activeSpace.name}</span>
          <span className="text-gray-400 font-medium text-xs">/</span>
          <span className="text-gray-500 font-semibold text-xs flex items-center gap-1">
            {activeTab === 'chat' && <MessageSquare size={12} />}
            {activeTab === 'list' && <ListIcon size={12} />}
            {activeTab === 'board' && <FolderKanban size={12} />}
            {activeTab === 'calendar' && <CalendarIcon size={12} />}
            {tabDisplayLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">H</div>
            <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">P</div>
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">A</div>
          </div>
          <button
            onClick={() => openNewTaskModal()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
          >
            <Plus size={13} />
            Task
          </button>
        </div>
      </div>

      {/* VIEW TABS SELECTOR */}
      <div className="planner-tab-row">
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
    </div>
  );
}
