import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, X, MapPin, Clock, ThumbsUp,
  AlertTriangle, Play, CheckCircle, Shield, Leaf, Heart, Info
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  ward: string;
  category: 'security' | 'environment' | 'health' | 'other';
  status: 'pending' | 'in-progress' | 'resolved' | 'assigned' | 'awaiting-verification';
  dateReported: string;
  votes: number;
  reporter: string;
  description: string;
  isUrgent: boolean;
   proofImage?: string;       // NEW
  adminNotes?: string;       // NEW
  assignedDepartment?: string; // NEW
  assignedAdminId?: number;
}

const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
const [reportToAssign, setReportToAssign] = useState<Report | null>(null);

  const categories = [
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'environment', name: 'Environment', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'other', name: 'Other', icon: Info, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];

 const statusOptions = [
  { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'assigned', name: 'Assigned', color: 'bg-purple-100 text-purple-700 border-purple-200' }, // 🆕 ADD THIS
  { id: 'awaiting-verification', name: 'Awaiting Verification', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, // 🆕 ADD THIS
  { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700 border-green-200' }
];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
  try {
     const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const userDepartment = user?.department;
    const response = await fetch('http://localhost/jam11report/backend/api/reports/all_reports.php');
    const data = await response.json();

    let reportsData = data.reports || [];
    
    // Filter reports based on admin department
    if (userDepartment && userDepartment !== 'all') {
      reportsData = reportsData.filter((report: any) => 
        report.category.toLowerCase() === userDepartment.toLowerCase()
      );
    }
    
    const transformedReports = (data.reports || []).map((report: any) => {
      // Calculate urgency based on votes and other factors
      const votes = parseInt(report.vote_count) || 0;
      const isUrgent = votes >= 30 || report.is_urgent === "1";
      
      return {
        id: parseInt(report.id),
        title: report.title,
        ward: report.ward,
        category: report.category.toLowerCase() as 'security' | 'environment' | 'health' | 'other',
        status: mapBackendStatusToFrontend(report.status),
        dateReported: report.created_at,
        votes: votes,
        reporter: report.reporter_name,
        description: report.description || '',
        isUrgent: isUrgent,
        proofImage: report.proof_image, // Add this
        adminNotes: report.admin_notes,
        assignedDepartment: report.assigned_department // Add this
      };
    });
    
   setReports(transformedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
  } finally {
    setIsLoading(false);
  }
};

const mapBackendStatusToFrontend = (backendStatus: string): 'pending' | 'in-progress' | 'resolved' => {
  switch (backendStatus) {
    case 'in_progress': return 'in-progress';
    case 'resolved': return 'resolved';
    default: return 'pending';
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
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchLower) ||
        report.ward.toLowerCase().includes(searchLower) ||
        report.reporter.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  };

  const exportData = () => {
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

 const handleMarkUrgent = async (reportId: number) => {
  try {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, isUrgent: !report.isUrgent } : report
      )
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, isUrgent: !prev.isUrgent } : null);
    }

    // Send to backend
    const response = await fetch('http://localhost/jam11report/backend/api/reports/update_status.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reportId,
        status: 'pending', // Keep same status
        is_urgent: true // Mark as urgent
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to mark as urgent');
    }

  } catch (error) {
    console.error('Error marking as urgent:', error);
  }
};

