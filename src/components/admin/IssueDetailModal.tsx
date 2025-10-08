import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, TrendingUp, Clock, User,
  AlertTriangle, Tag, ChevronLeft, ChevronRight,
  Calendar, Image as ImageIcon, ZoomIn
} from 'lucide-react';

interface IssueDetail {
  id: number;
  title: string;
  category: string;
  ward: string;
  votes: number;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'resolved';
  isMarkedUrgent: boolean;
  reporter: string;
  description: string;
  images?: string[];
}

interface IssueDetailModalProps {
  issueId: number;
  isOpen: boolean;
  onClose: () => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issueId, isOpen, onClose }) => {
  const [issue, setIssue] = useState<IssueDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && issueId) {
      fetchIssueDetails();
    }
  }, [isOpen, issueId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImageIndex !== null) {
          setSelectedImageIndex(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, selectedImageIndex]);

  const fetchIssueDetails = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockIssueDetails: Record<number, IssueDetail> = {
        1: {
          id: 1,
          title: "Open drain causing severe flooding on main road",
          category: "environment",
          ward: "Lindi",
          votes: 89,
          createdAt: "2025-01-15T10:00:00Z",
          status: "pending",
          isMarkedUrgent: true,
          reporter: "John Mwangi",
          description: "There is a large open drainage system along the main road near the market area that causes severe flooding during rainy seasons. The water accumulates and makes it impossible for residents to pass through. Many businesses are affected, and children cannot go to school safely. The situation has persisted for over 3 months and requires immediate attention from the county government.",
          images: [
            "https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800"
          ]
        },
        2: {
          id: 2,
          title: "Daily street fights disrupting market business",
          category: "security",
          ward: "Makina",
          votes: 76,
          createdAt: "2025-01-12T15:40:00Z",
          status: "in-progress",
          isMarkedUrgent: true,
          reporter: "Grace Wanjiku",
          description: "Groups of youth have been engaging in violent confrontations daily at the main market entrance. This has scared away customers and is seriously affecting local businesses. Several people have been injured, and vendors are afraid to operate their stalls. We urgently need increased police presence and youth engagement programs to address this issue.",
          images: [
            "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800"
          ]
        },
        3: {
          id: 3,
          title: "Water shortage affecting 200+ families",
          category: "health",
          ward: "Sarang'ombe",
          votes: 134,
          createdAt: "2025-01-10T11:30:00Z",
          status: "pending",
          isMarkedUrgent: false,
          reporter: "David Ochieng",
          description: "Over 200 families in our neighborhood have been without clean water for the past two weeks. The main water pipe appears to be broken, and despite multiple reports to the water company, no action has been taken. Residents are forced to buy water at inflated prices from vendors, which is not sustainable. Children are missing school to fetch water from distant sources. This is a public health emergency that needs immediate resolution.",
          images: [
            "https://images.pexels.com/photos/1490736/pexels-photo-1490736.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1739942/pexels-photo-1739942.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1451360/pexels-photo-1451360.jpeg?auto=compress&cs=tinysrgb&w=800"
          ]
        },
        4: {
          id: 4,
          title: "Broken streetlights creating safety hazards",
          category: "security",
          ward: "Laini Saba",
          votes: 67,
          createdAt: "2025-01-08T09:20:00Z",
          status: "resolved",
          isMarkedUrgent: true,
          reporter: "Peter Kamau",
          description: "Multiple streetlights along the main road have been non-functional for months, creating dangerous conditions after dark. There have been several mugging incidents reported in these dark areas. Women and children feel unsafe walking home in the evening. We request urgent repair or replacement of these lights to restore safety to our community.",
          images: []
        },
        5: {
          id: 5,
          title: "Garbage pile attracting disease vectors",
          category: "environment",
          ward: "Woodley",
          votes: 54,
          createdAt: "2025-01-05T14:15:00Z",
          status: "pending",
          isMarkedUrgent: false,
          reporter: "Mary Njeri",
          description: "A large pile of uncollected garbage has been accumulating near the residential area for over a month. The waste is attracting rats, flies, and other disease-carrying pests. The smell is unbearable, especially during hot weather. Several children have developed respiratory problems, and there are concerns about potential disease outbreaks. We need immediate waste collection and regular disposal services.",
          images: [
            "https://images.pexels.com/photos/3951373/pexels-photo-3951373.jpeg?auto=compress&cs=tinysrgb&w=800"
          ]
        },
        6: {
          id: 6,
          title: "Collapsed bridge blocking emergency access",
          category: "other",
          ward: "Lindi",
          votes: 98,
          createdAt: "2025-01-03T16:45:00Z",
          status: "in-progress",
          isMarkedUrgent: true,
          reporter: "Samuel Kiprotich",
          description: "The pedestrian bridge connecting our community to the main road collapsed last week following heavy rains. This bridge is critical for emergency vehicle access, and its collapse has left our area completely isolated. Ambulances cannot reach residents in case of medical emergencies. Children have to take a dangerous detour to reach school. This is a life-threatening situation requiring immediate reconstruction.",
          images: [
            "https://images.pexels.com/photos/2102827/pexels-photo-2102827.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=800"
          ]
        }
      };

      const issueData = mockIssueDetails[issueId];
      if (issueData) {
        setIssue(issueData);
      }
    } catch (error) {
      console.error('Error fetching issue details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return '🛡️';
      case 'environment': return '🌿';
      case 'health': return '➕';
      default: return 'ℹ️';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      security: 'Security',
      environment: 'Environment',
      health: 'Health',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrevImage = () => {
    if (issue?.images && issue.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? issue.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (issue?.images && issue.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === issue.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Content */}
          <div className="overflow-y-auto max-h-[90vh] p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading issue details...</p>
                </div>
              </div>
            ) : issue ? (
              <div className="space-y-6">
                {/* Header Section */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{getCategoryIcon(issue.category)}</span>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {issue.isMarkedUrgent && (
                          <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-200">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {issue.votes}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        votes
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {issue.title}
                  </h2>

                  {/* Meta Information */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Tag className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-gray-500">Category</div>
                        <div className="font-medium">{getCategoryLabel(issue.category)}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-gray-500">Ward</div>
                        <div className="font-medium">{issue.ward}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-gray-500">Reported by</div>
                        <div className="font-medium">{issue.reporter}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="font-medium text-xs">{formatDate(issue.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Detailed Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Images Section */}
                {issue.images && issue.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      Attached Photos ({issue.images.length})
                    </h3>

                    {/* Main Image with Navigation */}
                    <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={issue.images[currentImageIndex]}
                        alt={`Issue photo ${currentImageIndex + 1}`}
                        className="w-full h-80 object-cover"
                      />

                      {/* Image Navigation */}
                      {issue.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-800" />
                          </button>
                          <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-800" />
                          </button>

                          {/* Image Counter */}
                          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                            {currentImageIndex + 1} / {issue.images.length}
                          </div>
                        </>
                      )}

                      {/* Zoom Button */}
                      <button
                        onClick={() => setSelectedImageIndex(currentImageIndex)}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ZoomIn className="w-4 h-4 text-gray-800" />
                      </button>
                    </div>

                    {/* Thumbnail Gallery */}
                    {issue.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-3">
                        {issue.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === idx
                                ? 'border-primary scale-95'
                                : 'border-gray-200 hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* No Images Placeholder */}
                {(!issue.images || issue.images.length === 0) && (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No photos attached to this report</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Issue not found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Image Zoom Modal */}
        <AnimatePresence>
          {selectedImageIndex !== null && issue?.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
              onClick={() => setSelectedImageIndex(null)}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                src={issue.images[selectedImageIndex]}
                alt="Zoomed view"
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default IssueDetailModal;
