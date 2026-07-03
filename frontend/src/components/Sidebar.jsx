import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Sparkles, Users, Settings, Shield, UserPlus, ArrowUpCircle, ChevronsRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ sidebarOpen, toggleSidebar, lightSidebarOpen = true, onExpandLightSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'ADMIN';
  const path = location.pathname;

  return (
    <aside className="dash-sidebar">


      {/* Nav Links */}
      <nav className="dash-nav-links">
        {/* Expand (>>) button at the top - always in DOM, animated via classes */}
        <button
          onClick={onExpandLightSidebar}
          className={`dash-nav-item dash-nav-item--expand-btn ${!lightSidebarOpen ? 'dash-nav-item--expand-btn-active' : ''}`}
          title="Expand Sidebar"
        >
          <ChevronsRight />
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className={`dash-nav-item ${path === '/dashboard' ? 'dash-nav-item--active' : ''}`}
          title="Home"
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate('/planner')}
          className={`dash-nav-item ${path.startsWith('/planner') ? 'dash-nav-item--active' : ''}`}
          title="Planner"
        >
          <Calendar size={20} />
          <span>Planner</span>
        </button>

        <button
          onClick={() => alert("AI chat is ready to help! (mock action)")}
          className="dash-nav-item"
          title="AI"
        >
          <Sparkles size={20} />
          <span>AI</span>
        </button>

        <button
          onClick={() => alert("Teams panel is coming soon! (mock action)")}
          className="dash-nav-item"
          title="Teams"
        >
          <Users size={20} />
          <span>Teams</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className={`dash-nav-item ${path === '/admin' ? 'dash-nav-item--active' : ''}`}
            title="Admin"
          >
            <Shield size={20} />
            <span>Admin</span>
          </button>
        )}

        <button
          onClick={() => navigate('/settings')}
          className={`dash-nav-item ${path.startsWith('/settings') ? 'dash-nav-item--active' : ''}`}
          title="Settings"
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Bottom Area: Invite & Upgrade */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
        <button
          onClick={() => alert("Invite link copied to clipboard! (mock action)")}
          className="dash-nav-item"
          style={{ padding: '0.25rem 0' }}
          title="Invite"
        >
          <UserPlus size={20} />
          <span>Invite</span>
        </button>

        <button
          onClick={() => alert("Upgrade to Premium plan to unlock more features! (mock action)")}
          className="dash-nav-item"
          style={{ padding: '0.25rem 0' }}
          title="Upgrade"
        >
          <ArrowUpCircle size={20} style={{ color: '#fbbf24' }} />
          <span style={{ color: '#fbbf24' }}>Upgrade</span>
        </button>
      </div>
    </aside>
  );
}
