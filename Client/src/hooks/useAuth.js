import { useState, useCallback, useEffect } from 'react';
import apiClient from '../api/apiClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(' Login attempt with username:', credentials.username);
      
      const response = await apiClient.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Store user info
      const userData = {
        username: credentials.username,
        ...response.user
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error(' Login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.code === 'ECONNABORTED') {
        setError('Login request timed out');
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server');
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
      
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = !!localStorage.getItem('token');

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
}