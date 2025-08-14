import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface SubscriptionData {
  id: string;
  schoolId: string;
  schoolName: string;
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  usage: {
    students: number;
    teachers: number;
    classes: number;
  };
}

interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  cancelledSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  planDistribution: Record<string, number>;
}

const SubscriptionMonitoringPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setError(null);
      const response = await api.get('/admin/subscriptions');
      setSubscriptions(response.data.subscriptions);
      setStats(response.data.stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setError('Unable to load subscription data. Please ensure the backend admin subscriptions API is available.');
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch = sub.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="px-6 py-8 sm:px-8 sm:py-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Subscription Monitoring</h1>
                  <p className="mt-2 text-blue-100">Monitor all school subscriptions and revenue across the platform.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={fetchSubscriptionData}
                    className="inline-flex items-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-white text-sm"
                  >
                    <span className="mr-2">🔄</span>
                    Refresh
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 rounded-md bg-white text-blue-700 hover:bg-blue-50 transition text-sm"
                  >
                    <span className="mr-2">⬇️</span>
                    Export CSV
                  </button>
                </div>
              </div>
              {lastUpdated && (
                <p className="mt-3 text-xs text-blue-100">Last updated {lastUpdated.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <div className="text-red-600 text-xl mr-3">⚠️</div>
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                <p className="mt-1 text-xs text-red-600">Tip: Start the backend API and add the route GET /api/v1/admin/subscriptions. The database tables appear to exist (Subscription, SubscriptionPayment).</p>
              </div>
              <button onClick={fetchSubscriptionData} className="ml-4 text-sm text-red-800 underline">Retry</button>
            </div>
          </div>
        )}

        {/* Enhanced Financial Stats Cards */}
        {stats && (
          <>
            {/* Primary Revenue Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-xs text-gray-500">{stats.totalPayments} transactions</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                    <p className="text-xs text-gray-500">MRR from active subs</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Annual Projection</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.annualProjectedRevenue)}</p>
                    <p className="text-xs text-gray-500">Based on current MRR</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                    <p className="text-xs text-gray-500">{stats.conversionRate}% conversion rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trial Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.trialSubscriptions}</p>
                    <p className="text-xs text-gray-500">Free trials active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expired Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.expiredSubscriptions || 0}</p>
                    <p className="text-xs text-gray-500">Need attention</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Revenue/School</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgRevenuePerSchool)}</p>
                    <p className="text-xs text-gray-500">ARPU</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recent Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.recentRevenue)}</p>
                    <p className="text-xs text-gray-500">Last 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'trial', label: 'Trial' },
                { id: 'past_due', label: 'Past Due' },
                { id: 'cancelled', label: 'Cancelled' },
                { id: 'expired', label: 'Expired' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setFilter(s.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${filter === s.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex-1 md:ml-4">
              <input
                type="text"
                placeholder="Search schools or plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Subscriptions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.schoolName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {subscription.schoolId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                        {subscription.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.amount > 0 ? formatCurrency(subscription.amount) : 'Free'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>S: {subscription.usage.students}</div>
                        <div>T: {subscription.usage.teachers}</div>
                        <div>C: {subscription.usage.classes}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getDaysUntilExpiry(subscription.currentPeriodEnd)} days left
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3">
                        View Details
                      </button>
                      <button className="inline-flex items-center text-green-600 hover:text-green-900">
                        Contact
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubscriptions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="mx-auto w-full sm:w-2/3">
                        <div className="text-5xl mb-3">🗂️</div>
                        <h4 className="text-lg font-semibold text-gray-900">No subscriptions to display</h4>
                        <p className="mt-1 text-sm text-gray-600">Try adjusting filters or check back later once subscriptions are active.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Plan Distribution and Revenue Breakdown */}
        {stats && stats.planDistribution && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
              <div className="space-y-4">
                {Object.entries(stats.planDistribution).map(([plan, count]) => {
                  const percentage = (count / stats.totalSubscriptions) * 100;
                  const planColors = {
                    'free': 'bg-gray-500',
                    'starter': 'bg-purple-500',
                    'basic': 'bg-blue-500',
                    'professional': 'bg-indigo-500',
                    'enterprise': 'bg-green-500'
                  };
                  return (
                    <div key={plan} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">{plan}</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">{count}</span>
                          <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${planColors[plan] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Total Revenue (All Time)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Monthly Recurring Revenue</span>
                  <span className="font-semibold text-green-600">{formatCurrency(stats.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Annual Projection</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(stats.annualProjectedRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Average Revenue Per User</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(stats.avgRevenuePerSchool)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-indigo-600">{stats.conversionRate}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Total Transactions</span>
                  <span className="font-semibold text-gray-900">{stats.totalPayments}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionMonitoringPage; 