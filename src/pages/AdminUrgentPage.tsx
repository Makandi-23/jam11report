import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, MapPin, TrendingUp, Clock, 
  CheckCircle, Play, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';

interface UrgentIssue {
  id: number;
  title: string;
  category: string;
  ward: string;
  votes: number;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'resolved';
  isMarkedUrgent: boolean;
  reporter: string;
}

const AdminUrgentPage: React.FC = () => {
  const [urgentIssues, setUrgentIssues] = useState<UrgentIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<UrgentIssue[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssues, setSelectedIssues] = useState<number[]>([]);

  const issuesPerPage = 6;

  const filterTabs = [
    { id: 'all', label: 'All Issues', count: 0 },
    { id: 'high-votes', label: 'High Votes', count: 0 },
    { id: 'marked-urgent', label: 'Marked Urgent', count: 0 },
    { id: 'resolved', label: 'Resolved', count: 0 }
  ];

  useEffect(() => {
    fetchUrgentIssues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [urgentIssues, activeFilter]);

  const fetchUrgentIssues = async () => {
    try {
      // Mock data for demonstration
      const mockIssues: UrgentIssue[] = [
        {
          id: 1,
          title: "Open drain causing severe flooding on main road",
          category: "environment",
          ward: "Lindi",
          votes: 89,
          createdAt: "2025-01-15T10:00:00Z",
          status: "pending",
          isMarkedUrgent: true,
          reporter: "John Mwangi"
        },
        {
          id: 2,
          title: "Daily street fights disrupting market business",
          category: "security",
          ward: "Makina",
          votes: 76,
          createdAt: "2025-01-12T15:40:00Z",
          status: "in-progress",
          isMarkedUrgent: true,
          reporter: "Grace Wanjiku"
        },
        {
          id: 3,
          title: "Water shortage affecting 200+ families",
          category: "health",
          ward: "Sarang'ombe",
          votes: 134,
          createdAt: "2025-01-10T11:30:00Z",
          status: "pending",
          isMarkedUrgent: false,
          reporter: "David Ochieng"
        },
        {
          id: 4,
          title: "Broken streetlights creating safety hazards",
          category: "security",
          ward: "Laini Saba",
          votes: 67,
          createdAt: "2025-01-08T09:20:00Z",
          status: "resolved",
          isMarkedUrgent: true,
          reporter: "Peter Kamau"
        },
        {
          id: 5,
          title: "Garbage pile attracting disease vectors",
          category: "environment",
          ward: "Woodley",
          votes: 54,
          createdAt: "2025-01-05T14:15:00Z",
          status: "pending",
          isMarkedUrgent: false,
          reporter: "Mary Njeri"
        },
        {
          id: 6,
          title: "Collapsed bridge blocking emergency access",
          category: "other",
          ward: "Lindi",
          votes: 98,
          createdAt: "2025-01-03T16:45:00Z",
          status: "in-progress",
          isMarkedUrgent: true,
          reporter: "Samuel Kiprotich"
        }
      ];
      
      setUrgentIssues(mockIssues);
    } catch (error) {
      console.error('Error fetching urgent issues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...urgentIssues];

    switch (activeFilter) {
      case 'high-votes':
        filtered = filtered.filter(issue => issue.votes >= 50);
        break;
      case 'marked-urgent':
        filtered = filtered.filter(issue => issue.isMarkedUrgent);
        break;
      case 'resolved':
        filtered = filtered.filter(issue => issue.status === 'resolved');
        break;
      default:
        // Show all issues, sorted by votes descending
        break;
    }

    // Sort by votes descending
    filtered.sort((a, b) => b.votes - a.votes);
    
    setFilteredIssues(filtered);
    setCurrentPage(1);

    // Update filter counts
    filterTabs[0].count = urgentIssues.length;
    filterTabs[1].count = urgentIssues.filter(issue => issue.votes >= 50).length;
    filterTabs[2].count = urgentIssues.filter(issue => issue.isMarkedUrgent).length;
    filterTabs[3].count = urgentIssues.filter(issue => issue.status === 'resolved').length;
  };

  const handleMarkUrgent = async (issueId: number) => {
    setUrgentIssues(prev =>
      prev.map(issue =>
        issue.id === issueId ? { ...issue, isMarkedUrgent: !issue.isMarkedUrgent } : issue
      )
    );
  };

  const handleStatusChange = async (issueId: number, newStatus: string) => {
    setUrgentIssues(prev =>
      prev.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus as any } : issue
      )
    );
  };

  const handleBulkMarkUrgent = async () => {
    setUrgentIssues(prev =>
      prev.map(issue =>
        selectedIssues.includes(issue.id) ? { ...issue, isMarkedUrgent: true } : issue
      )
    );
    setSelectedIssues([]);
  };

  const toggleIssueSelection = (issueId: number) => {
    setSelectedIssues(prev =>
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🛡️';
      case 'environment': return '🌿';
      case 'health': return '➕';
      default: return 'ℹ️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (dateString: string) => {
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
  const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);
  const startIndex = (currentPage - 1) * issuesPerPage;
  const currentIssues = filteredIssues.slice(startIndex, startIndex + issuesPerPage);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading urgent issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            Urgent Issues
          </h1>
          <p className="text-gray-600 mt-1">Prioritize and manage critical community issues</p>
        </div>
        
        {selectedIssues.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBulkMarkUrgent}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Mark {selectedIssues.length} as Urgent</span>
          </motion.button>
        )}
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Issues Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {currentIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                issue.votes > 70 
                  ? 'border-red-200 shadow-red-100' 
                  : issue.isMarkedUrgent
                  ? 'border-orange-200 shadow-orange-100'
                  : 'border-gray-200'
              } ${selectedIssues.includes(issue.id) ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Selection Checkbox */}
              <div className="flex items-start justify-between mb-4">
                <input
                  type="checkbox"
                  checked={selectedIssues.includes(issue.id)}
                  onChange={() => toggleIssueSelection(issue.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                
                {/* Vote Count with Animation */}
                <div className="text-right">
                  <motion.div
                    className={`text-2xl font-bold ${
                      issue.votes > 70 ? 'text-red-600' : 'text-primary'
                    }`}
                    animate={{ 
                      scale: issue.votes > 70 ? [1, 1.1, 1] : 1,
                      color: issue.votes > 70 ? ['#dc2626', '#ef4444', '#dc2626'] : '#77A8A8'
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: issue.votes > 70 ? Infinity : 0 
                    }}
                  >
                    {issue.votes}
                  </motion.div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    votes
                  </div>
                </div>
              </div>

              {/* Category & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                  {issue.isMarkedUrgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      URGENT
                    </span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-3 leading-tight">
                {issue.title}
              </h3>

              {/* Ward & Date */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {issue.ward}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTimeAgo(issue.createdAt)}
                </div>
              </div>

              {/* Reporter */}
              <div className="text-xs text-gray-500 mb-4">
                Reported by {issue.reporter}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkUrgent(issue.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    issue.isMarkedUrgent
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  {issue.isMarkedUrgent ? 'Unmark' : 'Mark Urgent'}
                </button>
                
                {issue.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusChange(
                      issue.id, 
                      issue.status === 'pending' ? 'in-progress' : 'resolved'
                    )}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      issue.status === 'pending'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {issue.status === 'pending' ? (
                      <>
                        <Play className="w-3 h-3 inline mr-1" />
                        Start Work
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Resolve
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No urgent issues found</h3>
          <p className="text-gray-600">
            {activeFilter === 'all' 
              ? 'All issues are under control!' 
              : 'Try adjusting your filter to see more issues.'}
          </p>
        </motion.div>
      )}

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
        </motion.div> /* ✅ fixed closing tag */
      )}
    </div>
  );
};

export default AdminUrgentPage;