'use client';

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface Credentials {
  username: string;
  password: string;
}

interface User {
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isClient = typeof window !== 'undefined';

  // Load token & user from localStorage (client only)
  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isClient]);

  const login = useCallback(
    async (credentials: Credentials) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('http://localhost:5151/api/auth/login', credentials);

        const token = response.data?.token;
        if (!token) throw new Error('No token returned from API');

        if (isClient) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify({ username: credentials.username }));
        }

        setUser({ username: credentials.username });
        setLoading(false);
        return true;
      } catch (err: unknown) {
        let message = 'Login failed';
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message || err.message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        console.error('❌ Login error details:', err);
        setError(message);
        setLoading(false);
        return false;
      }
    },
    [isClient]
  );

  const logout = useCallback(() => {
    if (isClient) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
    setError(null);
  }, [isClient]);

  const isAuthenticated = !!(isClient && localStorage.getItem('token'));

  return { user, login, logout, loading, error, isAuthenticated };
}