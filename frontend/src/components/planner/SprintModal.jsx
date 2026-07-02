import React from 'react';
import { Clock } from 'lucide-react';

export default function SprintModal({
  showSprintModal,
  setShowSprintModal,
  handleCreateSprint,
  sprintName,
  setSprintName,
  sprintStart,
  setSprintStart,
  sprintEnd,
  setSprintEnd,
  sprintStatus,
  setSprintStatus
}) {
  if (!showSprintModal) return null;

  return (
    <div className="planner-modal-backdrop">
      <div className="planner-modal-card">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <Clock className="text-purple-600" size={18} />
          Add New Sprint
        </h3>
        
        <form onSubmit={handleCreateSprint} className="space-y-4">
          <div className="planner-modal-field">
            <label className="planner-modal-label">Sprint Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sprint 3: Database setup"
              className="planner-modal-input"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="planner-modal-field">
              <label className="planner-modal-label">Start Date</label>
              <input
                type="date"
                className="planner-modal-input"
                value={sprintStart}
                onChange={(e) => setSprintStart(e.target.value)}
              />
            </div>
            <div className="planner-modal-field">
              <label className="planner-modal-label">End Date</label>
              <input
                type="date"
                className="planner-modal-input"
                value={sprintEnd}
                onChange={(e) => setSprintEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Initial Status</label>
            <select
              className="planner-modal-input"
              value={sprintStatus}
              onChange={(e) => setSprintStatus(e.target.value)}
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="planner-modal-actions">
            <button
              type="button"
              onClick={() => setShowSprintModal(false)}
              className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
            >
              Add Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
