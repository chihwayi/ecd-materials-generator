import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import UserManagementPage from './pages/admin/UserManagementPage';
import SchoolManagementPage from './pages/admin/SchoolManagementPage';
import SystemAnalyticsPage from './pages/admin/SystemAnalyticsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            {/* System Admin Routes */}
            <Route
              path="/system-users"
              element={
                <RoleProtectedRoute allowedRoles={['system_admin']}>
                  <UserManagementPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/system-schools"
              element={
                <RoleProtectedRoute allowedRoles={['system_admin']}>
                  <SchoolManagementPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/system-analytics"
              element={
                <RoleProtectedRoute allowedRoles={['system_admin']}>
                  <SystemAnalyticsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/system-templates"
              element={
                <RoleProtectedRoute allowedRoles={['system_admin']}>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">System Templates</h1>
                    <p className="text-gray-600 mt-2">Template management coming soon...</p>
                  </div>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/system-settings"
              element={
                <RoleProtectedRoute allowedRoles={['system_admin']}>
                  <SystemSettingsPage />
                </RoleProtectedRoute>
              }
            />
            
            {/* Regular User Routes */}
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">My Materials</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Assignments</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600 mt-2">Settings page coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;