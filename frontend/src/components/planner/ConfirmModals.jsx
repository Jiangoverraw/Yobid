import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

export default function ConfirmModals({
  showDeleteSpaceModal, setShowDeleteSpaceModal,
  showRenameSpaceModal, setShowRenameSpaceModal,
  showRenameWorkspaceModal, setShowRenameWorkspaceModal,
  showDeleteTaskModal, setShowDeleteTaskModal,
  
  spaceToDelete, spaceToRename, taskToDelete,
  confirmDeleteSpace, confirmRenameSpace,
  confirmRenameWorkspace, confirmDeleteTask,

  tempSpaceName, setTempSpaceName,
  tempWorkspaceName, setTempWorkspaceName
}) {
  return (
    <>
      {/* DELETE SPACE MODAL */}
      {showDeleteSpaceModal && spaceToDelete && (
        <div className="planner-modal-backdrop" onClick={() => setShowDeleteSpaceModal(false)}>
          <div className="planner-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Trash2 className="text-red-500" size={18} />
              Delete Space
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed" style={{ margin: '8px 0', textAlign: 'left' }}>
              Are you sure you want to delete the space <strong style={{ color: spaceToDelete.color }}>"{spaceToDelete.name}"</strong>? This will permanently remove all tasks and data inside this space. This action cannot be undone.
            </p>

            <div className="planner-modal-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteSpaceModal(false)}
                className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
                style={{ border: 'none', background: 'none' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSpace}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
                style={{ border: 'none', color: '#fff', backgroundColor: '#dc2626' }}
              >
                Delete Space
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME SPACE MODAL */}
      {showRenameSpaceModal && spaceToRename && (
        <div className="planner-modal-backdrop" onClick={() => setShowRenameSpaceModal(false)}>
          <div className="planner-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Pencil className="text-purple-600" size={18} />
              Rename Space
            </h3>
            
            <form onSubmit={confirmRenameSpace} className="space-y-4">
              <div className="planner-modal-field">
                <label className="planner-modal-label">Space Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Project Name"
                  className="planner-modal-input"
                  value={tempSpaceName}
                  onChange={(e) => setTempSpaceName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="planner-modal-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRenameSpaceModal(false)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
                  style={{ border: 'none', background: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENAME WORKSPACE MODAL */}
      {showRenameWorkspaceModal && (
        <div className="planner-modal-backdrop" onClick={() => setShowRenameWorkspaceModal(false)}>
          <div className="planner-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Pencil className="text-purple-600" size={18} />
              Rename Workspace
            </h3>
            
            <form onSubmit={confirmRenameWorkspace} className="space-y-4">
              <div className="planner-modal-field">
                <label className="planner-modal-label">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Awesome Team"
                  className="planner-modal-input"
                  value={tempWorkspaceName}
                  onChange={(e) => setTempWorkspaceName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="planner-modal-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowRenameWorkspaceModal(false)}
                  className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
                  style={{ border: 'none', background: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE TASK MODAL */}
      {showDeleteTaskModal && taskToDelete && (
        <div className="planner-modal-backdrop" onClick={() => setShowDeleteTaskModal(false)}>
          <div className="planner-modal-card" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-1.5 border-b border-gray-100 pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <Trash2 className="text-red-500" size={18} />
              Delete Task
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed" style={{ margin: '8px 0', textAlign: 'left' }}>
              Are you sure you want to delete the task <strong>"{taskToDelete.title}"</strong>? This action cannot be undone.
            </p>

            <div className="planner-modal-actions" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteTaskModal(false)}
                className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer"
                style={{ border: 'none', background: 'none' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm"
                style={{ border: 'none', color: '#fff', backgroundColor: '#dc2626' }}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
