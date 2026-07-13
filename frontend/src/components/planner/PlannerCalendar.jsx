import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  Calendar as CalendarIcon, RotateCw, Settings as SettingsIcon, Search
} from 'lucide-react';

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i >= 12 ? 'PM' : 'AM';
  const displayHour = i % 12 === 0 ? 12 : i % 12;
  return `${displayHour} ${ampm}`;
});

const PlannerCalendar = function PlannerCalendar({
  events = [],
  weekDays,
  currentWeekStart,
  onCellClick,
  onPrevWeek,
  onNextWeek,
  onToday,
  onDeleteEvent
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const displayDays = useMemo(() => {
    if (weekDays && weekDays.length) return weekDays;
    const today = new Date();
    const day = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - day);
    start.setHours(0, 0, 0, 0);
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        name: names[i],
        date: d.getDate().toString(),
        fullDate: d,
        isToday: d.toDateString() === today.toDateString()
      };
    });
  }, [weekDays]);

  const displayMonthYear = useMemo(() => {
    const d = currentWeekStart || now;
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentWeekStart, now]);

  const isNowInThisWeek = useMemo(() => {
    const todayStr = now.toDateString();
    return displayDays.some(d => d.fullDate?.toDateString() === todayStr || (d.isToday && !d.fullDate));
  }, [displayDays, now]);

  const timePercent = useMemo(() => {
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / 1440) * 100;
  }, [now]);

  const timeFormatted = useMemo(() => {
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }, [now]);

  return (
    <main className="planner-calendar-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      
      {/* Calendar Sub-header */}
      <div style={{ height: '48px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={onPrevWeek} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Previous Week"><ChevronLeft size={16} /></button>
            <button onClick={onNextWeek} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Next Week"><ChevronRight size={16} /></button>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{displayMonthYear}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, color: '#64748b', backgroundColor: '#fff', cursor: 'pointer' }}>
            Week <ChevronDown size={12} />
          </button>
          
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            <Sparkles size={12} /> AI Notes
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1' }} />
          
          <button onClick={onToday} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', position: 'relative' }} title="Go to Today">
            <CalendarIcon size={16} />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: '8px', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>•</span>
          </button>

          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><RotateCw size={14} /></button>
          <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><SettingsIcon size={14} /></button>
        </div>
      </div>

      {/* Calendar Scrollable Grid */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Grid Header Days */}
        <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <div style={{ padding: '8px', borderRight: '1px solid #e2e8f0', fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>GMT+7</div>
          {displayDays.map((day, idx) => (
            <div key={idx} style={{ padding: '8px', borderRight: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: day.isToday ? '#7c3aed' : '#94a3b8', fontWeight: 600 }}>{day.name}</span>
              <span style={{
                fontSize: '13px', fontWeight: 700,
                width: '24px', height: '24px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: day.isToday ? '#ef4444' : 'transparent',
                color: day.isToday ? '#fff' : '#1e293b'
              }}>{day.date}</span>
            </div>
          ))}
        </div>

        {/* Time Slots Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', position: 'relative' }}>
          
          {/* Red Current Time Line Marker (only visible when today is within current week) */}
          {isNowInThisWeek && (
            <>
              <div style={{
                position: 'absolute',
                top: `${timePercent}%`,
                left: '70px',
                right: 0,
                height: '2px',
                backgroundColor: '#ef4444',
                zIndex: 5,
                pointerEvents: 'none'
              }}>
                <div style={{ position: 'absolute', left: '-5px', top: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              </div>

              {/* Red Time Bubble inside GMT+7 Column */}
              <div style={{
                position: 'absolute',
                top: `${timePercent}%`,
                transform: 'translateY(-50%)',
                left: '12px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                zIndex: 6,
                pointerEvents: 'none'
              }}>
                {timeFormatted}
              </div>
            </>
          )}

          {/* Time Slots */}
          {HOURS.map((hourText, hIdx) => (
            <React.Fragment key={hIdx}>
              {/* Leftmost hour label */}
              <div style={{
                height: '60px',
                borderBottom: '1px solid #f1f5f9',
                borderRight: '1px solid #e2e8f0',
                fontSize: '10px',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                paddingTop: '6px',
                fontWeight: 600,
                backgroundColor: '#f8fafc'
              }}>
                {hourText}
              </div>

              {/* 7 Columns for the week */}
              {Array.from({ length: 7 }).map((_, dIdx) => {
                const slotEvents = events.filter(e => e.hour === hIdx && e.dayIndex === dIdx);

                return (
                  <div
                    key={dIdx}
                    onClick={() => onCellClick && onCellClick(hIdx, dIdx)}
                    style={{
                      height: '60px',
                      borderBottom: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9',
                      position: 'relative',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; }}
                  >
                    {slotEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDeleteEvent) {
                            if (window.confirm(`Delete event "${ev.title}"?`)) {
                              onDeleteEvent(ev.id);
                            }
                          } else {
                            alert(`Event: ${ev.title}`);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          height: `${(ev.duration || 1) * 50}px`,
                          backgroundColor: ev.color,
                          borderLeft: '3px solid rgba(0,0,0,0.2)',
                          borderRadius: '4px',
                          padding: '4px 6px',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          zIndex: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        title={`${ev.title} (Click to delete)`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Bottom Search Bar */}
      <div style={{ height: '56px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', flexShrink: 0, backgroundColor: '#f8fafc' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search events, teammates, commands..."
            style={{ width: '100%', padding: '8px 40px 8px 32px', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '11px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          />
          <Sparkles size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#a855f7' }} />
        </div>
      </div>
    </main>
  );
};

export default React.memo(PlannerCalendar);
