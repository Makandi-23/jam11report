import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard as Edit, Camera, Mail, Phone, MapPin, Calendar, TrendingUp, FileText, CheckCircle, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const [isEditing, setIsEditing] = useState(false);

  const badges = [
    { id: 'bronze', name: 'Bronze Helper', icon: '🥉', description: 'Submitted your first report', earned: true },
    { id: 'silver', name: 'Silver Guardian', icon: '🥈', description: 'Submitted 10 reports', earned: false },
    { id: 'gold', name: 'Gold Hero', icon: '🥇', description: 'Helped resolve 25 community issues', earned: false }
  ];

  const recentActivity = [
    { id: 1, type: 'report', title: 'Reported broken streetlight', category: 'security', date: '2 days ago', icon: '🛡️' },
    { id: 2, type: 'vote', title: 'Voted on drainage issue', category: 'environment', date: '3 days ago', icon: '🌿' },
    { id: 3, type: 'resolved', title: 'Your garbage report was resolved', category: 'environment', date: '1 week ago', icon: '🌿' }
  ];

  return (
    <div className="min-h-screen bg-pale">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-md mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center space-x-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-deepTeal text-white rounded-full flex items-center justify-center hover:bg-deepTeal/90 transition">
                    <Camera className="w-4 h-4" />
                  </button>
                </motion.div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user?.ward} Ward
                  </div>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since January 2025
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-deepTeal text-white rounded-xl hover:bg-deepTeal/90 transition font-medium"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        defaultValue={user?.name}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition ${
                          isEditing 
                            ? 'border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent' 
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        defaultValue={user?.email}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition ${
                          isEditing 
                            ? 'border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent' 
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition ${
                          isEditing 
                            ? 'border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent' 
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ward</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        defaultValue={user?.ward}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border transition ${
                          isEditing 
                            ? 'border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent' 
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <option value="Lindi">Lindi</option>
                        <option value="Laini Saba">Laini Saba</option>
                        <option value="Makina">Makina</option>
                        <option value="Woodley/Kenyatta Golf Course">Woodley/Kenyatta Golf Course</option>
                        <option value="Sarang'ombe">Sarang'ombe</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-500">{activity.date}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.type === 'resolved' ? 'bg-green-100 text-green-700' :
                        activity.type === 'vote' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {activity.type}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Activity Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-deepTeal" />
                      <span className="text-gray-700">Reports Submitted</span>
                    </div>
                    <span className="text-2xl font-bold text-deepTeal">3</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-deepTeal" />
                      <span className="text-gray-700">Votes Cast</span>
                    </div>
                    <span className="text-2xl font-bold text-deepTeal">12</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-deepTeal" />
                      <span className="text-gray-700">Issues Resolved</span>
                    </div>
                    <span className="text-2xl font-bold text-deepTeal">2</span>
                  </div>
                </div>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Badges</h3>
                
                <div className="space-y-3">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: badge.earned ? 1.05 : 1 }}
                      className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                        badge.earned 
                          ? 'border-deepTeal bg-deepTeal/5 hover:shadow-lg hover:shadow-deepTeal/20' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                      title={badge.description}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <div className={`font-medium ${badge.earned ? 'text-deepTeal' : 'text-gray-500'}`}>
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-500">{badge.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Language Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
                
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                        language === 'en'
                          ? 'bg-white text-deepTeal shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('sw')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                        language === 'sw'
                          ? 'bg-white text-deepTeal shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      SW
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;