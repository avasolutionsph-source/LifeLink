import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockAdmin } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API delay for demo
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple demo authentication
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        id: mockAdmin.id,
        username: mockAdmin.username,
        fullName: mockAdmin.fullName,
        email: mockAdmin.email
      };

      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);

      return { success: true };
    } else {
      return {
        success: false,
        error: 'Invalid credentials. Use admin/admin123'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
