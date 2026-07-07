import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Bell, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import PlannerLeftPanel from '../components/planner/PlannerLeftPanel';
import PlannerCalendar from '../components/planner/PlannerCalendar';

const WEEK_DAYS = [
  { name: 'Sun', date: '28' },
  { name: 'Mon', date: '29' },
  { name: 'Tue', date: '30' },
  { name: 'Wed', date: '1' },
  { name: 'Thu', date: '2' },
  { name: 'Fri', date: '3', isToday: true },
  { name: 'Sat', date: '4' }
];

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? 'PM' : 'AM';
  const displayHour = i % 12 === 0 ? 12 : i % 12;
  return `${displayHour} ${ampm}`;
});

export default function PlannerPage() {
  console.log("[PlannerPage] Mounted/Rendered!");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpen') ?? 'true'));
  
  // Planner State
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Sync & Standup', hour: 9, dayIndex: 5, duration: 1, color: '#7c3aed' },
    { id: 2, title: 'Code Review & PRs', hour: 13, dayIndex: 5, duration: 1.5, color: '#10b981' },
    { id: 3, title: 'UI Refactoring Session', hour: 10, dayIndex: 2, duration: 2, color: '#06b6d4' }
  ]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedSlot, setSelectedSlot] = useState({ hour: 9, dayIndex: 5 });

  const dropdownRef = useRef(null);

  useEffect(() => {
    notificationsApi.countUnread().then(d => setUnreadCount(d.unreadCount ?? 0)).catch(() => {});
  }, []);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSignOut = () => { logout(); navigate('/login'); };
  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';

  const handleCellClick = (hour, dayIndex) => {
    setSelectedSlot({ hour, dayIndex });
    setNewEventTitle('');
    setShowAddEventModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: newEventTitle,
      hour: selectedSlot.hour,
      dayIndex: selectedSlot.dayIndex,
      duration: 1,
      color: ['#7c3aed', '#10b981', '#06b6d4', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)]
    };
    setEvents([...events, newEvent]);
    setShowAddEventModal(false);
  };

  return (
    <div className={`dash-page ${sidebarOpen ? '' : 'dash-page--collapsed'}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(prev => { const n = !prev; localStorage.setItem('sidebarOpen', JSON.stringify(n)); return n; })}
      />

      <div className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <div className="dash-ws-pill">
              <span style={{ width: '24px', height: '24px', backgroundColor: '#7c3aed', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>
                {userDisplayName.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                {userDisplayName}'s Workspace
              </span>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </div>
          </div>

          <div className="dash-topbar-right">
            <button className="dash-icon-btn" style={{ position: 'relative' }}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff', borderRadius: '999px', fontSize: '10px', minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', lineHeight: 1 }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="dash-profile-dropdown" ref={dropdownRef}>
              <button className="dash-user-pill" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <span className="dash-avatar">{userDisplayName.charAt(0).toUpperCase()}</span>
                <span className="dash-user-name">{userDisplayName}</span>
                <ChevronDown size={14} className={`dash-chevron ${dropdownOpen ? 'dash-chevron--open' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="dash-dropdown-menu">
                  <div className="dash-dropdown-header">
                    <span className="dash-dropdown-name">{userDisplayName}</span>
                  </div>
                  <div className="dash-dropdown-divider" />
                  <button className="dash-dropdown-item" onClick={() => navigate('/settings')}>
                    <SettingsIcon size={15} />
                    <span>Settings</span>
                  </button>
                  <button className="dash-dropdown-item dash-dropdown-item--danger" onClick={handleSignOut}>
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Split Layout */}
        <div className="planner-page-content" style={{ display: 'flex', flex: 1, overflow: 'hidden', backgroundColor: '#fff' }}>
          <PlannerLeftPanel />
          <PlannerCalendar events={events} onCellClick={handleCellClick} />
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <form onSubmit={handleAddEvent} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
              Add Scheduled Task at {HOURS[selectedSlot.hour]} ({WEEK_DAYS[selectedSlot.dayIndex].name})
            </h3>
            <input
              type="text"
              placeholder="Task title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginBottom: '1.25rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', color: '#fff', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
