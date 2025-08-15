import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, Calendar, MapPin,
  FileText, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  ward: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  dateReported: string;
  votes: number;
  reporter: string;
}

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
    dateRange: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reportsPerPage = 10;
  const categories = [
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'environment', name: 'Environment', icon: '🌿' },
    { id: 'health', name: 'Health', icon: '➕' },
    { id: 'other', name: 'Other', icon: 'ℹ️' }
  ];

  const statusOptions = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700' }
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      // Mock data for demonstration
      const mockReports: Report[] = [
        {
          id: 1,
          title: "Open drain causing flooding on main road",
          ward: "Lindi",
          category: "environment",
          status: "pending",
          dateReported: "2025-01-15T10:00:00Z",
          votes: 67,
          reporter: "John Mwangi"
        },
        {
          id: 2,
          title: "Street fights disrupting market business",
          ward: "Makina",
          category: "security",
          status: "in-progress",
          dateReported: "2025-01-12T15:40:00Z",
          votes: 54,
          reporter: "Grace Wanjiku"
        },
        {
          id: 3,
          title: "Broken streetlights on residential street",
          ward: "Laini Saba",
          category: "security",
          status: "resolved",
          dateReported: "2025-01-10T09:20:00Z",
          votes: 32,
          reporter: "Peter Kamau"
        },
        {
          id: 4,
          title: "Garbage collection not happening regularly",
          ward: "Woodley",
          category: "environment",
          status: "pending",
          dateReported: "2025-01-08T14:15:00Z",
          votes: 45,
          reporter: "Mary Njeri"
        },
        {
          id: 5,
          title: "Water shortage affecting entire neighborhood",
          ward: "Sarang'ombe",
          category: "health",
          status: "in-progress",
          dateReported: "2025-01-05T11:30:00Z",
          votes: 78,
          reporter: "David Ochieng"
        }
      ];
      
      setReports(mockReports);
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

    if (filters.search) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.ward.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.reporter.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', search: '', dateRange: '' });
  };

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus as any } : report
      )
    );
  };

  const handleDelete = async (reportId: number) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
    setShowDeleteModal(null);
  };

  const exportData = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Title,Ward,Category,Status,Date Reported,Votes,Reporter\n" +
      filteredReports.map(report => 
        `${report.id},"${report.title}",${report.ward},${report.category},${report.status},${report.dateReported},${report.votes},"${report.reporter}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[3];
  };

  const getStatusInfo = (statusId: string) => {
    return statusOptions.find(status => status.id === statusId) || statusOptions[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all community reports</p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-0 z-10"
      >
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
              placeholder="Search reports, wards, or reporters..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ward</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Votes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {currentReports.map((report, index) => {
                  const categoryInfo = getCategoryInfo(report.category);
                  const statusInfo = getStatusInfo(report.status);
                  
                  return (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 truncate">{report.title}</div>
                          <div className="text-sm text-gray-500">by {report.reporter}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{report.ward}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{categoryInfo.icon}</span>
                          <span className="text-sm text-gray-900">{categoryInfo.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${statusInfo.color}`}
                        >
                          {statusOptions.map(status => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(report.dateReported)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{report.votes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(report.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + reportsPerPage, filteredReports.length)} of {filteredReports.length} results
              </div>
              <div className="flex items-center space-x-2">
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
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-primary text-white'
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
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Report</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this report? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(showDeleteModal)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReportsPage;