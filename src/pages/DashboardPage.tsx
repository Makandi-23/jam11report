import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, CheckCircle, AlertTriangle, User, Edit, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { useVote } from '../hooks/useVote';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnnouncementsWidget from '../components/dashboard/AnnouncementsWidget';

interface Report {
  id: number;
  title: string;
  category: string;
  ward: string;
  status: 'pending' | 'in-progress' | 'resolved';
  votes: number;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { vote, hasVoted, isVoting } = useVote();
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [urgentIssues, setUrgentIssues] = useState<Report[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch urgent issues (top 5 by votes)
      const urgentResponse = await fetch('/api/reports?page=1&limit=5');
      const urgentData = await urgentResponse.json();
      setUrgentIssues(urgentData.reports || []);

      // Fetch recent reports from user's ward
      const recentResponse = await fetch(`/api/reports?ward=${user?.ward}&page=1&limit=5`);
      const recentData = await recentResponse.json();
      setRecentReports(recentData.reports || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (reportId: number) => {
    try {
      await vote(reportId);
      // Refresh data after voting
      fetchDashboardData();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge-pending">Pending</span>;
      case 'in-progress':
        return <span className="badge-progress">In Progress</span>;
      case 'resolved':
        return <span className="badge-resolved">Resolved</span>;
      default:
        return <span className="badge-pending">Unknown</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return '🛡️';
      case 'environment':
        return '🌱';
      case 'health':
        return '🏥';
      default:
        return '📋';
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-md mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Side - Profile Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                    alt={user?.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                  />
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-deepTeal text-white rounded-full flex items-center justify-center hover:bg-deepTeal/90 transition">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.ward} Ward</p>
                  <p className="text-sm text-gray-500">Member since January 2025</p>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 border-2 border-deepTeal text-deepTeal rounded-lg hover:bg-deepTeal hover:text-white transition font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit Profile
                </button>
              </div>

              {/* Right Side - Activity Stats */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-deepTeal">3</div>
                  <div className="text-sm text-gray-600">Reports Submitted</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-deepTeal">12</div>
                  <div className="text-sm text-gray-600">Votes Cast</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl font-bold text-deepTeal">2</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('dashboard.greeting', { name: user?.name || 'Friend', ward: user?.ward || 'your area' })}
            </h1>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-info-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-info-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-3 bg-success-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <AnnouncementsWidget />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Urgent Issues */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Top Urgent Issues</h2>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              
              <div className="space-y-4">
                {urgentIssues.map((issue, index) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                        <h3 className="font-medium text-gray-900 text-sm">{issue.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>{issue.ward}</span>
                        <span>•</span>
                        <span>{timeAgo(issue.createdAt)}</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-amber-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((issue.votes / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <button
                        onClick={() => handleVote(issue.id)}
                        disabled={hasVoted(issue.id) || isVoting(issue.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          hasVoted(issue.id)
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {hasVoted(issue.id) ? 'Voted' : 'Vote'}
                      </button>
                      <p className="text-xs text-gray-600 mt-1">{issue.votes} votes</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                to="/reports" 
                className="block text-center text-primary hover:text-primary/80 font-medium mt-4"
              >
                View All Reports →
              </Link>
            </motion.div>

            {/* Recent Reports */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="card"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Reports in {user?.ward}</h2>
              
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getCategoryIcon(report.category)}</span>
                        <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>{timeAgo(report.createdAt)}</span>
                        <span>•</span>
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <button
                        onClick={() => handleVote(report.id)}
                        disabled={hasVoted(report.id) || isVoting(report.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                          hasVoted(report.id)
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {hasVoted(report.id) ? 'Voted' : 'Vote'}
                      </button>
                      <p className="text-xs text-gray-600 mt-1">{report.votes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Gamification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card mt-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Contributor</h3>
                <p className="text-gray-600">You're making a difference! Keep reporting and voting.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🥉</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Bronze</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress to Silver</span>
                <span>3/10 reports</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ward</label>
                <select
                  defaultValue={user?.ward}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                >
                  <option value="Lindi">Lindi</option>
                  <option value="Laini Saba">Laini Saba</option>
                  <option value="Makina">Makina</option>
                  <option value="Woodley/Kenyatta Golf Course">Woodley/Kenyatta Golf Course</option>
                  <option value="Sarang'ombe">Sarang'ombe</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-deepTeal text-white rounded-lg hover:bg-deepTeal/90 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Floating Action Button */}
      <Link
        to="/report"
        className="fixed bottom-6 right-6 w-14 h-14 bg-mystic text-white rounded-full shadow-lg flex items-center justify-center hover:bg-mystic/90 transition transform hover:scale-110 z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>

      <Footer variant="dashboard" />
    </div>
  );
};

export default DashboardPage;