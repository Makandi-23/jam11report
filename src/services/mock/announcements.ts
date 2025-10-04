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

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title_en: 'Community Clean-Up Day This Saturday',
    title_sw: 'Siku ya Usafi wa Jamii Jumamosi Hii',
    message_en: 'Join us for a community-wide clean-up effort this Saturday at 8 AM. Let\'s make Kibra cleaner together! Meeting point: Laini Saba Community Center.',
    message_sw: 'Jiunge nasi kwa juhudi za usafi wa jamii nzima Jumamosi hii saa 2 asubuhi. Tufanye Kibra isafi pamoja! Mahali pa kukutana: Kituo cha Jamii cha Laini Saba.',
    category: 'event',
    ward_target: 'all',
    is_pinned: true,
    expires_at: '2025-12-31',
    status: 'active',
    created_at: '2025-10-03T08:00:00Z'
  },
  {
    id: '2',
    title_en: 'Water Supply Interruption - Makina Ward',
    title_sw: 'Maji Yatakatizwa - Kata ya Makina',
    message_en: 'Water supply will be interrupted in Makina ward on Monday, October 7th from 9 AM to 3 PM for maintenance work. Please store water accordingly.',
    message_sw: 'Maji yatakatizwa katika kata ya Makina Jumatatu, Oktoba 7 kuanzia saa 3 asubuhi hadi saa 9 mchana kwa kazi ya matengenezo. Tafadhali hifadhi maji ipasavyo.',
    category: 'warning',
    ward_target: 'makina',
    is_pinned: true,
    expires_at: '2025-10-07',
    status: 'active',
    created_at: '2025-10-02T14:30:00Z'
  },
  {
    id: '3',
    title_en: 'New Health Clinic Opening in Lindi',
    title_sw: 'Kliniki Mpya ya Afya Inafunguliwa Lindi',
    message_en: 'A new health clinic will open in Lindi ward next week. The clinic will offer free check-ups for the first month. Operating hours: Monday to Friday, 8 AM - 6 PM.',
    message_sw: 'Kliniki mpya ya afya itafunguliwa katika kata ya Lindi wiki ijayo. Kliniki itatoa ukaguzi wa bure kwa mwezi wa kwanza. Masaa ya kazi: Jumatatu hadi Ijumaa, 8 asubuhi - 6 jioni.',
    category: 'info',
    ward_target: 'lindi',
    is_pinned: false,
    expires_at: null,
    status: 'active',
    created_at: '2025-10-01T10:15:00Z'
  },
  {
    id: '4',
    title_en: 'Security Alert - Suspicious Activity Reported',
    title_sw: 'Tahadhari ya Usalama - Shughuli za Kutilia Shaka Zimeripotiwa',
    message_en: 'Residents are advised to be vigilant. Several reports of suspicious individuals in Sarang\'ombe area. Please report any unusual activity to local authorities immediately.',
    message_sw: 'Wakazi wanashauri kuwa waangalifu. Ripoti kadhaa za watu wa kutilia shaka katika eneo la Sarang\'ombe. Tafadhali ripoti shughuli zozote zisizo za kawaida kwa mamlaka za mitaa haraka.',
    category: 'urgent',
    ward_target: 'sarang\'ombe',
    is_pinned: false,
    expires_at: '2025-10-10',
    status: 'active',
    created_at: '2025-09-30T16:45:00Z'
  },
  {
    id: '5',
    title_en: 'Youth Skills Training Program Registration Open',
    title_sw: 'Usajili wa Programu ya Mafunzo ya Ujuzi kwa Vijana Umefunguliwa',
    message_en: 'The county government is offering free skills training in carpentry, tailoring, and IT. Register at Woodley/Kenyatta Golf Course community office. Limited slots available!',
    message_sw: 'Serikali ya kaunti inatoa mafunzo ya bure ya ujuzi katika useremala, ushonaji, na IT. Jisajili ofisini ya jamii ya Woodley/Kenyatta Golf Course. Nafasi chache zinapatikana!',
    category: 'event',
    ward_target: 'woodley/kenyatta golf course',
    is_pinned: false,
    expires_at: '2025-10-15',
    status: 'active',
    created_at: '2025-09-28T09:00:00Z'
  },
  {
    id: '6',
    title_en: 'Waste Collection Schedule Update',
    title_sw: 'Sasisha Ratiba ya Ukusanyaji Taka',
    message_en: 'New waste collection schedule effective immediately. All wards: Monday, Wednesday, Friday mornings. Please have bins ready by 7 AM.',
    message_sw: 'Ratiba mpya ya ukusanyaji taka inaanza mara moja. Kata zote: Jumatatu, Jumatano, Ijumaa asubuhi. Tafadhali weka mapipa tayari kufikia saa 1 asubuhi.',
    category: 'info',
    ward_target: 'all',
    is_pinned: false,
    expires_at: null,
    status: 'active',
    created_at: '2025-09-25T11:20:00Z'
  },
  {
    id: '7',
    title_en: 'Road Maintenance - Expect Delays',
    title_sw: 'Matengenezo ya Barabara - Tarajia Kuchelewa',
    message_en: 'Road maintenance work ongoing on main road through Laini Saba. Expect traffic delays. Alternative routes recommended. Work expected to complete by end of month.',
    message_sw: 'Kazi ya matengenezo ya barabara inaendelea kwenye barabara kuu inayopita Laini Saba. Tarajia kuchelewa kwa magari. Barabara mbadala zinapendekezwa. Kazi inatarajiwa kukamilika mwishoni mwa mwezi.',
    category: 'warning',
    ward_target: 'laini saba',
    is_pinned: false,
    expires_at: '2025-10-31',
    status: 'active',
    created_at: '2025-09-20T07:30:00Z'
  },
  {
    id: '8',
    title_en: 'Free Legal Aid Clinic This Thursday',
    title_sw: 'Kliniki ya Bure ya Msaada wa Kisheria Alhamisi Hii',
    message_en: 'Free legal consultation available this Thursday at Makina community hall, 10 AM - 4 PM. Lawyers will be available to answer questions about housing, employment, and family law.',
    message_sw: 'Ushauri wa bure wa kisheria unapatikana Alhamisi hii katika ukumbi wa jamii wa Makina, saa 4 asubuhi - saa 10 jioni. Wanasheria watakuwepo kujibu maswali kuhusu makazi, ajira, na sheria za familia.',
    category: 'event',
    ward_target: 'makina',
    is_pinned: false,
    expires_at: '2025-10-10',
    status: 'active',
    created_at: '2025-09-18T13:00:00Z'
  }
];

