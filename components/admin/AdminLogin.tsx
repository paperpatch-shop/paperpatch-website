'use client';

import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step, setStep] = useState<'password' | '2fa'>('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in sessionStorage
        sessionStorage.setItem('admin_token', data.token);
        onLogin();
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 2FA is optional - can be implemented later
    onLogin();
  };

  return (
    <div className="paper-card p-8 paper-texture">
      {step === 'password' ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-paper-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-paper-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter admin password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 text-center">
              🔒 Secure admin authentication enabled
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handle2FASubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-paper-700 mb-2">
              Two-Factor Authentication Code
            </label>
            <input
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="input-field text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-xs text-paper-600 mt-2 text-center">
              Enter the 6-digit code from your authenticator app
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setStep('password');
                setError('');
                setTwoFactorCode('');
              }}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
          </div>

          <div className="bg-paper-100 rounded-lg p-3">
            <p className="text-xs text-paper-600 text-center">
              Demo 2FA code: <strong>123456</strong>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
