import React from 'react';
import { Layers } from 'lucide-react';

export default function EpicModal({
  showEpicModal,
  setShowEpicModal,
  handleCreateEpic,
  epicName,
  setEpicName,
  epicDesc,
  setEpicDesc,
  epicColor,
  setEpicColor
}) {
  if (!showEpicModal) return null;

  return (
    <div className="planner-modal-backdrop">
      <div className="planner-modal-card">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <Layers className="text-purple-600" size={18} />
          Add New Epic
        </h3>
        
        <form onSubmit={handleCreateEpic} className="space-y-4">
          <div className="planner-modal-field">
            <label className="planner-modal-label">Epic Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Payment Integration"
              className="planner-modal-input"
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
            />
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Description</label>
            <textarea
              placeholder="What scope does this Epic cover?"
              rows={2}
              className="planner-modal-input resize-none"
              value={epicDesc}
              onChange={(e) => setEpicDesc(e.target.value)}
            />
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Label Color</label>
            <div className="flex items-center gap-2">
              {['#7c3aed', '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ec4899'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEpicColor(c)}
                  className={`w-7 h-7 rounded-full border cursor-pointer relative transition-transform ${
                    epicColor === c ? 'scale-110 border-black ring-2 ring-purple-100' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {epicColor === c && <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="planner-modal-actions">
            <button
              type="button"
              onClick={() => setShowEpicModal(false)}
              className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
            >
              Add Epic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
