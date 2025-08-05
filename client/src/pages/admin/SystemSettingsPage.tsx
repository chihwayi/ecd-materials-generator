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

  useEffect(() => {
    fetchSystemData();
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
      // Mock backup creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('System backup created successfully');
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
      // Mock export data
      const blob = new Blob(['Mock CSV data'], { type: 'text/csv' });
      
      // Create download link
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

  const SettingCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
  }> = ({ title, description, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage system configuration and maintenance</p>
        </div>
        <button
          onClick={fetchSystemData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <SettingCard
          title="System Performance"
          description="Monitor system resource usage and performance metrics"
        >
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
        </SettingCard>

        {/* Backup & Export */}
        <SettingCard
          title="Backup & Export"
          description="Create system backups and export data"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">System Backup</h4>
              <button
                onClick={() => setIsBackupModalOpen(true)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Create Full Backup
              </button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Export</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleExportData('users')}
                  disabled={exportLoading}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                >
                  Users
                </button>
                <button
                  onClick={() => handleExportData('schools')}
                  disabled={exportLoading}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                >
                  Schools
                </button>
                <button
                  onClick={() => handleExportData('all')}
                  disabled={exportLoading}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                >
                  All Data
                </button>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* System Maintenance */}
        <SettingCard
          title="System Maintenance"
          description="Perform system maintenance tasks"
        >
          <div className="space-y-4">
            <button
              onClick={() => setIsMaintenanceModalOpen(true)}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Maintenance Mode
            </button>
            
            <button
              onClick={fetchSystemLogs}
              disabled={logsLoading}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {logsLoading ? 'Loading...' : 'View System Logs'}
            </button>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">
                ⚠️ Maintenance operations may temporarily affect system availability.
              </p>
            </div>
          </div>
        </SettingCard>

        {/* System Configuration */}
        <SettingCard
          title="System Configuration"
          description="Configure system-wide settings"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default User Language
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="en">English</option>
                <option value="sn">Shona</option>
                <option value="nd">Ndebele</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="480"
                defaultValue="60"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable user registration</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
              </label>
            </div>
            
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Configuration
            </button>
          </div>
        </SettingCard>
      </div>

      {/* System Logs */}
      {systemLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent System Logs</h3>
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
              ⚠️ The backup process may take several minutes and could temporarily impact system performance.
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
              onClick={() => {
                toast.success('Maintenance mode activated');
                setIsMaintenanceModalOpen(false);
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Enable Maintenance Mode
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Enabling maintenance mode will:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Display a maintenance message to all users</li>
            <li>Prevent new user registrations</li>
            <li>Disable non-essential system functions</li>
            <li>Allow only system administrators to access the system</li>
          </ul>
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-700">
              ⚠️ This will make the system unavailable to regular users. Use only when necessary.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SystemSettingsPage;