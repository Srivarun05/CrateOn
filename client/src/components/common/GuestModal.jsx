import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const GuestModal = ({ isOpen, onClose, actionText }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="profile-modal-content" style={{ textAlign: 'center', padding: '40px 24px' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ background: 'rgba(37, 99, 235, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Lock size={32} color="#3b82f6" />
        </div>
        
        <h2 style={{ marginBottom: '12px', fontSize: '24px' }}>Login Required</h2>
        <p style={{ color: '#aaa', marginBottom: '32px', lineHeight: '1.5' }}>
          You need to be logged in to {actionText}.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn-cancel" style={{ flex: 1 }}>
            Continue Browsing
          </button>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none' }}>
            Log In / Register
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuestModal;