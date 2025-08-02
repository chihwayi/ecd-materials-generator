import api from './api';

export const teacherService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/teacher/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Teacher stats API unavailable, using fallback data');
      return {
        materialsCreated: 5,
        activeAssignments: 3,
        students: 12,
        completionRate: 85,
        // Grading analytics
        pendingGrades: 2,
        averageGrade: 78,
        gradedThisWeek: 8,
        gradingInsights: [
          {
            message: '5 assignments need grading',
            type: 'pending',
            date: new Date().toISOString()
          },
          {
            message: 'Average grade improved by 5%',
            type: 'improvement',
            date: new Date(Date.now() - 86400000).toISOString()
          },
          {
            message: 'All assignments graded on time',
            type: 'efficiency',
            date: new Date(Date.now() - 172800000).toISOString()
          }
        ]
      };
    }
  },

  async getRecentActivity() {
    try {
      const response = await api.get('/teacher/dashboard/activity');
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
          },
          {
            id: '3',
            type: 'assignment_graded',
            description: 'Graded assignment: Math Practice',
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ]
      };
    }
  },

  async getGradingAnalytics() {
    try {
      const response = await api.get('/teacher/dashboard/grading');
      return response.data;
    } catch (error) {
      console.warn('Grading analytics API unavailable, using fallback data');
      return {
        pendingGrades: 2,
        averageGrade: 78,
        gradedThisWeek: 8,
        gradingInsights: [
          {
            message: '5 assignments need grading',
            type: 'pending',
            date: new Date().toISOString()
          },
          {
            message: 'Average grade improved by 5%',
            type: 'improvement',
            date: new Date(Date.now() - 86400000).toISOString()
          },
          {
            message: 'All assignments graded on time',
            type: 'efficiency',
            date: new Date(Date.now() - 172800000).toISOString()
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