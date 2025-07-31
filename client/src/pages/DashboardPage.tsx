import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import SchoolAdminDashboard from '../components/dashboard/SchoolAdminDashboard';
import ParentDashboard from '../components/dashboard/ParentDashboard';
import SystemAdminDashboard from '../components/dashboard/SystemAdminDashboard';
import DelegatedAdminDashboard from '../components/dashboard/DelegatedAdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      teacher: 'Teacher',
      school_admin: 'School Administrator',
      parent: 'Parent',
      system_admin: 'System Administrator',
      delegated_admin: 'Delegated Administrator'
    };
    return roleNames[role] || 'User';
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'teacher':
        return <TeacherDashboard user={user} />;
      case 'school_admin':
        return <SchoolAdminDashboard user={user} />;
      case 'parent':
        return <ParentDashboard user={user} />;
      case 'system_admin':
        return <SystemAdminDashboard user={user} />;
      case 'delegated_admin':
        return <DelegatedAdminDashboard user={user} />;
      default:
        return <TeacherDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {getRoleDisplayName(user?.role || '')} Dashboard - Here's your overview today.
          </p>
        </div>

        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;