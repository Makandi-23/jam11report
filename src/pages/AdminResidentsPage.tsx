import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Eye, UserX, UserCheck, 
  ChevronLeft, ChevronRight, Users, UserPlus,
  Mail, Phone, MapPin, Calendar, TrendingUp,
  FileText, X, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface Resident {
  id: number;
  name: string;
  email: string;
  phone: string;
  ward: string;
  avatar: string;
  reportsSubmitted: number;
  votesCast: number;
  status: 'active' | 'suspended';
  joinedAt: string;
  lastActive: string;
  engagementScore: number;
}

const AdminResidentsPage: React.FC = () => {
  const { t } = useI18n();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [filters, setFilters] = useState({
    ward: '',
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState<{ resident: Resident; action: 'suspend' | 'activate' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0
  });

  const residentsPerPage = 10;
  const wards = ['Lindi', 'Laini Saba', 'Makina', 'Woodley/Kenyatta Golf Course', "Sarang'ombe"];

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [residents, filters]);

  const fetchResidents = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockResidents: Resident[] = [
        {
          id: 1,
          name: 'Amina Hassan',
          email: 'amina.hassan@email.com',
          phone: '+254712345678',
          ward: 'Lindi',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          reportsSubmitted: 12,
          votesCast: 45,
          status: 'active',
          joinedAt: '2024-01-15',
          lastActive: '2025-01-20',
          engagementScore: 85
        },
        {
          id: 2,
          name: 'John Mwangi',
          email: 'john.mwangi@email.com',
          phone: '+254723456789',
          ward: 'Makina',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          reportsSubmitted: 8,
          votesCast: 32,
          status: 'active',
          joinedAt: '2024-02-20',
          lastActive: '2025-01-19',
          engagementScore: 72
        },
        {
          id: 3,
          name: 'Grace Wanjiku',
          email: 'grace.wanjiku@email.com',
          phone: '+254734567890',
          ward: 'Laini Saba',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          reportsSubmitted: 15,
          votesCast: 67,
          status: 'suspended',
          joinedAt: '2024-01-10',
          lastActive: '2025-01-18',
          engagementScore: 91
        },
        {
          id: 4,
          name: 'Peter Kamau',
          email: 'peter.kamau@email.com',
          phone: '+254745678901',
          ward: 'Woodley/Kenyatta Golf Course',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          reportsSubmitted: 6,
          votesCast: 23,
          status: 'active',
          joinedAt: '2024-03-05',
          lastActive: '2025-01-21',
          engagementScore: 58
        },
        {
          id: 5,
          name: 'Mary Njeri',
          email: 'mary.njeri@email.com',
          phone: '+254756789012',
          ward: "Sarang'ombe",
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          reportsSubmitted: 20,
          votesCast: 89,
          status: 'active',
          joinedAt: '2023-12-01',
          lastActive: '2025-01-20',
          engagementScore: 95
        }
      ];
      
      setResidents(mockResidents);
      
      // Calculate stats
      const total = mockResidents.length;
      const active = mockResidents.filter(r => r.status === 'active').length;
      const suspended = mockResidents.filter(r => r.status === 'suspended').length;
      setStats({ total, active, suspended });
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...residents];

    if (filters.ward) {
      filtered = filtered.filter(resident => resident.ward === filters.ward);
    }

    if (filters.status) {
      filtered = filtered.filter(resident => resident.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(resident =>
        resident.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        resident.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredResidents(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ ward: '', status: '', search: '' });
  };

  const handleStatusChange = async (resident: Resident, newStatus: 'active' | 'suspended') => {
    try {
      // Mock API call
      setResidents(prev =>
        prev.map(r =>
          r.id === resident.id ? { ...r, status: newStatus } : r
        )
      );
      setShowSuspendModal(null);
      
      // Update stats
      const updatedResidents = residents.map(r =>
        r.id === resident.id ? { ...r, status: newStatus } : r
      );
      const active = updatedResidents.filter(r => r.status === 'active').length;
      const suspended = updatedResidents.filter(r => r.status === 'suspended').length;
      setStats(prev => ({ ...prev, active, suspended }));
    } catch (error) {
      console.error('Error updating resident status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / residentsPerPage);
  const startIndex = (currentPage - 1) * residentsPerPage;
  const currentResidents = filteredResidents.slice(startIndex, startIndex + residentsPerPage);

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(119, 168, 168, 0.15)" }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-3xl font-bold text-gray-900"
        >
          {value}
        </motion.div>
      </div>
      <div className="text-gray-600 font-medium">{title}</div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading residents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Residents Management</h1>
          <p className="text-gray-600 mt-1">Manage community members and their engagement</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Residents"
          value={stats.total}
          icon={Users}
          color="bg-primary"
        />
        <StatCard
          title="Active Residents"
          value={stats.active}
          icon={UserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Suspended Residents"
          value={stats.suspended}
          icon={UserX}
          color="bg-yellow-500"
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-gradient-to-r from-primary to-pale rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={filters.ward}
            onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">All Wards</option>
            {wards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search residents..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredResidents.length} of {residents.length} residents
        </div>
      </motion.div>

      {/* Residents Table */}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Resident</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ward</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reports</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Votes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Engagement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {currentResidents.map((resident, index) => (
                  <motion.tr
                    key={resident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={resident.avatar}
                          alt={resident.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{resident.name}</div>
                          <div className="text-sm text-gray-500">{resident.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{resident.ward}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{resident.reportsSubmitted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{resident.votesCast}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(resident.engagementScore)}`}>
                        {resident.engagementScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        resident.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {resident.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedResident(resident);
                            setShowProfileModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSuspendModal({
                            resident,
                            action: resident.status === 'active' ? 'suspend' : 'activate'
                          })}
                          className={`p-2 rounded-lg transition-colors ${
                            resident.status === 'active'
                              ? 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={resident.status === 'active' ? 'Suspend' : 'Activate'}
                        >
                          {resident.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + residentsPerPage, filteredResidents.length)} of {filteredResidents.length} results
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

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedResident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Resident Profile</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedResident.avatar}
                    alt={selectedResident.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedResident.name}</h4>
                    <div className="flex items-center space-x-4 text-gray-600 mt-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedResident.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedResident.phone}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mt-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedResident.ward}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {formatDate(selectedResident.joinedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedResident.reportsSubmitted}</div>
                    <div className="text-sm text-gray-600">Reports</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedResident.votesCast}</div>
                    <div className="text-sm text-gray-600">Votes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedResident.engagementScore}%</div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${selectedResident.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedResident.status === 'active' ? 'Active' : 'Suspended'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Reported drainage issue</div>
                        <div className="text-sm text-gray-600">2 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Voted on security issue</div>
                        <div className="text-sm text-gray-600">5 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend/Activate Modal */}
      <AnimatePresence>
        {showSuspendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  showSuspendModal.action === 'suspend' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {showSuspendModal.action === 'suspend' ? 
                    <AlertTriangle className="w-6 h-6 text-yellow-600" /> :
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  }
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {showSuspendModal.action === 'suspend' ? 'Suspend Resident' : 'Activate Resident'}
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to {showSuspendModal.action} {showSuspendModal.resident.name}?
                  {showSuspendModal.action === 'suspend' && ' They will not be able to submit reports or vote.'}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSuspendModal(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusChange(
                      showSuspendModal.resident,
                      showSuspendModal.action === 'suspend' ? 'suspended' : 'active'
                    )}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      showSuspendModal.action === 'suspend'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {showSuspendModal.action === 'suspend' ? 'Suspend' : 'Activate'}
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

export default AdminResidentsPage;