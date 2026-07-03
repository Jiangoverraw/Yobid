import React from 'react';
import { LayoutGrid, Plus, MoreHorizontal, Pencil, Link, Copy, Archive, Trash2, List as ListIcon, FolderKanban, Calendar as CalendarIcon, MessageSquare, ChevronsLeft, Search, Inbox, CheckSquare, Sliders } from 'lucide-react';
import SpaceDropdownMenu from './SpaceDropdownMenu';

export default function PlannerSidebar({
  workspaceName,
  handleRenameWorkspace,
  activeSpaceId,
  setActiveSpaceId,
  spaces,
  activeMenuSpaceId,
  setActiveMenuSpaceId,
  handleRenameSpace,
  handleCycleSpaceColor,
  handleDeleteSpace,
  activeTab,
  setActiveTab,
  setSpaceName,
  setShowSpaceModal,
  lightSidebarOpen,
  setLightSidebarOpen,
  sidebarWidth,
  onMouseDownResizer
}) {
  return (
    <div
      className={`planner-sidebar ${!lightSidebarOpen ? 'planner-sidebar--collapsed' : ''}`}
      style={{ width: lightSidebarOpen ? sidebarWidth : 0 }}
    >
      {/* Sidebar Header Row with Collapse and Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>
          {activeSpaceId === 'home' ? 'Home' : (spaces.find(s => s.id === activeSpaceId)?.name || 'Space')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => alert("Search is coming soon! (mock action)")} />
          <ChevronsLeft
            size={16}
            style={{ color: '#94a3b8', cursor: 'pointer' }}
            onClick={() => setLightSidebarOpen(false)}
            title="Collapse Sidebar"
          />
          <button
            onClick={() => {
              setSpaceName('');
              setShowSpaceModal(true);
            }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
            title="Create Space"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>


      {/* Main sidebar scrollable area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px' }} className="planner-sidebar-scrollable">
        
        {/* Home Items section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div
            onClick={() => setActiveSpaceId('home')}
            className={`planner-space-item ${activeSpaceId === 'home' ? 'planner-space-item--active' : ''}`}
            style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}
          >
            <Inbox size={14} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 600 }}>Inbox</span>
          </div>

          <div
            className="planner-space-item"
            style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}
            onClick={() => alert("Assigned Comments is coming soon! (mock action)")}
          >
            <MessageSquare size={14} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 600 }}>Assigned Comments</span>
          </div>

          {/* My Tasks collapsible group */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              className="planner-space-item"
              style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}
            >
              <CheckSquare size={14} style={{ color: '#64748b' }} />
              <span style={{ fontWeight: 600 }}>My Tasks</span>
            </div>
            
            {/* Sub-items (indented) */}
            <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                className="planner-space-item"
                style={{ display: 'flex', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}
                onClick={() => alert("Tasks assigned to me (mock action)")}
              >
                <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold' }}>J</span>
                <span>Assigned to me</span>
              </div>
              <div
                className="planner-space-item"
                style={{ display: 'flex', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}
                onClick={() => alert("Today & Overdue tasks (mock action)")}
              >
                <CalendarIcon size={12} style={{ color: '#94a3b8' }} />
                <span>Today &amp; Overdue</span>
              </div>
              <div
                className="planner-space-item"
                style={{ display: 'flex', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748b' }}
                onClick={() => alert("Personal list (mock action)")}
              >
                <ListIcon size={12} style={{ color: '#94a3b8' }} />
                <span>Personal List</span>
              </div>
            </div>
          </div>

          <div
            className="planner-space-item"
            style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}
            onClick={() => alert("More tools (mock action)")}
          >
            <MoreHorizontal size={14} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 600 }}>More</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

        {/* AI Chats section */}
        <div>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px', paddingLeft: '8px' }}>AI Chats</span>
          <div
            className="planner-space-item"
            style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}
            onClick={() => alert("AI assistant ready to Ask, Build, Create!")}
          >
            <Plus size={14} style={{ color: '#a855f7' }} />
            <span style={{ color: '#6366f1', fontWeight: 600 }}>Ask, Build, Create</span>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

        {/* Spaces Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', paddingLeft: '8px', paddingRight: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Spaces</span>
            <button
              onClick={() => { setSpaceName(''); setShowSpaceModal(true); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <Plus size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* All Tasks item */}
            <div
              onClick={() => setActiveSpaceId('home')}
              className={`planner-space-item ${activeSpaceId === 'home' ? 'planner-space-item--active' : ''}`}
              style={{ display: 'flex', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}
            >
              <LayoutGrid size={14} style={{ color: '#64748b' }} />
              <span style={{ fontWeight: 600 }}>All Tasks <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>- {workspaceName}</span></span>
            </div>

            {/* Spaces list */}
            {spaces.map(space => {
              const isActive = space.id === activeSpaceId;
              return (
                <div key={space.id} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setActiveSpaceId(space.id)}
                    className={`planner-space-item ${isActive ? 'planner-space-item--active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px' }}
                  >
                    <div className="planner-space-link-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, fontSize: '12px' }}>
                      <span className="planner-space-icon" style={{ backgroundColor: space.color, width: '16px', height: '16px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>
                        {space.name.charAt(0)}
                      </span>
                      <span className="truncate max-w-[110px]" title={space.name}>{space.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuSpaceId(activeMenuSpaceId === space.id ? null : space.id);
                      }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                    >
                      <MoreHorizontal size={12} />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {activeMenuSpaceId === space.id && (
                    <SpaceDropdownMenu
                      space={space}
                      handleRenameSpace={handleRenameSpace}
                      handleCycleSpaceColor={handleCycleSpaceColor}
                      handleDeleteSpace={handleDeleteSpace}
                      onClose={() => setActiveMenuSpaceId(null)}
                    />
                  )}

                  {/* Under active space, show children */}
                  {isActive && (
                    <div className="pl-6 pr-2 py-1 space-y-1 border-l border-gray-200 ml-4 mt-0.5 mb-1.5 text-[11px] text-gray-500 font-semibold">
                      <div
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-1.5 py-1 px-2 rounded-sm cursor-pointer ${activeTab === 'list' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                      >
                        <ListIcon size={11} /> List
                      </div>
                      <div
                        onClick={() => setActiveTab('board')}
                        className={`flex items-center gap-1.5 py-1 px-2 rounded-sm cursor-pointer ${activeTab === 'board' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                      >
                        <FolderKanban size={11} /> Board
                      </div>
                      <div
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-1.5 py-1 px-2 rounded-sm cursor-pointer ${activeTab === 'calendar' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                      >
                        <CalendarIcon size={11} /> Calendar
                      </div>
                      <div
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-1.5 py-1 px-2 rounded-sm cursor-pointer ${activeTab === 'chat' ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                      >
                        <MessageSquare size={11} /> Chat
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customize Sidebar button at the bottom */}
      <button
        onClick={() => alert("Sidebar customization panel is coming soon!")}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: '100%',
          backgroundColor: '#f1f5f9',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#475569',
          cursor: 'pointer',
          marginTop: 'auto',
          transition: 'background-color 0.15s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
      >
        <Sliders size={12} style={{ color: '#64748b' }} />
        <span>Customize Sidebar</span>
      </button>

      {/* Resize Handle / Drag bar */}
      {lightSidebarOpen && (
        <div
          onMouseDown={onMouseDownResizer}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '4px',
            cursor: 'col-resize',
            zIndex: 50,
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#cbd5e1'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
          title="Drag to resize sidebar"
        />
      )}
    </div>
  );
}
