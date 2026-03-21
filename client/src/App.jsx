import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
// import GameDetails from './components/dashboard/GameDetails';
import Wishlist from './pages/dashboard/Wishlist';
import ManageUsers from './pages/admin/ManageUsers';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            {/* <Route path="/game/:id" element={<GameDetails />} /> */}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route> 

        </Routes> 
      </BrowserRouter>
    </AuthProvider>  

  );
}

export default App;