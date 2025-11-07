import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Home, FileText, AlertTriangle, Map,
  BarChart3, Users, Settings, LogOut, User, Bell,
  ChevronLeft, ChevronRight, Megaphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import LanguageToggle from './LanguageToggle';



const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  // 🆕 SIMPLIFIED NAVIGATION BASED ON USER TYPE
  const isSuperAdmin = user?.department === 'all';
  const isDepartmentAdmin = user?.department && user.department !== 'all';
  const userDepartment = user?.department || '';

  // 🆕 SUPER ADMIN NAVIGATION (Full access)
  const superAdminItems = [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/urgent', label: 'Urgent Issues', icon: AlertTriangle },
    { to: '/admin/map', label: 'Ward Insights', icon: Map },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/residents', label: 'Residents', icon: Users },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  // 🆕 DEPARTMENT ADMIN NAVIGATION (Minimal - Only My Department)
  const departmentAdminItems = [
    { to: '/admin/department', label: 'My Department', icon: Users },
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
    setShowProfileDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Keep this the same */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left - Logo & Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
            
            <Link to={isSuperAdmin ? "/admin" : "/admin/department"} className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">J</span>
              </motion.div>
              <span className="text-xl font-bold text-white tracking-wide">
                Jamii<span className="text-white/90">report</span>
              </span>
            </Link>
          </div>

          {/* Right - User Info Only (No Settings/Profile) */}
          <div className="flex items-center space-x-4">
            {/* 🆕 SIMPLIFIED HEADER FOR DEPARTMENT ADMINS */}
            {isDepartmentAdmin && (
              <div className="text-white text-sm">
                <div className="font-medium">{user?.name}</div>
                <div className="text-white/80 capitalize">{userDepartment} Department</div>
              </div>
            )}
            
            {/* 🆕 SUPER ADMIN KEEPS FULL HEADER FEATURES */}
            {isSuperAdmin && (
              <>
                <LanguageToggle />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>
                
                {/* Profile Dropdown - Only for Super Admin */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                    />
                    <span className="hidden sm:block font-medium">{user?.name}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                      >
                        <Link
                          to="/admin/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to="/admin/settings"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
            
            {/* 🆕 SIMPLE LOGOUT FOR DEPARTMENT ADMINS */}
            {isDepartmentAdmin && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        } lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        animate={{ width: isSidebarCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="p-4 space-y-2 h-full flex flex-col">
          {/* 🆕 SUPER ADMIN NAVIGATION */}
          {isSuperAdmin && superAdminItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <motion.div key={item.to} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                  {!isSidebarCollapsed && (
                    <span className="font-semibold tracking-wide">{item.label}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}

          {/* 🆕 DEPARTMENT ADMIN NAVIGATION (Only My Department) */}
          {isDepartmentAdmin && departmentAdminItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <motion.div key={item.to} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`} />
                  {!isSidebarCollapsed && (
                    <span className="font-semibold tracking-wide">{item.label}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
          
          {/* Collapse Toggle - Only for Super Admin */}
          {isSuperAdmin && (
            <div className="mt-auto pt-4">
              <motion.button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex items-center justify-center w-full p-3 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </motion.button>
            </div>
          )}
        </nav>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-8rem)]"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;