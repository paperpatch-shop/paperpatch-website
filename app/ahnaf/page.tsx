'use client';

import { useState, useEffect } from 'react';
import { Lock, Shield } from 'lucide-react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const authToken = sessionStorage.getItem('admin_auth');
    if (authToken) {
      // Verify token is still valid (simple check)
      const tokenData = JSON.parse(authToken);
      const now = Date.now();
      if (tokenData.expires > now) {
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Set session token (expires in 8 hours)
    const authToken = {
      authenticated: true,
      expires: Date.now() + 8 * 60 * 60 * 1000,
    };
    sessionStorage.setItem('admin_auth', JSON.stringify(authToken));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-paper-50 via-warm-50 to-paper-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-600 mx-auto mb-4"></div>
          <p className="text-paper-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-50 via-warm-50 to-paper-100">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-warm-500 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-paper-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-paper-600">
                Secure access to manage orders
              </p>
            </div>
            <AdminLogin onLogin={handleLogin} />
          </div>
        </div>
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
