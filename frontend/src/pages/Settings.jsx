import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Settings, Bell, Palette, Keyboard, Users, Shield,
  FileText, Trash2, LogOut, Globe, Bot, Smile,
  CheckSquare, ChevronRight, ChevronDown, Save, Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, trashApi, workspacesApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import ProfileSettings from '../components/settings/ProfileSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import TrashSettings from '../components/settings/TrashSettings';
import AvatarCropModal from '../components/settings/AvatarCropModal';
import ProfileDropdown from '../components/settings/ProfileDropdown';
import { useAvatarCrop } from '../hooks/useAvatarCrop';

// ── Helpers ──────────────────────────────────────────────────────────────────
const isImgUrl = (v) => v && (v.startsWith('data:image/') || v.startsWith('http://') || v.startsWith('https://') || v.startsWith('/'));

const renderAvatar = (targetUser, className = 'dash-avatar') => {
  const name = targetUser?.name || targetUser?.email?.split('@')[0] || 'User';
  const letter = name.charAt(0).toUpperCase();
  const val = targetUser?.avatar;
  if (isImgUrl(val)) return <div className={className} style={{ background: `url(${val}) center/cover no-repeat`, color: 'transparent' }}>{letter}</div>;
  return <div className={className} style={val ? { background: val } : {}}>{letter}</div>;
};

