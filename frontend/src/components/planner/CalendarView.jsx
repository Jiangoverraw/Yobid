import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month, 1).getDay();
};

export default function CalendarView({
  currentDate,
  prevMonth,
  nextMonth,
  filteredTasks,
  epics,
  openNewTaskModal
}) {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const cells = [];

  // Empty cells for the padding of the first week
  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`empty-${i}`} className="bg-gray-50/50 p-2 text-gray-400 select-none"></div>
    );
  }

  // Actual day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = day === 23 && month === 5 && year === 2026;
    const dayTasks = filteredTasks.filter(t => t.deadline === dayStr);

    cells.push(
      <div
        key={`day-${day}`}
        onClick={() => openNewTaskModal(dayStr)}
        className="planner-calendar-cell hover:bg-purple-50/30 transition-colors cursor-pointer group relative"
        style={{ backgroundColor: isToday ? '#fffbeb' : '#ffffff' }}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
            isToday ? 'bg-purple-600 text-white shadow-xs' : 'text-gray-800'
          }`}>
            {day}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded-md">
            + Add
          </span>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto max-h-[75px] mt-1.5 pr-1">
          {dayTasks.map(t => {
            const epic = epics.find(e => e.id === t.epicId);
            const dotColor = epic ? epic.color : '#9ca3af';

            return (
              <div
                key={t.id}
                onClick={(e) => { e.stopPropagation(); }}
                className="text-[10px] px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1.5 truncate font-medium text-gray-700 bg-white hover:border-gray-300 shadow-3xs"
                title={`${t.title} [${t.priority}]`}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }}></span>
                <span className="truncate">{t.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-gray-800 text-base">
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
            title="Next Month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          💡 Double click or click on any date cell to quickly add a deadline task!
        </span>
      </div>

      <div className="planner-calendar-grid bg-gray-200">
        <div className="grid grid-cols-7 bg-gray-100 text-center py-3 border-b border-gray-200 col-span-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day} className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </span>
          ))}
        </div>
        {cells}
      </div>
    </div>
  );
}
