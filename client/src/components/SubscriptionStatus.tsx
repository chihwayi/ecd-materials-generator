import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import subscriptionService from '../services/subscription.service.ts';
import { adminService } from '../services/admin.service.ts';

interface SubscriptionStatusProps {
  schoolId?: string;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ schoolId }) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, [schoolId]);

  const fetchSubscriptionData = async () => {
    try {
      const [subscriptionData, usageData] = await Promise.all([
        subscriptionService.getCurrentSubscription(),
        adminService.getSchoolUsage(schoolId || '')
      ]);
      
      setSubscription(subscriptionData?.subscription);
      setUsage(usageData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRemainingDays = () => {
    if (!subscription?.currentPeriodEnd) return null;
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const remainingDays = getRemainingDays();
  const planName = subscription?.planName || 'Free Trial';
  const status = subscription?.status || 'active';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          📊 Subscription Status
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Plan Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">
              {planName.toLowerCase().includes('free') ? '🆓' : 
               planName.toLowerCase().includes('basic') ? '🚀' : 
               planName.toLowerCase().includes('premium') ? '⭐' : '👑'}
            </span>
            <div>
              <p className="text-sm text-blue-600 font-medium">Current Plan</p>
              <p className="text-lg font-bold text-blue-900">{planName}</p>
            </div>
          </div>
        </div>

        {remainingDays !== null && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">⏰</span>
              <div>
                <p className="text-sm text-green-600 font-medium">Days Remaining</p>
                <p className="text-lg font-bold text-green-900">
                  {remainingDays} {remainingDays === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">📅</span>
            <div>
              <p className="text-sm text-purple-600 font-medium">Next Billing</p>
              <p className="text-lg font-bold text-purple-900">
                {subscription?.currentPeriodEnd 
                  ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      {usage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 mb-3">📈 Usage Overview</h4>
          
          {/* Students */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">👥 Students</span>
              <span className="text-sm text-gray-600">
                {usage.students || 0} / {usage.limits?.maxStudents === -1 ? '∞' : usage.limits?.maxStudents || 'N/A'}
              </span>
            </div>
            {usage.limits?.maxStudents !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usage.students || 0, usage.limits?.maxStudents || 1))}`}
                  style={{ width: `${getUsagePercentage(usage.students || 0, usage.limits?.maxStudents || 1)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Teachers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">👨🏫 Teachers</span>
              <span className="text-sm text-gray-600">
                {usage.teachers || 0} / {usage.limits?.maxTeachers === -1 ? '∞' : usage.limits?.maxTeachers || 'N/A'}
              </span>
            </div>
            {usage.limits?.maxTeachers !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usage.teachers || 0, usage.limits?.maxTeachers || 1))}`}
                  style={{ width: `${getUsagePercentage(usage.teachers || 0, usage.limits?.maxTeachers || 1)}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Classes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">📚 Classes</span>
              <span className="text-sm text-gray-600">
                {usage.classes || 0} / {usage.limits?.maxClasses === -1 ? '∞' : usage.limits?.maxClasses || 'N/A'}
              </span>
            </div>
            {usage.limits?.maxClasses !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(getUsagePercentage(usage.classes || 0, usage.limits?.maxClasses || 1))}`}
                  style={{ width: `${getUsagePercentage(usage.classes || 0, usage.limits?.maxClasses || 1)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => window.open('/subscription/pricing', '_blank')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          🚀 Upgrade Plan
        </button>
        <button
          onClick={async () => {
            try {
              const { url } = await subscriptionService.getBillingPortalUrl();
              window.open(url, '_blank');
            } catch (error) {
              toast.error('Failed to open billing portal');
            }
          }}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          ⚙️ Manage Billing
        </button>
      </div>

      {/* Warnings */}
      {remainingDays !== null && remainingDays <= 7 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-sm text-yellow-800">
              Your subscription expires in {remainingDays} {remainingDays === 1 ? 'day' : 'days'}. 
              Renew now to avoid service interruption.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;