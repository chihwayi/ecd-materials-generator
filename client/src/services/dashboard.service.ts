import api from './api';

export interface DashboardStats {
  totalMaterials: number;
  publishedMaterials: number;
  draftMaterials: number;
  totalStudents: number;
  activeStudents: number;
  completedActivities: number;
  averageScore: number;
  recentActivities: Array<{
    id: string;
    studentName: string;
    activityName: string;
    score: number;
    completedAt: string;
  }>;
  materialsBySubject: Array<{
    subject: string;
    count: number;
  }>;
  studentProgress: Array<{
    studentName: string;
    completedActivities: number;
    totalActivities: number;
    averageScore: number;
  }>;
}

export interface TeacherClass {
  id: string;
  name: string;
  studentCount: number;
  ageGroup: string;
}

class DashboardService {
  async getTeacherStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/teacher/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Dashboard API unavailable, using fallback data:', error.message);
      // Fallback data when API is unavailable
      return {
        totalMaterials: 24,
        publishedMaterials: 18,
        draftMaterials: 6,
        totalStudents: 15,
        activeStudents: 12,
        completedActivities: 156,
        averageScore: 82,
        recentActivities: [
          {
            id: '1',
            studentName: 'Tinashe Mukamuri',
            activityName: 'Draw Your Name',
            score: 90,
            completedAt: '2024-01-20T10:30:00Z'
          },
          {
            id: '2',
            studentName: 'Chipo Ndoro',
            activityName: 'Color Shapes',
            score: 85,
            completedAt: '2024-01-19T14:15:00Z'
          },
          {
            id: '3',
            studentName: 'Tafadzwa Moyo',
            activityName: 'Count to 10',
            score: 78,
            completedAt: '2024-01-18T09:45:00Z'
          }
        ],
        materialsBySubject: [
          { subject: 'Math', count: 8 },
          { subject: 'Language', count: 6 },
          { subject: 'Art', count: 5 },
          { subject: 'Science', count: 3 },
          { subject: 'Cultural', count: 2 }
        ],
        studentProgress: [
          {
            studentName: 'Tinashe Mukamuri',
            completedActivities: 12,
            totalActivities: 15,
            averageScore: 88
          },
          {
            studentName: 'Chipo Ndoro',
            completedActivities: 8,
            totalActivities: 15,
            averageScore: 82
          },
          {
            studentName: 'Tafadzwa Moyo',
            completedActivities: 10,
            totalActivities: 15,
            averageScore: 75
          }
        ]
      };
    }
  }

  async getTeacherClasses(): Promise<TeacherClass[]> {
    try {
      const response = await api.get('/teacher/classes');
      return response.data;
    } catch (error) {
      // Mock data for development
      return [
        {
          id: '1',
          name: 'Grade R Blue',
          studentCount: 15,
          ageGroup: '4-5 years'
        }
      ];
    }
  }
}

export const dashboardService = new DashboardService();