import api from './api';
import { toast } from 'react-hot-toast';

export const adminService = {
  // System Stats
  async getSystemStats() {
    try {
      const response = await api.get('/analytics/system/stats');
      return response.data;
    } catch (error) {
      // Fallback data for development
      return {
        totalUsers: 0,
        activeSchools: 0,
        totalMaterials: 0,
        systemHealth: 100,
        recentActivity: []
      };
    }
  },

  async getSystemPerformance() {
    try {
      const response = await api.get('/analytics/system/performance');
      return response.data;
    } catch (error) {
      // Fallback data for development
      return {
        database: { status: 'Connected' },
        memory: { used: 256, total: 1024 },
        uptime: 7200
      };
    }
  },

  // System Logs
  async getSystemLogs(level = 'all', limit = 100) {
    try {
      const response = await api.get(`/admin/logs?level=${level}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return { logs: [] };
    }
  },

  // Activity Logs
  async getActivityLogs(page = 1, limit = 50) {
    try {
      const response = await api.get(`/admin/activity?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return { data: [], pagination: { total: 0 } };
    }
  },

  // System Health
  async getSystemHealth() {
    try {
      const response = await api.get('/admin/health');
      return response.data;
    } catch (error) {
      return {
        status: 'healthy',
        services: {
          database: 'connected',
          redis: 'connected',
          storage: 'available'
        }
      };
    }
  },

  // User Management
  async getAllUsers(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  async toggleUserStatus(userId) {
    const user = await api.get(`/users/${userId}`);
    const response = await api.put(`/users/${userId}`, { isActive: !user.data.isActive });
    return response.data;
  },

  // School Management
  async getAllSchools(page = 1, limit = 20) {
    const response = await api.get(`/users/schools/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createSchool(schoolData) {
    const response = await api.post('/users/schools', schoolData);
    return response.data;
  },

  async updateSchool(schoolId, schoolData) {
    const response = await api.put(`/users/schools/${schoolId}`, schoolData);
    return response.data;
  },

  // Template Management
  async getAllTemplates(page = 1, limit = 20) {
    const response = await api.get(`/templates?page=${page}&limit=${limit}`);
    return response.data;
  },

  async approveTemplate(templateId) {
    const response = await api.patch(`/templates/${templateId}/approve`);
    return response.data;
  },

  async rejectTemplate(templateId, reason) {
    const response = await api.patch(`/templates/${templateId}/reject`, { reason });
    return response.data;
  },

  // System Settings
  async getSystemSettings() {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      return {
        maintenanceMode: false,
        registrationEnabled: true,
        maxFileSize: 10485760,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png']
      };
    }
  },

  async updateSystemSettings(settings) {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Bulk Operations
  async bulkUpdateUsers(userIds, updates) {
    const response = await api.patch('/admin/users/bulk', { userIds, updates });
    return response.data;
  },

  async bulkDeleteUsers(userIds) {
    const response = await api.delete('/admin/users/bulk', { data: { userIds } });
    return response.data;
  },

  // Export Data
  async exportUsers(format = 'csv') {
    const response = await api.get(`/admin/export/users?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async exportSchools(format = 'csv') {
    const response = await api.get(`/admin/export/schools?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Analytics
  async getAnalytics(timeRange = '7d') {
    const response = await api.get(`/analytics/users/growth?period=${timeRange}`);
    return response.data;
  },

  async getUserGrowthAnalytics(period = '30d') {
    const response = await api.get(`/analytics/users/growth?period=${period}`);
    return response.data;
  },

  async getSchoolAnalytics() {
    const response = await api.get('/analytics/schools/analytics');
    return response.data;
  },

  // User Role Management
  async assignRole(userId, role) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async getPermissions(userId) {
    const response = await api.get(`/admin/users/${userId}/permissions`);
    return response.data;
  },

  async updatePermissions(userId, permissions) {
    const response = await api.patch(`/admin/users/${userId}/permissions`, { permissions });
    return response.data;
  },

  // System Maintenance
  async enableMaintenanceMode() {
    const response = await api.post('/admin/maintenance/enable');
    return response.data;
  },

  async disableMaintenanceMode() {
    const response = await api.post('/admin/maintenance/disable');
    return response.data;
  },

  async clearCache() {
    const response = await api.post('/admin/cache/clear');
    return response.data;
  },

  async backupDatabase() {
    const response = await api.post('/admin/backup/database');
    return response.data;
  },

  // Password reset functionality for system admin
  async resetUserPassword(userId, newPassword = null) {
    const response = await api.post('/admin/users/reset-password', {
      userId,
      newPassword
    });
    return response.data;
  },

  async getUsersForPasswordReset(role = 'all', search = '') {
    const params = new URLSearchParams();
    if (role !== 'all') params.append('role', role);
    if (search) params.append('search', search);
    
    const response = await api.get(`/admin/users/reset-password?${params}`);
    return response.data;
  }
};

export const analyticsService = adminService;

// Utility functions for admin operations
export const adminUtils = {
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }
};