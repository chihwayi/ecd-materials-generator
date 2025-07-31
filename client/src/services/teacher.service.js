import api from './api';

export const teacherService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/teacher/stats');
      return response.data;
    } catch (error) {
      console.warn('Teacher stats API unavailable, using fallback data');
      return {
        materialsCreated: 5,
        activeAssignments: 3,
        students: 12,
        completionRate: 85
      };
    }
  },

  async getRecentActivity() {
    try {
      const response = await api.get('/dashboard/teacher/activity');
      return response.data;
    } catch (error) {
      console.warn('Teacher activity API unavailable, using fallback data');
      return {
        activity: [
          {
            id: '1',
            type: 'material_created',
            description: 'Created material: Colors and Shapes',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            type: 'assignment_created',
            description: 'Created assignment: Math Practice',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      };
    }
  },

  async getMaterials(page = 1, limit = 10) {
    const response = await api.get(`/teacher/materials?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getStudents() {
    const response = await api.get('/teacher/students');
    return response.data;
  }
};