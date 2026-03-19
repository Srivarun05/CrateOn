import React from 'react';
import { Search, Plus, Users, Heart } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SubNav = ({ onOpenCreateModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`sub-header ${isAdmin ? 'admin-mode' : 'user-mode'}`} 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
      
      <div className="user-nav-links" style={{ display: 'flex', gap: '16px' }}>        
        {user && (
          <button 
            onClick={() => navigate('/wishlist')} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: location.pathname === '/wishlist' ? '#333' : 'transparent', 
              color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Heart size={16} fill={location.pathname === '/wishlist' ? '#fff' : 'none'} /> My Wishlist
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="admin-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-action-btn" onClick={onOpenCreateModal}>
            <Plus size={16} /> Create Game
          </button>
          <button className="admin-action-btn" onClick={() => navigate('/admin/users')}>
            <Users size={16} /> Manage Users
          </button>
        </div>
      )}

      <div className="search-container" style={{ marginLeft: 'auto' }}>
        <Search className="search-icon" style={{ left: !isAdmin ? '16px' : '10px' }} />
        <input 
          type="text" 
          className={`search-input ${!isAdmin ? 'large' : ''}`} 
          placeholder="Search your library..." 
        />
      </div>
      
    </div>
  );
};

export default SubNav;