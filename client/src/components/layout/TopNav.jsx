import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Gamepad2, Bell, User as UserIcon, LogOut } from 'lucide-react';

const TopNav = () => {
  // Using your REAL AuthContext connected to your Node.js backend
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="global-header">
      <div className="header-left">
        <div className="brand-logo">
          <Gamepad2 size={24} color="#ffffff" />
          CrateOn
        </div>
        <nav className="main-nav-links">
          <a className="main-nav-link active">Dashboard</a>
          <a className="main-nav-link">My Library</a>
          <a className="main-nav-link">Community</a>
          
          {/* RBAC: Admin Main Nav Link (Only shows if DB says role is 'admin') */}
          {user?.role === 'admin' && (
            <a className="main-nav-link admin-link" onClick={() => navigate('/admin')}>
              Admin Panel
            </a>
          )}
        </nav>
      </div>

      <div className="header-right">
        <div className="action-icon"><Bell size={18} /></div>
        <div className="user-profile-btn">
          <UserIcon size={16} />
          {/* Shows their actual registered username from MongoDB */}
          {user?.username ? user.username.toUpperCase() : 'GUEST'}
        </div>
        <div className="action-icon" onClick={handleLogout} title="Logout">
          <LogOut size={18} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;