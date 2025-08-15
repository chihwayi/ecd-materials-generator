import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';
console.log('API_BASE_URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle maintenance mode
    if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
      // Check if user is system admin
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'system_admin') {
        // Store maintenance state
        localStorage.setItem('maintenanceMode', 'true');
        // Redirect to maintenance page
        window.location.href = '/maintenance';
      }
    }
    
    // Handle subscription expiry
    if (error.response?.status === 403 && error.response?.data?.subscriptionExpired) {
      window.location.href = '/subscription-expired';
    }
    
    // Handle inactive school - trial not activated
    if (error.response?.status === 403 && error.response?.data?.trialNotActivated) {
      // Redirect to pricing page for trial activation
      window.location.href = '/subscription/pricing';
      return Promise.reject(error);
    }
    
    // Handle other inactive school cases
    if (error.response?.status === 403 && error.response?.data?.schoolInactive) {
      alert(error.response.data.message);
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    }
    
    return Promise.reject(error);
  }
);

// Parent Dashboard
export const getParentDashboardStats = () => api.get('/parent/dashboard/stats');
export const markAssignmentViewed = (assignmentId, studentId) => 
  api.post(`/parent/assignment/${assignmentId}/viewed`, { studentId });

export default api;