import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaLungs, FaDna } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blood-50 via-gray-50 to-blood-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blood-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blood-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gray-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Login card */}
      <div className="relative z-10 glass-card p-10 w-full max-w-md animate-slide-in">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-float text-life-red-500">
            <FaHeartbeat />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-life-red-600 via-life-blue-600 to-life-green-600 bg-clip-text text-transparent mb-2">
            LifeLink
          </h1>
          <p className="text-gray-600 font-medium">Connecting life-saving gifts to those who need them most</p>
          <div className="mt-4 flex gap-2 justify-center">
            <div className="inline-block px-3 py-1 bg-life-red-100/50 backdrop-blur-sm rounded-full">
              <p className="text-xs font-semibold text-life-red-700 flex items-center gap-1">
                <MdBloodtype /> Blood
              </p>
            </div>
            <div className="inline-block px-3 py-1 bg-life-blue-100/50 backdrop-blur-sm rounded-full">
              <p className="text-xs font-semibold text-life-blue-700 flex items-center gap-1">
                <FaLungs /> Organs
              </p>
            </div>
            <div className="inline-block px-3 py-1 bg-life-green-100/50 backdrop-blur-sm rounded-full">
              <p className="text-xs font-semibold text-life-green-700 flex items-center gap-1">
                <FaDna /> Tissues
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl animate-slide-in">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field text-base"
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field text-base"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3.5 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 p-5 bg-gradient-to-br from-gray-50/80 to-gray-100/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Demo Credentials</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Username:</span>
              <span className="font-mono text-sm font-bold text-gray-800 px-3 py-1 bg-white/80 rounded-lg">admin</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Password:</span>
              <span className="font-mono text-sm font-bold text-gray-800 px-3 py-1 bg-white/80 rounded-lg">admin123</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Naga City, Philippines • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