const handleAssignDepartment = async (reportId: number, department: string, notes: string) => {
  try {
    // Call backend API FIRST
    const response = await fetch('http://localhost/jam11report/backend/api/reports/assign_department.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reportId,
        department: department,
        notes: notes
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign department');
    }

    const result = await response.json();
    console.log('Assignment successful:', result);

    // Only update UI after successful backend update
    setReports(prev =>
      prev.map(report =>
        report.id === reportId 
          ? { 
              ...report, 
              status: 'assigned',
              assignedDepartment: department,
              adminNotes: notes
            } 
          : report
      )
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { 
        ...prev, 
        status: 'assigned',
        assignedDepartment: department,
        adminNotes: notes
      } : null);
    }
    
  } catch (error) {
    console.error('Error assigning department:', error);
    // Optionally show error message to user
  }
};

 const handleStatusChange = async (reportId: number, newStatus: 'pending' | 'in-progress' | 'resolved') => {
  try {
    // Map frontend status to backend status
    const mapStatusToBackend = (status: string): string => {
      switch (status) {
        case 'in-progress': return 'in_progress';
        case 'resolved': return 'resolved';
        default: return 'pending';
      }
    };

    const backendStatus = mapStatusToBackend(newStatus);
    
    // Update UI optimistically
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );

    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // Send to backend
    const response = await fetch('http://localhost/jam11report/backend/api/reports/update_status.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: reportId,
        status: backendStatus,
        is_urgent: false
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

  } catch (error) {
    console.error('Error updating status:', error);
    // Optionally revert UI on error
  }
};
  const stats = [
    { label: 'Total Reports', value: reports.length, color: 'bg-blue-500' },
    { label: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Urgent', value: reports.filter(r => r.isUrgent).length, color: 'bg-red-500' },
    { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, color: 'bg-green-500' }
  ];

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
  // Assign Department Modal Component
const AssignDepartmentModal: React.FC<{
  report: Report;
  onAssign: (department: string, notes: string) => void;
  onClose: () => void;
}> = ({ report, onAssign, onClose }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const departments = [
    { id: 'health', name: 'Health Department', color: 'bg-orange-100 text-orange-800' },
    { id: 'Security', name: 'Security Team', color: 'bg-red-100 text-red-800' },
    { id: 'environment', name: 'Environment Office', color: 'bg-green-100 text-green-800' }
  ];

  const handleAssign = () => {
    if (selectedDepartment) {
      onAssign(selectedDepartment, adminNotes);
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-2">Assign to Department</h3>
        <p className="text-gray-600 mb-4">Assign "{report.title}" to a department team</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Choose a department...</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions & Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any specific instructions for the department team..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedDepartment}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Assign Department
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-gray-600 mt-1">Monitor, review, and manage all community reports</p>

          {/* ADD DEPARTMENT BADGE HERE */}
    {(() => {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const userDepartment = user?.department;
      
      if (userDepartment && userDepartment !== 'all') {
        const departmentColors: { [key: string]: string } = {
          'health': 'bg-orange-100 text-orange-800 border-orange-200',
          'Security': 'bg-red-100 text-red-800 border-red-200', 
          'environment': 'bg-green-100 text-green-800 border-green-200'
        };
        
        const colorClass = departmentColors[userDepartment] || 'bg-blue-100 text-blue-800 border-blue-200';
        
        return (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClass} mt-2`}>
            <Shield className="w-3 h-3 mr-1" />
            Department: {userDepartment.charAt(0).toUpperCase() + userDepartment.slice(1)}
          </div>
        );
      }
      return null;
    })()}
        </div>
        <button
          onClick={exportData}
          className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg opacity-20`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
          >
            <option value="">All Categories ▼</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
          >
            <option value="">All Status ▼</option>
            {statusOptions.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by report, ward, or reporter..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReports.map((report, index) => {
            const categoryInfo = getCategoryInfo(report.category);
            const statusInfo = getStatusInfo(report.status);
            const CategoryIcon = categoryInfo.icon;
            const departmentColors: { [key: string]: string } = {
        'health': 'bg-orange-100 text-orange-700 border-orange-200',
        'Security': 'bg-red-100 text-red-700 border-red-200',
        'environment': 'bg-green-100 text-green-700 border-green-200'
      };

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedReport(report)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* 🆕 SHOW ASSIGNED DEPARTMENT BADGE */}
          {report.assignedDepartment && (
            <div className={`flex items-center space-x-1 mb-3 px-2 py-1 rounded-full text-xs font-semibold border w-fit ${departmentColors[report.assignedDepartment] || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
              <Shield className="w-3 h-3" />
              <span>Assigned to: {report.assignedDepartment}</span>
            </div>
          )}
               {report.isUrgent && !report.assignedDepartment && (
                  <div className="flex items-center space-x-1 mb-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full w-fit">
                    <AlertTriangle className="w-3 h-3" />
                    <span>URGENT</span>
                  </div>
                )}

                <h3 className="font-semibold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {report.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.ward}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryInfo.color}`}>
                    <CategoryIcon className="w-3 h-3 inline mr-1" />
                    {categoryInfo.name}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  by {report.reporter}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>

                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {report.votes}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTimeAgo(report.dateReported)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No reports found</p>
        </div>
      )}

      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedReport.isUrgent && (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          <span>URGENT</span>
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusInfo(selectedReport.status).color}`}>
                        {getStatusInfo(selectedReport.status).name}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Category</span>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getCategoryInfo(selectedReport.category).icon, { className: "w-4 h-4" })}
                      <span className="font-medium">{getCategoryInfo(selectedReport.category).name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Ward</span>
                    <span className="font-medium">{selectedReport.ward}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Reporter</span>
                    <span className="font-medium">{selectedReport.reporter}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Date Reported</span>
                    <span className="font-medium">{new Date(selectedReport.dateReported).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Community Votes</span>
                    <span className="font-medium flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {selectedReport.votes}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                </div>

                <div className="space-y-3">
                   {/* ADD THIS BUTTON - Show for pending reports that aren't assigned */}
  {selectedReport.status === 'pending' && !selectedReport.assignedDepartment && (
    <button
      onClick={() => {
        setReportToAssign(selectedReport);
        setAssignModalOpen(true);
      }}
      className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors"
    >
      <Shield className="w-4 h-4" />
      <span>Assign to Department</span>
    </button>
  )}

  {/* Show assigned badge if already assigned */}
  {selectedReport.assignedDepartment && (
    <div className="w-full px-4 py-3 bg-teal-100 text-teal-800 rounded-lg font-medium text-center">
      ✅ Assigned to: {selectedReport.assignedDepartment}
    </div>
  )}
                  <button
                    onClick={() => handleMarkUrgent(selectedReport.id)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedReport.isUrgent
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{selectedReport.isUrgent ? 'Unmark Urgent' : 'Mark as Urgent'}</span>
                  </button>

                  {selectedReport.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedReport.id, 'in-progress')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {selectedReport.status === 'in-progress' && (
                    <button
                      onClick={() => handleStatusChange(selectedReport.id, 'resolved')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>

    
              </div>
            </motion.div>
          </>
        )}
        {/* Assign Department Modal */}
<AnimatePresence>
  {assignModalOpen && reportToAssign && (
    <AssignDepartmentModal
      report={reportToAssign}
      onAssign={(department, notes) => {
        handleAssignDepartment(reportToAssign.id, department, notes);
        setAssignModalOpen(false);
        setReportToAssign(null);
      }}
      onClose={() => {
        setAssignModalOpen(false);
        setReportToAssign(null);
      }}
    />
  )}
</AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default AdminReportsPage;
