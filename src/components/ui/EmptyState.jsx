import React from 'react';
import { Plus } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) {
  return (
    <div
      className="vt-card"
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        backgroundColor: 'var(--color-card)'
      }}
    >
      {Icon && (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-soft)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px'
          }}
        >
          <Icon size={28} strokeWidth={1.8} />
        </div>
      )}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '420px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="vt-btn vt-btn-primary"
          style={{ marginTop: '8px' }}
        >
          <Plus size={18} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
