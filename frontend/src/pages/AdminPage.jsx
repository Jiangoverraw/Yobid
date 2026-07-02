import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import AdminStats from '../components/admin/AdminStats';
import RoleDistribution from '../components/admin/RoleDistribution';
import UserManagementTable from '../components/admin/UserManagementTable';

const isImgUrl = (v) => v && (v.startsWith('data:image/') || v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/'));

const renderAvatar = (targetUser, className = 'dash-avatar') => {
  const displayName = targetUser?.name || targetUser?.email?.split('@')[0] || 'User';
  const letter = displayName.charAt(0).toUpperCase();
  const avatarValue = targetUser?.avatar;

  if (isImgUrl(avatarValue)) {
    return <div className={className} style={{ background: `url(${avatarValue}) center/cover no-repeat`, color: 'transparent' }}>{letter}</div>;
  }
  return <div className={className} style={avatarValue ? { background: avatarValue } : {}}>{letter}</div>;
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionUserId, setActionUserId] = useState(null);
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpen') ?? 'true'));
  const toggleSidebar = () => setSidebarOpen(p => { const v = !p; localStorage.setItem('sidebarOpen', v); return v; });

  const dropdownRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        usersApi.list({ search: search || undefined, role: roleFilter || undefined }),
        usersApi.stats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, roleFilter]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActionUserId(null); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleChangeRole = async (targetId, role) => {
    setSaving(targetId); setActionUserId(null);
    try {
      await usersApi.changeRole(targetId, role);
      showToast('Role updated successfully');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  const handleToggleActive = async (u) => {
    setSaving(u.id); setActionUserId(null);
    try {
      if (u.isActive) {
        await usersApi.deactivate(u.id);
        showToast('User deactivated');
      } else {
        await usersApi.activate(u.id);
        showToast('User activated');
      }
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className={`dash-page ${sidebarOpen ? '' : 'dash-page--collapsed'}`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left"><h2 className="dash-page-title">Admin Panel</h2></div>
          <div className="dash-topbar-right">
            <button className="dash-icon-btn" aria-label="Notifications"><Bell size={18} /></button>
            <button className="dash-user-pill" onClick={() => navigate('/settings')}>
              {renderAvatar(user, 'dash-avatar')}
              <span className="dash-user-name">{userDisplayName}</span>
            </button>
            <button className="dash-icon-btn" onClick={() => { logout(); navigate('/login'); }} aria-label="Sign out" title="Sign out"><LogOut size={16} /></button>
          </div>
        </header>

        <div className="dash-body">
          <AdminStats stats={stats} loading={loading} />
          <RoleDistribution stats={stats} />
          <UserManagementTable
            users={users} loading={loading} search={search} setSearch={setSearch}
            roleFilter={roleFilter} setRoleFilter={setRoleFilter} onRefresh={load}
            actionUserId={actionUserId} setActionUserId={setActionUserId} dropdownRef={dropdownRef}
            saving={saving} currentUser={user} onChangeRole={handleChangeRole} onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: 'rgba(13,13,22,0.95)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 10, padding: '12px 18px', color: '#e2e8f0', fontSize: 13,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <CheckSquare size={15} style={{ color: '#10b981' }} />
          {toast}
        </div>
      )}
    </div>
  );
}
