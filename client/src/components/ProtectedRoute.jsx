import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Unauthenticated visitors are redirected instead of seeing protected UI flash on screen.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Role-gated screens send signed-in users back to the safe default page.
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    alert("You don't have permission to view this page.");
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
