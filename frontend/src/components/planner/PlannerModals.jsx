import React from 'react';
import TaskModal from './TaskModal';
import EpicModal from './EpicModal';
import SprintModal from './SprintModal';
import SpaceModal from './SpaceModal';
import ConfirmModals from './ConfirmModals';

export default function PlannerModals({
  // Modals visibility state
  showTaskModal, setShowTaskModal,
  showEpicModal, setShowEpicModal,
  showSprintModal, setShowSprintModal,
  showSpaceModal, setShowSpaceModal,
  showDeleteSpaceModal, setShowDeleteSpaceModal,
  showRenameSpaceModal, setShowRenameSpaceModal,
  showRenameWorkspaceModal, setShowRenameWorkspaceModal,
  showDeleteTaskModal, setShowDeleteTaskModal,

  // Lists/Metadata
  epics, sprints,
  spaceToDelete, spaceToRename, taskToDelete,

  // Handlers/Callbacks
  handleCreateTask,
  handleCreateEpic,
  handleCreateSprint,
  handleCreateSpace,
  confirmDeleteSpace,
  confirmRenameSpace,
  confirmRenameWorkspace,
  confirmDeleteTask,

  // Task Form fields & setters
  taskTitle, setTaskTitle,
  taskDesc, setTaskDesc,
  taskPriority, setTaskPriority,
  taskStatus, setTaskStatus,
  taskEpic, setTaskEpic,
  taskSprint, setTaskSprint,
  taskDeadline, setTaskDeadline,

  // Epic Form fields & setters
  epicName, setEpicName,
  epicDesc, setEpicDesc,
  epicColor, setEpicColor,

  // Sprint Form fields & setters
  sprintName, setSprintName,
  sprintStart, setSprintStart,
  sprintEnd, setSprintEnd,
  sprintStatus, setSprintStatus,

  // Space Form fields & setters
  spaceName, setSpaceName,
  spaceColor, setSpaceColor,

  // Temporary Rename fields & setters
  tempSpaceName, setTempSpaceName,
  tempWorkspaceName, setTempWorkspaceName
}) {
  return (
    <>
      <TaskModal
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        epics={epics}
        sprints={sprints}
        handleCreateTask={handleCreateTask}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDesc={taskDesc}
        setTaskDesc={setTaskDesc}
        taskPriority={taskPriority}
        setTaskPriority={setTaskPriority}
        taskStatus={taskStatus}
        setTaskStatus={setTaskStatus}
        taskEpic={taskEpic}
        setTaskEpic={setTaskEpic}
        taskSprint={taskSprint}
        setTaskSprint={setTaskSprint}
        taskDeadline={taskDeadline}
        setTaskDeadline={setTaskDeadline}
      />

      <EpicModal
        showEpicModal={showEpicModal}
        setShowEpicModal={setShowEpicModal}
        handleCreateEpic={handleCreateEpic}
        epicName={epicName}
        setEpicName={setEpicName}
        epicDesc={epicDesc}
        setEpicDesc={setEpicDesc}
        epicColor={epicColor}
        setEpicColor={setEpicColor}
      />

      <SprintModal
        showSprintModal={showSprintModal}
        setShowSprintModal={setShowSprintModal}
        handleCreateSprint={handleCreateSprint}
        sprintName={sprintName}
        setSprintName={setSprintName}
        sprintStart={sprintStart}
        setSprintStart={setSprintStart}
        sprintEnd={sprintEnd}
        setSprintEnd={setSprintEnd}
        sprintStatus={sprintStatus}
        setSprintStatus={setSprintStatus}
      />

      <SpaceModal
        showSpaceModal={showSpaceModal}
        setShowSpaceModal={setShowSpaceModal}
        handleCreateSpace={handleCreateSpace}
        spaceName={spaceName}
        setSpaceName={setSpaceName}
        spaceColor={spaceColor}
        setSpaceColor={setSpaceColor}
      />

      <ConfirmModals
        showDeleteSpaceModal={showDeleteSpaceModal}
        setShowDeleteSpaceModal={setShowDeleteSpaceModal}
        showRenameSpaceModal={showRenameSpaceModal}
        setShowRenameSpaceModal={setShowRenameSpaceModal}
        showRenameWorkspaceModal={showRenameWorkspaceModal}
        setShowRenameWorkspaceModal={setShowRenameWorkspaceModal}
        showDeleteTaskModal={showDeleteTaskModal}
        setShowDeleteTaskModal={setShowDeleteTaskModal}
        spaceToDelete={spaceToDelete}
        spaceToRename={spaceToRename}
        taskToDelete={taskToDelete}
        confirmDeleteSpace={confirmDeleteSpace}
        confirmRenameSpace={confirmRenameSpace}
        confirmRenameWorkspace={confirmRenameWorkspace}
        confirmDeleteTask={confirmDeleteTask}
        tempSpaceName={tempSpaceName}
        setTempSpaceName={setTempSpaceName}
        tempWorkspaceName={tempWorkspaceName}
        setTempWorkspaceName={setTempWorkspaceName}
      />
    </>
  );
}
