import React from 'react';
import {
  Settings, Bell, Palette, Keyboard, HelpCircle,
  Trash2, LogOut, CheckSquare, Briefcase, Clock,
  Video, AlarmClock, LayoutDashboard, Sparkles,
  FileText, Users, ChevronRight, ChevronDown,
  Smile, BellOff, Download, Pin,
} from 'lucide-react';

const PERSONAL_TOOLS = [
  { icon: <CheckSquare size={14} />, label: 'Create task', pin: true },
  { icon: <Briefcase size={14} />, label: 'My Work', pin: true },
  { icon: <Clock size={14} />, label: 'Track Time', pin: false },
  { icon: <FileText size={14} />, label: 'Notepad', pin: true },
  { icon: <Video size={14} />, label: 'Record a Clip', pin: true },
  { icon: <AlarmClock size={14} />, label: 'Create Reminder', pin: true },
  { icon: <FileText size={14} />, label: 'Create Doc', pin: false },
  { icon: <LayoutDashboard size={14} />, label: 'Create Whiteboard', pin: false },
  { icon: <Users size={14} />, label: 'View People', pin: false },
  { icon: <LayoutDashboard size={14} />, label: 'Create Dashboard', pin: true },
  { icon: <Sparkles size={14} />, label: 'AI Notetaker', pin: false },
];

/**
 * Profile dropdown menu in the top bar.
 */
export default function ProfileDropdown({
  userDisplayName, renderAvatar, user,
  dropdownOpen, setDropdownOpen,
  setActiveSection, onSignOut,
}) {
  if (!dropdownOpen) return null;

  const close = () => setDropdownOpen(false);

  return (
    <div className="dash-dropdown-menu" role="menu">
      {/* Header */}
      <div className="dash-dropdown-header">
        {renderAvatar(user, 'dash-dropdown-avatar')}
        <div className="dash-dropdown-user-info">
          <span className="dash-dropdown-name">{userDisplayName}</span>
          <span className="dash-dropdown-status"><span className="dash-status-dot" /> Online</span>
        </div>
      </div>

      {/* Actions */}
      <div className="dash-dropdown-actions">
        <div className="dash-status-input-container">
          <Smile size={14} className="dash-status-icon" />
          <input type="text" placeholder="Set status" className="dash-status-input" />
        </div>
        <button className="dash-dropdown-row-btn" type="button">
          <div className="dash-btn-left"><BellOff size={14} /><span>Mute notifications</span></div>
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="dash-dropdown-divider" />

      {/* Items */}
      <div className="dash-dropdown-items-scroller">
        {[
          { icon: <Settings size={15} />, label: 'Settings', tab: 'profile' },
          { icon: <Bell size={15} />, label: 'Notifications', tab: 'notifications' },
          { icon: <Palette size={15} />, label: 'Themes', tab: 'themes' },
          { icon: <Keyboard size={15} />, label: 'Keyboard shortcuts', tab: 'shortcuts' },
        ].map(({ icon, label, tab }) => (
          <button key={label} className="dash-dropdown-item" onClick={() => { close(); setActiveSection(tab); }} role="menuitem" type="button">
            {icon}<span>{label}</span>
          </button>
        ))}

        <button className="dash-dropdown-item" role="menuitem" type="button">
          <Download size={15} /><span>Download Yobid</span>
        </button>
        <button className="dash-dropdown-item" role="menuitem" type="button">
          <HelpCircle size={15} /><span>Help</span>
        </button>

        <div className="dash-dropdown-section-title">Personal Tools</div>
        {PERSONAL_TOOLS.map((tool, idx) => (
          <button className="dash-dropdown-item dash-dropdown-item--tool" key={idx} role="menuitem" type="button">
            <div className="dash-tool-left">{tool.icon}<span>{tool.label}</span></div>
            {tool.pin && <Pin size={11} className="dash-tool-pin" />}
          </button>
        ))}

        <div className="dash-dropdown-divider" />
        <button className="dash-dropdown-item" onClick={() => { close(); setActiveSection('trash'); }} role="menuitem" type="button">
          <Trash2 size={15} /><span>Trash</span>
        </button>
        <button className="dash-dropdown-item dash-dropdown-item--danger" id="btn-signout" onClick={onSignOut} role="menuitem" type="button">
          <LogOut size={15} /><span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
