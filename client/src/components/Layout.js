import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { isAuthenticated, admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/donors', label: 'Donors', icon: '👥' },
    { path: '/blood', label: 'Blood', icon: '🩸' },
    { path: '/organs', label: 'Organs', icon: '🫁' },
    { path: '/tissues', label: 'Tissues', icon: '🧬' },
    { path: '/recipients', label: 'Recipients', icon: '⏱️' },
    { path: '/requests', label: 'Requests', icon: '📝' },
    { path: '/hospitals', label: 'Hospitals', icon: '🏥' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header with glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-float">🫀</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-life-red-600 via-life-blue-600 to-life-green-600 bg-clip-text text-transparent">
                  LifeLink
                </h1>
                <p className="text-gray-500 text-sm font-medium">Life-Saving Donation Network</p>
              </div>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="font-semibold text-gray-800">{admin?.fullName || admin?.Full_Name}</p>
                  <p className="text-gray-500 text-sm">{admin?.username || admin?.Username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation with Apple-style tabs */}
      {isAuthenticated && (
        <nav className="sticky top-[73px] z-40 backdrop-blur-xl bg-white/60 border-b border-gray-200/50 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap font-medium ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blood-500 to-blood-600 text-white shadow-md scale-105'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-blood-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content with animation */}
      <main className="container mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/60 border-t border-gray-200/50 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              &copy; {new Date().getFullYear()} LifeLink
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Life-Saving Donation Network • Naga City, Camarines Sur, Philippines
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Blood • Organs • Tissues • For the People of Naga
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
