import React from 'react';
import { Plus, Flag, Trash2 } from 'lucide-react';

export default function ListView({
  filteredTasks,
  epics,
  openNewTaskModal,
  handleUpdateTaskStatus,
  handleDeleteTask,
  setShowEpicModal,
  setShowSprintModal
}) {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowEpicModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-bold rounded-lg cursor-pointer"
          >
            + Epic
          </button>
          <button
            onClick={() => setShowSprintModal(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-bold rounded-lg cursor-pointer"
          >
            + Sprint
          </button>
        </div>

        <button
          onClick={() => openNewTaskModal()}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg shadow-2xs cursor-pointer"
        >
          <Plus size={12} />
          Create task
        </button>
      </div>

      {/* Lists by status */}
      {['TODO', 'IN_PROGRESS', 'DONE'].map(statusVal => {
        const statusTasks = filteredTasks.filter(t => t.status === statusVal);
        const headerColors = {
          TODO: 'bg-gray-400 text-white',
          IN_PROGRESS: 'bg-amber-500 text-white',
          DONE: 'bg-emerald-500 text-white'
        };
        const labelText = {
          TODO: 'TO DO',
          IN_PROGRESS: 'IN PROGRESS',
          DONE: 'DONE'
        };

        return (
          <div key={statusVal} className="planner-list-group">
            <div className="planner-list-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${headerColors[statusVal]}`}>
                  {labelText[statusVal]}
                </span>
                <span className="text-[11px] text-gray-400 font-bold">{statusTasks.length} tasks</span>
              </div>
            </div>

            <div className="divide-y divide-gray-150">
              {statusTasks.map(task => {
                const epic = epics.find(e => e.id === task.epicId);
                return (
                  <div key={task.id} className="planner-list-row group">
                    <div className="flex items-center gap-3 min-w-[280px]">
                      <input
                        type="checkbox"
                        checked={task.status === 'DONE'}
                        onChange={() => handleUpdateTaskStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
                        className="w-4 h-4 rounded-sm border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <div>
                        <span className={`text-xs font-bold text-gray-800 ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </span>
                        {task.description && (
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {epic && (
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: `${epic.color}15`, color: epic.color, border: `1px solid ${epic.color}25` }}
                        >
                          {epic.name}
                        </span>
                      )}

                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 ${
                        task.priority === 'HIGH' ? 'bg-red-50 text-red-600' : task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <Flag size={8} />
                        {task.priority}
                      </span>

                      {task.deadline && (
                        <span className="text-[9px] text-gray-500 font-medium">
                          {task.deadline}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {statusTasks.length === 0 && (
                <div className="p-4 text-center text-xs text-gray-400">No tasks in this status group.</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
