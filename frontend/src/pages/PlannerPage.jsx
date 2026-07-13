import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Bell, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import WeeklyPlanner from '../components/planner/WeeklyPlanner';

export default function PlannerPage() {
  console.log("[PlannerPage] Mounted/Rendered!");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpen') ?? 'true'));

  const dropdownRef = useRef(null);

  useEffect(() => {
    notificationsApi.countUnread().then(d => setUnreadCount(d.unreadCount ?? 0)).catch(() => { });
  }, []);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => {
      const n = !prev;
      localStorage.setItem('sidebarOpen', JSON.stringify(n));
      return n;
    });
  }, []);

  const handleSignOut = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className={`dash-page ${sidebarOpen ? '' : 'dash-page--collapsed'}`}>
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
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

        {/* Body */}
        <div className="dash-body dash-body--planner">
          {/* Weekly Planner Component */}
          <WeeklyPlanner />
        </div>
      </div>
    </div>
  );
}
