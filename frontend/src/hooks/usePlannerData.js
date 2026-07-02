import { useState, useEffect } from 'react';
import { workspacesApi, projectsApi, tasksApi } from '../services/api';

export function usePlannerData(userDisplayName) {
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [activeSpaceId, setActiveSpaceId] = useState('home');
  const [workspaceName, setWorkspaceName] = useState(`${userDisplayName}'s Workspace`);
  const [tasks, setTasks] = useState([]);

  // Sync active space to localStorage
  useEffect(() => {
    localStorage.setItem('yobid_active_space', String(activeSpaceId));
  }, [activeSpaceId]);

  // Fetch Workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
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
          localStorage.setItem('yobid_active_workspace_id', workspaceToSelect.id);
        } else {
          const newWs = await workspacesApi.create({
            name: `${userDisplayName}'s Workspace`,
            slug: `workspace-${Date.now()}`
          });
          setWorkspaces([newWs]);
          setActiveWorkspaceId(newWs.id);
          setWorkspaceName(newWs.name);
          localStorage.setItem('yobid_active_workspace_id', newWs.id);
        }
      } catch (err) {
        console.error('Error fetching workspaces:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, [userDisplayName]);

  // Fetch Projects/Spaces
  useEffect(() => {
    const fetchProjects = async () => {
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
    };
    fetchProjects();
  }, [activeWorkspaceId]);

  // Fetch Tasks
  useEffect(() => {
    const fetchTasks = async () => {
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
    };
    fetchTasks();
  }, [activeWorkspaceId, activeSpaceId, spaces]);

  return {
    loading, setLoading,
    workspaces, setWorkspaces,
    activeWorkspaceId, setActiveWorkspaceId,
    spaces, setSpaces,
    activeSpaceId, setActiveSpaceId,
    workspaceName, setWorkspaceName,
    tasks, setTasks
  };
}
