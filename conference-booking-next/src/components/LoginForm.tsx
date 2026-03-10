'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string }) => Promise<boolean>;
  error: string | null;
}

export default function LoginForm({ onLogin, error }: LoginFormProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.username.trim()) {
      setLocalError('Username is required');
      return;
    }
    if (!credentials.password.trim()) {
      setLocalError('Password is required');
      return;
    }
    
    setLoading(true);
    setLocalError(null);
    
    try {
      console.log('📝 Submitting login form for username:', credentials.username);
      
      const success = await onLogin(credentials);
      
      if (!success) {
        // Error is already set in the hook
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Unexpected error in login form:', err);
      setLocalError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-300 to-primary-500">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Conference Booking System</h2>
        <p className="text-center text-gray-600 mb-6">Sign in with your username</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter your username"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100"
              autoComplete="username"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100"
              autoComplete="current-password"
            />
          </div>
          
          {/* Display errors from either local validation or the hook */}
          {(localError || error) && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200">
              {localError || error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-400 text-black rounded-md hover:bg-primary-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        {/* Debug info - remove in production */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
          <p className="text-gray-600">API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        </div>
      </div>
    </div>
  );
}