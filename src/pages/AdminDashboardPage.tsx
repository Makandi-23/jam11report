import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, TrendingUp, Clock, CheckCircle, Users, 
  FileText, MapPin, BarChart3, Calendar, Eye, Edit, 
  Trash2, ArrowUp, ArrowDown
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
  newReports: number;
  activeReports: number;
}

interface Activity {
  id: number;
  type: 'new_report' | 'status_change' | 'urgent_mark';
  title: string;
  time: string;
  user: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0, pending: 0, inProgress: 0, resolved: 0, newReports: 0, activeReports: 0
  });
  const [urgentReports, setUrgentReports] = useState<Report[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      setStats({ 
        ...statsData, 
        newReports: 12, // Mock new reports in last 7 days
        activeReports: statsData.pending + statsData.inProgress
      });

      // Fetch urgent reports (top by votes)
      const urgentResponse = await fetch('/api/reports?page=1&limit=5');
      const urgentData = await urgentResponse.json();
      setUrgentReports(urgentData.reports || []);

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'new_report', title: 'New security report in Lindi', time: '2 minutes ago', user: 'John Doe' },
        { id: 2, type: 'status_change', title: 'Drainage issue marked as resolved', time: '15 minutes ago', user: 'Admin' },
        { id: 3, type: 'urgent_mark', title: 'Street lighting marked as urgent', time: '1 hour ago', user: 'Admin' },
        { id: 4, type: 'new_report', title: 'Garbage collection issue reported', time: '2 hours ago', user: 'Jane Smith' },
        { id: 5, type: 'status_change', title: 'Water shortage in progress', time: '3 hours ago', user: 'Admin' },
      ]);
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

  const markAsUrgent = async (reportId: number) => {
    // Mock urgent marking - REPLACE with real API call
    console.log('Marking report as urgent:', reportId);
    // Refresh data after marking
    fetchAdminData();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_report':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'status_change':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'urgent_mark':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
        className="bg-gradient-to-r from-deepTeal to-primary text-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90">
              Here's what's happening in the community today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-white/80">
              {currentTime.toLocaleDateString([], { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 bg-deepTeal/10 rounded-lg">
              <FileText className="w-6 h-6 text-deepTeal" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <div className="flex items-center">
                <motion.p 
                  className="text-2xl font-bold text-deepTeal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {stats.total}
                </motion.p>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  +5%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Reports</p>
              <div className="flex items-center">
                <motion.p 
                  className="text-2xl font-bold text-yellow-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {stats.activeReports}
                </motion.p>
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  -2%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reports Resolved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <div className="flex items-center">
                <motion.p 
                  className="text-2xl font-bold text-green-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {stats.resolved}
                </motion.p>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  +12%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Reports (Last 7 Days) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Reports (7d)</p>
              <div className="flex items-center">
                <motion.p 
                  className="text-2xl font-bold text-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {stats.newReports}
                </motion.p>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  +8%
                </span>
              </div>
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
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-500">Sorted by votes</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {urgentReports.slice(0, 5).map((report, index) => (
              <motion.div 
                key={report.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  report.votes > 30 
                    ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(report.category)}</span>
                      <Link 
                        to={`/reports/${report.id}`}
                        className="font-medium text-gray-900 text-sm hover:text-deepTeal hover:underline"
                      >
                        {report.title}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.ward}
                      </div>
                      <span>{timeAgo(report.createdAt)}</span>
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          className="font-medium"
                        >
                          {report.votes} votes
                        </motion.span>
                      </div>
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-1">
                    <button
                      onClick={() => markAsUrgent(report.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Mark Urgent
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'in-progress')}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <Link 
            to="/admin/urgent" 
            className="block text-center text-deepTeal hover:text-deepTeal/80 font-medium mt-4"
          >
            View All Urgent Issues →
          </Link>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>by {activity.user}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reports by Category Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Reports by Category</h2>
          <BarChart3 className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { category: 'Security', count: 15, color: 'bg-red-500', icon: '🛡️' },
            { category: 'Environment', count: 23, color: 'bg-green-500', icon: '🌿' },
            { category: 'Health', count: 8, color: 'bg-emerald-500', icon: '➕' },
            { category: 'Other', count: 12, color: 'bg-slate-500', icon: 'ℹ️' }
          ].map((item, index) => (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-3">
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {item.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{item.count}</div>
              <div className="text-sm text-gray-600 mb-3">{item.category}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / 58) * 100}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 1 }}
                  className={`${item.color} h-2 rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
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