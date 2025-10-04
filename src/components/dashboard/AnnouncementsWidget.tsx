import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pin, Calendar, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { useAuth } from '../../contexts/AuthContext';
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
  is_pinned: boolean;
  created_at: string;
  isRead?: boolean;
}

export default function AnnouncementsWidget() {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .eq('status', 'active')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

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
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'event': return 'bg-blue-100 text-blue-700';
      default: return 'bg-teal-100 text-teal-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Latest Announcements' : 'Matangazo ya Hivi Karibuni'}
        </h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {language === 'en' ? 'Latest Announcements' : 'Matangazo ya Hivi Karibuni'}
        </h2>
        <Link
          to="/announcements"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {language === 'en' ? 'View all' : 'Angalia yote'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-8">
          <Info className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            {language === 'en' ? 'No announcements yet' : 'Hakuna matangazo bado'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => !announcement.isRead && markAsRead(announcement.id)}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md ${
                announcement.is_pinned ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              } ${!announcement.isRead ? 'bg-teal-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(announcement.category)}`}>
                  {getCategoryIcon(announcement.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {announcement.is_pinned && (
                      <Pin className="h-3 w-3 text-yellow-600 fill-yellow-400 flex-shrink-0" />
                    )}
                    {!announcement.isRead && (
                      <span className="h-2 w-2 bg-teal-600 rounded-full flex-shrink-0"></span>
                    )}
                    <span className="text-xs text-gray-500 truncate">
                      {new Date(announcement.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'sw-TZ', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                    {language === 'en' ? announcement.title_en : announcement.title_sw}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {language === 'en' ? announcement.message_en : announcement.message_sw}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
