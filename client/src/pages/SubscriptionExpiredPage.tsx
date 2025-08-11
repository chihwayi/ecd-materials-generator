import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionExpiredPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚨</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Subscription Expired
          </h1>
          <p className="text-gray-600">
            Your subscription has expired. Please renew to continue using the system.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/subscription/pricing"
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
          >
            Renew Subscription
          </Link>
          
          <Link
            to="/subscription/manage"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
          >
            Manage Subscription
          </Link>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Need help? Contact support
            </p>
            <a
              href="mailto:support@ecdmaterials.com"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              support@ecdmaterials.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredPage;