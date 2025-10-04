import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Calendar, Filter, Download, FileImage, FileText,
  ArrowUpDown, TrendingUp, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useI18n } from '../contexts/I18nContext';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface WardData {
  ward: string;
  total: number;
  active: number;
  resolved: number;
  urgent: number;
  heatIndex: 'low' | 'medium' | 'high';
}

const WARD_COLORS = [
  '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'
];

export default function AdminWardInsightsPage() {
  const { language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [wardData, setWardData] = useState<WardData[]>([]);
  const [filteredData, setFilteredData] = useState<WardData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof WardData>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWardData();
  }, []);

  useEffect(() => {
    filterAndSortData();
  }, [wardData, searchTerm, sortField, sortDirection]);

  const fetchWardData = async () => {
    try {
      const wards = ['Makongeni', 'Bombolulu', 'Kisauni', 'Changamwe', 'Likoni', 'Nyali'];
      const data: WardData[] = [];

      for (const ward of wards) {
        const total = Math.floor(Math.random() * 150) + 50;
        const resolved = Math.floor(total * (Math.random() * 0.4 + 0.3));
        const active = Math.floor((total - resolved) * 0.7);
        const urgent = Math.floor(Math.random() * 20) + 5;

        let heatIndex: 'low' | 'medium' | 'high' = 'low';
        if (urgent > 15 || active > 50) heatIndex = 'high';
        else if (urgent > 10 || active > 30) heatIndex = 'medium';

        data.push({
          ward,
          total,
          active,
          resolved,
          urgent,
          heatIndex
        });
      }

      setWardData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching ward data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortData = () => {
    let filtered = [...wardData];

    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.ward.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setFilteredData(filtered);
  };

  const handleSort = (field: keyof WardData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getHeatBadge = (heat: string) => {
    const styles = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    const labels = {
      low: language === 'en' ? 'Low' : 'Chini',
      medium: language === 'en' ? 'Medium' : 'Wastani',
      high: language === 'en' ? 'High' : 'Juu'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[heat as keyof typeof styles]}`}>
        {labels[heat as keyof typeof labels]}
      </span>
    );
  };

  const exportToPNG = async () => {
    if (!dashboardRef.current) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#f9fafb'
      });

      const link = document.createElement('a');
      link.download = `ward-insights-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting to PNG:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!dashboardRef.current) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#f9fafb'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ward-insights-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const chartData = wardData.map(w => ({
    name: w.ward,
    value: w.total
  }));

  const totalReports = wardData.reduce((sum, w) => sum + w.total, 0);
  const totalActive = wardData.reduce((sum, w) => sum + w.active, 0);
  const totalResolved = wardData.reduce((sum, w) => sum + w.resolved, 0);
  const totalUrgent = wardData.reduce((sum, w) => sum + w.urgent, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{language === 'en' ? 'Loading insights...' : 'Inapakia maarifa...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Ward Insights' : 'Maarifa ya Kata'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' ? 'Data-driven insights across all wards' : 'Maarifa yanayotegemea data katika kata zote'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToPNG}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 shadow-md disabled:opacity-50"
          >
            <FileImage className="h-5 w-5" />
            {language === 'en' ? 'Export PNG' : 'Hamisha PNG'}
          </button>
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-200 disabled:opacity-50"
          >
            <FileText className="h-5 w-5" />
            {language === 'en' ? 'Export PDF' : 'Hamisha PDF'}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-gradient-to-r from-teal-600 to-teal-400 rounded-2xl shadow-lg p-4"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-white" />
            <span className="text-sm font-semibold text-white">
              {language === 'en' ? 'Filters:' : 'Vichujio:'}
            </span>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-sm font-medium text-gray-700 shadow-md"
          >
            <option value="all">{language === 'en' ? 'All Time' : 'Wakati Wote'}</option>
            <option value="today">{language === 'en' ? 'Today' : 'Leo'}</option>
            <option value="week">{language === 'en' ? 'This Week' : 'Wiki Hii'}</option>
            <option value="month">{language === 'en' ? 'This Month' : 'Mwezi Huu'}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-sm font-medium text-gray-700 shadow-md"
          >
            <option value="all">{language === 'en' ? 'All Categories' : 'Kategoria Zote'}</option>
            <option value="security">{language === 'en' ? 'Security' : 'Usalama'}</option>
            <option value="environment">{language === 'en' ? 'Environment' : 'Mazingira'}</option>
            <option value="health">{language === 'en' ? 'Health' : 'Afya'}</option>
          </select>

          {(dateRange !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setDateRange('all');
                setCategoryFilter('all');
              }}
              className="flex items-center gap-1 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-md hover:bg-white transition-colors"
            >
              <X className="h-4 w-4" />
              {language === 'en' ? 'Clear' : 'Futa'}
            </button>
          )}
        </div>
      </motion.div>

      <div ref={dashboardRef} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Total Reports' : 'Ripoti Zote'}</p>
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-yellow-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Active' : 'Hai'}</p>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalActive}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-green-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Resolved' : 'Zimetatuliwa'}</p>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalResolved}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:shadow-red-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Urgent' : 'Dharura'}</p>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalUrgent}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Reports by Ward' : 'Ripoti kwa Kata'}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WARD_COLORS[index % WARD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {language === 'en' ? 'Ward Performance' : 'Utendaji wa Kata'}
                </h2>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search wards...' : 'Tafuta kata...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      onClick={() => handleSort('ward')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Ward' : 'Kata'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('total')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Total' : 'Jumla'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('active')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Active' : 'Hai'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('resolved')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Resolved' : 'Zimetatuliwa'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('urgent')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Urgent' : 'Dharura'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('heatIndex')}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {language === 'en' ? 'Heat Index' : 'Kipimo cha Joto'}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((ward, index) => (
                    <motion.tr
                      key={ward.ward}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ward.ward}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{ward.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-yellow-700 font-semibold">{ward.active}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-700 font-semibold">{ward.resolved}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-700 font-semibold">{ward.urgent}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getHeatBadge(ward.heatIndex)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
