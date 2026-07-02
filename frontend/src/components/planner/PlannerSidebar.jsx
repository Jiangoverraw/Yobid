import React from 'react';
import { LayoutGrid, Plus, MoreHorizontal, Pencil, Link, Copy, Archive, Trash2, List as ListIcon, FolderKanban, Calendar as CalendarIcon, MessageSquare, ChevronsLeft, Search } from 'lucide-react';

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
  setLightSidebarOpen
}) {
  return (
    <div className={`planner-sidebar ${!lightSidebarOpen ? 'planner-sidebar--collapsed' : ''}`}>
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


      {/* Workspace Home Section */}
      <div className="mb-4">
        <div
          onClick={() => setActiveSpaceId('home')}
          className={`planner-space-item ${activeSpaceId === 'home' ? 'planner-space-item--active' : ''}`}
          style={{ display: 'flex', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }}
        >
          <div className="planner-space-link-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.85rem', color: activeSpaceId === 'home' ? '#7c3aed' : '#334155' }}>
            <LayoutGrid size={16} />
            <span>Workspace Home</span>
          </div>
        </div>
      </div>

      {/* Spaces divider & plus button without "SPACES" heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', marginBottom: '0.5rem', borderTop: '1.5px solid #f1f5f9', paddingTop: '0.75rem' }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}></span>
        <button
          onClick={() => {
            setSpaceName('');
            setShowSpaceModal(true);
          }}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
          className="hover:text-purple-600 flex items-center"
          title="Create Space"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Spaces list */}
      <div className="flex-1 space-y-1">
        {spaces.map(space => {
          const isActive = space.id === activeSpaceId;
          return (
            <div key={space.id} style={{ position: 'relative' }}>
              <div
                onClick={() => setActiveSpaceId(space.id)}
                className={`planner-space-item ${isActive ? 'planner-space-item--active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div className="planner-space-link-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span className="planner-space-icon" style={{ backgroundColor: space.color }}>
                    {space.name.charAt(0)}
                  </span>
                  <span className="truncate max-w-[110px]" title={space.name}>{space.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuSpaceId(activeMenuSpaceId === space.id ? null : space.id);
                  }}
                  className={`planner-space-menu-btn ${activeMenuSpaceId === space.id ? 'planner-space-menu-btn--open' : ''}`}
                  title="Space Settings"
                >
                  <MoreHorizontal size={12} />
                </button>
              </div>

              {/* Space Dropdown Settings Menu */}
              {activeMenuSpaceId === space.id && (
                <div
                  className="planner-space-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      handleRenameSpace(space.id, space.name);
                      setActiveMenuSpaceId(null);
                    }}
                    className="planner-space-dropdown-item"
                  >
                    <div className="flex items-center gap-2">
                      <Pencil size={12} className="text-gray-400" />
                      <span>Rename</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleCycleSpaceColor(space.id, space.color);
                    }}
                    className="planner-space-dropdown-item"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: space.color, display: 'inline-block' }} />
                      <span>Color & Icon</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                      setActiveMenuSpaceId(null);
                    }}
                    className="planner-space-dropdown-item"
                  >
                    <div className="flex items-center gap-2">
                      <Link size={12} className="text-gray-400" />
                      <span>Copy link</span>
                    </div>
                  </button>

                  <div className="planner-space-dropdown-divider" />

                  <div className="planner-space-dropdown-header">Actions</div>

                  <button
                    onClick={() => {
                      alert("Space duplicated (mock action).");
                      setActiveMenuSpaceId(null);
                    }}
                    className="planner-space-dropdown-item"
                  >
                    <div className="flex items-center gap-2">
                      <Copy size={12} className="text-gray-400" />
                      <span>Duplicate</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      alert("Space archived (mock action).");
                      setActiveMenuSpaceId(null);
                    }}
                    className="planner-space-dropdown-item"
                  >
                    <div className="flex items-center gap-2">
                      <Archive size={12} className="text-gray-400" />
                      <span>Archive</span>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      handleDeleteSpace(space.id, space.name, e);
                      setActiveMenuSpaceId(null);
                    }}
                    className="planner-space-dropdown-item planner-space-dropdown-item--danger"
                  >
                    <div className="flex items-center gap-2">
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </div>
                  </button>
                </div>
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

      {/* Plus button at bottom of sidebar list */}
      <button
        onClick={() => {
          setSpaceName('');
          setShowSpaceModal(true);
        }}
        className="w-full mt-4 py-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-700 rounded-lg text-[10px] font-bold transition-colors border border-dashed border-gray-300 flex items-center justify-center gap-1 cursor-pointer"
      >
        <Plus size={12} />
        New Space
      </button>
    </div>
  );
}
