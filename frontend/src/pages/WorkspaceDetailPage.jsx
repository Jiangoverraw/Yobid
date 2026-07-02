import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Settings, LogOut, Bell, FolderOpen, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { workspacesApi, projectsApi } from '../services/api';
import Sidebar from '../components/Sidebar';
import ProjectTab from '../components/workspace/ProjectTab';
import MemberTab from '../components/workspace/MemberTab';
import { ProjectModal, MemberModal } from '../components/workspace/WorkspaceModals';

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

export default function WorkspaceDetailPage() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(() => JSON.parse(localStorage.getItem('sidebarOpen') ?? 'true'));
  const toggleSidebar = () => setSidebarOpen(p => { const v = !p; localStorage.setItem('sidebarOpen', v); return v; });

  const isAdmin = user?.role === 'ADMIN';
  const isPM = user?.role === 'PROJECT_MANAGER';
  const canManage = isAdmin || isPM;

  const load = async () => {
    setLoading(true);
    try {
      const [ws, projs] = await Promise.all([
        workspacesApi.get(id),
        projectsApi.list(id),
      ]);
      setWorkspace(ws);
      setProjects(projs);
    } catch { navigate('/workspaces'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openCreateProject = () => { setEditProject(null); setFormName(''); setFormDesc(''); setShowProjectModal(true); };
  const openEditProject = (p) => { setEditProject(p); setFormName(p.name); setFormDesc(p.description || ''); setShowProjectModal(true); };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);
    try {
      if (editProject) {
        await projectsApi.update(editProject.id, { name: formName.trim(), description: formDesc.trim() });
        showToast('Project updated');
      } else {
        await projectsApi.create({ name: formName.trim(), description: formDesc.trim(), workspaceId: Number(id) });
        showToast('Project created');
      }
      setShowProjectModal(false);
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally { setSaving(false); }
  };

  const handleDeleteProject = async (pid) => {
    if (!window.confirm('Delete this project? All tasks will be lost.')) return;
    try {
      await projectsApi.remove(pid);
      showToast('Project deleted');
      load();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await workspacesApi.removeMember(id, userId);
      showToast('Member removed');
      load();
    } catch (err) { showToast(`Error: ${err.message}`); }
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    const val = memberEmail.trim();
    if (!val) return;
    setSaving(true);
    try {
      const parsedVal = /^\d+$/.test(val) ? Number(val) : val;
      await workspacesApi.addMember(id, parsedVal, 'MEMBER');
      showToast('Member added');
      setShowMemberModal(false);
      setMemberEmail('');
      load();
    } catch (err) { showToast(`Error: ${err.message}`); }
    finally { setSaving(false); }
  };

  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';

  if (loading) {
    return (
      <div className="dash-loading-screen">
        <div className="dash-loading-card">
          <Loader2 size={32} className="dash-spinner" />
          <p className="dash-loading-text">Loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dash-page ${sidebarOpen ? '' : 'dash-page--collapsed'}`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate('/workspaces')} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(15,15,25,0.6)', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="dash-page-title" style={{ marginBottom: 0 }}>{workspace?.name}</h2>
              {workspace?.description && <span style={{ fontSize: 12, color: '#64748b' }}>{workspace.description}</span>}
            </div>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-icon-btn" aria-label="Notifications"><Bell size={18} /></button>
            <button className="dash-user-pill" onClick={() => navigate('/settings')}>
              {renderAvatar(user, 'dash-avatar')}
              <span className="dash-user-name">{userDisplayName}</span>
            </button>
            <button className="dash-icon-btn" onClick={() => { logout(); navigate('/login'); }} title="Sign out"><LogOut size={16} /></button>
          </div>
        </header>

        <div className="dash-body">
          {/* Tab selector */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(15,15,25,0.6)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid rgba(99,102,241,0.15)' }}>
            {[
              { id: 'projects', icon: <FolderOpen size={14} />, label: 'Projects' },
              { id: 'members', icon: <Users size={14} />, label: 'Members' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'none',
                  color: activeTab === tab.id ? '#a855f7' : '#94a3b8',
                  transition: 'all 0.15s',
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'projects' ? (
            <ProjectTab
              projects={projects} canManage={canManage}
              openCreateProject={openCreateProject} openEditProject={openEditProject}
              handleDeleteProject={handleDeleteProject}
            />
          ) : (
            <MemberTab
              workspace={workspace} canManage={canManage} currentUser={user}
              setShowMemberModal={setShowMemberModal} handleRemoveMember={handleRemoveMember}
            />
          )}
        </div>
      </div>

      <ProjectModal
        show={showProjectModal} editProject={editProject}
        formName={formName} setFormName={setFormName}
        formDesc={formDesc} setFormDesc={setFormDesc}
        saving={saving} onClose={() => setShowProjectModal(false)}
        onSubmit={handleSaveProject}
      />

      <MemberModal
        show={showMemberModal} memberEmail={memberEmail} setMemberEmail={setMemberEmail}
        saving={saving} onClose={() => setShowMemberModal(false)}
        onSubmit={handleAddMemberSubmit}
      />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: 'rgba(13,13,22,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '12px 18px', color: '#e2e8f0', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}
