import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import LanguageToggle from '../components/layout/LanguageToggle';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigation is handled by route protection based on user role
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-deepTeal via-primary to-pale" />
        
        {/* Community Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center p-12"
        >
          {/* Main Illustration Container */}
          <div className="relative w-full max-w-md">
            {/* Background Neighborhood Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute inset-0"
            >
              {/* Buildings */}
              <div className="absolute top-8 left-4 w-16 h-20 bg-white/10 rounded-t-lg border border-white/20"></div>
              <div className="absolute top-12 left-24 w-12 h-16 bg-white/10 rounded-t-lg border border-white/20"></div>
              <div className="absolute top-6 right-8 w-14 h-22 bg-white/10 rounded-t-lg border border-white/20"></div>
              
              {/* Trees */}
              <div className="absolute bottom-20 left-8 w-3 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-20 right-12 w-3 h-8 bg-white/20 rounded-full"></div>
              
              {/* Street Light */}
              <div className="absolute bottom-16 left-32 w-1 h-12 bg-white/30"></div>
              <div className="absolute bottom-28 left-30 w-4 h-2 bg-white/20 rounded-full"></div>
            </motion.div>

            {/* Main Character - Resident with Phone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Person */}
              <div className="relative">
                {/* Head */}
                <div className="w-16 h-16 bg-white/90 rounded-full mb-2 border-2 border-deepTeal/30"></div>
                
                {/* Body */}
                <div className="w-20 h-24 bg-white/80 rounded-2xl relative border border-white/40">
                  {/* Deep Teal Shirt Accent */}
                  <div className="absolute top-2 left-2 right-2 h-4 bg-deepTeal/60 rounded-lg"></div>
                  
                  {/* Arms */}
                  <div className="absolute -left-3 top-4 w-6 h-16 bg-white/70 rounded-full transform -rotate-12"></div>
                  <div className="absolute -right-3 top-4 w-6 h-16 bg-white/70 rounded-full transform rotate-12"></div>
                </div>
                
                {/* Phone in Hand */}
                <motion.div
                  animate={{ rotate: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 top-20 w-8 h-12 bg-deepTeal rounded-lg border-2 border-white/40"
                >
                  {/* Phone Screen */}
                  <div className="w-6 h-8 bg-white/90 rounded m-1 relative">
                    <div className="w-4 h-1 bg-deepTeal/40 rounded mx-auto mt-1"></div>
                    <div className="w-5 h-3 bg-deepTeal/20 rounded mx-auto mt-1"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Category Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute inset-0"
            >
              {/* Security Icon */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                className="absolute top-16 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg border border-white/30"
              >
                🛡️
              </motion.div>
              
              {/* Environment Icon */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-32 left-2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg border border-white/30"
              >
                🌿
              </motion.div>
              
              {/* Health Icon */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
                className="absolute bottom-24 right-16 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg border border-white/30"
              >
                ➕
              </motion.div>
            </motion.div>

            {/* Connecting Lines/Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute top-24 right-12 w-16 h-0.5 bg-white/30 transform rotate-45"></div>
              <div className="absolute top-40 left-12 w-12 h-0.5 bg-white/30 transform -rotate-45"></div>
              <div className="absolute bottom-32 right-24 w-14 h-0.5 bg-white/30 transform rotate-12"></div>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-4xl font-bold mb-4 relative z-20"
            >
              Empowering Communities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-xl opacity-90 relative z-20"
            >
              Report issues, track progress, and build a better neighborhood together
            </motion.p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Jamii<span className="text-primary">report</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.login.title')}
            </h2>
            <p className="text-gray-600">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary/80">
                {t('auth.forgot.password')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : t('auth.login.button')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium">
                {t('auth.register.link')}
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Resident:</strong> resident@test.com / 123456</p>
              <p><strong>Admin:</strong> admin@test.com / 123456</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;