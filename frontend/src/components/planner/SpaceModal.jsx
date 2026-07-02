import React from 'react';
import { Folder } from 'lucide-react';

export default function SpaceModal({
  showSpaceModal,
  setShowSpaceModal,
  handleCreateSpace,
  spaceName,
  setSpaceName,
  spaceColor,
  setSpaceColor
}) {
  if (!showSpaceModal) return null;

  return (
    <div className="planner-modal-backdrop">
      <div className="planner-modal-card">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3">
          <Folder className="text-purple-600" size={18} />
          Create New Space
        </h3>
        
        <form onSubmit={handleCreateSpace} className="space-y-4">
          <div className="planner-modal-field">
            <label className="planner-modal-label">Space Name</label>
            <input
              type="text"
              required
              placeholder="e.g. EMMMORE, Project Alpha"
              className="planner-modal-input"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
            />
          </div>

          <div className="planner-modal-field">
            <label className="planner-modal-label">Space Color Icon</label>
            <div className="flex items-center gap-2">
              {['#7c3aed', '#ff6b6b', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSpaceColor(c)}
                  className={`w-7 h-7 rounded-full border cursor-pointer relative transition-transform ${
                    spaceColor === c ? 'scale-110 border-black ring-2 ring-purple-100' : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {spaceColor === c && <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="planner-modal-actions">
            <button
              type="button"
              onClick={() => setShowSpaceModal(false)}
              className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
            >
              Create Space
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
