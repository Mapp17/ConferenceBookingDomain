'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../api/apiClient';

export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(' Login attempt:', credentials.username);
      
      const response = await apiClient.post('/auth/login', credentials);
      
      console.log(' Login response:', response);
      
      // Map users to their IDs based on username
      const userIdMap: Record<string, number> = {
        'Employee1': 1,
        'Employee2': 2,
        'AdminUser': 4,
        'adminReceptionistUser': 4,
        'jFacilitiesManagerUser': 5,
      };
      
      // Get user ID from map or extract from response
      let userId: number;
      
      if (response.user?.id) {
        userId = response.user.id;
      } else if (response.id) {
        userId = response.id;
      } else if (response.userId) {
        userId = response.userId;
      } else {
        userId = userIdMap[credentials.username] || 0;
        console.log('🔍 Using mapped ID:', userId, 'for username:', credentials.username);
      }
      
      if (!userId || userId === 0) {
        console.error(' Could not determine user ID for:', credentials.username);
        throw new Error('User ID not found');
      }
      
      // Create user object
      const userData: User = {
        id: userId,
        username: credentials.username,
        email: response.email || `${credentials.username}@example.com`,
        role: response.role || (credentials.username === 'Admin' ? 'Admin' : 'Employee')
      };
      
      console.log('✅ User data created:', userData);
      
      // Store token
      const authToken = response.token || response.accessToken;
      if (authToken) {
        localStorage.setItem('token', authToken);
        setToken(authToken);
      }
      
      // Store user
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      setLoading(false);
      return true;
      
    } catch (err: any) {
      console.error(' Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
    router.push('/login');
  }, [router]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      login, 
      logout, 
      isAuthenticated,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };