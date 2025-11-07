// services/api/announcements.ts
export interface Announcement {
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
  isRead?: boolean;
}

const API_BASE_URL = 'http://localhost/jam11report/backend/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const userData = localStorage.getItem('user');
  const token = userData ? JSON.parse(userData).token : null;
  
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Map backend data to frontend interface
const mapBackendToFrontend = (backendData: any): Announcement => {
  return {
    id: backendData.id.toString(),
    title_en: backendData.title_en,
    title_sw: backendData.title_sw,
    message_en: backendData.message_en,
    message_sw: backendData.message_sw,
    category: mapCategoryToFrontend(backendData.category),
    ward_target: backendData.target_ward,
    is_pinned: backendData.priority === 'pinned',
    expires_at: backendData.expires_at,
    status: mapStatusToFrontend(backendData.expires_at),
    created_at: backendData.created_at,
    isRead: false // Default to unread
  };
};

// Map frontend category to backend category
const mapCategoryToBackend = (frontendCategory: string): string => {
  const mapping: { [key: string]: string } = {
    'info': 'information',
    'warning': 'warning',
    'urgent': 'urgent',
    'event': 'event'
  };
  return mapping[frontendCategory] || 'information';
};

// Map backend category to frontend category
const mapCategoryToFrontend = (backendCategory: string): 'info' | 'warning' | 'urgent' | 'event' => {
  const mapping: { [key: string]: 'info' | 'warning' | 'urgent' | 'event' } = {
    'information': 'info',
    'warning': 'warning',
    'urgent': 'urgent',
    'event': 'event'
  };
  return mapping[backendCategory] || 'info';
};

// Map status based on expiry date
const mapStatusToFrontend = (expiresAt: string | null): 'active' | 'expired' => {
  if (!expiresAt) return 'active';
  return new Date(expiresAt) < new Date() ? 'expired' : 'active';
};

// GET all announcements (for admin)
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/get_all.php`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch announcements: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.announcements) {
      return data.announcements.map(mapBackendToFrontend);
    } else if (data.success && data.announcements) {
      return data.announcements.map(mapBackendToFrontend);
    } else {
      throw new Error(data.message || 'No announcements found in response');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// GET announcements by ward (for residents)
// GET announcements by ward (for residents) - FIXED VERSION
// In services/api/announcements.ts - UPDATE getAnnouncementsByWard
export const getAnnouncementsByWard = async (ward: string): Promise<Announcement[]> => {
  try {
    const url = `${API_BASE_URL}/announcements/get_by_ward.php?ward=${encodeURIComponent(ward)}`;
    console.log('📡 Making API call to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response not OK. Error text:', errorText);
      throw new Error(`Failed to fetch announcements: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('📄 Raw response text:', responseText);
    
    const data = JSON.parse(responseText);
    console.log('📦 Parsed response data:', data);
    
    if (data.announcements) {
      const announcements = data.announcements.map(mapBackendToFrontend);
      console.log('🔄 Mapped announcements:', announcements);
      return announcements.sort((a: Announcement, b: Announcement) => {
        if (a.is_pinned !== b.is_pinned) {
          return a.is_pinned ? -1 : 1;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      console.error('❌ No announcements array in response');
      throw new Error(data.message || 'No announcements found in response');
    }
  } catch (error) {
    console.error('❌ API Error in getAnnouncementsByWard:', error);
    throw error;
  }
};
// CREATE new announcement
export const createAnnouncement = async (announcementData: {
  title_en: string;
  title_sw: string;
  message_en: string;
  message_sw: string;
  category: string;
  ward_target: string;
  is_pinned: boolean;
  expires_at: string | null;
}): Promise<{ success: boolean; announcement_id?: string; message?: string }> => {
  try {
    const backendData = {
      title_en: announcementData.title_en,
      title_sw: announcementData.title_sw,
      message_en: announcementData.message_en,
      message_sw: announcementData.message_sw,
      category: mapCategoryToBackend(announcementData.category),
      priority: announcementData.is_pinned ? 'pinned' : 'normal',
      target_ward: announcementData.ward_target,
      expires_at: announcementData.expires_at || null
    };

    const response = await fetch(`${API_BASE_URL}/announcements/create.php`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// For now, we'll keep these as mock functions since your backend might not support them yet
export const markAsRead = async (announcementId: string, userId: string): Promise<void> => {
  // Mock implementation for now
  console.log(`Marking announcement ${announcementId} as read for user ${userId}`);
  return Promise.resolve();
};

export const updateAnnouncement = async (id: string, data: Partial<Announcement>): Promise<Announcement | null> => {
  // Mock implementation for now
  console.log(`Updating announcement ${id}`, data);
  return Promise.resolve(null);
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  // Mock implementation for now
  console.log(`Deleting announcement ${id}`);
  return Promise.resolve(true);
};

export const archiveAnnouncement = async (id: string): Promise<boolean> => {
  // Mock implementation for now
  console.log(`Archiving announcement ${id}`);
  return Promise.resolve(true);
};