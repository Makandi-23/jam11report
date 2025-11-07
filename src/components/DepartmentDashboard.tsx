import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, MapPin, Clock, ThumbsUp, AlertTriangle, 
  Play, CheckCircle, Upload, Shield, Leaf, Heart, Info
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
  proofImage?: string;
  adminNotes?: string;
  assignedDepartment?: string;
}

const DepartmentDashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [reportToUpload, setReportToUpload] = useState<Report | null>(null);

  const [userDepartment, setUserDepartment] = useState<string>('');

  const statusOptions = [
    { id: 'assigned', name: 'Assigned', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'awaiting-verification', name: 'Awaiting Verification', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  ];

  const categories = [
    { id: 'security', name: 'Security', icon: Shield, color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'environment', name: 'Environment', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'health', name: 'Health', icon: Heart, color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'other', name: 'Other', icon: Info, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];

  useEffect(() => {
    // Get user department from localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    setUserDepartment(user?.department || '');
    
    fetchDepartmentReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchDepartmentReports = async () => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const department = user?.department;

      if (!department) {
        console.error('No department found for user');
        return;
      }

      const response = await fetch(`http://localhost/jam11report/backend/api/reports/department_reports.php?department=${department}`);
      const data = await response.json();

      if (data.success) {
        const transformedReports = data.reports.map((report: any) => ({
          id: report.id,
          title: report.title,
          ward: report.ward,
          category: report.category.toLowerCase() as 'security' | 'environment' | 'health' | 'other',
          status: mapBackendStatusToFrontend(report.status),
          dateReported: report.created_at,
          votes: report.vote_count,
          reporter: report.reporter_name,
          description: report.description,
          isUrgent: report.is_urgent,
          proofImage: report.proof_image,
          adminNotes: report.admin_notes,
          assignedDepartment: report.assigned_department
        }));
        
        setReports(transformedReports);
      } else {
        console.error('Error fetching reports:', data.message);
      }
    } catch (error) {
      console.error('Error fetching department reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapBackendStatusToFrontend = (backendStatus: string): 'pending' | 'in-progress' | 'resolved' | 'assigned' | 'awaiting-verification' => {
    switch (backendStatus) {
      case 'in_progress': return 'in-progress';
      case 'resolved': return 'resolved';
      case 'assigned': return 'assigned';
      case 'awaiting_verification': return 'awaiting-verification';
      default: return 'pending';
    }
  };

  const mapFrontendStatusToBackend = (frontendStatus: string): string => {
    switch (frontendStatus) {
      case 'in-progress': return 'in_progress';
      case 'awaiting-verification': return 'awaiting_verification';
      default: return frontendStatus;
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

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

  const handleStartWork = async (reportId: number) => {
    try {
      const response = await fetch('http://localhost/jam11report/backend/api/reports/update_department_status.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reportId,
          status: 'in_progress'
        }),
      });

      if (response.ok) {
        setReports(prev =>
          prev.map(report =>
            report.id === reportId ? { ...report, status: 'in-progress' } : report
          )
        );

        if (selectedReport?.id === reportId) {
          setSelectedReport(prev => prev ? { ...prev, status: 'in-progress' } : null);
        }
        
        console.log('Started work on report:', reportId);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error starting work:', error);
    }
  };

  const handleUploadProof = async (reportId: number, proofDescription: string) => {
    try {
      const response = await fetch('http://localhost/jam11report/backend/api/reports/update_department_status.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reportId,
          status: 'awaiting_verification',
          admin_notes: proofDescription
        }),
      });

      if (response.ok) {
        setReports(prev =>
          prev.map(report =>
            report.id === reportId ? { 
              ...report, 
              status: 'awaiting-verification',
              adminNotes: proofDescription
            } : report
          )
        );

        if (selectedReport?.id === reportId) {
          setSelectedReport(prev => prev ? { 
            ...prev, 
            status: 'awaiting-verification',
            adminNotes: proofDescription
          } : null);
        }
        
        console.log('Uploaded proof for report:', reportId);
      } else {
        throw new Error('Failed to upload proof');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
    }
  };

  const stats = [
    { label: 'Assigned', value: reports.filter(r => r.status === 'assigned').length, color: 'bg-purple-500' },
    { label: 'In Progress', value: reports.filter(r => r.status === 'in-progress').length, color: 'bg-blue-500' },
    { label: 'Awaiting Review', value: reports.filter(r => r.status === 'awaiting-verification').length, color: 'bg-indigo-500' },
    { label: 'Urgent', value: reports.filter(r => r.isUrgent).length, color: 'bg-red-500' }
  ];

  // Upload Proof Modal Component (keep this the same as before)
  const UploadProofModal: React.FC<{
    report: Report;
    onUpload: (description: string) => void;
    onClose: () => void;
  }> = ({ report, onUpload, onClose }) => {
    const [proofDescription, setProofDescription] = useState('');

    const handleUpload = () => {
      if (proofDescription.trim()) {
        onUpload(proofDescription);
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Proof of Work</h3>
          <p className="text-gray-600 mb-4">Describe the work completed for "{report.title}"</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description
              </label>
              <textarea
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                placeholder="Describe what work was done, materials used, challenges faced, etc..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Proof images will be uploaded here (mock implementation)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                In real implementation, file upload would go here
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!proofDescription.trim()}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload Proof
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading department reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Reports</h1>
          <p className="text-gray-600 mt-1">Manage issues assigned to your department</p>
          
          {userDepartment && (
            <div className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium border border-teal-200 mt-2">
              <Shield className="w-3 h-3 mr-1" />
              Department: {userDepartment.charAt(0).toUpperCase() + userDepartment.slice(1)}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
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

      

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-3 items-center">
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReports.map((report, index) => {
            const categoryInfo = getCategoryInfo(report.category);
            const statusInfo = getStatusInfo(report.status);
            const CategoryIcon = categoryInfo.icon;

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
                {report.isUrgent && (
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
          <p className="text-gray-500">No reports assigned to your department</p>
        </div>
      )}

      {/* Report Detail Modal */}
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

                  {selectedReport.adminNotes && (
                    <div className="flex items-start justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Admin Instructions</span>
                      <span className="font-medium text-sm text-right max-w-xs">{selectedReport.adminNotes}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Proof of Work Section */}
                {selectedReport.proofImage && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-sm font-semibold text-green-900 mb-2">Proof of Work Submitted</h3>
                    <p className="text-green-800 text-sm mb-3">{selectedReport.adminNotes}</p>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <img 
                        src={selectedReport.proofImage} 
                        alt="Proof of work" 
                        className="mx-auto rounded-lg max-h-32 object-cover"
                      />
                      <p className="text-xs text-gray-600 mt-2">Proof image (mock)</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {selectedReport.status === 'assigned' && (
                    <button
                      onClick={() => handleStartWork(selectedReport.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {selectedReport.status === 'in-progress' && (
                    <button
                      onClick={() => {
                        setReportToUpload(selectedReport);
                        setUploadModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Proof of Work</span>
                    </button>
                  )}

                  {selectedReport.status === 'awaiting-verification' && (
                    <div className="w-full px-4 py-3 bg-indigo-100 text-indigo-800 rounded-lg font-medium text-center">
                      ✅ Proof Submitted - Awaiting Admin Verification
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Proof Modal */}
      <AnimatePresence>
        {uploadModalOpen && reportToUpload && (
          <UploadProofModal
            report={reportToUpload}
            onUpload={(description) => {
              handleUploadProof(reportToUpload.id, description);
              setUploadModalOpen(false);
              setReportToUpload(null);
            }}
            onClose={() => {
              setUploadModalOpen(false);
              setReportToUpload(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentDashboard;