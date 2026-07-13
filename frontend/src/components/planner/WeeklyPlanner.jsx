import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PlannerLeftPanel from './PlannerLeftPanel';
import PlannerCalendar from './PlannerCalendar';

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? 'PM' : 'AM';
  const displayHour = i % 12 === 0 ? 12 : i % 12;
  return `${displayHour} ${ampm}`;
});

const WeeklyPlanner = function WeeklyPlanner() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('yobid_weekly_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(e => e.id === 1 && e.title === 'Team Sync & Standup')) {
          return [];
        }
        return parsed;
      } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('yobid_weekly_events', JSON.stringify(events));
  }, [events]);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    return start;
  });

  const weekDays = useMemo(() => {
    const today = new Date();
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(currentWeekStart.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      return {
        name: names[i],
        date: d.getDate().toString(),
        fullDate: d,
        isToday
      };
    });
  }, [currentWeekStart]);

  const handlePrevWeek = useCallback(() => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 7);
      return d;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 7);
      return d;
    });
  }, []);

  const handleToday = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
    setCurrentWeekStart(start);
  }, []);

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedSlot, setSelectedSlot] = useState({ hour: 9, dayIndex: 5 });

  const handleCellClick = useCallback((hour, dayIndex) => {
    setSelectedSlot({ hour, dayIndex });
    setNewEventTitle('');
    setShowAddEventModal(true);
  }, []);

  const handleAddEvent = useCallback((e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const newEvent = {
      id: Date.now(),
      title: newEventTitle,
      hour: selectedSlot.hour,
      dayIndex: selectedSlot.dayIndex,
      duration: 1,
      color: ['#7c3aed', '#10b981', '#06b6d4', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)]
    };
    setEvents(prev => [...prev, newEvent]);
    setShowAddEventModal(false);
  }, [newEventTitle, selectedSlot]);

  const handleDeleteEvent = useCallback((eventId) => {
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
  }, []);

  const selectedDayName = weekDays[selectedSlot.dayIndex]?.name || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedSlot.dayIndex];

  return (
    <>
      {/* Split Layout */}
      <div className="planner-layout">
        <PlannerLeftPanel />
        <PlannerCalendar
          events={events}
          weekDays={weekDays}
          currentWeekStart={currentWeekStart}
          onCellClick={handleCellClick}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onToday={handleToday}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <form onSubmit={handleAddEvent} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
              Add Scheduled Task at {HOURS[selectedSlot.hour]} ({selectedDayName})
            </h3>
            <input
              type="text"
              placeholder="Task title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              autoFocus
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', marginBottom: '1.25rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                style={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#64748b', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', color: '#fff', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default React.memo(WeeklyPlanner);
