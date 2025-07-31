import api from './api';

export const schoolAdminService = {
  // Teachers
  async getTeachers() {
    const response = await api.get('/school-admin/teachers');
    return response.data;
  },

  async createTeacher(teacherData) {
    const response = await api.post('/school-admin/teachers', teacherData);
    return response.data;
  },

  // Students
  async getAllStudents() {
    const response = await api.get('/school-admin/students');
    return response.data;
  },

  // Materials
  async getSchoolMaterials() {
    const response = await api.get('/school-admin/materials');
    return response.data;
  },

  // Analytics
  async getSchoolAnalytics() {
    const response = await api.get('/school-admin/analytics');
    return response.data;
  }
};