import React from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SubNav = ({ onOpenCreateModal }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`sub-header ${isAdmin ? 'admin-mode' : 'user-mode'}`}>
      
      {isAdmin && (
        <div className="admin-actions">
          <button className="admin-action-btn" onClick={onOpenCreateModal}>
            <Plus size={16} /> Create Game
          </button>
          <button className="admin-action-btn" onClick={() => navigate('/admin/users')}>
            <Users size={16} /> Manage Users
          </button>
        </div>
      )}

      <div className="search-container">
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