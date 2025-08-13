import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, TrendingUp, Clock, CheckCircle, 
  Users, FileText, MapPin, BarChart3 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Report {
  id: number;
  title: string;
  category: string;
  ward: string;
  status: 'pending' | 'in-progress' | 'resolved';
  votes: number;
  createdAt: string;
  userId: number;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  residents: number;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ 
    total: 0, pending: 0, inProgress: 0, resolved: 0, residents: 0 
  });
  const [urgentReports, setUrgentReports] = useState<Report[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      setStats({ ...statsData, residents: 156 }); // Mock resident count

      // Fetch urgent reports (top by votes)
      const urgentResponse = await fetch('/api/reports?page=1&limit=5');
      const urgentData = await urgentResponse.json();
      setUrgentReports(urgentData.reports || []);

      // Fetch recent reports
      const recentResponse = await fetch('/api/reports?page=1&limit=8');
      const recentData = await recentResponse.json();
      setRecentReports(recentData.reports || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (reportId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh data
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return '🛡️';
      case 'environment':
        return '🌿';
      case 'health':
        return '➕';
      default:
        return 'ℹ️';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Resolved</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Unknown</span>;
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening in the community today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Residents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.residents}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Urgent Issues */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Urgent Issues</h2>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="space-y-4">
            {urgentReports.slice(0, 5).map((report) => (
              <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(report.category)}</span>
                      <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.ward}
                      </div>
                      <span>{timeAgo(report.createdAt)}</span>
                      <span>{report.votes} votes</span>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-1">
                    <button
                      onClick={() => updateReportStatus(report.id, 'in-progress')}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            {recentReports.slice(0, 6).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(report.category)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{report.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span>{report.ward}</span>
                      <span>•</span>
                      <span>{timeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(report.status)}
                  <div className="text-xs text-gray-500 mt-1">{report.votes} votes</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Reports Overview</h2>
          <BarChart3 className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
            <div className="text-sm text-gray-600 mb-2">Pending</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.pending / stats.total) * 100}%` }}
                transition={{ delay: 0.8, duration: 1 }}
                className="bg-yellow-500 h-2 rounded-full"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
            <div className="text-sm text-gray-600 mb-2">In Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                transition={{ delay: 1, duration: 1 }}
                className="bg-blue-500 h-2 rounded-full"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.resolved}</div>
            <div className="text-sm text-gray-600 mb-2">Resolved</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                transition={{ delay: 1.2, duration: 1 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;