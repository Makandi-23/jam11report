import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle, Clock, TrendingUp, AlertTriangle,
  Users, BarChart3, Calendar, MapPin, Eye, Edit, Trash2,
  ArrowUp, ArrowDown, Play, Pause
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  total: number;
  active: number;
  resolved: number;
  newReports: number;
  totalChange: number;
  activeChange: number;
  resolvedChange: number;
  newChange: number;
}

interface UrgentIssue {
  id: number;
  title: string;
  category: string;
  ward: string;
  votes: number;
  createdAt: string;
  status: string;
}

interface Activity {
  id: number;
  type: 'new_report' | 'status_change' | 'urgent_mark';
  title: string;
  user: string;
  timestamp: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    resolved: 0,
    newReports: 0,
    totalChange: 0,
    activeChange: 0,
    resolvedChange: 0,
    newChange: 0
  });
  const [urgentIssues, setUrgentIssues] = useState<UrgentIssue[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [categoryData, setCategoryData] = useState([
    { name: 'Security', count: 23, color: 'bg-red-500', icon: '🛡️' },
    { name: 'Environment', count: 45, color: 'bg-green-500', icon: '🌿' },
    { name: 'Health', count: 18, color: 'bg-emerald-500', icon: '➕' },
    { name: 'Other', count: 12, color: 'bg-slate-500', icon: 'ℹ️' }
  ]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      
      // Mock additional data for demo
      setStats({
        total: statsData.total || 98,
        active: (statsData.pending || 0) + (statsData.inProgress || 0),
        resolved: statsData.resolved || 67,
        newReports: 12,
        totalChange: 8.5,
        activeChange: -3.2,
        resolvedChange: 15.7,
        newChange: 22.1
      });

      // Mock urgent issues
      setUrgentIssues([
        {
          id: 1,
          title: "Open drain causing flooding on main road",
          category: "environment",
          ward: "Lindi",
          votes: 67,
          createdAt: "2025-01-15T10:00:00Z",
          status: "pending"
        },
        {
          id: 2,
          title: "Street fights disrupting market business",
          category: "security",
          ward: "Makina",
          votes: 54,
          createdAt: "2025-01-12T15:40:00Z",
          status: "pending"
        },
        {
          id: 3,
          title: "Water shortage affecting entire neighborhood",
          category: "health",
          ward: "Sarang'ombe",
          votes: 43,
          createdAt: "2025-01-10T11:30:00Z",
          status: "in-progress"
        }
      ]);

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'new_report',
          title: 'New garbage collection issue reported',
          user: 'John Mwangi',
          timestamp: '5m ago'
        },
        {
          id: 2,
          type: 'status_change',
          title: 'Streetlight issue marked as resolved',
          user: 'Admin',
          timestamp: '12m ago'
        },
        {
          id: 3,
          type: 'urgent_mark',
          title: 'Drainage issue marked as urgent',
          user: 'Admin',
          timestamp: '1h ago'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🛡️';
      case 'environment': return '🌿';
      case 'health': return '➕';
      default: return 'ℹ️';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_report': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'status_change': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'urgent_mark': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleStatusChange = async (issueId: number, newStatus: string) => {
    // Mock status update
    setUrgentIssues(prev => 
      prev.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      change: stats.totalChange,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Reports',
      value: stats.active,
      change: stats.activeChange,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Reports Resolved',
      value: stats.resolved,
      change: stats.resolvedChange,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'New Reports (7d)',
      value: stats.newReports,
      change: stats.newChange,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name} 👋
              </h1>
              <p className="text-white/90 text-lg">
                Here's the latest on community reports across all wards
              </p>
            </div>
            <div className="mt-4 lg:mt-0 text-right">
              <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
              <div className="text-white/80">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  card.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              <div>
                <motion.div
                  className="text-3xl font-bold text-gray-900 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    {card.value}
                  </motion.span>
                </motion.div>
                <p className="text-gray-600 font-medium">{card.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Urgent Issues Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Urgent Issues
            </h2>
            <span className="text-sm text-gray-500">Sorted by votes</span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {urgentIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                  issue.votes > 50 
                    ? 'border-red-200 bg-red-50 shadow-red-100' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {issue.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{issue.ward}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.div
                      className="text-lg font-bold text-red-600"
                      animate={{ scale: issue.votes > 50 ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 2, repeat: issue.votes > 50 ? Infinity : 0 }}
                    >
                      {issue.votes}
                    </motion.div>
                    <div className="text-xs text-gray-500">votes</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(issue.id, 'in-progress')}
                    className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Play className="w-3 h-3 inline mr-1" />
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(issue.id, 'resolved')}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Resolve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reports by Category Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-6 h-6 text-primary mr-2" />
              Reports by Category
            </h2>
          </div>
          
          <div className="space-y-4">
            {categoryData.map((category, index) => {
              const total = categoryData.reduce((sum, cat) => sum + cat.count, 0);
              const percentage = (category.count / total) * 100;
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{category.count}</span>
                      <span className="text-sm text-gray-500 ml-1">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${category.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 text-primary mr-2" />
            Recent Activity
          </h2>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">
                  by {activity.user} • {activity.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;