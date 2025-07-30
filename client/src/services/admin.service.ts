import api from './api';
import { 
  User, 
  School, 
  SystemStats, 
  PaginatedResponse, 
  UserFilters, 
  SchoolFilters,
  CreateUserRequest,
  UpdateUserRequest,
  CreateSchoolRequest,
  UpdateSchoolRequest
} from '../types/user.types';

// User Management API
export const userService = {
  // Get all users with pagination and filtering
  getUsers: async (params: {
    page?: number;
    limit?: number;
    filters?: UserFilters;
  }): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/users?${queryParams.toString()}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  }
};

// School Management API
export const schoolService = {
  // Get all schools with pagination and filtering
  getSchools: async (params: {
    page?: number;
    limit?: number;
    filters?: SchoolFilters;
  }): Promise<PaginatedResponse<School>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/users/schools/all?${queryParams.toString()}`);
    return response.data;
  },

  // Create new school
  createSchool: async (schoolData: CreateSchoolRequest): Promise<School> => {
    const response = await api.post('/users/schools', schoolData);
    return response.data;
  },

  // Update school
  updateSchool: async (id: string, schoolData: UpdateSchoolRequest): Promise<School> => {
    const response = await api.put(`/users/schools/${id}`, schoolData);
    return response.data;
  },

  // Delete school
  deleteSchool: async (id: string): Promise<void> => {
    await api.delete(`/users/schools/${id}`);
  }
};

// Analytics API
export const analyticsService = {
  // Get system statistics
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await api.get('/analytics/system/stats');
    return response.data;
  },

  // Get system performance metrics
  getSystemPerformance: async (): Promise<any> => {
    const response = await api.get('/analytics/system/performance');
    return response.data;
  },

  // Get user growth analytics
  getUserGrowthAnalytics: async (period: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<any[]> => {
    const response = await api.get(`/analytics/users/growth?period=${period}`);
    return response.data;
  },

  // Get school analytics
  getSchoolAnalytics: async (): Promise<any[]> => {
    const response = await api.get('/analytics/schools/analytics');
    return response.data;
  }
};

// System Management API
export const systemService = {
  // Get system health status
  getSystemHealth: async (): Promise<any> => {
    const response = await api.get('/analytics/system/performance');
    return response.data;
  },

  // Export system data
  exportSystemData: async (type: 'users' | 'schools' | 'all'): Promise<Blob> => {
    const response = await api.get(`/system/export/${type}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // System backup
  createBackup: async (): Promise<any> => {
    const response = await api.post('/system/backup');
    return response.data;
  },

  // Get system logs
  getSystemLogs: async (params: {
    level?: 'error' | 'warn' | 'info' | 'debug';
    limit?: number;
    page?: number;
  } = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(`/system/logs?${queryParams.toString()}`);
    return response.data;
  }
};

export default {
  users: userService,
  schools: schoolService,
  analytics: analyticsService,
  system: systemService
};