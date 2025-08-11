import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { analyticsService } from '../../services/admin.service.ts';
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' :
              changeType === 'negative' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  const HealthIndicator: React.FC<{ status: string; label: string }> = ({ status, label }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
        status === 'healthy' || status === 'Connected' || status === 'Active' || status === 'Available' || status === 'Operational'
          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
          : status === 'warning'
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
          : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      }`}>
        {status === 'healthy' || status === 'Connected' || status === 'Active' || status === 'Available' || status === 'Operational' ? '✅ ' : status === 'warning' ? '⚠️ ' : '❌ '}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                📊 System Analytics Dashboard
              </h1>
              <p className="text-blue-100 text-lg">
                Real-time system performance and usage statistics
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm"
              >
                <option value="7d">📅 Last 7 days</option>
                <option value="30d">📅 Last 30 days</option>
                <option value="90d">📅 Last 90 days</option>
                <option value="1y">📅 Last year</option>
              </select>
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 backdrop-blur-sm"
              >
                {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
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
            icon="👥"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Schools"
            value={stats.activeSchools}
            change={`${stats.totalSchools} total`}
            changeType="neutral"
            icon="🏫"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Materials"
            value={stats.totalMaterials}
            icon="📚"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            changeType={stats.systemHealth >= 95 ? 'positive' : stats.systemHealth >= 80 ? 'neutral' : 'negative'}
            icon="💚"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              👥 User Distribution
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  🎭 By Role
                </h4>
                <div className="space-y-3">
                  {Object.entries(stats.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  💳 By Subscription
                </h4>
                <div className="space-y-3">
                  {Object.entries(stats.usersBySubscription).map(([plan, count]) => (
                    <div key={plan} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">{plan}</span>
                      <span className="text-lg font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Health */}
        {performance && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              💚 System Health
            </h3>
            <div className="space-y-4">
              <HealthIndicator status={performance.database.status} label="Database" />
              <HealthIndicator status="Active" label="Redis Cache" />
              <HealthIndicator status="Available" label="File Storage" />
              <HealthIndicator status="Operational" label="API Status" />
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                  📊 Performance Metrics
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      💾 Memory Usage
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {performance.memory.used}MB / {performance.memory.total}MB
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      ⚡ Avg Response Time
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {Math.round(performance.responseTime.avg)}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      ⏱️ Uptime
                    </span>
                    <span className="text-lg font-bold text-gray-900">
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            📈 User Growth Trend
          </h3>
          <div className="h-80 flex items-end justify-between space-x-3 p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl">
            {userGrowth.map((data, index) => {
              const maxCount = Math.max(...userGrowth.map(d => parseInt(d.count)));
              const height = maxCount > 0 ? (parseInt(data.count) / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div
                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg w-full min-h-[8px] transition-all duration-500 hover:from-blue-700 hover:to-blue-500 shadow-lg"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${data.date}: ${data.count} users`}
                  />
                  <span className="text-xs text-gray-600 mt-3 font-medium group-hover:text-blue-600 transition-colors">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* School Warnings */}
      {schoolAnalytics.length > 0 && schoolAnalytics.some(school => 
        school.warnings?.teachersNearLimit || school.warnings?.studentsNearLimit || school.warnings?.classesNearLimit
      ) && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-lg border border-red-200 p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
            ⚠️ Schools Approaching Limits
          </h3>
          <div className="space-y-3">
            {schoolAnalytics
              .filter(school => school.warnings?.teachersNearLimit || school.warnings?.studentsNearLimit || school.warnings?.classesNearLimit)
              .map(school => (
                <div key={school.id} className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{school.name}</h4>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {school.subscriptionPlan?.toUpperCase() || 'FREE'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {school.warnings?.teachersNearLimit && (
                      <p className="text-red-700">👨🏫 Teachers: {(school.teacherCount || 0) + (school.adminCount || 0)}/{school.limits?.maxTeachers} ({Math.round(school.utilization?.teachers || 0)}%)</p>
                    )}
                    {school.warnings?.studentsNearLimit && (
                      <p className="text-red-700">👥 Students: {school.studentCount || 0}/{school.limits?.maxStudents} ({Math.round(school.utilization?.students || 0)}%)</p>
                    )}
                    {school.warnings?.classesNearLimit && (
                      <p className="text-red-700">🏢 Classes: {school.classCount || 0}/{school.limits?.maxClasses} ({Math.round(school.utilization?.classes || 0)}%)</p>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* School Analytics */}
      {schoolAnalytics.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            🏫 School Performance Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🏫 School
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    👥 Users
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    📊 Utilization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    💳 Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    🔄 Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {schoolAnalytics.slice(0, 10).map((school) => {
                  const activeUsers = school.activeUsers || 0;
                  const totalUsers = school.totalUsers || 0;
                  const utilizationRate = school.utilizationRate || 0;
                  const isActive = school.isActive !== undefined ? school.isActive : false;
                  
                  return (
                    <tr key={school.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {school.name || 'Unknown School'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-16">Teachers:</span>
                            <span className="font-medium">{(school.teacherCount || 0) + (school.adminCount || 0)}</span>
                            <span className="text-gray-400">/{school.limits?.maxTeachers === -1 ? '∞' : school.limits?.maxTeachers || 5}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-16">Students:</span>
                            <span className="font-medium">{school.studentCount || 0}</span>
                            <span className="text-gray-400">/{school.limits?.maxStudents === -1 ? '∞' : school.limits?.maxStudents || 100}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full shadow-sm"
                                style={{ width: `${Math.min(school.utilization?.teachers || 0, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{Math.round(school.utilization?.teachers || 0)}%</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full shadow-sm"
                                style={{ width: `${Math.min(school.utilization?.students || 0, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{Math.round(school.utilization?.students || 0)}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                          school.subscriptionPlan === 'premium' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                          school.subscriptionPlan === 'basic' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                          'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                        }`}>
                          {school.subscriptionPlan?.toUpperCase() || 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                          isActive ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        }`}>
                          {isActive ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            🏫 School Performance Overview
          </h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">🏫</div>
            <p className="text-gray-600 text-lg font-medium">No school data available</p>
            <p className="text-gray-500 text-sm mt-2">School analytics will appear here once data is available</p>
          </div>
        </div>
      )}

            {/* Recent Activity */}
      {stats?.recentActivity && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            📝 Recent System Activity
          </h3>
          <div className="space-y-4">
            {stats.recentActivity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full shadow-sm ${
                  activity.type === 'user_created' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                  activity.type === 'school_created' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  activity.type === 'material_created' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                }`} />
                <span className="text-sm text-gray-700 flex-1 font-medium">{activity.description}</span>
                <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;