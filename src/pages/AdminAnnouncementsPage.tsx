import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Archive, Pin, Calendar, AlertCircle, Info } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
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
  status: 'active' | 'expired' | 'archived';
  created_at: string;
}

const wards = ['All', 'Makongeni', 'Bombolulu', 'Kisauni', 'Changamwe', 'Likoni', 'Nyali'];

export default function AdminAnnouncementsPage() {
  const { t, language } = useI18n();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_sw: '',
    message_en: '',
    message_sw: '',
    category: 'info' as 'info' | 'warning' | 'urgent' | 'event',
    ward_target: 'all',
    is_pinned: false,
    expires_at: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        expires_at: formData.expires_at || null,
        status: 'active'
      };

      if (editingId) {
        const { error } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([payload]);
        if (error) throw error;
      }

      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title_en: announcement.title_en,
      title_sw: announcement.title_sw,
      message_en: announcement.message_en,
      message_sw: announcement.message_sw,
      category: announcement.category,
      ward_target: announcement.ward_target,
      is_pinned: announcement.is_pinned,
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setConfirmDelete(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ status: 'archived' })
        .eq('id', id);
      if (error) throw error;
      fetchAnnouncements();
    } catch (error) {
      console.error('Error archiving announcement:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_sw: '',
      message_en: '',
      message_sw: '',
      category: 'info',
      ward_target: 'all',
      is_pinned: false,
      expires_at: ''
    });
    setEditingId(null);
    setShowForm(false);
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
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'event': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-teal-100 text-teal-700 border-teal-200';
    }
  };

  const getStatusColor = (status: string, expiresAt: string | null) => {
    if (status === 'archived') return 'bg-gray-100 text-gray-700';
    if (expiresAt && new Date(expiresAt) < new Date()) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (status: string, expiresAt: string | null) => {
    if (status === 'archived') return language === 'en' ? 'Archived' : 'Iliyohifadhiwa';
    if (expiresAt && new Date(expiresAt) < new Date()) return language === 'en' ? 'Expired' : 'Imeisha';
    return language === 'en' ? 'Active' : 'Hai';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'Announcements' : 'Matangazo'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en' ? 'Manage community announcements' : 'Simamia matangazo ya jamii'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-200"
        >
          <Plus className="h-5 w-5" />
          {language === 'en' ? 'New Announcement' : 'Tangazo Jipya'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {editingId
              ? (language === 'en' ? 'Edit Announcement' : 'Hariri Tangazo')
              : (language === 'en' ? 'Create New Announcement' : 'Tengeneza Tangazo Jipya')
            }
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Title (English)' : 'Kichwa (Kiingereza)'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Title (Swahili)' : 'Kichwa (Kiswahili)'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_sw}
                  onChange={(e) => setFormData({ ...formData, title_sw: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Message (English)' : 'Ujumbe (Kiingereza)'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message_en}
                  onChange={(e) => setFormData({ ...formData, message_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Message (Swahili)' : 'Ujumbe (Kiswahili)'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message_sw}
                  onChange={(e) => setFormData({ ...formData, message_sw: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Category' : 'Kategoria'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="info">{language === 'en' ? 'Information' : 'Taarifa'}</option>
                  <option value="warning">{language === 'en' ? 'Warning' : 'Onyo'}</option>
                  <option value="urgent">{language === 'en' ? 'Urgent' : 'Dharura'}</option>
                  <option value="event">{language === 'en' ? 'Event' : 'Tukio'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Ward Target' : 'Kata Lengwa'}
                </label>
                <select
                  value={formData.ward_target}
                  onChange={(e) => setFormData({ ...formData, ward_target: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {wards.map(ward => (
                    <option key={ward} value={ward.toLowerCase()}>{ward}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Expires At (Optional)' : 'Inaisha (Hiari)'}
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinned"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="pinned" className="text-sm font-medium text-gray-700">
                {language === 'en' ? 'Pin this announcement' : 'Bandika tangazo hili'}
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-200"
              >
                {editingId ? t('common.save') : t('common.submit')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`bg-white rounded-2xl shadow-md p-6 border transition-all duration-300 hover:shadow-lg ${
              announcement.is_pinned ? 'border-yellow-400 border-2' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.is_pinned && (
                    <Pin className="h-4 w-4 text-yellow-600 fill-yellow-400" />
                  )}
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(announcement.category)}`}>
                    {getCategoryIcon(announcement.category)}
                    {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(announcement.status, announcement.expires_at)}`}>
                    {getStatusText(announcement.status, announcement.expires_at)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {language === 'en' ? 'Ward:' : 'Kata:'} {announcement.ward_target}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? announcement.title_en : announcement.title_sw}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {language === 'en' ? announcement.message_en : announcement.message_sw}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                  {announcement.expires_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {language === 'en' ? 'Expires:' : 'Inaisha:'} {new Date(announcement.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  title={t('common.edit')}
                >
                  <Edit className="h-5 w-5" />
                </button>
                {announcement.status !== 'archived' && (
                  <button
                    onClick={() => handleArchive(announcement.id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title={language === 'en' ? 'Archive' : 'Hifadhi'}
                  >
                    <Archive className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setConfirmDelete(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('common.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Confirm Deletion' : 'Thibitisha Ufutaji'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en'
                ? 'Are you sure you want to delete this announcement? This action cannot be undone.'
                : 'Je, una uhakika unataka kufuta tangazo hili? Hatua hii haiwezi kutenduliwa.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
