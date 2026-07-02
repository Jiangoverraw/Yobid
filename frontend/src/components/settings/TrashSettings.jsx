import React from 'react';
import { Trash2, Loader2, RotateCcw } from 'lucide-react';

/**
 * TrashSettings – displays soft-deleted items with restore/delete/clear-all actions.
 */
export default function TrashSettings({
  trashItems, loadingTrash, trashError, trashSuccessMsg,
  onRefresh, onRestore, onPermanentDelete, onClearAll,
}) {
  return (
    <div className="set-content-inner" style={{ maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="set-content-title" style={{ marginBottom: '0.5rem' }}>Trash</h1>
          <p className="set-section-desc">View, restore, or permanently delete items you have soft-deleted.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {trashItems.length > 0 && (
            <button onClick={onClearAll} disabled={loadingTrash} type="button"
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', cursor: loadingTrash ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}>
              <Trash2 size={15} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#dc2626' }}>Clear All</span>
            </button>
          )}
          <button onClick={onRefresh} disabled={loadingTrash} className="dash-icon-btn" type="button"
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {loadingTrash ? <Loader2 size={16} className="dash-spinner" /> : <RotateCcw size={16} />}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#374151' }}>Refresh</span>
          </button>
        </div>
      </div>

      {trashError && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', fontSize: '0.85rem' }}>
          {trashError}
        </div>
      )}
      {trashSuccessMsg && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#16a34a', fontSize: '0.85rem' }}>
          {trashSuccessMsg}
        </div>
      )}

      {loadingTrash ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
          <Loader2 size={36} className="dash-spinner" style={{ color: '#7c3aed' }} />
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading deleted items...</p>
        </div>
      ) : trashItems.length === 0 ? (
        <div className="set-empty-state" style={{ padding: '5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#fafbfe', borderRadius: '12px', border: '1.5px dashed #e5e7eb' }}>
          <div style={{ padding: '1rem', background: '#f5f3ff', borderRadius: '50%', color: '#7c3aed' }}>
            <Trash2 size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>Your Trash is empty</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Items you delete will show up here for you to restore or delete permanently.</p>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #e5e7eb' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4b5563' }}>Type</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4b5563' }}>Name</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4b5563' }}>Location</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4b5563' }}>Deleted At</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4b5563', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trashItems.map((item, idx) => {
                const badge = item.type === 'workspace'
                  ? { bg: '#f5f3ff', color: '#7c3aed' }
                  : item.type === 'project'
                  ? { bg: '#eff6ff', color: '#2563eb' }
                  : { bg: '#fff1f2', color: '#e11d48' };

                return (
                  <tr key={`${item.type}-${item.id}`} style={{ borderBottom: idx === trashItems.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', background: badge.bg, color: badge.color }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 500, color: '#111827' }}>{item.name}</td>
                    <td style={{ padding: '1rem 1.25rem', color: '#6b7280', fontSize: '0.8rem' }}>
                      {item.type === 'task' ? <span>{item.workspaceName} &gt; {item.projectName}</span>
                        : item.type === 'project' ? <span>{item.workspaceName}</span>
                        : <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#4b5563' }}>
                      {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Unknown'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => onRestore(item.type, item.id)} type="button"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #7c3aed', background: 'rgba(124,58,237,0.04)', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                          <RotateCcw size={12} /> Restore
                        </button>
                        <button onClick={() => onPermanentDelete(item.type, item.id)} type="button"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid #dc2626', background: 'rgba(220,38,38,0.04)', color: '#dc2626', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
