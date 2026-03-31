import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import './styles/auth.css';
import './styles/dashboard.css';
import './styles/GameDetails.css';

// --- 1. REPLACE PAGE IMPORTS WITH LAZY IMPORTS ---
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Home = lazy(() => import('./pages/dashboard/Home'));
const Wishlist = lazy(() => import('./pages/dashboard/Wishlist'));
const MyStatus = lazy(() => import('./pages/dashboard/MyStatus'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));

// --- 2. THE CUSTOM FALLBACK LOADER ---
const PageLoader = () => (
  <div style={{ 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#000',
    color: '#fff' 
  }}>
    <div className="spinner" style={{
      width: '40px', height: '40px', border: '3px solid #333',
      borderTop: '3px solid #fff', borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* --- 3. WRAP ALL ROUTES IN SUSPENSE --- */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/status" element={<MyStatus />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              {/* <Route path="/game/:id" element={<GameDetails />} /> */}
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route> 

          </Routes> 
        </Suspense>
      </BrowserRouter>
    </AuthProvider>  
  );
}

export default App;