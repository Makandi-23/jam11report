import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Filter, X, MapPin, Clock, 
  ChevronLeft, ChevronRight, FileText 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
}

const MyReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const reportsPerPage = 6;

  const categories = [
    { id: 'security', name: 'Security', icon: '🛡️', color: 'bg-red-100 text-red-700' },
    { id: 'environment', name: 'Environment', icon: '🌿', color: 'bg-green-100 text-green-700' },
    { id: 'health', name: 'Health', icon: '➕', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'other', name: 'Other', icon: 'ℹ️', color: 'bg-slate-100 text-slate-700' }
  ];

  const statusOptions = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700' }
  ];

  useEffect(() => {
    fetchMyReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

 const fetchMyReports = async () => {
  try {
    const response = await fetch('http://localhost/jam11report/backend/api/reports/all_reports.php');
    const data = await response.json();
    
    // Filter reports to show only current user's reports
    const userReports = (data.reports || [])
      .filter((report: any) => report.reporter_name === user?.name)
      .map((report: any) => {
        // Map backend status to frontend status
        const mapStatus = (backendStatus: string): 'pending' | 'in-progress' | 'resolved' => {
          switch (backendStatus) {
            case 'in_progress': return 'in-progress';
            case 'resolved': return 'resolved';
            default: return 'pending';
          }
        };
        
        return {
          id: parseInt(report.id),
          title: report.title,
          description: report.description,
          category: report.category.toLowerCase(),
          ward: report.ward,
          status: mapStatus(report.status), // Use REAL status from API
          votes: parseInt(report.vote_count) || 0,
          createdAt: report.created_at
        };
      });
    
    setReports(userReports);
  } catch (error) {
    console.error('Error fetching my reports:', error);
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
    setFilters({ category: '', status: '', search: '' });
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
  
  if (diffInHours === 0) {
    return 'just now';
  } else if (diffInHours === 1) {
    return '1h ago';  // Fixed "1th" to "1h"
  } else if (diffInHours < 24) {
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
            <p className="text-gray-600">Loading your reports...</p>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reports</h1>
            <p className="text-gray-600">View and manage all reports you've submitted</p>
            <div className="mt-4 text-lg font-semibold text-deepTeal">
              {reports.length} report{reports.length !== 1 ? 's' : ''} submitted
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md mb-8"
          >
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-deepTeal focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your reports..."
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
          </motion.div>

          {/* Reports Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentReports.map((report, index) => {
              const categoryInfo = getCategoryInfo(report.category);
              const statusInfo = getStatusInfo(report.status);
              
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-deepTeal hover:underline transition">
                      {report.title}
                    </h3>
                  </Link>

                  {/* Description Preview */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {report.description}
                  </p>

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

                  {/* Votes */}
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-1" />
                    {report.votes} votes
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {reports.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-600 mb-6">You haven't submitted any reports yet</p>
              <Link to="/report" className="btn-primary">
                Submit Your First Report
              </Link>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
        </div>
      </main>

      <Footer variant="dashboard" />
    </div>
  );
};

export default MyReportsPage;