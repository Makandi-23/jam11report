import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapContainer, TileLayer, Marker, Popup, useMap 
} from 'react-leaflet';
import { 
  Map as MapIcon, Filter, Calendar, ChevronDown, ChevronUp,
  MapPin, Eye, Edit, Layers, BarChart3
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Report {
  id: number;
  title: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  ward: string;
  votes: number;
  createdAt: string;
  coordinates: [number, number];
  reporter: string;
}

const AdminMapPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [mapMode, setMapMode] = useState<'pins' | 'heatmap'>('pins');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateRange: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'security', name: 'Security', icon: '🛡️', color: '#EF4444' },
    { id: 'environment', name: 'Environment', icon: '🌿', color: '#10B981' },
    { id: 'health', name: 'Health', icon: '➕', color: '#059669' },
    { id: 'other', name: 'Other', icon: 'ℹ️', color: '#6B7280' }
  ];

  const statusOptions = [
    { id: 'pending', name: 'Pending', color: '#FFD166' },
    { id: 'in-progress', name: 'In Progress', color: '#3B82F6' },
    { id: 'resolved', name: 'Resolved', color: '#10B981' }
  ];

  // Mock coordinates for Kibra area
  const kibra = [-1.3133, 36.7833];

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const fetchReports = async () => {
    try {
      // Mock data with Kibra coordinates
      const mockReports: Report[] = [
        {
          id: 1,
          title: "Open drain causing flooding on main road",
          category: "environment",
          status: "pending",
          ward: "Lindi",
          votes: 67,
          createdAt: "2025-01-15T10:00:00Z",
          coordinates: [-1.3120, 36.7820],
          reporter: "John Mwangi"
        },
        {
          id: 2,
          title: "Street fights disrupting market business",
          category: "security",
          status: "in-progress",
          ward: "Makina",
          votes: 54,
          createdAt: "2025-01-12T15:40:00Z",
          coordinates: [-1.3140, 36.7850],
          reporter: "Grace Wanjiku"
        },
        {
          id: 3,
          title: "Broken streetlights on residential street",
          category: "security",
          status: "resolved",
          ward: "Laini Saba",
          votes: 32,
          createdAt: "2025-01-10T09:20:00Z",
          coordinates: [-1.3110, 36.7840],
          reporter: "Peter Kamau"
        },
        {
          id: 4,
          title: "Garbage collection not happening regularly",
          category: "environment",
          status: "pending",
          ward: "Woodley",
          votes: 45,
          createdAt: "2025-01-08T14:15:00Z",
          coordinates: [-1.3150, 36.7810],
          reporter: "Mary Njeri"
        },
        {
          id: 5,
          title: "Water shortage affecting entire neighborhood",
          category: "health",
          status: "in-progress",
          ward: "Sarang'ombe",
          votes: 78,
          createdAt: "2025-01-05T11:30:00Z",
          coordinates: [-1.3100, 36.7860],
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

    setFilteredReports(filtered);
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', dateRange: '' });
  };

  const handleStatusChange = async (reportId: number, newStatus: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus as any } : report
      )
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[3];
  };

  const getStatusInfo = (statusId: string) => {
    return statusOptions.find(status => status.id === statusId) || statusOptions[0];
  };

  const createCustomIcon = (category: string, status: string) => {
    const categoryInfo = getCategoryInfo(category);
    const statusInfo = getStatusInfo(status);
    
    return L.divIcon({
      html: `
        <div style="
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          background: ${statusInfo.color}; 
          border: 3px solid white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">
          ${categoryInfo.icon}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
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

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
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
            <MapIcon className="w-8 h-8 text-primary mr-3" />
            Map View
          </h1>
          <p className="text-gray-600 mt-1">Geographic overview of community reports</p>
        </div>
        
        {/* Map Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMapMode('pins')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              mapMode === 'pins'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Pin Map</span>
          </button>
          <button
            onClick={() => setMapMode('heatmap')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
              mapMode === 'heatmap'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Heatmap</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <span>{showFilters ? 'Hide' : 'Show'}</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-4 items-center"
              >
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

                {/* Date Range */}
                <input
                  type="date"
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  Clear Filters
                </button>

                <div className="text-sm text-gray-600 ml-auto">
                  Showing {filteredReports.length} of {reports.length} reports
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ height: '600px' }}
      >
        <MapContainer
          center={kibra as [number, number]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {mapMode === 'pins' && filteredReports.map((report) => {
            const categoryInfo = getCategoryInfo(report.category);
            const statusInfo = getStatusInfo(report.status);
            
            return (
              <Marker
                key={report.id}
                position={report.coordinates}
                icon={createCustomIcon(report.category, report.status)}
              >
                <Popup className="custom-popup">
                  <div className="p-4 min-w-64">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{categoryInfo.icon}</span>
                        <span className="font-medium text-gray-900">{categoryInfo.name}</span>
                      </div>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {statusInfo.name}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                      {report.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {report.ward}
                      </div>
                      <div>
                        <strong>{report.votes}</strong> votes • {formatTimeAgo(report.createdAt)}
                      </div>
                      <div>
                        Reported by {report.reporter}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
                        <Eye className="w-3 h-3 inline mr-1" />
                        View Details
                      </button>
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:border-transparent"
                      >
                        {statusOptions.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          Legend
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Status Colors */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Status</h4>
            <div className="space-y-2">
              {statusOptions.map(status => (
                <div key={status.id} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminMapPage;