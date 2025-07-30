export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'school_admin' | 'parent' | 'system_admin';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  language: 'en' | 'sn' | 'nd';
  schoolId?: string;
  subscriptionPlan: 'free' | 'teacher' | 'school' | 'premium';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  subscriptionExpiresAt?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  school?: School;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  maxTeachers: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
  _count?: {
    users: number;
    students: number;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'teacher' | 'school_admin' | 'parent' | 'system_admin';
  phoneNumber?: string;
  language?: 'en' | 'sn' | 'nd';
  schoolId?: string;
  subscriptionPlan?: 'free' | 'teacher' | 'school' | 'premium';
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'teacher' | 'school_admin' | 'parent' | 'system_admin';
  phoneNumber?: string;
  language?: 'en' | 'sn' | 'nd';
  schoolId?: string;
  subscriptionPlan?: 'free' | 'teacher' | 'school' | 'premium';
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  isActive?: boolean;
}

export interface CreateSchoolRequest {
  name: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  subscriptionPlan?: 'free' | 'basic' | 'premium';
  maxTeachers?: number;
  maxStudents?: number;
}

export interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  subscriptionPlan?: 'free' | 'basic' | 'premium';
  subscriptionStatus?: 'active' | 'cancelled' | 'expired';
  maxTeachers?: number;
  maxStudents?: number;
  isActive?: boolean;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalSchools: number;
  activeSchools: number;
  totalMaterials: number;
  totalTemplates: number;
  totalAssignments: number;
  systemHealth: number;
  usersByRole: {
    teacher: number;
    school_admin: number;
    parent: number;
    system_admin: number;
  };
  usersBySubscription: {
    free: number;
    teacher: number;
    school: number;
    premium: number;
  };
  recentActivity: SystemActivity[];
}

export interface SystemActivity {
  id: string;
  type: 'user_created' | 'user_updated' | 'school_created' | 'school_updated' | 'material_created' | 'template_created' | 'system_event';
  description: string;
  userId?: string;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  role?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  isActive?: boolean;
  schoolId?: string;
  search?: string;
}

export interface SchoolFilters {
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  isActive?: boolean;
  search?: string;
}