const readAnnouncements = new Set<string>();

const simulateLatency = () => new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 200));

export interface AnnouncementFilters {
  category?: string;
  ward?: string;
  status?: string;
  unreadOnly?: boolean;
  limit?: number;
}

export async function getAnnouncements(filters: AnnouncementFilters = {}): Promise<Announcement[]> {
  await simulateLatency();

  let filtered = [...mockAnnouncements];

  if (filters.status) {
    filtered = filtered.filter(a => a.status === filters.status);
  } else {
    filtered = filtered.filter(a => a.status === 'active');
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(a => a.category === filters.category);
  }

  if (filters.ward && filters.ward !== 'all') {
    filtered = filtered.filter(a =>
      a.ward_target === 'all' || a.ward_target === filters.ward
    );
  }

  const enriched = filtered.map(a => ({
    ...a,
    isRead: readAnnouncements.has(a.id)
  }));

  if (filters.unreadOnly) {
    return enriched.filter(a => !a.isRead);
  }

  filtered = enriched.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  await simulateLatency();

  const announcement = mockAnnouncements.find(a => a.id === id);
  if (!announcement) return null;

  return {
    ...announcement,
    isRead: readAnnouncements.has(id)
  };
}

export async function markAsRead(announcementId: string, userId: string): Promise<void> {
  await simulateLatency();
  readAnnouncements.add(announcementId);
}

export async function createAnnouncementDraft(data: Partial<Announcement>): Promise<Announcement> {
  await simulateLatency();

  const newAnnouncement: Announcement = {
    id: `temp-${Date.now()}`,
    title_en: data.title_en || '',
    title_sw: data.title_sw || '',
    message_en: data.message_en || '',
    message_sw: data.message_sw || '',
    category: data.category || 'info',
    ward_target: data.ward_target || 'all',
    is_pinned: data.is_pinned || false,
    expires_at: data.expires_at || null,
    status: 'active',
    created_at: new Date().toISOString()
  };

  mockAnnouncements.unshift(newAnnouncement);
  return newAnnouncement;
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | null> {
  await simulateLatency();

  const index = mockAnnouncements.findIndex(a => a.id === id);
  if (index === -1) return null;

  mockAnnouncements[index] = {
    ...mockAnnouncements[index],
    ...data
  };

  return mockAnnouncements[index];
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  await simulateLatency();

  const index = mockAnnouncements.findIndex(a => a.id === id);
  if (index === -1) return false;

  mockAnnouncements.splice(index, 1);
  return true;
}

export async function archiveAnnouncement(id: string): Promise<boolean> {
  await simulateLatency();

  const announcement = mockAnnouncements.find(a => a.id === id);
  if (!announcement) return false;

  announcement.status = 'archived';
  return true;
}
