import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../../components/admin/Modal.tsx';
import { adminService, analyticsService } from '../../services/admin.service.ts';

const SystemSettingsPage: React.FC = () => {
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settings, setSettings] = useState({
    defaultLanguage: 'en',
    sessionTimeout: 60,
    enableRegistration: true,
    enableNotifications: true
  });

  useEffect(() => {
    fetchSystemData();
    fetchMaintenanceStatus();
    fetchSettings();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      const performanceData = await analyticsService.getSystemPerformance();
      setPerformance(performanceData);
    } catch (error) {
      toast.error('Failed to fetch system data');
      console.error('System data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      setLogsLoading(true);
      const logs = { data: [] }; // Mock data since systemService not available
      setSystemLogs(logs.data || []);
    } catch (error) {
      toast.error('Failed to fetch system logs');
      console.error('System logs fetch error:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setBackupLoading(true);
      
      // Fetch complete database backup from backend
      const response = await fetch('http://localhost:5000/api/v1/admin/backup/complete', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create backup');
      }
      
      const backupData = await response.json();
      
      // Add system settings to backup
      backupData.systemSettings = settings;
      
      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('System backup created and downloaded successfully');
      setIsBackupModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create backup');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleExportData = async (type: 'users' | 'schools' | 'all') => {
    try {
      setExportLoading(true);
      
      let csvData = '';
      
      if (type === 'users' || type === 'all') {
        const users = await adminService.getAllUsers(1, 1000, {});
        const usersCsv = [
          'ID,First Name,Last Name,Email,Role,School,Status,Created At',
          ...users.data.map(user => 
            `${user.id},${user.firstName},${user.lastName},${user.email},${user.role},${user.School?.name || 'N/A'},${user.isActive ? 'Active' : 'Inactive'},${user.createdAt}`
          )
        ].join('\n');
        csvData += usersCsv;
      }
      
      if (type === 'schools' || type === 'all') {
        const schools = await adminService.getAllSchools(1, 1000);
        if (csvData) csvData += '\n\n';
        const schoolsCsv = [
          'ID,Name,Contact Email,Subscription Plan,Status,Created At',
          ...schools.data.map(school => 
            `${school.id},${school.name},${school.contactEmail || 'N/A'},${school.subscriptionPlan},${school.subscriptionStatus},${school.createdAt}`
          )
        ].join('\n');
        csvData += schoolsCsv;
      }
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system_${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type} data exported successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/maintenance/status', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setMaintenanceMode(data.maintenanceMode);
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/settings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSettings({
        defaultLanguage: data.defaultLanguage,
        sessionTimeout: data.sessionTimeout,
        enableRegistration: data.enableRegistration,
        enableNotifications: data.enableNotifications
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const endpoint = maintenanceMode ? 'disable' : 'enable';
      const response = await fetch(`http://localhost:5000/api/v1/admin/maintenance/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data.maintenanceMode);
        toast.success(data.message);
        setIsMaintenanceModalOpen(false);
      } else {
        throw new Error('Failed to toggle maintenance mode');
      }
    } catch (error) {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/admin/cache/clear', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        toast.success('System cache cleared successfully');
      } else {
        throw new Error('Failed to clear cache');
      }
    } catch (error) {
      toast.error('Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard: React.FC<{
    label: string;
    value: string | number;
    status?: 'good' | 'warning' | 'error';
  }> = ({ label, value, status = 'good' }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${
          status === 'good' ? 'text-green-600' :
          status === 'warning' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">⚙️ System Settings</h1>
              <p className="text-slate-100 text-lg">Configure system-wide settings and perform maintenance tasks</p>
              <p className="text-slate-200 text-sm mt-2">
                Maintenance Mode: {maintenanceMode ? '🔴 Enabled' : '🟢 Disabled'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSystemData}
                disabled={loading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 backdrop-blur-sm"
              >
                {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
              <div className="text-6xl opacity-20">⚙️</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Performance */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                📊 System Performance
              </h3>
              <p className="text-sm text-gray-600">Monitor system resource usage and performance metrics</p>
            </div>
            {performance ? (
              <div className="space-y-3">
                <MetricCard
                  label="Memory Usage"
                  value={`${performance.memory.used}MB / ${performance.memory.total}MB`}
                  status={performance.memory.used / performance.memory.total > 0.8 ? 'warning' : 'good'}
                />
                <MetricCard
                  label="Database Connections"
                  value={performance.database.activeConnections}
                  status={performance.database.activeConnections > 50 ? 'warning' : 'good'}
                />
                <MetricCard
                  label="Average Response Time"
                  value={`${Math.round(performance.responseTime.avg)}ms`}
                  status={performance.responseTime.avg > 500 ? 'error' : performance.responseTime.avg > 200 ? 'warning' : 'good'}
                />
                <MetricCard
                  label="System Uptime"
                  value={`${Math.floor(performance.uptime / 3600)}h ${Math.floor((performance.uptime % 3600) / 60)}m`}
                />
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading performance data...</p>
              </div>
            )}
          </div>

          {/* Backup & Export */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                💾 Backup & Export
              </h3>
              <p className="text-sm text-gray-600">Create system backups and export data</p>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">📦 System Backup</h4>
                <button
                  onClick={() => setIsBackupModalOpen(true)}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold transition-all duration-200"
                >
                  💾 Create Full Backup
                </button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Data Export</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleExportData('users')}
                    disabled={exportLoading}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm font-semibold transition-all duration-200"
                  >
                    👥 Users
                  </button>
                  <button
                    onClick={() => handleExportData('schools')}
                    disabled={exportLoading}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm font-semibold transition-all duration-200"
                  >
                    🏫 Schools
                  </button>
                  <button
                    onClick={() => handleExportData('all')}
                    disabled={exportLoading}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm font-semibold transition-all duration-200"
                  >
                    📋 All Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* System Maintenance */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                🔧 System Maintenance
              </h3>
              <p className="text-sm text-gray-600">Perform system maintenance tasks</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setIsMaintenanceModalOpen(true)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  maintenanceMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {maintenanceMode ? '🔴 Disable Maintenance Mode' : '🟡 Enable Maintenance Mode'}
              </button>
              
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 font-semibold transition-all duration-200"
              >
                {loading ? '🔄 Clearing...' : '🗑️ Clear System Cache'}
              </button>
              
              <button
                onClick={fetchSystemLogs}
                disabled={logsLoading}
                className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 font-semibold transition-all duration-200"
              >
                {logsLoading ? '📄 Loading...' : '📄 View System Logs'}
              </button>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700 flex items-center">
                  ⚠️ Maintenance operations may temporarily affect system availability.
                </p>
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                🔧 System Configuration
              </h3>
              <p className="text-sm text-gray-600">Configure system-wide settings</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌐 Default User Language
                </label>
                <select 
                  value={settings.defaultLanguage}
                  onChange={(e) => setSettings({...settings, defaultLanguage: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="sn">Shona</option>
                  <option value="nd">Ndebele</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enableRegistration}
                    onChange={(e) => setSettings({...settings, enableRegistration: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">👤 Enable user registration</span>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) => setSettings({...settings, enableNotifications: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">📧 Enable email notifications</span>
                </label>
              </div>
              
              <button 
                onClick={handleSaveSettings}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold transition-all duration-200"
              >
                {loading ? '💾 Saving...' : '💾 Save Configuration'}
              </button>
            </div>
          </div>
        </div>

        {/* System Logs */}
        {systemLogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">📄 Recent System Logs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm">
                    <span className={`inline-block w-2 h-2 rounded-full mt-2 ${
                      log.level === 'error' ? 'bg-red-500' :
                      log.level === 'warn' ? 'bg-yellow-500' :
                      log.level === 'info' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{log.message}</span>
                        <span className="text-gray-500 text-xs">{log.timestamp}</span>
                      </div>
                      {log.meta && (
                        <pre className="text-gray-600 text-xs mt-1 whitespace-pre-wrap">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Backup Confirmation Modal */}
        <Modal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          title="Create System Backup"
          footer={
            <div className="flex space-x-3">
              <button
                onClick={() => setIsBackupModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {backupLoading ? 'Creating...' : 'Create Backup'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This will create a complete backup of the system including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>All user data and accounts</li>
              <li>School information and settings</li>
              <li>Learning materials and templates</li>
              <li>System configuration</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ The backup will be downloaded to your local machine as a JSON file.
              </p>
            </div>
          </div>
        </Modal>

        {/* Maintenance Mode Modal */}
        <Modal
          isOpen={isMaintenanceModalOpen}
          onClose={() => setIsMaintenanceModalOpen(false)}
          title="Maintenance Mode"
          footer={
            <div className="flex space-x-3">
              <button
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleMaintenance}
                className={`px-4 py-2 text-white rounded-md font-semibold ${
                  maintenanceMode 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              {maintenanceMode ? 'Disabling' : 'Enabling'} maintenance mode will:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>{maintenanceMode ? 'Remove' : 'Display'} a maintenance message to all users</li>
              <li>{maintenanceMode ? 'Enable' : 'Prevent'} new user registrations</li>
              <li>{maintenanceMode ? 'Enable' : 'Disable'} non-essential system functions</li>
              <li>Allow only system administrators to access the system</li>
            </ul>
            <div className={`border rounded-md p-3 ${
              maintenanceMode ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                maintenanceMode ? 'text-green-700' : 'text-red-700'
              }`}>
                {maintenanceMode 
                  ? '✅ This will restore normal system operation.' 
                  : '⚠️ This will make the system unavailable to regular users. Use only when necessary.'
                }
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SystemSettingsPage;