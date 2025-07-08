import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import axios from '../utils/axios';
import { getTokenExpiration } from '../utils/jwtUtils';
import {jwtDecode} from 'jwt-decode';

type Role = 'free' | 'pro' | 'business' | 'agency';

interface User {
  id: string;
  email: string;
  role: Role;
  full_name?: string;
  instagram_account_id?: string;
  page_name?: string;
  created_at?: string;
}

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  full_name?: string;
  exp: number;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!token);

  const isAuthenticated = !!token && !!user;

  const setAxiosAuthHeader = (authToken: string | null) => {
    axios.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : '';
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAxiosAuthHeader(null);
    setLoading(false);
  }, []);

  const fetchUser = useCallback(
    async (authToken: string) => {
      try {
        const { data } = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const typedData = data as { user: User };
        setUser(typedData.user);
        return true;
      } catch (err) {
        console.error('❌ Failed to fetch user:', err);
        logout();
        return false;
      }
    },
    [logout]
  );

  const login = useCallback(
    async (newToken: string): Promise<boolean> => {
      setLoading(true);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      setAxiosAuthHeader(newToken);

      try {
        const decoded = jwtDecode<JwtPayload>(newToken);
        setUser({
          id: decoded.id,
          email: decoded.email,
          full_name: decoded.full_name,
          role: decoded.role,
        });

        return true;
      } catch (err) {
        console.error('❌ Failed to decode token:', err);
        logout();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [logout]
  );

  const refreshToken = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.post(
        '/api/auth/refresh',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const typedData = data as { token: string };
      const newToken = typedData.token;

      setToken(newToken);
      localStorage.setItem('token', newToken);
      setAxiosAuthHeader(newToken);

      const decoded = jwtDecode<JwtPayload>(newToken);
      setUser({
        id: decoded.id,
        email: decoded.email,
        full_name: decoded.full_name,
        role: decoded.role,
      });
    } catch (err) {
      console.error('❌ Token refresh failed:', err);
      logout();
    }
  }, [token, logout]);

  // 🔄 Auto-refresh token before it expires
  useEffect(() => {
    if (!token) return;

    const exp = getTokenExpiration(token);
    if (!exp) return;

    const now = Date.now();
    const timeUntilExpiry = exp - now;
    const refreshBuffer = 5 * 60 * 1000;
    const refreshIn = timeUntilExpiry - refreshBuffer;

    if (refreshIn <= 0) {
      refreshToken();
      return;
    }

    const timer = setTimeout(() => {
      refreshToken();
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [token, refreshToken]);

  useEffect(() => {
    if (token && !user) {
      setAxiosAuthHeader(token);
      fetchUser(token).finally(() => setLoading(false));
    } else if (!token) {
      setAxiosAuthHeader(null);
      setLoading(false);
    }
  }, [token, user, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
