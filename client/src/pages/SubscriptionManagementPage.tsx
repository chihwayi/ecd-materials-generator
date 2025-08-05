import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService, { SubscriptionSummary } from '../services/subscription.service.ts';
import { toast } from 'react-hot-toast';

const SubscriptionManagementPage: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const data = await subscriptionService.getCurrentSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setProcessing('billing');
      const { url } = await subscriptionService.getBillingPortalUrl();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting billing portal URL:', error);
      toast.error('Failed to open billing portal');
    } finally {
      setProcessing(null);
    }
  };

  const handleCancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
    try {
      setProcessing('cancel');
      const result = await subscriptionService.cancelSubscription(cancelAtPeriodEnd);
      toast.success(result.message);
      fetchSubscription(); // Refresh data
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setProcessing(null);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setProcessing('reactivate');
      const result = await subscriptionService.reactivateSubscription();
      toast.success(result.message);
      fetchSubscription(); // Refresh data
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setProcessing(null);
    }
  };

  const getUsagePercentage = (current: number, limit: any): number => {
    if (limit === 'unlimited' || limit === -1) return 0;
    return Math.min(Math.round((current / limit) * 100), 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'expired': return 'text-red-600';
      case 'past_due': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Active Subscription</h1>
            <p className="text-gray-600 mb-8">You don't have an active subscription. Choose a plan to get started.</p>
            <button
              onClick={() => navigate('/subscription/pricing')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage your subscription, view usage, and update billing information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Plan</h2>
                  <p className="text-gray-600">
                    {subscription.subscription?.planName || 'Free'} Plan
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(subscription.subscription?.status || 'active')}`}>
                  {subscription.subscription?.status || 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Next Billing Date</p>
                  <p className="font-medium">
                    {subscription.subscription?.currentPeriodEnd 
                      ? new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Days Until Renewal</p>
                  <p className="font-medium">
                    {subscription.daysUntilExpiry !== null ? subscription.daysUntilExpiry : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trial Status</p>
                  <p className="font-medium">
                    {subscription.subscription?.trialEnd 
                      ? new Date(subscription.subscription.trialEnd) > new Date() ? 'Active' : 'Expired'
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleManageBilling}
                  disabled={processing === 'billing'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing === 'billing' ? 'Opening...' : 'Manage Billing'}
                </button>
                
                {subscription.subscription?.cancelAtPeriodEnd ? (
                  <button
                    onClick={handleReactivateSubscription}
                    disabled={processing === 'reactivate'}
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {processing === 'reactivate' ? 'Processing...' : 'Reactivate'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleCancelSubscription(true)}
                    disabled={processing === 'cancel'}
                    className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {processing === 'cancel' ? 'Processing...' : 'Cancel Subscription'}
                  </button>
                )}
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(subscription.usage).map(([metric, current]) => {
                  const limit = subscription.limits[metric]?.limit;
                  const percentage = getUsagePercentage(current, limit);
                  const color = getUsageColor(percentage);
                  
                  return (
                    <div key={metric} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {metric}
                        </span>
                        <span className={`text-sm font-medium ${color}`}>
                          {current} / {limit === 'unlimited' || limit === -1 ? '∞' : limit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 90 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      {percentage > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {percentage}% used
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/subscription/pricing')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Change Plan
                </button>
                <button
                  onClick={handleManageBilling}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Billing Portal
                </button>
                <button
                  onClick={() => navigate('/subscription/payments')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Payment History
                </button>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${getStatusColor(subscription.subscription?.status || 'active')}`}>
                    {subscription.subscription?.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="text-sm font-medium">
                    {subscription.subscription?.planName || 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="text-sm font-medium">
                    {subscription.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                {subscription.subscription?.cancelAtPeriodEnd && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cancelling</span>
                    <span className="text-sm font-medium text-yellow-600">Yes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your subscription? Our support team is here to help.
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage; 