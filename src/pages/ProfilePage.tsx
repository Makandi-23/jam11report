import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard as Edit, Camera, Mail, Phone, MapPin, Calendar, TrendingUp, FileText, CheckCircle, Globe, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { apiService } from '../services/api';


interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  ward: string;
  estate_street: string;
  role: string;
  status: string;
  created_at: string;
}

interface StatsData {
  reportsSubmitted: number;
  votesCast: number;
  issuesResolved: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<StatsData>({ reportsSubmitted: 0, votesCast: 0, issuesResolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    ward: '',
    estate_street: ''
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
      loadStats();
      loadRecentActivity();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const response = await apiService.getProfile(user!.id);
      if (response.success) {
        setProfile(response.user);
        setFormData({
          full_name: response.user.full_name,
          email: response.user.email,
          phone: response.user.phone || '',
          ward: response.user.ward || '',
          estate_street: response.user.estate_street || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

 const loadStats = async () => {
  try {
    const response = await apiService.getUserStats(user!.id);
    if (response.success) {
      setStats({
        reportsSubmitted: response.reports_submitted,
        votesCast: response.votes_cast,
        issuesResolved: response.issues_resolved
      });
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const loadRecentActivity = async () => {
  try {
    const response = await apiService.getUserReports(user!.id);
    if (response.reports) {
      // Convert reports to activity items
      const activities = response.reports.slice(0, 5).map((report: any) => ({
        id: report.id,
        type: 'report',
        title: `Reported: ${report.title}`,
        category: report.category,
        date: formatTimeAgo(report.created_at),
        icon: getCategoryIcon(report.category),
        status: report.status
      }));
      
      // You can add votes activity here once you have the data
      setRecentActivity(activities);
    }
  } catch (error) {
    console.error('Error loading recent activity:', error);
  }
};

// Helper function to format date
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Helper function to get icons based on category
const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'security': '🛡️',
    'environment': '🌿',
    'infrastructure': '🏗️',
    'sanitation': '🗑️',
    'other': '📋'
  };
  return icons[category] || '📋';
};

  const handleSaveProfile = async () => {
    try {
      const updateData = {
        id: user!.id,
        ...formData
      };

      const response = await apiService.updateProfile(updateData);
      
      if (response.success) {
        // Refresh profile data
        await loadProfileData();
        setIsEditing(false);
        // Show success message
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone || '',
        ward: profile.ward || '',
        estate_street: profile.estate_street || ''
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }
   const badges = [
    { id: 'bronze', name: 'Bronze Helper', icon: '🥉', description: 'Submitted your first report', earned: stats.reportsSubmitted >= 1 },
    { id: 'silver', name: 'Silver Guardian', icon: '🥈', description: 'Submitted 10 reports', earned: stats.reportsSubmitted >= 10 },
    { id: 'gold', name: 'Gold Hero', icon: '🥇', description: 'Helped resolve 25 community issues', earned: stats.issuesResolved >= 25 }
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
  <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
  <div className="flex items-center text-gray-600 mt-1">
    <MapPin className="w-4 h-4 mr-2" />
    {profile.ward} Ward
  </div>
  <div className="flex items-center text-gray-500 mt-1">
    <Calendar className="w-4 h-4 mr-2" />
    Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
  </div>
</div>
              </div>

              {isEditing ? (
  <>
    <button
      onClick={handleSaveProfile}
      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium flex items-center"
    >
      <Save className="w-4 h-4 inline mr-2" />
      Save Changes
    </button>
    <button
      onClick={handleCancelEdit}
      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium flex items-center"
    >
      <X className="w-4 h-4 inline mr-2" />
      Cancel
    </button>
  </>
) : (
  <button
    onClick={() => setIsEditing(true)}
    className="px-6 py-3 bg-deepTeal text-white rounded-xl hover:bg-deepTeal/90 transition font-medium flex items-center"
  >
    <Edit className="w-4 h-4 inline mr-2" />
    Edit Profile
  </button>
)}
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
  value={formData.full_name}
  onChange={(e) => handleInputChange('full_name', e.target.value)}
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
  value={formData.email}
  onChange={(e) => handleInputChange('email', e.target.value)}
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
  value={formData.phone}
  onChange={(e) => handleInputChange('phone', e.target.value)}
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
  value={formData.ward}
  onChange={(e) => handleInputChange('ward', e.target.value)}
  disabled={!isEditing}
  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition ${
    isEditing 
      ? 'border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent' 
      : 'border-gray-100 bg-gray-50'
  }`}
>
  <option value="">Select Ward</option>
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
      <span className="text-2xl font-bold text-deepTeal">{stats.reportsSubmitted}</span>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-deepTeal" />
        <span className="text-gray-700">Votes Cast</span>
      </div>
      <span className="text-2xl font-bold text-deepTeal">{stats.votesCast}</span>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-deepTeal" />
        <span className="text-gray-700">Issues Resolved</span>
      </div>
      <span className="text-2xl font-bold text-deepTeal">{stats.issuesResolved}</span>
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

     <Footer variant="dashboard" />
    </div>
  );
};

export default ProfilePage;