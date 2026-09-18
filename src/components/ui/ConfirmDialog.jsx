import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar exclusão',
  message = 'Tem certeza que deseja excluir este registro?',
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', alignItems: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-danger-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-danger)'
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
          <button
            onClick={onClose}
            className="vt-btn vt-btn-secondary"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="vt-btn vt-btn-danger"
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
