import React from 'react';
import { AlertTriangle } from 'lucide-react';
import '../../styles/admin.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Shared confirm dialog for destructive actions that need a second explicit user decision.
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="popup-modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-icon-wrapper warning">
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        
        <h2 style={{ marginBottom: '12px', fontSize: '24px', color: '#fff' }}>{title}</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', lineHeight: '1.5', fontSize: '15px' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn-cancel" style={{ flex: 1 }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger" style={{ flex: 1 }}>
            Yes, Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
