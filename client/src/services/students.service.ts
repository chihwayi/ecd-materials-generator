import api from './api';

export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  age: number;
  className: string;
  enrollmentDate: string;
  progress: {
    completedActivities: number;
    totalActivities: number;
    averageScore: number;
  };
  recentActivities: Array<{
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
        name: `${student.firstName} ${student.lastName}`,
        parentName: student.parent?.firstName && student.parent?.lastName 
          ? `${student.parent.firstName} ${student.parent.lastName}` 
          : student.parentName || 'N/A',
        parentEmail: student.parent?.email || student.parentEmail || 'N/A',
        age: student.age,
        className: student.class?.name || 'N/A',
        enrollmentDate: student.createdAt?.split('T')[0] || 'N/A',
        progress: {
          completedActivities: 0,
          totalActivities: 10,
          averageScore: 0
        },
        recentActivities: []
      }));
    } catch (error) {
      console.warn('Students API unavailable, using fallback data:', error.message);
      // Fallback data when API is unavailable
      return [
        {
          id: '1',
          name: 'Tinashe Mukamuri',
          parentName: 'Grace Mukamuri',
          parentEmail: 'grace.mukamuri@email.com',
          age: 5,
          className: 'Grade R Blue',
          enrollmentDate: '2024-01-15',
          progress: {
            completedActivities: 12,
            totalActivities: 20,
            averageScore: 85
          },
          recentActivities: [
            { id: '1', name: 'Draw Your Name', type: 'drawing', completedAt: '2024-01-20', score: 90 },
            { id: '2', name: 'Count to 10', type: 'math', completedAt: '2024-01-18', score: 80 }
          ]
        },
        {
          id: '2',
          name: 'Chipo Ndoro',
          parentName: 'Memory Ndoro',
          parentEmail: 'memory.ndoro@email.com',
          age: 4,
          className: 'Grade R Blue',
          enrollmentDate: '2024-01-10',
          progress: {
            completedActivities: 8,
            totalActivities: 20,
            averageScore: 78
          },
          recentActivities: [
            { id: '3', name: 'Color Shapes', type: 'art', completedAt: '2024-01-19', score: 85 }
          ]
        }
      ];
    }
  }

  async getStudentById(studentId: string): Promise<Student> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
      const response = await api.get(`${baseEndpoint}/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.warn('Student API unavailable, using fallback data:', error.message);
      return {
        id: studentId,
        name: 'Student Name',
        parentName: 'Parent Name',
        parentEmail: 'parent@email.com',
        age: 5,
        className: 'Grade R Blue',
        enrollmentDate: '2024-01-15',
        progress: { completedActivities: 0, totalActivities: 0, averageScore: 0 },
        recentActivities: []
      };
    }
  }

  async getStudentProgress(studentId: string): Promise<ProgressRecord[]> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
      const response = await api.get(`${baseEndpoint}/students/${studentId}/progress`);
      return response.data;
    } catch (error) {
      console.warn('Progress API unavailable, using fallback data:', error.message);
      return [
        {
          id: '1',
          studentId,
          activity: 'Sample Activity',
          type: 'offline',
          score: 85,
          notes: 'Great work!',
          date: new Date().toISOString().split('T')[0]
        }
      ];
    }
  }

  async addProgressRecord(studentId: string, record: {
    activity: string;
    type: 'digital' | 'offline';
    score?: number;
    notes: string;
  }): Promise<ProgressRecord> {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const baseEndpoint = user.role === 'teacher' ? '/teacher' : '/school-admin';
      const response = await api.post(`${baseEndpoint}/students/${studentId}/progress`, record);
      return response.data;
    } catch (error) {
      console.warn('Add progress API unavailable, using fallback:', error.message);
      return {
        id: Date.now().toString(),
        studentId,
        activity: record.activity,
        type: record.type,
        score: record.score,
        notes: record.notes,
        date: new Date().toISOString().split('T')[0]
      };
    }
  }
}

export const studentsService = new StudentsService();