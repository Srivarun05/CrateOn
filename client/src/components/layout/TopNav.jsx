import React, { useState } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PieChart, User as UserIcon, LogOut } from 'lucide-react';
import UserProfileModal from '../dashboard/UserProfileModal'; 

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="global-header">
        <div className="header-left">
          <div className="brand-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <PieChart size={24} color="#ffffff" />
            CrateOn
          </div>
          <nav className="main-nav-links">
            <a 
              className={`main-nav-link ${location.pathname === '/home' ? 'active' : ''}`} 
              onClick={() => navigate('/home')}
              style={{ cursor: 'pointer' }}
            >
              Dashboard
            </a>
            
            {user?.role === 'admin' && (
              <a 
                className={`main-nav-link admin-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                onClick={() => navigate('/admin')}
                style={{ cursor: 'pointer' }}
              >
                Admin Panel
              </a>
            )}
          </nav>
        </div>

        <div className="header-right">
          <div 
            className="user-profile-btn" 
            onClick={() => setIsProfileOpen(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {user?.profilePic ? (
              <img 
                src={getImageUrl(user.profilePic)} 
                alt="Avatar" 
                style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} 
              />
            ) : (
              <UserIcon size={16} />
            )}
            {user?.username ? user.username.toUpperCase() : 'GUEST'}
          </div>
          
          <div className="action-icon" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </div>
        </div>
      </header>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default TopNav;