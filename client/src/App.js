import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import SystemUsersPage from './pages/SystemUsersPage';
import { useSelector } from 'react-redux';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
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
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">Assignments</h1>
                  <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin', 'delegated_admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">System Administration</h1>
                  <p className="text-gray-600 mt-2">System admin tools coming soon...</p>
                </div>
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/system-users"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SystemUsersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-management"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">School Management</h1>
                  <p className="text-gray-600 mt-2">School management tools coming soon...</p>
                </div>
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;