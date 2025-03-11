// src/context/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import AuthContext, { AuthContextType } from './AuthContext';
import { AuthUser, Role } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Ensure the token is attached to the user object
        userData.token = token;
        setUser(userData);
      } catch (e) {
        // Invalid user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    // Store user data and token separately
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    
    // Use window.location instead of useNavigate
    window.location.href = '/login';
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    // Helper functions for role-based access control
    hasRole: (role: Role) => !!user && user.role === role,
    isAgentCom: () => !!user && user.role === 'AGENT_COM',
    isChefSect: () => !!user && user.role === 'CHEF_SECT',
    isChefAnte: () => !!user && user.role === 'CHEF_ANTE',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;