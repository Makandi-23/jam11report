import React, { useState, useEffect } from 'react';
import { Pin, Calendar, AlertCircle, Info, Filter } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';

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
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-teal-100 text-teal-700 border-teal-200';
    }
  };

  const groupByDate = (announcements: Announcement[]) => {
    const groups: Record<string, Announcement[]> = {};

    announcements.forEach(announcement => {
      const date = new Date(announcement.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = language === 'en' ? 'Today' : 'Leo';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = language === 'en' ? 'Yesterday' : 'Jana';
      } else {
        key = date.toLocaleDateString(language === 'en' ? 'en-US' : 'sw-TZ', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(announcement);
    });

    return groups;
  };

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const groupedAnnouncements = groupByDate(paginatedAnnouncements);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'en' ? 'Announcements' : 'Matangazo'}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'en' ? 'Stay updated with community news' : 'Pata habari mpya za jamii'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'Filter by:' : 'Chuja kwa:'}
            </span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="all">{language === 'en' ? 'All Categories' : 'Kategoria Zote'}</option>
            <option value="info">{language === 'en' ? 'Information' : 'Taarifa'}</option>
            <option value="warning">{language === 'en' ? 'Warning' : 'Onyo'}</option>
            <option value="urgent">{language === 'en' ? 'Urgent' : 'Dharura'}</option>
            <option value="event">{language === 'en' ? 'Event' : 'Tukio'}</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            />
            <span className="text-gray-700">
              {language === 'en' ? 'Unread only' : 'Zisizosomwa tu'}
            </span>
          </label>
          <div className="ml-auto text-sm text-gray-600">
            {filteredAnnouncements.length} {language === 'en' ? 'announcements' : 'matangazo'}
          </div>
        </div>
      </div>

      {Object.keys(groupedAnnouncements).length === 0 ? (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">
            {language === 'en' ? 'No announcements found' : 'Hakuna matangazo yaliyopatikana'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAnnouncements).map(([date, announcements]) => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                {date}
              </h2>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => !announcement.isRead && markAsRead(announcement.id)}
                    className={`bg-white rounded-2xl shadow-md p-5 border transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      announcement.is_pinned ? 'border-yellow-400 border-2' : 'border-gray-100'
                    } ${!announcement.isRead ? 'bg-teal-50' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getCategoryColor(announcement.category)}`}>
                        {getCategoryIcon(announcement.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {announcement.is_pinned && (
                            <Pin className="h-4 w-4 text-yellow-600 fill-yellow-400" />
                          )}
                          {!announcement.isRead && (
                            <span className="h-2 w-2 bg-teal-600 rounded-full"></span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(announcement.created_at).toLocaleTimeString(language === 'en' ? 'en-US' : 'sw-TZ', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {language === 'en' ? announcement.title_en : announcement.title_sw}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {language === 'en' ? announcement.message_en : announcement.message_sw}
                        </p>
                        {announcement.expires_at && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {language === 'en' ? 'Valid until' : 'Halali hadi'}{' '}
                            {new Date(announcement.expires_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {language === 'en' ? 'Previous' : 'Iliyopita'}
          </button>
          <span className="px-4 py-2 text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {language === 'en' ? 'Next' : 'Ijayo'}
          </button>
        </div>
      )}
    </div>
  );
}
