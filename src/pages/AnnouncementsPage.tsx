import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Calendar, AlertCircle, Info, Filter, Megaphone, X, ChevronDown } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Announcement {
  id: string;
  title_en: string;
  title_sw: string;
  message_en: string;
  message_sw: string;
  category: 'info' | 'warning' | 'urgent' | 'event';
  ward_target: string;
  is_pinned: boolean;
  expires_at: string | null;
  created_at: string;
  isRead?: boolean;
}

export default function AnnouncementsPage() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, categoryFilter, showUnreadOnly]);

  const fetchAnnouncements = async () => {
    try {
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'active')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;

      const { data: readsData } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('user_id', user?.id || '');

      const readIds = new Set(readsData?.map(r => r.announcement_id) || []);

      const enrichedData = (announcementsData || []).map(a => ({
        ...a,
        isRead: readIds.has(a.id)
      }));

      setAnnouncements(enrichedData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }

    if (showUnreadOnly) {
      filtered = filtered.filter(a => !a.isRead);
    }

    setFilteredAnnouncements(filtered);
    setCurrentPage(1);
  };

  const markAsRead = async (announcementId: string) => {
    try {
      await supabase
        .from('announcement_reads')
        .insert([{ announcement_id: announcementId, user_id: user?.id }]);

      setAnnouncements(prev =>
        prev.map(a => a.id === announcementId ? { ...a, isRead: true } : a)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'urgent': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertCircle className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'event': return 'bg-blue-500 text-white';
      default: return 'bg-teal-500 text-white';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      case 'event': return 'bg-blue-50';
      default: return 'bg-teal-50';
    }
  };

  const groupByPeriod = (announcements: Announcement[]) => {
    const groups: Record<string, Announcement[]> = {
      today: [],
      thisWeek: [],
      earlier: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    announcements.forEach(announcement => {
      const date = new Date(announcement.created_at);
      const announcementDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (announcementDate.getTime() === today.getTime()) {
        groups.today.push(announcement);
      } else if (announcementDate >= weekAgo) {
        groups.thisWeek.push(announcement);
      } else {
        groups.earlier.push(announcement);
      }
    });

    return groups;
  };

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const groupedAnnouncements = groupByPeriod(paginatedAnnouncements);

  const getSectionTitle = (key: string) => {
    const titles = {
      today: language === 'en' ? 'Today' : 'Leo',
      thisWeek: language === 'en' ? 'This Week' : 'Wiki Hii',
      earlier: language === 'en' ? 'Earlier' : 'Zamani'
    };
    return titles[key as keyof typeof titles];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl mb-4 shadow-lg">
              <Megaphone className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Announcements' : 'Matangazo'}
            </h1>
            <p className="text-lg text-gray-600">
              {language === 'en' ? 'Stay updated with community news' : 'Pata habari mpya za jamii'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-16 z-30 bg-gradient-to-r from-teal-600 to-teal-400 rounded-2xl shadow-lg p-4 mb-8"
          >
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-white" />
                <span className="text-sm font-semibold text-white">
                  {language === 'en' ? 'Filter by:' : 'Chuja kwa:'}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 flex-1 justify-end">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-white/90 backdrop-blur-sm border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-sm font-medium text-gray-700 shadow-md"
                >
                  <option value="all">{language === 'en' ? 'All Categories' : 'Kategoria Zote'}</option>
                  <option value="info">{language === 'en' ? 'Information' : 'Taarifa'}</option>
                  <option value="warning">{language === 'en' ? 'Warning' : 'Onyo'}</option>
                  <option value="urgent">{language === 'en' ? 'Urgent' : 'Dharura'}</option>
                  <option value="event">{language === 'en' ? 'Event' : 'Tukio'}</option>
                </select>

                <label className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-md cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={showUnreadOnly}
                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <span>{language === 'en' ? 'Unread only' : 'Zisizosomwa tu'}</span>
                </label>

                {(categoryFilter !== 'all' || showUnreadOnly) && (
                  <button
                    onClick={() => {
                      setCategoryFilter('all');
                      setShowUnreadOnly(false);
                    }}
                    className="flex items-center gap-1 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-md hover:bg-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                    {language === 'en' ? 'Clear' : 'Futa'}
                  </button>
                )}
              </div>

              <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-md">
                {filteredAnnouncements.length} {language === 'en' ? 'total' : 'jumla'}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {Object.keys(groupedAnnouncements).every(key => groupedAnnouncements[key as keyof typeof groupedAnnouncements].length === 0) ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                  <Megaphone className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? 'No announcements right now' : 'Hakuna matangazo kwa sasa'}
                </h3>
                <p className="text-gray-600 text-lg">
                  {language === 'en' ? 'Check back soon!' : 'Rudi hivi karibuni!'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedAnnouncements).map(([period, announcements]) => {
                  if (announcements.length === 0) return null;

                  return (
                    <motion.div
                      key={period}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                          {getSectionTitle(period)}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      </div>
                      <div className="space-y-4">
                        {announcements.map((announcement, index) => (
                          <motion.div
                            key={announcement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => !announcement.isRead && markAsRead(announcement.id)}
                            className={`group relative bg-white rounded-2xl shadow-md border-2 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                              announcement.is_pinned
                                ? 'border-yellow-400 shadow-yellow-200/50 hover:shadow-yellow-300/50'
                                : 'border-transparent hover:border-teal-300 hover:shadow-teal-200/50'
                            } ${!announcement.isRead ? 'ring-2 ring-teal-500 ring-opacity-30' : ''}`}
                          >
                            {announcement.is_pinned && (
                              <div className="absolute -top-3 left-6 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-md">
                                <Pin className="h-3 w-3 text-white fill-white" />
                                <span className="text-xs font-bold text-white uppercase">
                                  {language === 'en' ? 'Pinned' : 'Imebandikwa'}
                                </span>
                              </div>
                            )}

                            <div className="p-6">
                              <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 p-3 rounded-xl ${getCategoryColor(announcement.category)} shadow-md`}>
                                  {getCategoryIcon(announcement.category)}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    {!announcement.isRead && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                                        {language === 'en' ? 'NEW' : 'MPYA'}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500 font-medium">
                                      {new Date(announcement.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-TZ', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>

                                  <h3 className={`text-xl font-bold mb-2 ${announcement.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {language === 'en' ? announcement.title_en : announcement.title_sw}
                                  </h3>

                                  <p className={`text-sm leading-relaxed mb-3 ${announcement.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {language === 'en' ? announcement.message_en : announcement.message_sw}
                                  </p>

                                  {announcement.expires_at && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg w-fit">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-medium">
                                        {language === 'en' ? 'Valid until' : 'Halali hadi'}{' '}
                                        {new Date(announcement.expires_at).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-TZ', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className={`h-1 w-full rounded-b-2xl ${getCategoryBgColor(announcement.category)}`}></div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-2 mt-8"
            >
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-gray-700 shadow-md"
              >
                {language === 'en' ? 'Previous' : 'Iliyopita'}
              </button>
              <div className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-md">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-gray-700 shadow-md"
              >
                {language === 'en' ? 'Next' : 'Ijayo'}
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer variant="dashboard" />
    </div>
  );
}
