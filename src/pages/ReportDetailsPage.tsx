import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, TrendingUp, Share2, Plus, 
  CheckCircle, AlertCircle, PlayCircle 
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
  photos?: string[];
}

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { vote, hasVoted, isVoting } = useVote();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const categories = {
    security: { name: 'Security', icon: '🛡️', color: 'bg-red-100 text-red-700', illustration: '🚨' },
    environment: { name: 'Environment', icon: '🌿', color: 'bg-green-100 text-green-700', illustration: '🌍' },
    health: { name: 'Health', icon: '➕', color: 'bg-emerald-100 text-emerald-700', illustration: '🏥' },
    other: { name: 'Other', icon: 'ℹ️', color: 'bg-slate-100 text-slate-700', illustration: '📋' }
  };

  const statusConfig = {
    pending: { name: 'Pending', color: 'bg-yellow-100 text-yellow-700', step: 1 },
    'in-progress': { name: 'In Progress', color: 'bg-blue-100 text-blue-700', step: 2 },
    resolved: { name: 'Resolved', color: 'bg-green-100 text-green-700', step: 3 }
  };

  useEffect(() => {
    if (id) {
      fetchReport(parseInt(id));
    }
  }, [id]);

  const fetchReport = async (reportId: number) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        navigate('/reports');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      navigate('/reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!report) return;
    try {
      await vote(report.id);
      setReport(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report?.title,
        text: report?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareModal(true);
      setTimeout(() => setShowShareModal(false), 2000);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!report || !user || user.role !== 'admin') return;
    
    try {
      const response = await fetch(`/api/reports/${report.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReport(updatedReport);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pale">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepTeal mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-pale">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
            <Link to="/reports" className="btn-primary">Back to Reports</Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = categories[report.category as keyof typeof categories] || categories.other;
  const statusInfo = statusConfig[report.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-pale">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-md mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                    <span className="mr-2 text-lg">{categoryInfo.icon}</span>
                    {categoryInfo.name}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {report.title}
                </h1>

                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {report.ward}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {timeAgo(report.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {report.votes} votes
                  </div>
                </div>
              </div>

              {/* Category Illustration */}
              <div className="text-8xl opacity-20 lg:opacity-100">
                {categoryInfo.illustration}
              </div>
            </div>
          </motion.div>

          {/* Body Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-md mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {report.description}
                </p>
              </motion.div>

              {/* Photos */}
              {report.photos && report.photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-8 shadow-md mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {report.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Report photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-8">
              {/* Timeline Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Timeline</h3>
                
                <div className="space-y-4">
                  {/* Pending */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      statusInfo.step >= 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {statusInfo.step >= 1 ? <AlertCircle className="w-4 h-4" /> : '1'}
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium ${statusInfo.step >= 1 ? 'text-yellow-700' : 'text-gray-400'}`}>
                        Pending Review
                      </div>
                      <div className="text-sm text-gray-500">Report submitted and awaiting review</div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className={`w-0.5 h-8 ml-4 ${statusInfo.step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />

                  {/* In Progress */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      statusInfo.step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {statusInfo.step >= 2 ? <PlayCircle className="w-4 h-4" /> : '2'}
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium ${statusInfo.step >= 2 ? 'text-blue-700' : 'text-gray-400'}`}>
                        In Progress
                      </div>
                      <div className="text-sm text-gray-500">Work has begun on this issue</div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div className={`w-0.5 h-8 ml-4 ${statusInfo.step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />

                  {/* Resolved */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      statusInfo.step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {statusInfo.step >= 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
                    </div>
                    <div className="ml-4">
                      <div className={`font-medium ${statusInfo.step >= 3 ? 'text-green-700' : 'text-gray-400'}`}>
                        Resolved
                      </div>
                      <div className="text-sm text-gray-500">Issue has been successfully resolved</div>
                    </div>
                  </div>
                </div>

                {/* Admin Status Controls */}
                {user && user.role === 'admin' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => updateStatus('pending')}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition ${
                          report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                            : 'bg-gray-50 text-gray-600 hover:bg-yellow-50'
                        }`}
                      >
                        Mark as Pending
                      </button>
                      <button
                        onClick={() => updateStatus('in-progress')}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition ${
                          report.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'bg-gray-50 text-gray-600 hover:bg-blue-50'
                        }`}
                      >
                        Mark as In Progress
                      </button>
                      <button
                        onClick={() => updateStatus('resolved')}
                        className={`w-full px-3 py-2 text-sm rounded-lg transition ${
                          report.status === 'resolved'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-50 text-gray-600 hover:bg-green-50'
                        }`}
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  {/* Vote Button */}
                  <button
                    onClick={handleVote}
                    disabled={!user || hasVoted(report.id) || isVoting(report.id)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      hasVoted(report.id)
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-deepTeal text-white hover:bg-deepTeal/90 hover:shadow-lg hover:shadow-deepTeal/25'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    {hasVoted(report.id) ? 'Voted' : 'Vote for this issue'}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-3 rounded-lg border-2 border-deepTeal text-deepTeal hover:bg-deepTeal hover:text-white transition font-medium"
                  >
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Share Report
                  </button>

                  {/* Report Another */}
                  <Link
                    to="/report"
                    className="w-full px-4 py-3 rounded-lg border-2 border-deepTeal text-deepTeal hover:bg-deepTeal hover:text-white transition font-medium text-center block"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Report Another Issue
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-xl p-6 max-w-sm mx-4"
          >
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Link Copied!</h3>
              <p className="text-gray-600">The report link has been copied to your clipboard.</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default ReportDetailsPage;