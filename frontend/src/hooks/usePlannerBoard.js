import { useState, useEffect, useRef } from 'react';
import { tasksApi } from '../services/api';
import { usePlannerData } from './usePlannerData';
import { usePlannerBoardModals } from './usePlannerBoardModals';

const DEFAULT_EPICS = [
  { id: 'epic-1', name: 'Authentication System', description: 'Google, Facebook & X Login integration', color: '#7c3aed' },
  { id: 'epic-2', name: 'Core Storefront', description: 'Product list, Cart & Checkout UI', color: '#10b981' },
];

const DEFAULT_SPRINTS = [
  { id: 'sprint-1', name: 'Sprint 1: Bootstrap & Layout', startDate: '2026-06-20', endDate: '2026-06-27', status: 'active' },
  { id: 'sprint-2', name: 'Sprint 2: Social OAuth', startDate: '2026-06-28', endDate: '2026-07-05', status: 'planned' },
];

const DEFAULT_CHAT = [
  { id: 'msg-1', sender: 'Hoang Bang Giang', role: 'Member', text: 'Chào mọi người! Tôi đã setup xong khung giao diện trên Figma.', time: '10:15 AM', avatar: 'H' },
  { id: 'msg-2', sender: 'Project Manager', role: 'Project Manager', text: 'Tuyệt vời Giang! Chúng ta hãy bám sát Backlog để chạy Sprint 1 nhé.', time: '10:20 AM', avatar: 'P' },
];

const BOT_RESPONSES = [
  "Tôi đã ghi nhận ý kiến của bạn! Tôi sẽ cập nhật trạng thái nhiệm vụ tương ứng.",
  "Đúng vậy, chúng ta cần hoàn thiện Sprint này trước cuối tuần.",
  "Để tôi kiểm tra lại backlog xem còn thiếu tính năng nào không nhé.",
  "Báo cáo rất chi tiết! Mọi người có câu hỏi gì cho phần này không?",
  "Cảm ơn bạn đã cập nhật tiến độ công việc!"
];

export function usePlannerBoard(userDisplayName, onStateChange) {
  const data = usePlannerData(userDisplayName);

  const [activeTab, setActiveTab] = useState('list');
  const [activeMenuSpaceId, setActiveMenuSpaceId] = useState(null);

  // Epics, Sprints, Chat, Calendar
  const [epics, setEpics] = useState(() => {
    const saved = localStorage.getItem('yobid_epics');
    return saved ? JSON.parse(saved) : DEFAULT_EPICS;
  });
  const [sprints, setSprints] = useState(() => {
    const saved = localStorage.getItem('yobid_sprints');
    return saved ? JSON.parse(saved) : DEFAULT_SPRINTS;
  });
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('yobid_chats');
    return saved ? JSON.parse(saved) : DEFAULT_CHAT;
  });
  const [typedMessage, setTypedMessage] = useState('');
  const chatScrollerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 23));

  // Sync epics, sprints, chats to localStorage
  useEffect(() => { localStorage.setItem('yobid_epics', JSON.stringify(epics)); }, [epics]);
  useEffect(() => { localStorage.setItem('yobid_sprints', JSON.stringify(sprints)); }, [sprints]);
  useEffect(() => { localStorage.setItem('yobid_chats', JSON.stringify(chatMessages)); }, [chatMessages]);

  // Close space settings dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuSpaceId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Sync to parent breadcrumbs
  useEffect(() => {
    if (onStateChange) {
      if (data.activeSpaceId === 'home') {
        onStateChange('Home', '');
      } else {
        const space = data.spaces.find(s => s.id === data.activeSpaceId);
        onStateChange(space ? space.name : 'Workspace', activeTab);
      }
    }
  }, [data.activeSpaceId, activeTab, data.spaces, onStateChange]);

  const modals = usePlannerBoardModals(data, epics, setEpics, sprints, setSprints);

  const handleCycleSpaceColor = (spaceId, currentColor) => {
    const colors = ['#7c3aed', '#ff6b6b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
    const currentIndex = colors.indexOf(currentColor);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    data.setSpaces(data.spaces.map(s => s.id === spaceId ? { ...s, color: nextColor } : s));
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      data.setTasks(data.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      await tasksApi.update(taskId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
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
      setChatMessages(prev => [...prev, botResponse]);
    }, 1200);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return {
    ...data,
    ...modals,
    activeTab, setActiveTab,
    activeMenuSpaceId, setActiveMenuSpaceId,
    epics, setEpics,
    sprints, setSprints,
    chatMessages, setChatMessages,
    typedMessage, setTypedMessage,
    chatScrollerRef,
    currentDate, setCurrentDate,
    handleCycleSpaceColor,
    handleUpdateTaskStatus,
    handleSendChatMessage,
    prevMonth, nextMonth
  };
}
