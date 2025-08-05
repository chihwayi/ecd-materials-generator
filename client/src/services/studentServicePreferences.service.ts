import api from './api';

export interface StudentServicePreferences {
  id?: string;
  studentId: string;
  schoolId: string;
  tuitionType: 'monthly' | 'term' | null;
  transport: boolean;
  food: boolean;
  activities: boolean;
  auxiliary: boolean;
  academicYear: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavePreferencesData {
  tuitionType: 'monthly' | 'term' | null;
  transport: boolean;
  food: boolean;
  activities: boolean;
  auxiliary: boolean;
  academicYear?: string;
  notes?: string;
}

class StudentServicePreferencesService {
  // Get student service preferences
  async getStudentPreferences(studentId: string, academicYear?: string): Promise<StudentServicePreferences> {
    const params = academicYear ? `?academicYear=${academicYear}` : '';
    const response = await api.get(`/student-service-preferences/${studentId}${params}`);
    return response.data;
  }

  // Save student service preferences
  async saveStudentPreferences(studentId: string, preferences: SavePreferencesData): Promise<{ message: string; preferences: StudentServicePreferences }> {
    const response = await api.post(`/student-service-preferences/${studentId}`, preferences);
    return response.data;
  }

  // Update student service preferences
  async updateStudentPreferences(studentId: string, preferences: SavePreferencesData): Promise<{ message: string; preferences: StudentServicePreferences }> {
    const response = await api.put(`/student-service-preferences/${studentId}`, preferences);
    return response.data;
  }

  // Get all student service preferences for the school
  async getAllStudentPreferences(academicYear?: string): Promise<StudentServicePreferences[]> {
    const params = academicYear ? `?academicYear=${academicYear}` : '';
    const response = await api.get(`/student-service-preferences${params}`);
    return response.data;
  }
}

export default new StudentServicePreferencesService(); 