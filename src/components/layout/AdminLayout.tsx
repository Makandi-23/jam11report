import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, FileText, AlertTriangle, Map, 
  BarChart3, Users, Settings, LogOut, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import LanguageToggle from './LanguageToggle';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/urgent', label: 'Urgent Issues', icon: AlertTriangle },
    { to: '/admin/map', label: 'Map View', icon: Map },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/residents', label: 'Residents', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-pale">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left - Logo & Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold text-white">
                Jamii<span className="text-white/90">report</span>
              </span>
            </Link>
          </div>

          {/* Right - Language Toggle, Profile, Logout */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            
            <div className="flex items-center space-x-2 text-white">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
              />
              <span className="hidden sm:block font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? 'bg-deepTeal text-white shadow-lg shadow-deepTeal/25'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-deepTeal'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="lg:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ease-in-out lg:ml-64`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;