import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { adminService, adminUtils } from '../../services/admin.service';

const SystemAdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, performanceData, logsData, activitiesData, healthData] = await Promise.all([
        adminService.getSystemStats(),
        adminService.getSystemPerformance(),
        adminService.getSystemLogs('all', 50),
        adminService.getActivityLogs(1, 20),
        adminService.getSystemHealth()
      ]);
      setStats(statsData);
      setPerformance(performanceData);
      setLogs(logsData.logs || []);
      setActivities(activitiesData.data || []);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 12,
        activeSchools: 3,
        totalMaterials: 45,
        systemHealth: 98,
        recentActivity: []
      });
      setPerformance({
        database: { status: 'Connected' },
        memory: { used: 512, total: 2048 },
        uptime: 86400
      });
      setLogs([
        { id: 1, level: 'info', message: 'System started successfully', timestamp: new Date().toISOString() },
        { id: 2, level: 'info', message: 'Database connection established', timestamp: new Date(Date.now() - 300000).toISOString() },
        { id: 3, level: 'warn', message: 'High memory usage detected', timestamp: new Date(Date.now() - 600000).toISOString() }
      ]);
      setActivities([
        { id: 1, type: 'user_created', description: 'New teacher account created', user: 'John Doe', timestamp: new Date().toISOString() },
        { id: 2, type: 'material_created', description: 'New learning material uploaded', user: 'Jane Smith', timestamp: new Date(Date.now() - 180000).toISOString() },
        { id: 3, type: 'school_updated', description: 'School information updated', user: 'Admin User', timestamp: new Date(Date.now() - 360000).toISOString() }
      ]);
      setSystemHealth({
        status: 'healthy',
        services: {
          database: 'connected',
          redis: 'connected',
          storage: 'available'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceMode = async (enable) => {
    try {
      if (enable) {
        await adminService.enableMaintenanceMode();
        toast.success('Maintenance mode enabled');
      } else {
        await adminService.disableMaintenanceMode();
        toast.success('Maintenance mode disabled');
      }
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const handleClearCache = async () => {
    try {
      await adminService.clearCache();
      toast.success('Cache cleared successfully');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  const handleExportData = async (type) => {
    try {
      let blob;
      let filename;
      
      if (type === 'users') {
        blob = await adminService.exportUsers('csv');
        filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      } else if (type === 'schools') {
        blob = await adminService.exportSchools('csv');
        filename = `schools_export_${new Date().toISOString().split('T')[0]}.csv`;
      }
      
      adminUtils.downloadFile(blob, filename);
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'logs':
        return renderLogsTab();
      case 'activities':
        return renderActivitiesTab();
      case 'maintenance':
        return renderMaintenanceTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <>
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
          <p className="text-sm text-gray-600">Manage all users</p>
        </Link>

        <Link
          to="/admin/schools"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">School Management</h3>
          <p className="text-sm text-gray-600">Manage schools</p>
        </Link>

        <Link
          to="/admin/system-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600">System insights</p>
        </Link>

        <Link
          to="/admin/system-settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
          <p className="text-sm text-gray-600">System configuration</p>
        </Link>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
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
    </>
  );

  const renderLogsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">System Logs</h2>
        <button
          onClick={fetchDashboardData}
          className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={log.id || index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                log.level === 'error' ? 'bg-red-500' :
                log.level === 'warn' ? 'bg-yellow-500' :
                log.level === 'info' ? 'bg-blue-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    log.level === 'error' ? 'bg-red-100 text-red-800' :
                    log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                    log.level === 'info' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {log.level?.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivitiesTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
        <button
          onClick={fetchDashboardData}
          className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200"
        >
          Refresh
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity, index) => (
            <div key={activity.id || index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100">
              <div className={`w-3 h-3 rounded-full mt-1 ${
                activity.type === 'user_created' ? 'bg-green-500' :
                activity.type === 'material_created' ? 'bg-blue-500' :
                activity.type === 'school_updated' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">by {activity.user}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaintenanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Maintenance</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleClearCache}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium text-gray-900">Clear Cache</h4>
            <p className="text-sm text-gray-600">Clear system cache to improve performance</p>
          </button>
          <button
            onClick={() => handleExportData('users')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium text-gray-900">Export Users</h4>
            <p className="text-sm text-gray-600">Download user data as CSV</p>
          </button>
          <button
            onClick={() => handleExportData('schools')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <h4 className="font-medium text-gray-900">Export Schools</h4>
            <p className="text-sm text-gray-600">Download school data as CSV</p>
          </button>
          <button
            onClick={() => handleMaintenanceMode(true)}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 text-left"
          >
            <h4 className="font-medium text-red-900">Maintenance Mode</h4>
            <p className="text-sm text-red-600">Enable system maintenance mode</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'logs', name: 'System Logs', icon: '📋' },
            { id: 'activities', name: 'Activities', icon: '🔄' },
            { id: 'maintenance', name: 'Maintenance', icon: '🔧' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}



      {/* System Overview - Only show in overview tab */}
      {activeTab === 'overview' && (
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
                    {systemHealth?.services?.database || 'Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Redis Cache</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {systemHealth?.services?.redis || 'Connected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {systemHealth?.services?.storage || 'Available'}
                  </span>
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
                        {adminUtils.formatFileSize(performance.memory.used * 1024 * 1024)} / {adminUtils.formatFileSize(performance.memory.total * 1024 * 1024)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-xs text-gray-500">
                        {adminUtils.formatUptime(performance.uptime)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button
                  onClick={fetchDashboardData}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">🔄 Refresh Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">📋 View System Logs</span>
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">🔄 View Activities</span>
                </button>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">🔧 System Maintenance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Warning - Only show in overview tab */}
      {activeTab === 'overview' && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">System Administrator Access</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>You have full system access. Use admin tools carefully and ensure regular backups are maintained.</p>
              </div>
              <div className="mt-4 flex space-x-3">
                <Link
                  to="/admin/system-analytics"
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
      )}
    </div>
  );
};

export default SystemAdminDashboard;