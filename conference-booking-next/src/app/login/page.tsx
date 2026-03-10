'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, error } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle login submit
  const handleLogin = async (credentials: { username: string; password: string }) => {
    const success = await login(credentials);
    if (success) {
      router.push('/dashboard'); // Redirect after successful login
    }
    return success;
  };

  if (!mounted) return null; // Avoid SSR issues

  return (
    <LoginForm
      onLogin={handleLogin}
      error={error}
    />
  );
}