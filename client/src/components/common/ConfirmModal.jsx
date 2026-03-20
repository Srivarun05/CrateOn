import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="profile-modal-content" style={{ textAlign: 'center', padding: '40px 24px' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <AlertTriangle size={32} color="#ef4444" />
        </div>
        
        <h2 style={{ marginBottom: '12px', fontSize: '24px' }}>{title}</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', lineHeight: '1.5' }}>{message}</p>
        
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