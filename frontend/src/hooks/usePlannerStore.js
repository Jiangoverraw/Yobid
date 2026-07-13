import { create } from 'zustand';
import { workspacesApi, projectsApi, tasksApi } from '../services/api';

const getInitialEpics = () => {
  const saved = localStorage.getItem('yobid_epics');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(e => e.id === 'epic-1' || e.id === 'epic-2')) return [];
      return parsed;
    } catch (e) { return []; }
  }
  return [];
};

const getInitialSprints = () => {
  const saved = localStorage.getItem('yobid_sprints');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(s => s.id === 'sprint-1' || s.id === 'sprint-2')) return [];
      return parsed;
    } catch (e) { return []; }
  }
  return [];
};

const getInitialChatMessages = () => {
  const saved = localStorage.getItem('yobid_chats');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(c => c.id === 'msg-1' || c.id === 'msg-2')) return [];
      return parsed;
    } catch (e) { return []; }
  }
  return [];
};

const BOT_RESPONSES = [
  "Tôi đã ghi nhận ý kiến của bạn! Tôi sẽ cập nhật trạng thái nhiệm vụ tương ứng.",
  "Đúng vậy, chúng ta cần hoàn thiện Sprint này trước cuối tuần.",
  "Để tôi kiểm tra lại backlog xem còn thiếu tính năng nào không nhé.",
  "Báo cáo rất chi tiết! Mọi người có câu hỏi gì cho phần này không?",
  "Cảm ơn bạn đã cập nhật tiến độ công việc!"
];

