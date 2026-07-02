import React from 'react';
import { List as ListIcon } from 'lucide-react';

export default function TaskModal({
  showTaskModal,
  setShowTaskModal,
  epics,
  sprints,
  handleCreateTask,
  taskTitle,
  setTaskTitle,
  taskDesc,
  setTaskDesc,
  taskPriority,
  setTaskPriority,
  taskStatus,
  setTaskStatus,
  taskEpic,
  setTaskEpic,
  taskSprint,
  setTaskSprint,
  taskDeadline,
  setTaskDeadline
}) {
  if (!showTaskModal) return null;

  return (
    <div className="planner-modal-backdrop">
      <div className="planner-modal-card">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <ListIcon className="text-purple-600" size={18} />
          Create New Task
        </h3>
        
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="planner-modal-field">
            <label className="planner-modal-label">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Add product lists"
              className="planner-modal-input"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Description</label>
            <textarea
              placeholder="Provide a brief task description..."
              rows={3}
              className="planner-modal-input resize-none"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="planner-modal-field">
              <label className="planner-modal-label">Priority</label>
              <select
                className="planner-modal-input"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🔵 Low</option>
              </select>
            </div>
            <div className="planner-modal-field">
              <label className="planner-modal-label">Status</label>
              <select
                className="planner-modal-input"
                value={taskStatus}
                onChange={(e) => setTaskStatus(e.target.value)}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="planner-modal-field">
              <label className="planner-modal-label">Associate Epic</label>
              <select
                className="planner-modal-input"
                value={taskEpic}
                onChange={(e) => setTaskEpic(e.target.value)}
              >
                <option value="">No Epic</option>
                {epics.map(epic => (
                  <option key={epic.id} value={epic.id}>{epic.name}</option>
                ))}
              </select>
            </div>
            <div className="planner-modal-field">
              <label className="planner-modal-label">Associate Sprint</label>
              <select
                className="planner-modal-input"
                value={taskSprint}
                onChange={(e) => setTaskSprint(e.target.value)}
              >
                <option value="">Backlog Only</option>
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Deadline Date</label>
            <input
              type="date"
              className="planner-modal-input"
              value={taskDeadline}
              onChange={(e) => setTaskDeadline(e.target.value)}
            />
          </div>

          <div className="planner-modal-actions">
            <button
              type="button"
              onClick={() => setShowTaskModal(false)}
              className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
