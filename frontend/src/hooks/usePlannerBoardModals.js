import { useCallback } from 'react';
import { workspacesApi, projectsApi, tasksApi } from '../services/api';
import { usePlannerModalsStore } from './usePlannerModalsStore';

const getTodayStr = () => new Date().toISOString().split('T')[0];

export function usePlannerBoardModals(data, epics, setEpics, sprints, setSprints) {
  const store = usePlannerModalsStore();

  const handleRenameWorkspace = useCallback(() => {
    store.setTempWorkspaceName(data.workspaceName);
    store.setShowRenameWorkspaceModal(true);
  }, [data.workspaceName, store]);

  const confirmRenameWorkspace = async (e) => {
    e.preventDefault();
    if (!store.tempWorkspaceName.trim() || !data.activeWorkspaceId) return;
    try {
      await workspacesApi.update(data.activeWorkspaceId, { name: store.tempWorkspaceName.trim() });
      data.setWorkspaceName(store.tempWorkspaceName.trim());
      data.setWorkspaces(data.workspaces.map(w => w.id === data.activeWorkspaceId ? { ...w, name: store.tempWorkspaceName.trim() } : w));
      store.setShowRenameWorkspaceModal(false);
    } catch (err) {
      alert(`Error renaming workspace: ${err.message}`);
    }
  };

  const openNewTaskModal = (presetDate = getTodayStr(), presetStatus = 'TODO') => {
    store.setTaskDeadline(presetDate);
    store.setTaskStatus(presetStatus);
    store.setTaskTitle('');
    store.setTaskDesc('');
    store.setTaskPriority('MEDIUM');
    store.setTaskEpic(epics[0]?.id || '');
    store.setTaskSprint(sprints[0]?.id || '');
    store.setShowTaskModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!store.taskTitle.trim()) return;

    const targetProjectId = data.activeSpaceId === 'home' ? (data.spaces[0]?.id) : data.activeSpaceId;
    if (!targetProjectId) {
      alert('Please select or create a Space before creating a task.');
      return;
    }

    try {
      const createdTask = await tasksApi.create({
        title: store.taskTitle.trim(),
        description: store.taskDesc.trim() || undefined,
        priority: store.taskPriority,
        status: store.taskStatus,
        projectId: Number(targetProjectId),
        deadline: store.taskDeadline ? new Date(store.taskDeadline).toISOString() : undefined,
      });

      const newTask = {
        ...createdTask,
        spaceId: createdTask.projectId
      };

      data.setTasks([...data.tasks, newTask]);
      store.setShowTaskModal(false);
      store.setTaskTitle('');
      store.setTaskDesc('');
    } catch (err) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const handleCreateEpic = (e) => {
    e.preventDefault();
    if (!store.epicName.trim()) return;

    const newEpic = {
      id: `epic-${Date.now()}`,
      name: store.epicName,
      description: store.epicDesc,
      color: store.epicColor
    };

    setEpics([...epics, newEpic]);
    store.setShowEpicModal(false);
    store.setEpicName('');
    store.setEpicDesc('');
  };

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (!store.sprintName.trim()) return;

    const newSprint = {
      id: `sprint-${Date.now()}`,
      name: store.sprintName,
      startDate: store.sprintStart,
      endDate: store.sprintEnd,
      status: store.sprintStatus
    };

    setSprints([...sprints, newSprint]);
    store.setShowSprintModal(false);
    store.setSprintName('');
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!store.spaceName.trim() || !data.activeWorkspaceId) return;

    try {
      const newProj = await projectsApi.create({
        name: store.spaceName.trim(),
        workspaceId: data.activeWorkspaceId
      });
      const colors = ['#7c3aed', '#ff6b6b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
      const nextColor = colors[data.spaces.length % colors.length];
      const newSpace = {
        id: newProj.id,
        name: newProj.name,
        color: nextColor
      };

      data.setSpaces([...data.spaces, newSpace]);
      data.setActiveSpaceId(newProj.id);
      localStorage.setItem('yobid_active_space', String(newProj.id));
      store.setShowSpaceModal(false);
      store.setSpaceName('');
    } catch (err) {
      alert(`Error creating space: ${err.message}`);
    }
  };

  const handleDeleteSpace = (spaceId, name, e) => {
    if (e) e.stopPropagation();
    const space = data.spaces.find(s => s.id === spaceId);
    if (space) {
      store.setSpaceToDelete(space);
      store.setShowDeleteSpaceModal(true);
    }
  };

  const confirmDeleteSpace = async () => {
    if (!store.spaceToDelete) return;
    const spaceId = store.spaceToDelete.id;
    try {
      await projectsApi.remove(spaceId);
      data.setSpaces(data.spaces.filter(s => s.id !== spaceId));
      data.setTasks(data.tasks.filter(t => t.spaceId !== spaceId));
      if (data.activeSpaceId === spaceId) {
        data.setActiveSpaceId('home');
        localStorage.setItem('yobid_active_space', 'home');
      }
      store.setShowDeleteSpaceModal(false);
      store.setSpaceToDelete(null);
    } catch (err) {
      alert(`Error deleting space: ${err.message}`);
    }
  };

  const handleRenameSpace = (spaceId, currentName) => {
    const space = data.spaces.find(s => s.id === spaceId);
    if (space) {
      store.setSpaceToRename(space);
      store.setTempSpaceName(currentName);
      store.setShowRenameSpaceModal(true);
    }
  };

  const confirmRenameSpace = async (e) => {
    e.preventDefault();
    if (!store.spaceToRename || !store.tempSpaceName.trim()) return;
    try {
      await projectsApi.update(store.spaceToRename.id, { name: store.tempSpaceName.trim() });
      data.setSpaces(data.spaces.map(s => s.id === store.spaceToRename.id ? { ...s, name: store.tempSpaceName.trim() } : s));
      store.setShowRenameSpaceModal(false);
      store.setSpaceToRename(null);
    } catch (err) {
      alert(`Error renaming space: ${err.message}`);
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
      store.setTaskToDelete(task);
      store.setShowDeleteTaskModal(true);
    }
  };

  const confirmDeleteTask = async () => {
    if (!store.taskToDelete) return;
    try {
      await tasksApi.remove(store.taskToDelete.id);
      data.setTasks(data.tasks.filter(t => t.id !== store.taskToDelete.id));
      store.setShowDeleteTaskModal(false);
      store.setTaskToDelete(null);
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  return {
    showDeleteSpaceModal: store.showDeleteSpaceModal,
    setShowDeleteSpaceModal: store.setShowDeleteSpaceModal,
    spaceToDelete: store.spaceToDelete,
    setSpaceToDelete: store.setSpaceToDelete,
    showRenameSpaceModal: store.showRenameSpaceModal,
    setShowRenameSpaceModal: store.setShowRenameSpaceModal,
    spaceToRename: store.spaceToRename,
    setSpaceToRename: store.setSpaceToRename,
    tempSpaceName: store.tempSpaceName,
    setTempSpaceName: store.setTempSpaceName,
    showRenameWorkspaceModal: store.showRenameWorkspaceModal,
    setShowRenameWorkspaceModal: store.setShowRenameWorkspaceModal,
    tempWorkspaceName: store.tempWorkspaceName,
    setTempWorkspaceName: store.setTempWorkspaceName,
    showDeleteTaskModal: store.showDeleteTaskModal,
    setShowDeleteTaskModal: store.setShowDeleteTaskModal,
    taskToDelete: store.taskToDelete,
    setTaskToDelete: store.setTaskToDelete,
    showTaskModal: store.showTaskModal,
    setShowTaskModal: store.setShowTaskModal,
    showEpicModal: store.showEpicModal,
    setShowEpicModal: store.setShowEpicModal,
    showSprintModal: store.showSprintModal,
    setShowSprintModal: store.setShowSprintModal,
    showSpaceModal: store.showSpaceModal,
    setShowSpaceModal: store.setShowSpaceModal,
    taskTitle: store.taskTitle,
    setTaskTitle: store.setTaskTitle,
    taskDesc: store.taskDesc,
    setTaskDesc: store.setTaskDesc,
    taskPriority: store.taskPriority,
    setTaskPriority: store.setTaskPriority,
    taskStatus: store.taskStatus,
    setTaskStatus: store.setTaskStatus,
    taskEpic: store.taskEpic,
    setTaskEpic: store.setTaskEpic,
    taskSprint: store.taskSprint,
    setTaskSprint: store.setTaskSprint,
    taskDeadline: store.taskDeadline,
    setTaskDeadline: store.setTaskDeadline,
    epicName: store.epicName,
    setEpicName: store.setEpicName,
    epicDesc: store.epicDesc,
    setEpicDesc: store.setEpicDesc,
    epicColor: store.epicColor,
    setEpicColor: store.setEpicColor,
    sprintName: store.sprintName,
    setSprintName: store.setSprintName,
    sprintStart: store.sprintStart,
    setSprintStart: store.setSprintStart,
    sprintEnd: store.sprintEnd,
    setSprintEnd: store.setSprintEnd,
    sprintStatus: store.sprintStatus,
    setSprintStatus: store.setSprintStatus,
    spaceName: store.spaceName,
    setSpaceName: store.setSpaceName,
    spaceColor: store.spaceColor,
    setSpaceColor: store.setSpaceColor,
    handleRenameWorkspace, confirmRenameWorkspace,
    openNewTaskModal, handleCreateTask,
    handleCreateEpic, handleCreateSprint, handleCreateSpace,
    handleDeleteSpace, confirmDeleteSpace,
    handleRenameSpace, confirmRenameSpace,
    handleDeleteTask, confirmDeleteTask
  };
}
