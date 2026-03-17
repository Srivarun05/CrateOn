import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
import GameDetails from './components/dashboard/GameDetails';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/game/:id" element={<GameDetails />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<div>Admin Dashboard Page</div>} />
            <Route path="/manage-games" element={<div>Manage Global Games</div>} />
            <Route path="/admin/users" element={<div>Manage Users Page Coming Soon!</div>} />
          </Route> 

        </Routes> 
      </BrowserRouter>
    </AuthProvider>  

  );
}

export default App;