const buildSections = () => [
  { group: 'My Settings', items: [
    { id: 'profile',   icon: <Settings size={15} />, label: 'Profile' },
    { id: 'notifications', icon: <Bell size={15} />,  label: 'Notifications' },
    { id: 'themes',    icon: <Palette size={15} />,  label: 'Themes' },
    { id: 'shortcuts', icon: <Keyboard size={15} />, label: 'Keyboard Shortcuts' },
  ]},
  { group: 'Admin', items: [
    { id: 'general',  icon: <Settings size={15} />, label: 'General' },
    { id: 'people',   icon: <Users size={15} />,    label: 'People' },
    { id: 'teams',    icon: <Globe size={15} />,    label: 'Teams' },
    { id: 'security', icon: <Shield size={15} />,   label: 'Security & Permissions' },
    { id: 'audit',    icon: <FileText size={15} />, label: 'Audit Logs' },
    { id: 'trash',    icon: <Trash2 size={15} />,   label: 'Trash' },
  ]},
  { group: 'Features', items: [
    { id: 'automations', icon: <Bot size={15} />,         label: 'Automations Manager' },
    { id: 'emojis',      icon: <Smile size={15} />,       label: 'Emojis' },
    { id: 'task-types',  icon: <CheckSquare size={15} />, label: 'Task Types' },
  ]},
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('tab') || 'profile';
  const setActiveSection = (tab) => setSearchParams({ tab });

  // Profile form state
  const [profile, setProfile] = useState(user);
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const avatarCrop = useAvatarCrop(user?.avatar || '');

  // Workspace state
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [wsName, setWsName] = useState('');
  const [wsSlug, setWsSlug] = useState('');
  const [customBranding, setCustomBranding] = useState(false);
  const [personalLayout, setPersonalLayout] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [savingWs, setSavingWs] = useState(false);
  const [wsSaveMsg, setWsSaveMsg] = useState('');

  // Trash state
  const [trashItems, setTrashItems] = useState([]);
  const [loadingTrash, setLoadingTrash] = useState(false);
  const [trashError, setTrashError] = useState(null);
  const [trashSuccessMsg, setTrashSuccessMsg] = useState('');

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpen') ?? 'true'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen(prev => { const n = !prev; localStorage.setItem('sidebarOpen', JSON.stringify(n)); return n; });
  const handleSignOut = () => { logout(); navigate('/login'); };

  useEffect(() => {
    if (user) { setProfile(user); setFullName(user.name || ''); setEmail(user.email || ''); avatarCrop.setAvatarVal(user.avatar || ''); }
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    workspacesApi.list().then(data => {
      const active = data.filter(w => !w.isDeleted);
      if (active.length > 0) {
        const ws = active.find(w => w.id === Number(localStorage.getItem('yobid_active_workspace_id'))) || active[0];
        setActiveWorkspace(ws); setWsName(ws.name); setWsSlug(ws.slug);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => { if (activeSection === 'trash') fetchTrash(); }, [activeSection]);

  const fetchTrash = async () => {
    setLoadingTrash(true); setTrashError(null);
    try { setTrashItems((await trashApi.list()) || []); }
    catch (err) { setTrashError(err.message); }
    finally { setLoadingTrash(false); }
  };

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const payload = { name: fullName, email, avatar: avatarCrop.avatarVal };
      if (newPassword) payload.password = newPassword;
      const updated = await authApi.updateProfile(payload);
      updateUser(updated); setProfile(updated); setNewPassword(''); setSaveMsg('Changes saved!');
    } catch (err) { setSaveMsg(`Error: ${err.message}`); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(''), 4000); }
  };

  const handleSaveWorkspace = async () => {
    if (!activeWorkspace) return;
    setSavingWs(true); setWsSaveMsg('');
    try {
      const updated = await workspacesApi.update(activeWorkspace.id, { name: wsName, slug: wsSlug });
      setActiveWorkspace(updated); setWsSaveMsg('Workspace settings saved successfully!');
    } catch (err) { setWsSaveMsg(`Error: ${err.message}`); }
    finally { setSavingWs(false); setTimeout(() => setWsSaveMsg(''), 4000); }
  };

  const handleDeleteWorkspace = async () => {
    if (!activeWorkspace || !window.confirm('WARNING: Delete this workspace forever?')) return;
    try { await workspacesApi.remove(activeWorkspace.id); localStorage.removeItem('yobid_active_workspace_id'); navigate('/workspaces'); }
    catch (err) { alert(`Error: ${err.message}`); }
  };

  const handleRestore = async (type, id) => {
    setTrashSuccessMsg(''); setTrashError(null);
    try { await trashApi.restore(type, id); setTrashSuccessMsg(`Restored ${type} successfully!`); fetchTrash(); }
    catch (err) { setTrashError(err.message); }
  };

  const handlePermanentDelete = async (type, id) => {
    if (!window.confirm(`Permanently delete this ${type}? This cannot be undone.`)) return;
    setTrashSuccessMsg(''); setTrashError(null);
    try { await trashApi.permanentDelete(type, id); setTrashSuccessMsg(`Permanently deleted ${type}.`); fetchTrash(); }
    catch (err) { setTrashError(err.message); }
  };

  const handleClearAll = async () => {
    if (!trashItems.length || !window.confirm(`Permanently delete ALL ${trashItems.length} item(s)?`)) return;
    setTrashSuccessMsg(''); setTrashError(null);
    try { const r = await trashApi.clearAll(); setTrashSuccessMsg(`Cleared trash — ${r.deleted} item(s) deleted.`); fetchTrash(); }
    catch (err) { setTrashError(err.message); }
  };

  const userDisplayName = profile?.name || profile?.email?.split('@')[0] || 'User';
  const sections = buildSections();

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings
          userDisplayName={userDisplayName} avatarLetter={userDisplayName.charAt(0).toUpperCase()}
          avatarVal={avatarCrop.avatarVal} setAvatarVal={avatarCrop.setAvatarVal}
          fullName={fullName} setFullName={setFullName}
          email={email} setEmail={setEmail}
          newPassword={newPassword} setNewPassword={setNewPassword}
          showPassword={showPassword} setShowPassword={setShowPassword}
          twoFAEnabled={twoFAEnabled} setTwoFAEnabled={setTwoFAEnabled}
          fileInputRef={avatarCrop.fileInputRef}
          onUploadClick={() => { avatarCrop.fileInputRef.current?.click(); avatarCrop.fileInputRef.current && (avatarCrop.fileInputRef.current.onchange = avatarCrop.handleAvatarFileChange); }}
        />;
      case 'general':
        return <GeneralSettings
          wsName={wsName} setWsName={setWsName} wsSlug={wsSlug} setWsSlug={setWsSlug}
          customBranding={customBranding} setCustomBranding={setCustomBranding}
          personalLayout={personalLayout} setPersonalLayout={setPersonalLayout}
          selectedColor={selectedColor} setSelectedColor={setSelectedColor}
          savingWs={savingWs} wsSaveMsg={wsSaveMsg}
          onSave={handleSaveWorkspace} onDelete={handleDeleteWorkspace}
        />;
      case 'trash':
        return <TrashSettings
          trashItems={trashItems} loadingTrash={loadingTrash}
          trashError={trashError} trashSuccessMsg={trashSuccessMsg}
          onRefresh={fetchTrash} onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete} onClearAll={handleClearAll}
        />;
      case 'notifications':
        return (
          <div className="set-content-inner">
            <h1 className="set-content-title">Notifications</h1>
            <section className="set-section">
              <div className="set-section-left"><h3 className="set-section-heading">Email Notifications</h3><p className="set-section-desc">Choose what kinds of emails you'd like to receive.</p></div>
              <div className="set-section-right">
                {['Task assigned to you', 'Task completed', 'Comment mentions', 'Due date reminders'].map(item => (
                  <div className="set-checkbox-row" key={item}>
                    <input type="checkbox" defaultChecked id={`notif-${item}`} className="set-checkbox" />
                    <label htmlFor={`notif-${item}`} className="set-checkbox-label">{item}</label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'security':
        return (
          <div className="set-content-inner">
            <h1 className="set-content-title">Security &amp; Permissions</h1>
            <section className="set-section">
              <div className="set-section-left"><h3 className="set-section-heading">Active Sessions</h3><p className="set-section-desc">Manage where you're logged in.</p></div>
              <div className="set-section-right">
                <div className="set-session-card">
                  <div className="set-session-icon">💻</div>
                  <div className="set-session-info">
                    <span className="set-session-device">This device (Current)</span>
                    <span className="set-session-meta">Last active: just now · {window.location.hostname}</span>
                  </div>
                  <span className="set-session-badge">Active</span>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="set-content-inner">
            <h1 className="set-content-title">{sections.flatMap(s => s.items).find(i => i.id === activeSection)?.label || 'Settings'}</h1>
            <div className="set-empty-state"><Settings size={40} className="set-empty-icon" /><p>This section is coming soon.</p></div>
          </div>
        );
    }
  };

  return (
    <div className={`dash-page ${sidebarOpen ? '' : 'dash-page--collapsed'}`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left"><h2 className="dash-page-title">Settings</h2></div>
          <div className="dash-topbar-right">
            <button className="dash-icon-btn" id="btn-notifications" aria-label="Notifications"><Bell size={18} /></button>
            <div className="dash-profile-dropdown" ref={dropdownRef}>
              <button className="dash-user-pill" id="btn-profile-menu" onClick={() => setDropdownOpen(o => !o)} aria-expanded={dropdownOpen} aria-haspopup="true">
                {renderAvatar(user, 'dash-avatar')}
                <span className="dash-user-name">{userDisplayName}</span>
                <ChevronDown size={14} className={`dash-chevron ${dropdownOpen ? 'dash-chevron--open' : ''}`} />
              </button>
              <ProfileDropdown
                userDisplayName={userDisplayName} renderAvatar={renderAvatar} user={user}
                dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen}
                setActiveSection={setActiveSection} onSignOut={handleSignOut}
              />
            </div>
          </div>
        </header>

        {/* Settings Layout */}
        <div className="set-body-wrapper">
          <aside className="set-sidebar">
            <div className="set-sidebar-header">
              <button className="set-back-btn" onClick={() => navigate('/dashboard')} id="btn-back-dashboard" type="button">
                <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /><span>All settings</span>
              </button>
            </div>
            <div className="set-sidebar-nav">
              {sections.map(group => (
                <div className="set-nav-group" key={group.group}>
                  <span className="set-nav-group-label">{group.group}</span>
                  {group.items.map(item => (
                    <button key={item.id} className={`set-nav-item ${activeSection === item.id ? 'set-nav-item--active' : ''}`}
                      onClick={() => setActiveSection(item.id)} id={`set-nav-${item.id}`} type="button">
                      {item.icon}<span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
              <div className="set-nav-group set-nav-group--bottom">
                <button className="set-nav-item set-nav-item--danger" onClick={handleSignOut} id="btn-logout-settings" type="button">
                  <LogOut size={15} /><span>Log out</span>
                </button>
              </div>
            </div>
          </aside>

          <main className="set-main">
            {renderContent()}
            {['profile', 'notifications'].includes(activeSection) && (
              <div className="set-footer">
                {saveMsg && <span className={`set-save-msg ${saveMsg.startsWith('Error') ? 'set-save-msg--error' : ''}`}>{saveMsg}</span>}
                <button className="set-save-btn" onClick={handleSave} disabled={saving} id="btn-save-settings" type="button">
                  {saving ? <Loader2 size={15} className="set-spinner-sm" /> : <Save size={15} />}
                  <span>{saving ? 'Saving...' : 'Save changes'}</span>
                </button>
              </div>
            )}
          </main>
        </div>

        {avatarCrop.showCropModal && (
          <AvatarCropModal
            cropImageSrc={avatarCrop.cropImageSrc} zoom={avatarCrop.zoom} setZoom={avatarCrop.setZoom}
            panX={avatarCrop.panX} panY={avatarCrop.panY}
            onMouseDown={avatarCrop.handleMouseDown} onMouseMove={avatarCrop.handleMouseMove} onMouseUp={avatarCrop.handleMouseUp}
            onTouchStart={avatarCrop.handleTouchStart} onTouchMove={avatarCrop.handleTouchMove} onTouchEnd={avatarCrop.handleTouchEnd}
            onApply={avatarCrop.handleApplyCrop} onCancel={() => avatarCrop.setShowCropModal(false)}
          />
        )}
      </div>
    </div>
  );
}
