import React from 'react';
import { Pencil, Link, Copy, Archive, Trash2 } from 'lucide-react';

export default function SpaceDropdownMenu({
  space,
  handleRenameSpace,
  handleCycleSpaceColor,
  handleDeleteSpace,
  onClose,
  style
}) {
  return (
    <div
      className="planner-space-dropdown"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          handleRenameSpace(space.id, space.name);
          onClose();
        }}
        className="planner-space-dropdown-item"
      >
        <div className="flex items-center gap-2">
          <Pencil size={12} className="text-gray-400" />
          <span>Rename</span>
        </div>
      </button>

      <button
        onClick={() => {
          handleCycleSpaceColor(space.id, space.color);
        }}
        className="planner-space-dropdown-item"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: space.color, display: 'inline-block' }} />
          <span>Color & Icon</span>
        </div>
      </button>

      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
          onClose();
        }}
        className="planner-space-dropdown-item"
      >
        <div className="flex items-center gap-2">
          <Link size={12} className="text-gray-400" />
          <span>Copy link</span>
        </div>
      </button>

      <div className="planner-space-dropdown-divider" />

      <div className="planner-space-dropdown-header">Actions</div>

      <button
        onClick={() => {
          alert("Space duplicated (mock action).");
          onClose();
        }}
        className="planner-space-dropdown-item"
      >
        <div className="flex items-center gap-2">
          <Copy size={12} className="text-gray-400" />
          <span>Duplicate</span>
        </div>
      </button>

      <button
        onClick={() => {
          alert("Space archived (mock action).");
          onClose();
        }}
        className="planner-space-dropdown-item"
      >
        <div className="flex items-center gap-2">
          <Archive size={12} className="text-gray-400" />
          <span>Archive</span>
        </div>
      </button>

      <button
        onClick={(e) => {
          handleDeleteSpace(space.id, space.name, e);
          onClose();
        }}
        className="planner-space-dropdown-item planner-space-dropdown-item--danger"
      >
        <div className="flex items-center gap-2">
          <Trash2 size={12} />
          <span>Delete</span>
        </div>
      </button>
    </div>
  );
}
