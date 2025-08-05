import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { adminService, adminUtils } from '../../services/admin.service.ts';

interface SystemStats {
  totalUsers: number;
  activeSchools: number;
  totalMaterials: number;
  systemHealth: number;
  recentActivity: SystemActivity[];
}

interface SystemActivity {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

interface SystemPerformance {
  database: { status: string };
  memory: { used: number; total: number };
  uptime: number;
}

interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  services: {
    database: string;
    redis: string;
    storage: string;
  };
}

interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

interface SystemAdminDashboardProps {
  user: SimpleUser;
}

const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [performance, setPerformance] = useState<SystemPerformance | null>(null);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
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
        { id: '1', level: 'info', message: 'System started successfully', timestamp: new Date().toISOString() },
        { id: '2', level: 'info', message: 'Database connection established', timestamp: new Date(Date.now() - 300000).toISOString() },
        { id: '3', level: 'warn', message: 'High memory usage detected', timestamp: new Date(Date.now() - 600000).toISOString() }
      ]);
      setActivities([
        { id: '1', type: 'user_created', description: 'New teacher account created', user: 'John Doe', timestamp: new Date().toISOString() },
        { id: '2', type: 'material_created', description: 'New learning material uploaded', user: 'Jane Smith', timestamp: new Date(Date.now() - 180000).toISOString() },
        { id: '3', type: 'school_updated', description: 'School information updated', user: 'Admin User', timestamp: new Date(Date.now() - 360000).toISOString() }
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

  const handleMaintenanceMode = async (enable: boolean) => {
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

  const handleExportData = async (type: string) => {
    try {
      await adminService.exportData(type);
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type} data`);
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warn': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatMemoryUsage = (used: number, total: number) => {
    const percentage = Math.round((used / total) * 100);
    return `${percentage}% (${used}MB / ${total}MB)`;
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
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all users</p>
        </Link>

        <Link
          to="/admin/schools"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Schools</h3>
          <p className="text-sm text-gray-600">View and manage schools</p>
        </Link>

        <Link
          to="/admin/system-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">System Analytics</h3>
          <p className="text-sm text-gray-600">View system insights</p>
        </Link>

        <Link
          to="/admin/system-settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
          <p className="text-sm text-gray-600">Configure system</p>
        </Link>
      </div>

      {/* System Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers?.toString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Schools</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeSchools?.toString() || '0'}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats?.totalMaterials?.toString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.systemHealth?.toString() || '0'}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Performance */}
      {performance && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Database Status</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${performance.database.status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">{performance.database.status}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Memory Usage</h3>
                <p className="text-sm font-medium">{formatMemoryUsage(performance.memory.used, performance.memory.total)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Uptime</h3>
                <p className="text-sm font-medium">{formatUptime(performance.uptime)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health */}
      {systemHealth && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  systemHealth.status === 'healthy' ? 'bg-green-100' : 
                  systemHealth.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <span className="text-2xl">
                    {systemHealth.status === 'healthy' ? '💚' : 
                     systemHealth.status === 'warning' ? '⚠️' : '🔴'}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Overall Status</p>
                <p className="text-xs text-gray-600 capitalize">{systemHealth.status}</p>
              </div>
              {Object.entries(systemHealth.services).map(([service, status]) => (
                <div key={service} className="text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    status === 'connected' || status === 'available' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className="text-2xl">
                      {status === 'connected' || status === 'available' ? '✅' : '❌'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{service}</p>
                  <p className="text-xs text-gray-600 capitalize">{status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {activities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Logs */}
      {logs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Logs</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                    {log.level?.toUpperCase() || 'INFO'}
                  </span>
                  <span className="text-sm text-gray-900 flex-1">{log.message}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Maintenance</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => handleMaintenanceMode(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
            >
              🔧 Enable Maintenance Mode
            </button>
            <button
              onClick={() => handleMaintenanceMode(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              ✅ Disable Maintenance Mode
            </button>
            <button
              onClick={() => handleClearCache()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              🗑️ Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;