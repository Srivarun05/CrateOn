import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => ({
  user: { username: 'AdminGamer', role: 'admin' }, 
  isAuthenticated: true 
});

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    alert("You don't have permission to view this page.");
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;