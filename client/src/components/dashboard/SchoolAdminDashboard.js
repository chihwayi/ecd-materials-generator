import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolAdminService } from '../../services/school-admin.service';

const SchoolAdminDashboard = ({ user }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await schoolAdminService.getSchoolAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/manage-teachers"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Teachers</h3>
          <p className="text-sm text-gray-600">Add and manage teachers</p>
        </Link>

        <Link
          to="/school-students"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">All Students</h3>
          <p className="text-sm text-gray-600">View all students</p>
        </Link>

        <Link
          to="/school-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">School Analytics</h3>
          <p className="text-sm text-gray-600">Performance reports</p>
        </Link>
      </div>

      {/* Additional Management Tools */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/manage-classes"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Classes</h3>
          <p className="text-sm text-gray-600">Create and assign classes</p>
        </Link>

        <Link
          to="/password-recovery"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Password Recovery</h3>
          <p className="text-sm text-gray-600">Reset user passwords</p>
        </Link>

        <Link
          to="/create-student"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👶</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Student</h3>
          <p className="text-sm text-gray-600">Add new students to classes</p>
        </Link>
      </div>

      {/* School Settings */}
      <div className="grid md:grid-cols-1 gap-6">
        <Link
          to="/school-settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">School Settings</h3>
              <p className="text-sm text-gray-600">Configure default parent password and school information</p>
            </div>
          </div>
        </Link>
      </div>

      {/* School Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalTeachers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalClasses || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">School Performance</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.schoolPerformance || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* School Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Teacher Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">👨‍🏫</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teacher activity</h3>
              <p className="mt-1 text-sm text-gray-500">Teachers will appear here once they start using the platform.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;