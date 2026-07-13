import { useEffect } from 'react';
import { usePlannerStore } from './usePlannerStore';

export function usePlannerData(userDisplayName) {
  const store = usePlannerStore();

  // Fetch Workspaces on mount
  useEffect(() => {
    store.fetchWorkspaces(userDisplayName);
  }, [userDisplayName]);

  // Fetch Projects/Spaces
  useEffect(() => {
    store.fetchSpaces();
  }, [store.activeWorkspaceId]);

  const spaceIdsKey = JSON.stringify(store.spaces.map(s => s.id));

  // Fetch Tasks
  useEffect(() => {
    store.fetchTasks();
  }, [store.activeWorkspaceId, store.activeSpaceId, spaceIdsKey]);

  return {
    loading: store.loading,
    setLoading: store.setLoading,
    workspaces: store.workspaces,
    setWorkspaces: store.setWorkspaces,
    activeWorkspaceId: store.activeWorkspaceId,
    setActiveWorkspaceId: store.setActiveWorkspaceId,
    spaces: store.spaces,
    setSpaces: store.setSpaces,
    activeSpaceId: store.activeSpaceId,
    setActiveSpaceId: store.setActiveSpaceId,
    workspaceName: store.workspaceName,
    setWorkspaceName: store.setWorkspaceName,
    tasks: store.tasks,
    setTasks: store.setTasks
  };
}
