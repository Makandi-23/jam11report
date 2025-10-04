import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, PieChart, TrendingUp, Download, 
  Calendar, Filter, ChevronDown, RefreshCw,
  Users, FileText, AlertTriangle, CheckCircle
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface ChartData {
  reportsByCategory: { category: string; count: number; color: string }[];
  reportsByWard: { ward: string; count: number; color: string }[];
  reportsOverTime: { date: string; count: number }[];
  mostVotedIssues: { title: string; votes: number; category: string }[];
}

const AdminAnalyticsPage: React.FC = () => {
  const { t } = useI18n();
  const [chartData, setChartData] = useState<ChartData>({
    reportsByCategory: [],
    reportsByWard: [],
    reportsOverTime: [],
    mostVotedIssues: []
  });
  const [filters, setFilters] = useState({
    dateRange: '30',
    category: '',
    comparison: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  const categories = [
    { id: 'security', name: 'Security', color: '#EF4444' },
    { id: 'environment', name: 'Environment', color: '#10B981' },
    { id: 'health', name: 'Health', color: '#059669' },
    { id: 'other', name: 'Other', color: '#6B7280' }
  ];

  const wards = [
    { name: 'Lindi', color: '#FFD166' },
    { name: 'Makina', color: '#3B82F6' },
    { name: 'Laini Saba', color: '#10B981' },
    { name: 'Woodley', color: '#8B5CF6' },
    { name: "Sarang'ombe", color: '#F59E0B' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData: ChartData = {
        reportsByCategory: [
          { category: 'Security', count: 45, color: '#EF4444' },
          { category: 'Environment', count: 67, color: '#10B981' },
          { category: 'Health', count: 23, color: '#059669' },
          { category: 'Other', count: 18, color: '#6B7280' }
        ],
        reportsByWard: [
          { ward: 'Lindi', count: 34, color: '#FFD166' },
          { ward: 'Makina', count: 28, color: '#3B82F6' },
          { ward: 'Laini Saba', count: 41, color: '#10B981' },
          { ward: 'Woodley', count: 25, color: '#8B5CF6' },
          { ward: "Sarang'ombe", count: 25, color: '#F59E0B' }
        ],
        reportsOverTime: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10) + 1
        })),
        mostVotedIssues: [
          { title: 'Open drain causing flooding', votes: 89, category: 'Environment' },
          { title: 'Street fights disrupting business', votes: 76, category: 'Security' },
          { title: 'Water shortage in neighborhood', votes: 67, category: 'Health' },
          { title: 'Broken streetlights', votes: 54, category: 'Security' },
          { title: 'Garbage collection delays', votes: 43, category: 'Environment' }
        ]
      };
      setChartData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChart = (format: 'png' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting charts as ${format}`);
    setShowExportModal(false);
  };

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
        <div className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 font-medium">{title}</div>
    </motion.div>
  );

  const BarChart = ({ data, title }: { data: any[]; title: string }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.category || item.ward}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-20 text-sm font-medium text-gray-700 truncate">
                {item.category || item.ward}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / maxValue) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <div className="w-12 text-sm font-bold text-gray-900 text-right">
                {item.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title }: { data: any[]; title: string }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercentage = 0;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {data.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const strokeDasharray = `${percentage * 2.51} ${251.2 - percentage * 2.51}`;
                const strokeDashoffset = -cumulativePercentage * 2.51;
                cumulativePercentage += percentage;

                return (
                  <motion.circle
                    key={item.ward}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray, strokeDashoffset }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
                    className="hover:stroke-8"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.ward} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.ward}</span>
              <span className="text-sm font-medium text-gray-900">({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LineChart = ({ data, title }: { data: any[]; title: string }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.count / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="h-64 bg-gray-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#77A8A8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#77A8A8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.polyline
              fill="none"
              stroke="#77A8A8"
              strokeWidth="0.5"
              points={points}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.polygon
              fill="url(#lineGradient)"
              points={`${points} 100,100 0,100`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            />
          </svg>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Trends</h1>
          <p className="text-gray-600 mt-1">Insights into community reporting patterns</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchAnalyticsData()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-gradient-to-r from-primary to-pale rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.comparison}
              onChange={(e) => setFilters(prev => ({ ...prev, comparison: e.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-gray-700 font-medium">Compare with previous period</span>
          </label>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value="153"
          change={12}
          icon={FileText}
          color="bg-primary"
        />
        <StatCard
          title="Active Issues"
          value="89"
          change={-5}
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatCard
          title="Resolved Issues"
          value="64"
          change={18}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Community Engagement"
          value="2,341"
          change={25}
          icon={Users}
          color="bg-blue-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Reports by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(119, 168, 168, 0.15)" }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <BarChart data={chartData.reportsByCategory} title="Reports by Category" />
        </motion.div>

        {/* Reports by Ward */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(119, 168, 168, 0.15)" }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <DonutChart data={chartData.reportsByWard} title="Reports by Ward" />
        </motion.div>

        {/* Reports Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(119, 168, 168, 0.15)" }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <LineChart data={chartData.reportsOverTime} title="Reports Over Time" />
        </motion.div>

        {/* Most Voted Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(119, 168, 168, 0.15)" }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all duration-300"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Most Voted Issues</h3>
            <div className="space-y-3">
              {chartData.mostVotedIssues.map((issue, index) => (
                <motion.div
                  key={issue.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{issue.title}</div>
                    <div className="text-xs text-gray-600">{issue.category}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold text-primary">{issue.votes}</div>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Charts</h3>
              <p className="text-gray-600 mb-6">Choose the format for exporting your analytics charts.</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => exportChart('png')}
                  className="w-full px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
                >
                  Export as PNG
                </button>
                <button
                  onClick={() => exportChart('pdf')}
                  className="w-full px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  Export as PDF
                </button>
              </div>
              
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnalyticsPage;