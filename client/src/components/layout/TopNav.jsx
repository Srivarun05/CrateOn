import React, { useState } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PieChart, User as UserIcon, LogOut, Menu, X, Heart, Library, Shield, Plus, Users } from 'lucide-react';
import UserProfileModal from '../dashboard/UserProfileModal'; 

const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `http://localhost:8000/${imagePath.replace(/\\/g, "/")}`; 
};

// NOTE: Added onOpenCreateModal as a prop here so the mobile menu can trigger it!
const TopNav = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateAndClose = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); 
  };

  return (
    <>
      <header className="global-header">
        <div className="header-left">
          <div className="brand-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <PieChart size={24} color="#ffffff" />
            CrateOn
          </div>
          
          <nav className="main-nav-links desktop-only">
            <a 
              className={`main-nav-link ${location.pathname === '/home' ? 'active' : ''}`} 
              onClick={() => navigate('/home')}
              style={{ cursor: 'pointer' }}
            >
              Dashboard
            </a>
            
            {user?.role === 'admin' && (
              <a 
                className={`main-nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                onClick={() => navigate('/admin')}
                style={{ cursor: 'pointer' }}
              >
                Admin Panel
              </a>
            )}
          </nav>
        </div>

        <div className="header-right">
          {/* Added 'desktop-only' to completely hide this button on phones */}
          <button 
            className="user-profile-btn desktop-only" 
            onClick={() => setIsProfileOpen(true)}
          >
            {user?.profilePic ? (
              <img 
                src={getImageUrl(user.profilePic)} 
                alt="Avatar" 
                className="nav-avatar-img"
              />
            ) : (
              <UserIcon size={16} />
            )}
            <span className="desktop-only">{user?.username ? user.username.toUpperCase() : 'GUEST'}</span>
          </button>
          
          <div className="action-icon desktop-only" onClick={handleLogout} title="Logout" style={{ cursor: 'pointer' }}>
            <LogOut size={18} />
          </div>

          <div className="action-icon mobile-only" onClick={() => setIsMobileMenuOpen(true)} style={{ cursor: 'pointer' }}>
            <Menu size={24} />
          </div>
        </div>
      </header>

      {/* --- MOBILE SLIDE-OUT MENU --- */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <div className={`mobile-slide-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-menu-links">
          
          {/* 1. PROFILE IN MOBILE MENU */}
          <button 
            onClick={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }} 
            style={{ borderBottom: '1px solid #222', marginBottom: '8px', paddingBottom: '20px' }}
          >
            {user?.profilePic ? (
               <img src={getImageUrl(user.profilePic)} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
               <UserIcon size={20} />
            )}
            <span style={{ color: '#fff' }}>{user?.username ? user.username : 'My Profile'}</span>
          </button>

          <button onClick={() => navigateAndClose('/home')} className={location.pathname === '/home' ? 'active' : ''}>
            <PieChart size={18} /> Dashboard
          </button>

          <button onClick={() => navigateAndClose('/wishlist')} className={location.pathname === '/wishlist' ? 'active' : ''}>
            <Heart size={18} /> My Wishlist
          </button>

          <button onClick={() => navigateAndClose('/status')} className={location.pathname === '/status' ? 'active' : ''}>
            <Library size={18} /> My Library
          </button>

          {/* ADMIN ONLY CONTROLS */}
          {user?.role === 'admin' && (
            <>
              <div style={{ color: '#666', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', padding: '16px 16px 8px 16px', marginTop: '8px', borderTop: '1px solid #222', letterSpacing: '1px' }}>
                Admin Controls
              </div>
              
              <button onClick={() => navigateAndClose('/admin')} className={location.pathname === '/admin' ? 'active' : ''}>
                <Shield size={18} /> Admin Panel
              </button>
              
              {/* 2. CREATE GAME IN MOBILE MENU */}
              {onOpenCreateModal && (
                <button onClick={() => { onOpenCreateModal(); setIsMobileMenuOpen(false); }}>
                  <Plus size={18} /> Create Game
                </button>
              )}
              
              {/* 3. MANAGE USERS IN MOBILE MENU */}
              <button onClick={() => navigateAndClose('/admin/users')} className={location.pathname === '/admin/users' ? 'active' : ''}>
                <Users size={18} /> Manage Users
              </button>
            </>
          )}

          <button onClick={handleLogout} className="logout-mobile-btn" style={{ marginTop: '24px', borderTop: '1px solid #222', paddingTop: '20px' }}>
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default TopNav;