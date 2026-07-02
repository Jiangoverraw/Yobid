import React from 'react';
import { Plus, Flag, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function BoardView({
  filteredTasks,
  epics,
  openNewTaskModal,
  handleUpdateTaskStatus,
  handleDeleteTask
}) {
  return (
    <div className="planner-kanban-grid">
      {['TODO', 'IN_PROGRESS', 'DONE'].map(statusVal => {
        const statusTasks = filteredTasks.filter(t => t.status === statusVal);
        const colHeaders = {
          TODO: { label: 'To Do', countBg: 'bg-gray-100 text-gray-600' },
          IN_PROGRESS: { label: 'In Progress', countBg: 'bg-amber-50 text-amber-700' },
          DONE: { label: 'Done', countBg: 'bg-emerald-50 text-emerald-700' }
        };

        return (
          <div
            key={statusVal}
            className="planner-kanban-col"
            style={{
              borderTop: statusVal === 'TODO' ? '4px solid #94a3b8' : statusVal === 'IN_PROGRESS' ? '4px solid #f59e0b' : '4px solid #10b981'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {colHeaders[statusVal].label}
              </span>
              <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${colHeaders[statusVal].countBg}`}>
                {statusTasks.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {statusTasks.map(task => {
                const epic = epics.find(e => e.id === task.epicId);
                return (
                  <div key={task.id} className="planner-kanban-card group">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>

                    {epic && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm inline-block self-start" style={{ backgroundColor: `${epic.color}15`, color: epic.color }}>
                        {epic.name}
                      </span>
                    )}

                    <div>
                      <h5 className="text-xs font-bold text-gray-800 leading-tight pr-4">{task.title}</h5>
                      {task.description && <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{task.description}</p>}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 mt-1">
                      <div className="flex gap-1">
                        {statusVal !== 'TODO' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, statusVal === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowLeft size={12} />
                          </button>
                        )}
                        {statusVal !== 'DONE' && (
                          <button
                            onClick={() => handleUpdateTaskStatus(task.id, statusVal === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
                            title="Move Right"
                          >
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{task.priority}</span>
                    </div>
                  </div>
                );
              })}

              {statusTasks.length === 0 && (
                <div className="h-full flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl">
                  <span className="text-xs text-gray-400">No tasks</span>
                </div>
              )}
            </div>

            <button
              onClick={() => openNewTaskModal('2026-06-23', statusVal)}
              className="w-full mt-4 py-2 hover:bg-gray-200/50 text-gray-500 hover:text-gray-800 rounded-lg text-xs font-bold transition-colors border border-dashed border-gray-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={12} />
              Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}
