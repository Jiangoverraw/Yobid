import { create } from 'zustand';

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getNextWeekStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

export const usePlannerModalsStore = create((set) => ({
  showDeleteSpaceModal: false,
  spaceToDelete: null,
  showRenameSpaceModal: false,
  spaceToRename: null,
  tempSpaceName: '',
  showRenameWorkspaceModal: false,
  tempWorkspaceName: '',
  showDeleteTaskModal: false,
  taskToDelete: null,

  showTaskModal: false,
  showEpicModal: false,
  showSprintModal: false,
  showSpaceModal: false,

  taskTitle: '',
  taskDesc: '',
  taskPriority: 'MEDIUM',
  taskStatus: 'TODO',
  taskEpic: '',
  taskSprint: '',
  taskDeadline: getTodayStr(),

  epicName: '',
  epicDesc: '',
  epicColor: '#7c3aed',

  sprintName: '',
  sprintStart: getTodayStr(),
  sprintEnd: getNextWeekStr(),
  sprintStatus: 'planned',

  spaceName: '',
  spaceColor: '#7c3aed',

  setShowDeleteSpaceModal: (showDeleteSpaceModal) => set({ showDeleteSpaceModal }),
  setSpaceToDelete: (spaceToDelete) => set({ spaceToDelete }),
  setShowRenameSpaceModal: (showRenameSpaceModal) => set({ showRenameSpaceModal }),
  setSpaceToRename: (spaceToRename) => set({ spaceToRename }),
  setTempSpaceName: (tempSpaceName) => set({ tempSpaceName }),
  setShowRenameWorkspaceModal: (showRenameWorkspaceModal) => set({ showRenameWorkspaceModal }),
  setTempWorkspaceName: (tempWorkspaceName) => set({ tempWorkspaceName }),
  setShowDeleteTaskModal: (showDeleteTaskModal) => set({ showDeleteTaskModal }),
  setTaskToDelete: (taskToDelete) => set({ taskToDelete }),

  setShowTaskModal: (showTaskModal) => set({ showTaskModal }),
  setShowEpicModal: (showEpicModal) => set({ showEpicModal }),
  setShowSprintModal: (showSprintModal) => set({ showSprintModal }),
  setShowSpaceModal: (showSpaceModal) => set({ showSpaceModal }),

  setTaskTitle: (taskTitle) => set({ taskTitle }),
  setTaskDesc: (taskDesc) => set({ taskDesc }),
  setTaskPriority: (taskPriority) => set({ taskPriority }),
  setTaskStatus: (taskStatus) => set({ taskStatus }),
  setTaskEpic: (taskEpic) => set({ taskEpic }),
  setTaskSprint: (taskSprint) => set({ taskSprint }),
  setTaskDeadline: (taskDeadline) => set({ taskDeadline }),

  setEpicName: (epicName) => set({ epicName }),
  setEpicDesc: (epicDesc) => set({ epicDesc }),
  setEpicColor: (epicColor) => set({ epicColor }),

  setSprintName: (sprintName) => set({ sprintName }),
  setSprintStart: (sprintStart) => set({ sprintStart }),
  setSprintEnd: (sprintEnd) => set({ sprintEnd }),
  setSprintStatus: (sprintStatus) => set({ sprintStatus }),

  setSpaceName: (spaceName) => set({ spaceName }),
  setSpaceColor: (spaceColor) => set({ spaceColor }),
}));
