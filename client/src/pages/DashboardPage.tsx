import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import TeacherDashboard from '../components/dashboard/TeacherDashboard.tsx';
import SchoolAdminDashboard from '../components/dashboard/SchoolAdminDashboard';
import SystemAdminDashboard from '../components/dashboard/SystemAdminDashboard.tsx';
import DelegatedAdminDashboard from '../components/dashboard/DelegatedAdminDashboard.tsx';

import ParentDashboard from '../components/dashboard/ParentDashboard.tsx';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderDashboard = () => {
    switch (user.role) {
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
      case 'finance':
        return <Navigate to="/finance" replace />;
      default:
        return <TeacherDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardPage;