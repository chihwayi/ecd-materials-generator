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
import TeacherMessagesPage from './pages/TeacherMessagesPage.tsx';
import ParentMessagesPage from './pages/ParentMessagesPage.tsx';
import SchoolAdminFeeManagementPage from './pages/SchoolAdminFeeManagementPage.tsx';
import FinanceDashboardPage from './pages/FinanceDashboardPage.tsx';
import SchoolAdminFinancePage from './pages/SchoolAdminFinancePage.tsx';
import SystemUsersPage from './pages/SystemUsersPage.tsx';
import ManageTeachersPage from './pages/ManageTeachersPage.js';
import SchoolStudentsPage from './pages/SchoolStudentsPage';
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
import ProgressReportsPage from './pages/ProgressReportsPage.tsx';
import ContactTeacherPage from './pages/ContactTeacherPage.tsx';
import SchoolSettingsPage from './pages/SchoolSettingsPage';
import SignatureManagementPage from './pages/SignatureManagementPage.tsx';
import FinancialReportsPage from './pages/FinancialReportsPage.tsx';
import ReceiptsManagementPage from './pages/ReceiptsManagementPage.tsx';
import UserManagementPage from './pages/admin/UserManagementPage.tsx';
import SchoolManagementPage from './pages/admin/SchoolManagementPage.tsx';
import SystemAnalyticsPage from './pages/admin/SystemAnalyticsPage.tsx';
import SystemSettingsPage from './pages/admin/SystemSettingsPage.tsx';
import SubscriptionPricingPage from './pages/SubscriptionPricingPage.tsx';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage.tsx';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage.tsx';
import SubscriptionMonitoringPage from './pages/admin/SubscriptionMonitoringPage.tsx';
import SubscriptionPlansPage from './pages/admin/SubscriptionPlansPage.tsx';
import AuditLogsPage from './pages/admin/AuditLogsPage.tsx';
import MaintenancePage from './pages/MaintenancePage.tsx';
import { useSelector } from 'react-redux';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute.tsx';
import { RootState } from './store';
import subscriptionService from './services/subscription.service.ts';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const SubscriptionProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isActive, setIsActive] = React.useState<boolean | null>(null);
  const location = window.location.pathname;

  React.useEffect(() => {
    const checkSubscription = async () => {
      if (user?.role === 'school_admin') {
        setIsLoading(true);
        try {
          const sub = await subscriptionService.getCurrentSubscription();
          console.log('Subscription check result:', sub);
          setIsActive(!!(sub && sub.isActive));
        } catch (error) {
          console.error('Subscription check error:', error);
          setIsActive(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkSubscription();
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'school_admin') return <>{children}</>;
  if (isLoading || isActive === null) return <div className="min-h-screen flex items-center justify-center text-xl">Checking subscription...</div>;
  if (!isActive && location !== '/subscription/pricing') {
    return <Navigate to="/subscription/pricing" replace />;
  }
  return <>{children}</>;
};

const FinanceRedirect: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (user?.role === 'school_admin') {
    return <Navigate to="/school-finance" replace />;
  }
  
  return <FinanceDashboardPage />;
};

const DashboardRedirect: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (user?.role === 'finance') {
    return <Navigate to="/finance" replace />;
  }
  
  return <DashboardPage />;
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
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route 
            path="/templates" 
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'system_admin']}>
                <TemplatesPage />
              </RoleProtectedRoute>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <SubscriptionProtectedRoute>
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/materials"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <MaterialsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/materials/create"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <MaterialEditorPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/materials/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <MaterialEditorPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/materials/:id"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <MaterialViewerPage />
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
            path="/messaging"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherMessagingPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/teacher/messages"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherMessagesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/parent/messages"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <ParentMessagesPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherAssignmentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:id"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
                <TeacherAssignmentReviewPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/assignments/:id/edit"
            element={
              <RoleProtectedRoute allowedRoles={['teacher']}>
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
            path="/admin/subscriptions"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SubscriptionMonitoringPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/subscription-monitoring"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SubscriptionMonitoringPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/subscription-plans"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <SubscriptionPlansPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <RoleProtectedRoute allowedRoles={['system_admin']}>
                <AuditLogsPage />
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
            path="/subscription/pricing"
            element={
              <ProtectedRoute>
                <SubscriptionPricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription/manage"
            element={
              <ProtectedRoute>
                <SubscriptionManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription/success"
            element={
              <ProtectedRoute>
                <SubscriptionSuccessPage />
              </ProtectedRoute>
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
          {/* School admin protected routes */}
          <Route
            path="/manage-teachers"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <ManageTeachersPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/school-students"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <SchoolStudentsPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/school-analytics"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <SchoolAnalyticsPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/fee-management"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <SchoolAdminFeeManagementPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/school-finance"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <SchoolAdminFinancePage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/manage-classes"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <ManageClassesPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/password-recovery"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <PasswordRecoveryPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/create-student"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <CreateStudentPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/class-students/:classId"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <ClassStudentsPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
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
            path="/parent/progress-reports"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <ProgressReportsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/parent/contact-teacher"
            element={
              <RoleProtectedRoute allowedRoles={['parent']}>
                <ContactTeacherPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/school-settings"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <SchoolSettingsPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/signatures"
            element={
              <RoleProtectedRoute allowedRoles={['teacher', 'school_admin']}>
                <SignatureManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/financial-reports"
            element={
              <SubscriptionProtectedRoute>
                <RoleProtectedRoute allowedRoles={['school_admin']}>
                  <FinancialReportsPage />
                </RoleProtectedRoute>
              </SubscriptionProtectedRoute>
            }
          />
          <Route
            path="/receipts"
            element={
              <RoleProtectedRoute allowedRoles={['finance']}>
                <ReceiptsManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance-configuration"
            element={
              <RoleProtectedRoute allowedRoles={['finance', 'school_admin']}>
                <FinanceRedirect />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/finance"
            element={
              <SubscriptionProtectedRoute>
                <ProtectedRoute>
                  <FinanceRedirect />
                </ProtectedRoute>
              </SubscriptionProtectedRoute>
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