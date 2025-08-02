import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/common/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginForm from './components/auth/LoginForm.tsx';
import RegisterForm from './components/auth/RegisterForm.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import TemplatesPage from './pages/TemplatesPage.tsx';
import MaterialsPage from './pages/MaterialsPage.tsx';
import MaterialEditorPage from './pages/MaterialEditorPage.tsx';
import MaterialViewerPage from './pages/MaterialViewerPage.tsx';
import StudentsPage from './pages/StudentsPage.tsx';
import TeacherMessagingPage from './pages/TeacherMessagingPage.tsx';
import SystemUsersPage from './pages/SystemUsersPage';
import ManageTeachersPage from './pages/ManageTeachersPage';
import SchoolStudentsPage from './pages/SchoolStudentsPage';
import SchoolMaterialsPage from './pages/SchoolMaterialsPage';
import SchoolAnalyticsPage from './pages/SchoolAnalyticsPage';
import ManageClassesPage from './pages/ManageClassesPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import CreateStudentPage from './pages/CreateStudentPage';
import ClassStudentsPage from './pages/ClassStudentsPage';
import CreateAssignmentPage from './pages/CreateAssignmentPage';
import TeacherAssignmentsPage from './pages/TeacherAssignmentsPage';
import StudentAssignmentsPage from './pages/StudentAssignmentsPage';
import StudentAssignmentPage from './pages/StudentAssignmentPage';
import StudentAssignmentCompletionPage from './pages/StudentAssignmentCompletionPage';
import TeacherAssignmentReviewPage from './pages/TeacherAssignmentReviewPage';
import ParentAssignmentsPage from './pages/ParentAssignmentsPage.tsx';
import SchoolSettingsPage from './pages/SchoolSettingsPage';
import UserManagementPage from './pages/admin/UserManagementPage.tsx';
import SchoolManagementPage from './pages/admin/SchoolManagementPage.tsx';
import SystemAnalyticsPage from './pages/admin/SystemAnalyticsPage.tsx';
import SystemSettingsPage from './pages/admin/SystemSettingsPage.tsx';
import { useSelector } from 'react-redux';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute.tsx';
import { RootState } from './store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
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
                <MaterialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/create"
            element={
              <ProtectedRoute>
                <MaterialEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:id/edit"
            element={
              <ProtectedRoute>
                <MaterialEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materials/:id"
            element={
              <ProtectedRoute>
                <MaterialViewerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <StudentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/messaging"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherMessagingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <TeacherAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:id"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <TeacherAssignmentReviewPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <CreateAssignmentPage />
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
            path="/admin/users"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <UserManagementPage />
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
            path="/students"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <StudentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/schools"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SchoolManagementPage />
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
            path="/admin/system-analytics"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SystemAnalyticsPage />
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
            path="/admin/system-settings"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SystemSettingsPage />
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
            path="/manage-teachers"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <ManageTeachersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-students"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <SchoolStudentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-materials"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <SchoolMaterialsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-analytics"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <SchoolAnalyticsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/manage-classes"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <ManageClassesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/password-recovery"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <PasswordRecoveryPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/create-student"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <CreateStudentPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/class-students/:classId"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <ClassStudentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/create-assignment"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <CreateAssignmentPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/student-assignments/:studentId"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <StudentAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/student-assignment-management"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <StudentAssignmentPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:assignmentId/complete"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <StudentAssignmentCompletionPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:assignmentId/review"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherAssignmentReviewPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/parent/assignments"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <ParentAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/parent-assignments/:studentId"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <ParentAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-settings"
            element={
              <RoleProtectedRoute allowedRoles={['school_admin']}>
                <SchoolSettingsPage />
              </RoleProtectedRoute>
            }
          />
        </Routes>
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
}

export default App;