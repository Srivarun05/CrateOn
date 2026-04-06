import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import '../../styles/admin.css';

const GuestModal = ({ isOpen, onClose, actionText }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    // This reusable gate keeps guests in context while nudging them toward authentication.
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="popup-modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-icon-wrapper">
          <Lock size={28} color="#fff" />
        </div>
        
        <h2 style={{ marginBottom: '12px', fontSize: '24px', color: '#fff' }}>Login Required</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', lineHeight: '1.5', fontSize: '15px' }}>
          You need to be logged in to {actionText}.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn-cancel" style={{ flex: 1 }}>
            Continue Browsing
          </button>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ flex: 1 }}>
            Log In / Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuestModal;
