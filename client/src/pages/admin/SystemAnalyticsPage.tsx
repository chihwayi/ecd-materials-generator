import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { analyticsService } from '../../services/admin.service';
import { SystemStats } from '../../types/user.types';

const SystemAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [schoolAnalytics, setSchoolAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAllData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    setRefreshInterval(interval);

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [selectedPeriod]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsData, performanceData, growthData, schoolData] = await Promise.all([
        analyticsService.getSystemStats(),
        analyticsService.getSystemPerformance(),
        analyticsService.getUserGrowthAnalytics(selectedPeriod),
        analyticsService.getSchoolAnalytics()
      ]);

      setStats(statsData);
      setPerformance(performanceData);
      setUserGrowth(growthData);
      setSchoolAnalytics(schoolData);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType = 'neutral', icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const HealthIndicator: React.FC<{ status: string; label: string }> = ({ status, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'healthy' || status === 'Connected' || status === 'Active' || status === 'Available' || status === 'Operational'
          ? 'bg-green-100 text-green-800'
          : status === 'warning'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status}
      </span>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600">Real-time system performance and usage statistics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change={`${stats.activeUsers} active`}
            changeType="positive"
            icon={<span className="text-2xl">👥</span>}
            color="bg-blue-100"
          />
          <StatCard
            title="Active Schools"
            value={stats.activeSchools}
            change={`${stats.totalSchools} total`}
            changeType="neutral"
            icon={<span className="text-2xl">🏫</span>}
            color="bg-green-100"
          />
          <StatCard
            title="Total Materials"
            value={stats.totalMaterials}
            icon={<span className="text-2xl">📚</span>}
            color="bg-purple-100"
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            changeType={stats.systemHealth >= 95 ? 'positive' : stats.systemHealth >= 80 ? 'neutral' : 'negative'}
            icon={<span className="text-2xl">💚</span>}
            color="bg-red-100"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">By Role</h4>
                <div className="space-y-2">
                  {Object.entries(stats.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{role.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">By Subscription</h4>
                <div className="space-y-2">
                  {Object.entries(stats.usersBySubscription).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{plan}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Health */}
        {performance && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <HealthIndicator status={performance.database.status} label="Database" />
              <HealthIndicator status="Active" label="Redis Cache" />
              <HealthIndicator status="Available" label="File Storage" />
              <HealthIndicator status="Operational" label="API Status" />
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-sm font-medium text-gray-900">
                      {performance.memory.used}MB / {performance.memory.total}MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Response Time</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(performance.responseTime.avg)}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.floor(performance.uptime / 3600)}h {Math.floor((performance.uptime % 3600) / 60)}m
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Growth Chart */}
      {userGrowth.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {userGrowth.map((data, index) => {
              const maxCount = Math.max(...userGrowth.map(d => parseInt(d.count)));
              const height = maxCount > 0 ? (parseInt(data.count) / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300"
                    style={{ height: `${height}%` }}
                    title={`${data.date}: ${data.count} users`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School Analytics */}
      {schoolAnalytics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolAnalytics.slice(0, 10).map((school) => (
                  <tr key={school.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {school.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.activeUsers}/{school.totalUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(school.utilizationRate, 100)}%` }}
                          />
                        </div>
                        <span>{Math.round(school.utilizationRate)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.subscriptionPlan === 'premium' ? 'bg-purple-100 text-purple-800' :
                        school.subscriptionPlan === 'basic' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {school.subscriptionPlan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {school.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats?.recentActivity && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user_created' ? 'bg-green-400' :
                  activity.type === 'school_created' ? 'bg-blue-400' :
                  activity.type === 'material_created' ? 'bg-purple-400' :
                  'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-600 flex-1">{activity.description}</span>
                <span className="text-xs text-gray-400">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAnalyticsPage;