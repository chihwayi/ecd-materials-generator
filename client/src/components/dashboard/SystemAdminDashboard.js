import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { adminService } from '../../services/admin.service';

const SystemAdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for now - replace with real API calls later
      setStats({
        totalUsers: 5,
        activeSchools: 0,
        totalMaterials: 2,
        systemHealth: 100,
        recentActivity: [
          { id: 1, type: 'user_created', description: 'New delegated admin created', createdAt: new Date() },
          { id: 2, type: 'system', description: 'System health check completed', createdAt: new Date(Date.now() - 120000) }
        ]
      });
      setPerformance({
        database: { status: 'Connected' },
        memory: { used: 256, total: 1024 },
        uptime: 7200
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          to="/system-users"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">All Users</h3>
          <p className="text-sm text-gray-600">Manage all users</p>
        </Link>

        <Link
          to="/system-schools"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Schools</h3>
          <p className="text-sm text-gray-600">Manage schools</p>
        </Link>

        <Link
          to="/system-templates"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Templates</h3>
          <p className="text-sm text-gray-600">Manage templates</p>
        </Link>

        <Link
          to="/system-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">System Analytics</h3>
          <p className="text-sm text-gray-600">Platform insights</p>
        </Link>
      </div>

      {/* Additional Admin Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/system-settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
          <p className="text-sm text-gray-600">Configure system and maintenance</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔧</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={fetchDashboardData}
              className="w-full text-left text-sm text-blue-600 hover:text-blue-800"
            >
              Refresh System Data
            </button>
            <Link
              to="/system-analytics"
              className="block w-full text-left text-sm text-blue-600 hover:text-blue-800"
            >
              View Detailed Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.totalUsers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Schools</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.activeSchools || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Materials</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.totalMaterials || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className={`text-3xl font-bold ${
                loading ? 'text-gray-900' :
                (stats?.systemHealth || 0) >= 95 ? 'text-green-600' :
                (stats?.systemHealth || 0) >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {loading ? '...' : `${stats?.systemHealth || 0}%`}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {performance?.database?.status || 'Connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Redis Cache</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File Storage</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Operational</span>
              </div>
              {performance && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-xs text-gray-500">
                      {performance.memory.used}MB / {performance.memory.total}MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-xs text-gray-500">
                      {Math.floor(performance.uptime / 3600)}h {Math.floor((performance.uptime % 3600) / 60)}m
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user_created' ? 'bg-green-400' :
                    activity.type === 'school_created' ? 'bg-blue-400' :
                    activity.type === 'material_created' ? 'bg-purple-400' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600 flex-1">{activity.description}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              )) || (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">System started successfully</span>
                    <span className="text-xs text-gray-400">Just now</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Database synchronized</span>
                    <span className="text-xs text-gray-400">2 min ago</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tools */}
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">System Administrator</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>You have full system access. Use admin tools carefully and ensure regular backups are maintained.</p>
            </div>
            <div className="mt-4 flex space-x-3">
              <Link
                to="/system-analytics"
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
              >
                View Full Analytics
              </Link>
              <button
                onClick={fetchDashboardData}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;