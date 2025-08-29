'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    toast.success(`Welcome back, ${newUser.username}!`);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Auto-logout on token expiration
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        
        if (expirationTime < currentTime) {
          logout();
          toast.error('Session expired. Please login again.');
        } else {
          // Set timeout to auto-logout when token expires
          const timeoutId = setTimeout(() => {
            logout();
            toast.error('Session expired. Please login again.');
          }, expirationTime - currentTime);
          
          return () => clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error('Invalid token format:', error);
        logout();
      }
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};