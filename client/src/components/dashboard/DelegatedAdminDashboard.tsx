import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface DelegatedStats {
  totalUsers: number;
  totalSchools: number;
  totalMaterials: number;
  totalAssignments: number;
  recentActivities: DelegatedActivity[];
  assignedSchools: SchoolInfo[];
}

interface DelegatedActivity {
  id: string;
  type: 'user_created' | 'school_updated' | 'material_created' | 'assignment_created';
  description: string;
  schoolName: string;
  timestamp: string;
}

interface SchoolInfo {
  id: string;
  name: string;
  userCount: number;
  materialCount: number;
  lastActivity: string;
}

interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

interface DelegatedAdminDashboardProps {
  user: SimpleUser;
}

const DelegatedAdminDashboard: React.FC<DelegatedAdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DelegatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/delegated-admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
      toast.error('Failed to load dashboard data');
      // Fallback to mock data
      setStats({
        totalUsers: 8,
        totalSchools: 2,
        totalMaterials: 25,
        totalAssignments: 15,
        recentActivities: [
          {
            id: '1',
            type: 'user_created',
            description: 'New teacher account created',
            schoolName: 'Springfield Elementary',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'material_created',
            description: 'New learning material uploaded',
            schoolName: 'Lincoln High School',
            timestamp: new Date(Date.now() - 180000).toISOString()
          }
        ],
        assignedSchools: [
          {
            id: '1',
            name: 'Springfield Elementary',
            userCount: 5,
            materialCount: 12,
            lastActivity: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Lincoln High School',
            userCount: 3,
            materialCount: 13,
            lastActivity: new Date(Date.now() - 360000).toISOString()
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return '👤';
      case 'school_updated': return '🏫';
      case 'material_created': return '📄';
      case 'assignment_created': return '📝';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage assigned users</p>
        </Link>

        <Link
          to="/admin/schools"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Schools</h3>
          <p className="text-sm text-gray-600">View and manage assigned schools</p>
        </Link>

        <Link
          to="/admin/system-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600">View system insights</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Schools</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalSchools || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Materials</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalMaterials || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalAssignments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.schoolName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    to="/admin/system-analytics"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all activity →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">📊</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">Activity will appear here as users interact with the system.</p>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Schools */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Assigned Schools</h2>
          </div>
          <div className="p-6">
            {stats?.assignedSchools && stats.assignedSchools.length > 0 ? (
              <div className="space-y-4">
                {stats.assignedSchools.map((school) => (
                  <div key={school.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{school.name}</h3>
                        <p className="text-sm text-gray-600">
                          {school.userCount} users • {school.materialCount} materials
                        </p>
                      </div>
                      <Link
                        to={`/admin/schools/${school.id}`}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        View
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last activity: {new Date(school.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    to="/admin/schools"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all schools →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">🏫</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No schools assigned</h3>
                <p className="mt-1 text-sm text-gray-500">Contact the system administrator to get schools assigned to you.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/admin/users"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
            >
              👥 Manage Users
            </Link>
            <Link
              to="/admin/schools"
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
            >
              🏫 Manage Schools
            </Link>
            <Link
              to="/admin/system-analytics"
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm text-center"
            >
              📊 View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegatedAdminDashboard; 