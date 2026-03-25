import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Api from '../Api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const interceptor = Api.interceptors.response.use(
      (response) => response, 
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          window.location.href = '/login?session=expired'; 
        }
        return Promise.reject(error);
      }
    );

    return () => {
      Api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const refreshUserProfile = useCallback(async (authToken) => {
    try {
      if (Api.defaults.headers) {
          Api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await Api.get('/users/profile');
      const updatedUser = response.data.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to sync profile from DB:", error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          logout();
          setLoading(false);
          return; 
        }
      } catch (e) {
        console.error("Failed to parse token", e);
      }

      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      
      refreshUserProfile(storedToken);
    }
    setLoading(false);
  }, [refreshUserProfile, logout]);

  const login = (userData, authToken = null) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    if (authToken) {
      setToken(authToken);
      localStorage.setItem('token', authToken);
      refreshUserProfile(authToken);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUserProfile, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);