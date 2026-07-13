import { useEffect, useRef, useCallback } from 'react';
import { usePlannerData } from './usePlannerData';
import { usePlannerBoardModals } from './usePlannerBoardModals';
import { usePlannerStore } from './usePlannerStore';

export function usePlannerBoard(userDisplayName, onStateChange) {
  const data = usePlannerData(userDisplayName);
  const store = usePlannerStore();

  const chatScrollerRef = useRef(null);

  // Close space settings dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      store.setActiveMenuSpaceId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const activeSpaceName = data.activeSpaceId === 'home' ? 'Home' : (data.spaces.find(s => s.id === data.activeSpaceId)?.name || 'Workspace');

  // Sync to parent breadcrumbs
  useEffect(() => {
    if (onStateChange) {
      onStateChange(activeSpaceName, data.activeSpaceId === 'home' ? '' : store.activeTab);
    }
  }, [activeSpaceName, store.activeTab, data.activeSpaceId, onStateChange]);

  const modals = usePlannerBoardModals(data, store.epics, store.setEpics, store.sprints, store.setSprints);

  const handleCycleSpaceColor = useCallback((spaceId, currentColor) => {
    store.cycleSpaceColor(spaceId, currentColor);
  }, [store]);

  const handleUpdateTaskStatus = useCallback(async (taskId, newStatus) => {
    await store.updateTaskStatus(taskId, newStatus);
  }, [store]);

  const handleSendChatMessage = useCallback((e) => {
    e.preventDefault();
    store.sendChatMessage();
  }, [store]);

  const prevMonth = useCallback(() => {
    store.prevMonth();
  }, [store]);

  const nextMonth = useCallback(() => {
    store.nextMonth();
  }, [store]);

  return {
    ...data,
    ...modals,
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    activeMenuSpaceId: store.activeMenuSpaceId,
    setActiveMenuSpaceId: store.setActiveMenuSpaceId,
    epics: store.epics,
    setEpics: store.setEpics,
    sprints: store.sprints,
    setSprints: store.setSprints,
    chatMessages: store.chatMessages,
    setChatMessages: store.setChatMessages,
    typedMessage: store.typedMessage,
    setTypedMessage: store.setTypedMessage,
    chatScrollerRef,
    currentDate: store.currentDate,
    setCurrentDate: store.setCurrentDate,
    handleCycleSpaceColor,
    handleUpdateTaskStatus,
    handleSendChatMessage,
    prevMonth,
    nextMonth
  };
}
