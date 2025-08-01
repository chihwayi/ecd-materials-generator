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

  async getTeacherById(teacherId) {
    const response = await api.get(`/school-admin/teachers/${teacherId}`);
    return response.data;
  },

  async updateTeacher(teacherId, teacherData) {
    const response = await api.put(`/school-admin/teachers/${teacherId}`, teacherData);
    return response.data;
  },

  async toggleTeacherStatus(teacherId) {
    const response = await api.patch(`/school-admin/teachers/${teacherId}/toggle-status`);
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
  },

  // Bulk Student Assignment
  async bulkAssignStudents(studentIds, classId) {
    const response = await api.post('/school-admin/students/bulk-assign', {
      studentIds,
      classId
    });
    return response.data;
  },

  async getUnassignedStudents() {
    const response = await api.get('/school-admin/students/unassigned');
    return response.data;
  },

  async getStudentsByClass(classId) {
    const response = await api.get(`/school-admin/classes/${classId}/students`);
    return response.data;
  }
};