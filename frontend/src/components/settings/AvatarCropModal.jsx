import React from 'react';

/**
 * Modal for cropping and zooming an avatar image.
 * All drag/touch/zoom state is managed via useAvatarCrop hook.
 */
export default function AvatarCropModal({
  cropImageSrc, zoom, setZoom, panX, panY,
  onMouseDown, onMouseMove, onMouseUp,
  onTouchStart, onTouchMove, onTouchEnd,
  onApply, onCancel,
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(15,23,42,0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1.5rem',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        background: '#ffffff', borderRadius: '16px',
        width: '100%', maxWidth: '380px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        border: '1px solid #e2e8f0', textAlign: 'center',
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Adjust profile picture</h3>
          <button type="button" onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem', padding: '0.25rem', lineHeight: 1 }}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Drag the image to center it and use the slider to zoom.</span>

          {/* Crop preview circle */}
          <div
            style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', position: 'relative', cursor: 'move', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '3px solid #6366f1', background: '#f8fafc' }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          >
            <img src={cropImageSrc} alt="Avatar preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: 'center center', userSelect: 'none', pointerEvents: 'none' }}
            />
          </div>

          {/* Zoom slider */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>1x</span>
            <input type="range" min="1" max="3" step="0.01" value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, height: '5px', borderRadius: '5px', background: '#e2e8f0', outline: 'none', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 }}>3x</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="button" onClick={onApply}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(124,58,237,0.2)' }}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
