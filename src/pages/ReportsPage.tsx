import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, MapPin, TrendingUp, Clock, 
  ChevronLeft, ChevronRight, BarChart3 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVote } from '../hooks/useVote';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  ward: string;
  status: 'pending' | 'in-progress' | 'resolved';
  votes: number;
  createdAt: string;
  userId: number;
}

interface FilterState {
  category: string;
  status: string;
  search: string;
  ward: string;
}

const ReportsPage: React.FC = () => {
  const { user, token } = useAuth();
  const { vote, hasVoted, isVoting } = useVote();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    status: '',
    search: '',
    ward: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });

  const reportsPerPage = 6;

  const categories = [
    { id: 'security', name: 'Security', icon: '🛡️', color: 'bg-red-100 text-red-700', bgColor: 'bg-red-500' },
    { id: 'environment', name: 'Environment', icon: '🌿', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-500' },
    { id: 'health', name: 'Health', icon: '➕', color: 'bg-emerald-100 text-emerald-700', bgColor: 'bg-emerald-500' },
    { id: 'other', name: 'Other', icon: 'ℹ️', color: 'bg-slate-100 text-slate-700', bgColor: 'bg-slate-500' }
  ];

  const statusOptions = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700', bgColor: 'bg-yellow-500' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-500' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-500' }
  ];

  const wards = ['Lindi', 'Laini Saba', 'Makina', 'Woodley/Kenyatta Golf Course', "Sarang'ombe"];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data.reports || []);
      
      // Calculate stats
      const pending = data.reports?.filter((r: Report) => r.status === 'pending').length || 0;
      const inProgress = data.reports?.filter((r: Report) => r.status === 'in-progress').length || 0;
      const resolved = data.reports?.filter((r: Report) => r.status === 'resolved').length || 0;
      setStats({ pending, inProgress, resolved });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.category) {
      filtered = filtered.filter(report => report.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    if (filters.ward) {
      filtered = filtered.filter(report => report.ward === filters.ward);
    }

    if (filters.search) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', search: '', ward: '' });
  };

  const handleVote = async (reportId: number) => {
    try {
      await vote(reportId);
      fetchReports();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[3];
  };

  const getStatusInfo = (statusId: string) => {
    return statusOptions.find(status => status.id === statusId) || statusOptions[0];
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

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pale">
      <Header />
      
      <main className="pt-16">
        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-40 bg-gradient-to-r from-deepTeal to-pale shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward Filter */}
              <div className="relative">
                <select
                  value={filters.ward}
                  onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                >
                  <option value="">All Wards</option>
                  {wards.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-transparent"
                />
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 border-2 border-deepTeal text-deepTeal rounded-lg hover:bg-deepTeal hover:text-white transition"
              >
                <X className="w-4 h-4 inline mr-2" />
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Reports Overview</h2>
              <BarChart3 className="w-6 h-6 text-deepTeal" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.pending / (stats.pending + stats.inProgress + stats.resolved)) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-2 bg-yellow-500 rounded-full mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.inProgress / (stats.pending + stats.inProgress + stats.resolved)) * 100}%` }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="h-2 bg-blue-500 rounded-full mt-2"
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <div className="text-sm text-gray-600">Resolved</div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.resolved / (stats.pending + stats.inProgress + stats.resolved)) * 100}%` }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="h-2 bg-green-500 rounded-full mt-2"
                />
              </div>
            </div>
          </motion.div>

          {/* Reports Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {currentReports.map((report, index) => {
                const categoryInfo = getCategoryInfo(report.category);
                const statusInfo = getStatusInfo(report.status);
                
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-deepTeal/20 group"
                  >
                    {/* Category & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                        <span className="mr-2">{categoryInfo.icon}</span>
                        {categoryInfo.name}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.name}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/reports/${report.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-deepTeal group-hover:underline transition">
                        {report.title}
                      </h3>
                    </Link>

                    {/* Ward & Date */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {report.ward}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {timeAgo(report.createdAt)}
                      </div>
                    </div>

                    {/* Vote Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {report.votes} votes
                      </div>
                      <button
                        onClick={() => handleVote(report.id)}
                        disabled={!user || hasVoted(report.id) || isVoting(report.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          hasVoted(report.id)
                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                            : 'bg-deepTeal text-white hover:bg-deepTeal/90 hover:shadow-lg hover:shadow-deepTeal/25'
                        }`}
                      >
                        {hasVoted(report.id) ? 'Voted' : 'Vote'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-deepTeal text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <Link to="/report" className="btn-primary">
                Report New Issue
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportsPage;