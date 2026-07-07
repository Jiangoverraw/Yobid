import React, { useEffect, useState } from 'react';
import { Clock, Calendar, CheckSquare, List, FileText, Settings, ChevronLeft, ChevronRight, ListCollapse, MoreHorizontal } from 'lucide-react';

export default function MyTasksDashboardView({
  greeting,
  userDisplayName,
  tasks = [],
  spaces = [],
  setActiveSpaceId,
  openNewTaskModal,
  handleUpdateTaskStatus,
  handleDeleteTask
}) {
  // Current time states for Agenda red line
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Format current date for Agenda
  const agendaDateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit'
  }); // e.g., "Tue, Jul 07"

  // Calculate percentage offset for the red timeline (between 3:00 PM and 7:00 PM)
  // Let's map 4:00 PM to 6:00 PM for the display slots
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeInMinutes = currentHour * 60 + currentMinute;
  
  // 3:00 PM is 900 minutes, 7:00 PM is 1140 minutes
  const startMinutes = 15 * 60; // 3:00 PM
  const endMinutes = 19 * 60;   // 7:00 PM
  const totalMinutesRange = endMinutes - startMinutes;
  
  let redLineTopPercent = ((timeInMinutes - startMinutes) / totalMinutesRange) * 100;
  if (redLineTopPercent < 0) redLineTopPercent = 10; // clamp
  if (redLineTopPercent > 100) redLineTopPercent = 90;

  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }); // e.g., "17:05"

  // Filter tasks
  const assignedTasks = tasks.filter(t => t.status !== 'DONE');
  const completedTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      {/* Top Banner Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          {greeting}, {userDisplayName}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{
            backgroundColor: '#7c3aed',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }} onClick={() => alert("Manage cards is coming soon!")}>
            Manage cards
          </button>
          <button style={{
            background: 'none',
            border: '1.5px solid #e2e8f0',
            color: '#64748b',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: '#fff'
          }}>
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* 2x2 Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* CARD 1: Recents */}
        <div style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '260px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recents</span>
            <MoreHorizontal size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '6px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
              <List size={14} style={{ color: '#7c3aed' }} />
              <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>List</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>• in dd</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '6px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
              <List size={14} style={{ color: '#06b6d4' }} />
              <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Jeezzy's List</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '6px', backgroundColor: '#f8fafc', cursor: 'pointer' }}>
              <FileText size={14} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Untitled</span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>• in Doc</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Agenda */}
        <div style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '260px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agenda</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '2px 6px', backgroundColor: '#f8fafc' }}>
                <ChevronLeft size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                <ChevronRight size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{agendaDateStr}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <List size={12} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                <Calendar size={12} style={{ color: '#7c3aed', cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>GMT+07:00</div>

          {/* Timeline Calendar area */}
          <div style={{ position: 'relative', borderLeft: '1.5px solid #e2e8f0', flex: 1, paddingLeft: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
            {/* Hour lines */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '33%' }}>
              <span style={{ position: 'absolute', left: '-40px', fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>4 PM</span>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '33%' }}>
              <span style={{ position: 'absolute', left: '-40px', fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>5 PM</span>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '33%' }}>
              <span style={{ position: 'absolute', left: '-40px', fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>6 PM</span>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#f1f5f9' }} />
            </div>

            {/* Current time red line */}
            <div style={{
              position: 'absolute',
              top: `${redLineTopPercent}%`,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              zIndex: 10
            }}>
              <span style={{
                position: 'absolute',
                left: '-44px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '8px',
                fontWeight: 800,
                padding: '2px 4px',
                borderRadius: '4px',
                lineHeight: 1
              }}>{formattedTime}</span>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', marginLeft: '-3px' }} />
              <div style={{ flex: 1, height: '1.5px', backgroundColor: '#ef4444' }} />
            </div>
          </div>
        </div>

        {/* CARD 3: My Work */}
        <div style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '260px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Work</span>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#7c3aed',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }} onClick={() => openNewTaskModal()}>
              + Task
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {assignedTasks.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                <CheckSquare size={32} style={{ color: '#cbd5e1' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>No active tasks</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {assignedTasks.slice(0, 4).map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                    <input
                      type="checkbox"
                      checked={task.status === 'DONE'}
                      onChange={() => handleUpdateTaskStatus(task.id, 'DONE')}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>{task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 4: Assigned to me */}
        <div style={{
          backgroundColor: '#fff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '260px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned to me</span>
            <MoreHorizontal size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            {assignedTasks.length === 0 ? (
              <>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  ⚡
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>Nothing assigned yet</span>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {assignedTasks.map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyStyle: 'space-between', padding: '6px 8px', borderRadius: '6px', border: '1px solid #f1f5f9', width: '100%' }}>
                    <span style={{ fontSize: '12px', color: '#334155', flex: 1 }}>{task.title}</span>
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 700 }}>{task.priority || 'NORMAL'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
