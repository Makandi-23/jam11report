const API_BASE_URL = 'http://localhost/jam11report/backend/api';

export const apiService = {
  async getProfile(userId: number) {
    const response = await fetch(`${API_BASE_URL}/users/get_profile.php?user_id=${userId}`);
    return response.json();
  },

  async updateProfile(profileData: any) {
    const response = await fetch(`${API_BASE_URL}/users/update_profile.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  async getResidentStats(userId: number) {
    const response = await fetch(`${API_BASE_URL}/reports/my_reports.php?user_id=${userId}`);
    return response.json();
  },

   async getUserStats(userId: number) {
    const response = await fetch(`${API_BASE_URL}/users/user_stats.php?user_id=${userId}`);
    return response.json();
  },

  async getUserReports(userId: number) {
    const response = await fetch(`${API_BASE_URL}/reports/my_reports.php?user_id=${userId}`);
    return response.json();
  },

   async getResidents() {
    const response = await fetch(`${API_BASE_URL}/admin/residents.php`);
    return response.json();
  },

  async updateResidentStatus(userId: number, status: string) {
    const response = await fetch(`${API_BASE_URL}/admin/update_resident_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, status }),
    });
    return response.json();
  },
};