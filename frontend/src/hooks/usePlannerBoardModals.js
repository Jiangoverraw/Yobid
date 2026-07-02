import { useState } from 'react';
import { workspacesApi, projectsApi, tasksApi } from '../services/api';

export function usePlannerBoardModals(data, epics, setEpics, sprints, setSprints) {
  // Modals visibility
  const [showDeleteSpaceModal, setShowDeleteSpaceModal] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  const [showRenameSpaceModal, setShowRenameSpaceModal] = useState(false);
  const [spaceToRename, setSpaceToRename] = useState(null);
  const [tempSpaceName, setTempSpaceName] = useState('');
  const [showRenameWorkspaceModal, setShowRenameWorkspaceModal] = useState(false);
  const [tempWorkspaceName, setTempWorkspaceName] = useState('');
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEpicModal, setShowEpicModal] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskStatus, setTaskStatus] = useState('TODO');
  const [taskEpic, setTaskEpic] = useState('');
  const [taskSprint, setTaskSprint] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('2026-06-23');

  const [epicName, setEpicName] = useState('');
  const [epicDesc, setEpicDesc] = useState('');
  const [epicColor, setEpicColor] = useState('#7c3aed');

  const [sprintName, setSprintName] = useState('');
  const [sprintStart, setSprintStart] = useState('2026-06-23');
  const [sprintEnd, setSprintEnd] = useState('2026-06-30');
  const [sprintStatus, setSprintStatus] = useState('planned');

  const [spaceName, setSpaceName] = useState('');
  const [spaceColor, setSpaceColor] = useState('#7c3aed');

  const handleRenameWorkspace = () => {
    setTempWorkspaceName(data.workspaceName);
    setShowRenameWorkspaceModal(true);
  };

  const confirmRenameWorkspace = async (e) => {
    e.preventDefault();
    if (!tempWorkspaceName.trim() || !data.activeWorkspaceId) return;
    try {
      await workspacesApi.update(data.activeWorkspaceId, { name: tempWorkspaceName.trim() });
      data.setWorkspaceName(tempWorkspaceName.trim());
      data.setWorkspaces(data.workspaces.map(w => w.id === data.activeWorkspaceId ? { ...w, name: tempWorkspaceName.trim() } : w));
      setShowRenameWorkspaceModal(false);
    } catch (err) {
      alert(`Error renaming workspace: ${err.message}`);
    }
  };

  const openNewTaskModal = (presetDate = '2026-06-23', presetStatus = 'TODO') => {
    setTaskDeadline(presetDate);
    setTaskStatus(presetStatus);
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('MEDIUM');
    setTaskEpic(epics[0]?.id || '');
    setTaskSprint(sprints[0]?.id || '');
    setShowTaskModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const targetProjectId = data.activeSpaceId === 'home' ? (data.spaces[0]?.id) : data.activeSpaceId;
    if (!targetProjectId) {
      alert('Please select or create a Space before creating a task.');
      return;
    }

    try {
      const createdTask = await tasksApi.create({
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        priority: taskPriority,
        status: taskStatus,
        projectId: Number(targetProjectId),
        deadline: taskDeadline ? new Date(taskDeadline).toISOString() : undefined,
      });

      const newTask = {
        ...createdTask,
        spaceId: createdTask.projectId
      };

      data.setTasks([...data.tasks, newTask]);
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
    } catch (err) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const handleCreateEpic = (e) => {
    e.preventDefault();
    if (!epicName.trim()) return;

    const newEpic = {
      id: `epic-${Date.now()}`,
      name: epicName,
      description: epicDesc,
      color: epicColor
    };

    setEpics([...epics, newEpic]);
    setShowEpicModal(false);
    setEpicName('');
    setEpicDesc('');
  };

  const handleCreateSprint = (e) => {
    e.preventDefault();
    if (!sprintName.trim()) return;

    const newSprint = {
      id: `sprint-${Date.now()}`,
      name: sprintName,
      startDate: sprintStart,
      endDate: sprintEnd,
      status: sprintStatus
    };

    setSprints([...sprints, newSprint]);
    setShowSprintModal(false);
    setSprintName('');
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!spaceName.trim() || !data.activeWorkspaceId) return;

    try {
      const newProj = await projectsApi.create({
        name: spaceName.trim(),
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
      setShowSpaceModal(false);
      setSpaceName('');
    } catch (err) {
      alert(`Error creating space: ${err.message}`);
    }
  };

  const handleDeleteSpace = (spaceId, name, e) => {
    if (e) e.stopPropagation();
    const space = data.spaces.find(s => s.id === spaceId);
    if (space) {
      setSpaceToDelete(space);
      setShowDeleteSpaceModal(true);
    }
  };

  const confirmDeleteSpace = async () => {
    if (!spaceToDelete) return;
    const spaceId = spaceToDelete.id;
    try {
      await projectsApi.remove(spaceId);
      data.setSpaces(data.spaces.filter(s => s.id !== spaceId));
      data.setTasks(data.tasks.filter(t => t.spaceId !== spaceId));
      if (data.activeSpaceId === spaceId) {
        data.setActiveSpaceId('home');
        localStorage.setItem('yobid_active_space', 'home');
      }
      setShowDeleteSpaceModal(false);
      setSpaceToDelete(null);
    } catch (err) {
      alert(`Error deleting space: ${err.message}`);
    }
  };

  const handleRenameSpace = (spaceId, currentName) => {
    const space = data.spaces.find(s => s.id === spaceId);
    if (space) {
      setSpaceToRename(space);
      setTempSpaceName(currentName);
      setShowRenameSpaceModal(true);
    }
  };

  const confirmRenameSpace = async (e) => {
    e.preventDefault();
    if (!spaceToRename || !tempSpaceName.trim()) return;
    try {
      await projectsApi.update(spaceToRename.id, { name: tempSpaceName.trim() });
      data.setSpaces(data.spaces.map(s => s.id === spaceToRename.id ? { ...s, name: tempSpaceName.trim() } : s));
      setShowRenameSpaceModal(false);
      setSpaceToRename(null);
    } catch (err) {
      alert(`Error renaming space: ${err.message}`);
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = data.tasks.find(t => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteTaskModal(true);
    }
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await tasksApi.remove(taskToDelete.id);
      data.setTasks(data.tasks.filter(t => t.id !== taskToDelete.id));
      setShowDeleteTaskModal(false);
      setTaskToDelete(null);
    } catch (err) {
      alert(`Error deleting task: ${err.message}`);
    }
  };

  return {
    showDeleteSpaceModal, setShowDeleteSpaceModal,
    spaceToDelete, setSpaceToDelete,
    showRenameSpaceModal, setShowRenameSpaceModal,
    spaceToRename, setSpaceToRename,
    tempSpaceName, setTempSpaceName,
    showRenameWorkspaceModal, setShowRenameWorkspaceModal,
    tempWorkspaceName, setTempWorkspaceName,
    showDeleteTaskModal, setShowDeleteTaskModal,
    taskToDelete, setTaskToDelete,
    showTaskModal, setShowTaskModal,
    showEpicModal, setShowEpicModal,
    showSprintModal, setShowSprintModal,
    showSpaceModal, setShowSpaceModal,
    taskTitle, setTaskTitle,
    taskDesc, setTaskDesc,
    taskPriority, setTaskPriority,
    taskStatus, setTaskStatus,
    taskEpic, setTaskEpic,
    taskSprint, setTaskSprint,
    taskDeadline, setTaskDeadline,
    epicName, setEpicName,
    epicDesc, setEpicDesc,
    epicColor, setEpicColor,
    sprintName, setSprintName,
    sprintStart, setSprintStart,
    sprintEnd, setSprintEnd,
    sprintStatus, setSprintStatus,
    spaceName, setSpaceName,
    spaceColor, setSpaceColor,
    handleRenameWorkspace, confirmRenameWorkspace,
    openNewTaskModal, handleCreateTask,
    handleCreateEpic, handleCreateSprint, handleCreateSpace,
    handleDeleteSpace, confirmDeleteSpace,
    handleRenameSpace, confirmRenameSpace,
    handleDeleteTask, confirmDeleteTask
  };
}
