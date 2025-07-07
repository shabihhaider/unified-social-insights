// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';

interface User {
  id: string;
  email: string;
  full_name: string;
  instagram_account_id: string;
  page_name?: string;
  created_at: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!token);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userData = data as { user: User };
      setUser(userData.user);
      return true;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
      return false;
    }
  }, [logout]);

  const login = useCallback(async (newToken: string): Promise<boolean> => {
    setLoading(true);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    
    const success = await fetchUser(newToken);
    setLoading(false);
    return success;
  }, [fetchUser]);

  const refreshToken = useCallback(async () => {
    if (!token) return;
    
    try {
      const { data } = await axios.post('/api/auth/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tokenData = data as { token: string };
      setToken(tokenData.token);
      localStorage.setItem('token', tokenData.token);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    if (token && !user) {
      fetchUser(token).finally(() => setLoading(false));
    } else if (!token) {
      setLoading(false);
    }
  }, [token, user, fetchUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      refreshToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};