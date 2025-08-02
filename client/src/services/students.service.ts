import api from './api';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  class?: {
    name: string;
    grade: string;
  };
  age?: number;
  parentName?: string;
  parentEmail?: string;
  enrollmentDate?: string;
  progress?: {
    completedActivities: number;
    totalActivities: number;
    averageScore: number;
  };
  recentActivities?: Array<{
    id: string;
    name: string;
    type: string;
    completedAt: string;
    score?: number;
  }>;
}

export interface ProgressRecord {
  id: string;
  studentId: string;
  activity: string;
  type: 'digital' | 'offline';
  score?: number;
  notes: string;
  date: string;
  recordedBy?: string;
}

class StudentsService {
  async getStudents(): Promise<Student[]> {
    try {
      // Get current user info to determine the correct endpoint
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const endpoint = user.role === 'teacher' ? '/teacher/students' : '/school-admin/students';
      
      const response = await api.get(endpoint);
      return response.data.students.map(student => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        class: student.class,
        age: student.age || 5, // Default age if not provided
        parentName: student.parent?.firstName && student.parent?.lastName 
          ? `${student.parent.firstName} ${student.parent.lastName}` 
          : student.parentName || 'N/A',
        parentEmail: student.parent?.email || student.parentEmail || 'N/A',
        enrollmentDate: student.createdAt?.split('T')[0] || 'N/A',
        progress: {
          completedActivities: 0,
          totalActivities: 0,
          averageScore: 0
        },
        recentActivities: []
      }));
    } catch (error) {
      console.warn('Students API unavailable:', error.message);
      return [];
    }
  }

  async getStudentById(studentId: string): Promise<Student> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
      const response = await api.get(`${baseEndpoint}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.warn('Student API unavailable:', error.message);
      throw error;
    }
  }

  async getStudentProgress(studentId: string): Promise<ProgressRecord[]> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
      const response = await api.get(`${baseEndpoint}/students/${studentId}/progress`);
      return response.data;
    } catch (error) {
      console.warn('Progress API unavailable:', error.message);
      return [];
    }
  }

  async addProgressRecord(studentId: string, record: {
    activity: string;
    type: 'digital' | 'offline';
    score?: number;
    notes: string;
  }): Promise<ProgressRecord> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
    const response = await api.post(`${baseEndpoint}/students/${studentId}/progress`, record);
    return response.data;
  }
}

export const studentsService = new StudentsService();