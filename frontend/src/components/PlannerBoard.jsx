import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlannerBoard } from '../hooks/usePlannerBoard';

// Subcomponents
import PlannerSidebar from './planner/PlannerSidebar';
import PlannerHeader from './planner/PlannerHeader';
import WorkspaceHomeView from './planner/WorkspaceHomeView';
import ChatView from './planner/ChatView';
import ListView from './planner/ListView';
import BoardView from './planner/BoardView';
import CalendarView from './planner/CalendarView';
import PlannerModals from './planner/PlannerModals';

export default function PlannerBoard(props) {
  const { user } = useAuth();
  const userDisplayName = user?.name || user?.email?.split('@')[0] || 'User';
  
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const board = usePlannerBoard(userDisplayName, props.onStateChange);

  // Send workspace info back up to Dashboard.jsx topbar
  useEffect(() => {
    if (props.onWorkspaceInfo) {
      props.onWorkspaceInfo({
        name: board.workspaceName,
        onRename: board.handleRenameWorkspace
      });
    }
  }, [board.workspaceName, board.handleRenameWorkspace, props.onWorkspaceInfo]);

  // Capitalize Tab names for display
  const tabDisplayLabel = board.activeTab.charAt(0).toUpperCase() + board.activeTab.slice(1);

  // Filtering Tasks by Selected Space
  const filteredTasks = board.tasks.filter(t => {
    const taskSpace = t.spaceId || 'space-default';
    return taskSpace === board.activeSpaceId;
  });

  const activeSpace = board.activeSpaceId === 'home'
    ? { name: 'Workspace Home', color: '#7c3aed' }
    : (board.spaces.find(s => s.id === board.activeSpaceId) || { name: 'Workspace', color: '#7c3aed' });

  return (
    <div className="planner-layout">
      {/* Left Workspace Sidebar */}
      <PlannerSidebar
        workspaceName={board.workspaceName}
        handleRenameWorkspace={board.handleRenameWorkspace}
        activeSpaceId={board.activeSpaceId}
        setActiveSpaceId={board.setActiveSpaceId}
        spaces={board.spaces}
        activeMenuSpaceId={board.activeMenuSpaceId}
        setActiveMenuSpaceId={board.setActiveMenuSpaceId}
        handleRenameSpace={board.handleRenameSpace}
        handleCycleSpaceColor={board.handleCycleSpaceColor}
        handleDeleteSpace={board.handleDeleteSpace}
        activeTab={board.activeTab}
        setActiveTab={board.setActiveTab}
        setSpaceName={board.setSpaceName}
        setShowSpaceModal={board.setShowSpaceModal}
      />

      {/* Right Main Space Container */}
      <div className="planner-main-content">
        <PlannerHeader
          activeSpaceId={board.activeSpaceId}
          activeSpace={activeSpace}
          activeTab={board.activeTab}
          setActiveTab={board.setActiveTab}
          tabDisplayLabel={tabDisplayLabel}
          openNewTaskModal={board.openNewTaskModal}
        />

        <div className="planner-content-area">
          {board.activeSpaceId === 'home' && (
            <WorkspaceHomeView
              greeting={greeting}
              userDisplayName={userDisplayName}
              tasks={board.tasks}
              spaces={board.spaces}
              setActiveSpaceId={board.setActiveSpaceId}
              openNewTaskModal={board.openNewTaskModal}
              handleUpdateTaskStatus={board.handleUpdateTaskStatus}
              handleDeleteTask={board.handleDeleteTask}
            />
          )}

          {board.activeSpaceId !== 'home' && board.activeTab === 'chat' && (
            <ChatView
              activeSpace={activeSpace}
              chatMessages={board.chatMessages}
              typedMessage={board.typedMessage}
              setTypedMessage={board.setTypedMessage}
              handleSendChatMessage={board.handleSendChatMessage}
              chatScrollerRef={board.chatScrollerRef}
            />
          )}

          {board.activeSpaceId !== 'home' && board.activeTab === 'list' && (
            <ListView
              filteredTasks={filteredTasks}
              epics={board.epics}
              openNewTaskModal={board.openNewTaskModal}
              handleUpdateTaskStatus={board.handleUpdateTaskStatus}
              handleDeleteTask={board.handleDeleteTask}
              setShowEpicModal={board.setShowEpicModal}
              setShowSprintModal={board.setShowSprintModal}
            />
          )}

          {board.activeSpaceId !== 'home' && board.activeTab === 'board' && (
            <BoardView
              filteredTasks={filteredTasks}
              epics={board.epics}
              openNewTaskModal={board.openNewTaskModal}
              handleUpdateTaskStatus={board.handleUpdateTaskStatus}
              handleDeleteTask={board.handleDeleteTask}
            />
          )}

          {board.activeSpaceId !== 'home' && board.activeTab === 'calendar' && (
            <CalendarView
              currentDate={board.currentDate}
              prevMonth={board.prevMonth}
              nextMonth={board.nextMonth}
              filteredTasks={filteredTasks}
              epics={board.epics}
              openNewTaskModal={board.openNewTaskModal}
            />
          )}
        </div>
      </div>

      {/* Centered Modals */}
      <PlannerModals
        showTaskModal={board.showTaskModal}
        setShowTaskModal={board.setShowTaskModal}
        showEpicModal={board.showEpicModal}
        setShowEpicModal={board.setShowEpicModal}
        showSprintModal={board.showSprintModal}
        setShowSprintModal={board.setShowSprintModal}
        showSpaceModal={board.showSpaceModal}
        setShowSpaceModal={board.setShowSpaceModal}
        showDeleteSpaceModal={board.showDeleteSpaceModal}
        setShowDeleteSpaceModal={board.setShowDeleteSpaceModal}
        showRenameSpaceModal={board.showRenameSpaceModal}
        setShowRenameSpaceModal={board.setShowRenameSpaceModal}
        showRenameWorkspaceModal={board.showRenameWorkspaceModal}
        setShowRenameWorkspaceModal={board.setShowRenameWorkspaceModal}
        showDeleteTaskModal={board.showDeleteTaskModal}
        setShowDeleteTaskModal={board.setShowDeleteTaskModal}
        epics={board.epics}
        sprints={board.sprints}
        spaceToDelete={board.spaceToDelete}
        spaceToRename={board.spaceToRename}
        taskToDelete={board.taskToDelete}
        handleCreateTask={board.handleCreateTask}
        handleCreateEpic={board.handleCreateEpic}
        handleCreateSprint={board.handleCreateSprint}
        handleCreateSpace={board.handleCreateSpace}
        confirmDeleteSpace={board.confirmDeleteSpace}
        confirmRenameSpace={board.confirmRenameSpace}
        confirmRenameWorkspace={board.confirmRenameWorkspace}
        confirmDeleteTask={board.confirmDeleteTask}
        taskTitle={board.taskTitle}
        setTaskTitle={board.setTaskTitle}
        taskDesc={board.taskDesc}
        setTaskDesc={board.setTaskDesc}
        taskPriority={board.taskPriority}
        setTaskPriority={board.setTaskPriority}
        taskStatus={board.taskStatus}
        setTaskStatus={board.setTaskStatus}
        taskEpic={board.taskEpic}
        setTaskEpic={board.setTaskEpic}
        taskSprint={board.taskSprint}
        setTaskSprint={board.setTaskSprint}
        taskDeadline={board.taskDeadline}
        setTaskDeadline={board.setTaskDeadline}
        epicName={board.epicName}
        setEpicName={board.setEpicName}
        epicDesc={board.epicDesc}
        setEpicDesc={board.setEpicDesc}
        epicColor={board.epicColor}
        setEpicColor={board.setEpicColor}
        sprintName={board.sprintName}
        setSprintName={board.setSprintName}
        sprintStart={board.sprintStart}
        setSprintStart={board.setSprintStart}
        sprintEnd={board.sprintEnd}
        setSprintEnd={board.setSprintEnd}
        sprintStatus={board.sprintStatus}
        setSprintStatus={board.setSprintStatus}
        spaceName={board.spaceName}
        setSpaceName={board.setSpaceName}
        spaceColor={board.spaceColor}
        setSpaceColor={board.setSpaceColor}
        tempSpaceName={board.tempSpaceName}
        setTempSpaceName={board.setTempSpaceName}
        tempWorkspaceName={board.tempWorkspaceName}
        setTempWorkspaceName={board.setTempWorkspaceName}
      />
    </div>
  );
}
