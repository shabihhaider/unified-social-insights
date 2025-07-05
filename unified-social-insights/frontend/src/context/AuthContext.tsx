// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

interface User {
  id: number;
  email?: string;
  role?: string;
  access_token?: string;
  instagram_account_id?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<boolean>; // ✅ Corrected return type
  loginWithToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);

      const fetchUser = async () => {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = res.data as { user: User };
          console.log('✅ Loaded user from token:', data.user);
          setUser(data.user);
        } catch (err) {
          console.error('❌ Failed to fetch user from token:', err);
          logout();
        }
      };

      fetchUser();
    } else {
      console.log('🚫 No token in localStorage');
    }
  }, [token]);

  const login = async (newToken: string): Promise<boolean> => {
    console.log('🔐 Login with token:', newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);

    try {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      const data = res.data as { user: User };
      console.log('✅ User loaded during login:', data.user);
      setUser(data.user);
      return true;
    } catch (err) {
      console.error('❌ Failed to fetch user during login:', err);
      logout();
      return false;
    }
  };

  const loginWithToken = (newToken: string) => {
    console.log('🔐 LoginWithToken:', newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
