import api from './api';

export const adminService = {
  // System Stats
  async getSystemStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getSystemPerformance() {
    const response = await api.get('/admin/performance');
    return response.data;
  },

  // User Management
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async toggleUserStatus(userId) {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // School Management
  async getAllSchools(page = 1, limit = 20) {
    const response = await api.get(`/admin/schools?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createSchool(schoolData) {
    const response = await api.post('/admin/schools', schoolData);
    return response.data;
  },

  async updateSchool(schoolId, schoolData) {
    const response = await api.put(`/admin/schools/${schoolId}`, schoolData);
    return response.data;
  },

  // Template Management
  async getAllTemplates(page = 1, limit = 20) {
    const response = await api.get(`/admin/templates?page=${page}&limit=${limit}`);
    return response.data;
  },

  async approveTemplate(templateId) {
    const response = await api.patch(`/admin/templates/${templateId}/approve`);
    return response.data;
  },

  async rejectTemplate(templateId, reason) {
    const response = await api.patch(`/admin/templates/${templateId}/reject`, { reason });
    return response.data;
  },

  // System Settings
  async getSystemSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSystemSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Analytics
  async getAnalytics(timeRange = '7d') {
    const response = await api.get(`/admin/analytics?range=${timeRange}`);
    return response.data;
  }
};