export const usePlannerStore = create((set, get) => ({
  // Core Data State
  loading: false,
  workspaces: [],
  activeWorkspaceId: null,
  workspaceName: 'Workspace',
  spaces: [],
  activeSpaceId: 'home',
  tasks: [],

  // UI State
  activeTab: 'list',
  activeMenuSpaceId: null,
  typedMessage: '',
  currentDate: new Date(),

  // Epics, Sprints, Chat
  epics: getInitialEpics(),
  sprints: getInitialSprints(),
  chatMessages: getInitialChatMessages(),

  // Setters
  setLoading: (loading) => set({ loading }),
  setWorkspaces: (workspaces) => set({ workspaces: typeof workspaces === 'function' ? workspaces(get().workspaces) : workspaces }),
  setActiveWorkspaceId: (id) => {
    set({ activeWorkspaceId: id });
    if (id) localStorage.setItem('yobid_active_workspace_id', String(id));
  },
  setWorkspaceName: (name) => set({ workspaceName: name }),
  setSpaces: (spaces) => set({ spaces: typeof spaces === 'function' ? spaces(get().spaces) : spaces }),
  setActiveSpaceId: (id) => {
    set({ activeSpaceId: id });
    localStorage.setItem('yobid_active_space', String(id));
  },
  setTasks: (tasks) => set({ tasks: typeof tasks === 'function' ? tasks(get().tasks) : tasks }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveMenuSpaceId: (id) => set({ activeMenuSpaceId: id }),
  setTypedMessage: (msg) => set({ typedMessage: msg }),
  setCurrentDate: (date) => set({ currentDate: typeof date === 'function' ? date(get().currentDate) : date }),

  setEpics: (epics) => {
    const nextEpics = typeof epics === 'function' ? epics(get().epics) : epics;
    localStorage.setItem('yobid_epics', JSON.stringify(nextEpics));
    set({ epics: nextEpics });
  },
  setSprints: (sprints) => {
    const nextSprints = typeof sprints === 'function' ? sprints(get().sprints) : sprints;
    localStorage.setItem('yobid_sprints', JSON.stringify(nextSprints));
    set({ sprints: nextSprints });
  },
  setChatMessages: (messages) => {
    const nextMessages = typeof messages === 'function' ? messages(get().chatMessages) : messages;
    localStorage.setItem('yobid_chats', JSON.stringify(nextMessages));
    set({ chatMessages: nextMessages });
  },

  // Actions
  fetchWorkspaces: async (userDisplayName) => {
    const { setLoading, setWorkspaces, setActiveWorkspaceId, setWorkspaceName } = get();
    try {
      setLoading(true);
      const wsList = await workspacesApi.list();
      const activeWs = wsList.filter(w => !w.isDeleted);
      if (activeWs.length > 0) {
        setWorkspaces(activeWs);
        const savedWsId = localStorage.getItem('yobid_active_workspace_id');
        const workspaceToSelect = activeWs.find(w => w.id === Number(savedWsId)) || activeWs[0];
        setActiveWorkspaceId(workspaceToSelect.id);
        setWorkspaceName(workspaceToSelect.name);
      } else {
        const newWs = await workspacesApi.create({
          name: `${userDisplayName || 'User'}'s Workspace`,
          slug: `workspace-${Date.now()}`
        });
        setWorkspaces([newWs]);
        setActiveWorkspaceId(newWs.id);
        setWorkspaceName(newWs.name);
      }
    } catch (err) {
      console.error('Error fetching workspaces:', err);
    } finally {
      setLoading(false);
    }
  },

  fetchSpaces: async () => {
    const { activeWorkspaceId, setLoading, setSpaces, setActiveSpaceId } = get();
    if (!activeWorkspaceId) return;
    try {
      setLoading(true);
      const projList = await projectsApi.list(activeWorkspaceId);
      const activeProjs = projList.filter(p => !p.isDeleted);
      const colors = ['#7c3aed', '#ff6b6b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
      const mapped = activeProjs.map((p, idx) => ({
        id: p.id,
        name: p.name,
        color: colors[idx % colors.length]
      }));
      setSpaces(mapped);

      const savedSpaceId = localStorage.getItem('yobid_active_space') || 'home';
      if (savedSpaceId !== 'home' && mapped.some(s => s.id === Number(savedSpaceId))) {
        setActiveSpaceId(Number(savedSpaceId));
      } else {
        setActiveSpaceId('home');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  },

  fetchTasks: async () => {
    const { activeWorkspaceId, activeSpaceId, spaces, setTasks } = get();
    if (!activeWorkspaceId) return;
    try {
      if (activeSpaceId === 'home') {
        if (spaces.length === 0) {
          setTasks([]);
          return;
        }
        const promises = spaces.map(s => tasksApi.list({ projectId: s.id }));
        const results = await Promise.all(promises);
        const allTasks = results.flat().filter(t => !t.isDeleted).map(t => ({
          ...t,
          spaceId: t.projectId
        }));
        setTasks(allTasks);
      } else {
        const tList = await tasksApi.list({ projectId: activeSpaceId });
        const activeTasks = tList.filter(t => !t.isDeleted).map(t => ({
          ...t,
          spaceId: t.projectId
        }));
        setTasks(activeTasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  },

  cycleSpaceColor: (spaceId, currentColor) => {
    const colors = ['#7c3aed', '#ff6b6b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
    const currentIndex = colors.indexOf(currentColor);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    get().setSpaces(prev => prev.map(s => s.id === spaceId ? { ...s, color: nextColor } : s));
  },

  updateTaskStatus: async (taskId, newStatus) => {
    try {
      get().setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await tasksApi.update(taskId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  },

  sendChatMessage: () => {
    const { typedMessage, setChatMessages, setTypedMessage } = get();
    if (!typedMessage.trim()) return;

    const newUserMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Hoang Bang Giang',
      role: 'Member',
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'H'
    };

    setChatMessages(prev => [...prev, newUserMsg]);
    setTypedMessage('');

    setTimeout(() => {
      const botResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'Project Manager',
        role: 'Project Manager',
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'P'
      };
      get().setChatMessages(prev => [...prev, botResponse]);
    }, 1200);
  },

  prevMonth: () => {
    get().setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  },

  nextMonth: () => {
    get().setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }
}));
