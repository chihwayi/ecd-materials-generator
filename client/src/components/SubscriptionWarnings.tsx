import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface Warning {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  daysLeft?: number;
  failureCount?: number;
  action: string;
}

const SubscriptionWarnings: React.FC = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    fetchWarnings();
    const interval = setInterval(fetchWarnings, 300000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchWarnings = async () => {
    try {
      const response = await api.get('/analytics/school/subscription-warnings');
      setWarnings(response.data.warnings || []);
    } catch (error) {
      console.error('Failed to fetch subscription warnings:', error);
    }
  };

  const dismissWarning = (type: string) => {
    setDismissed([...dismissed, type]);
    localStorage.setItem('dismissedWarnings', JSON.stringify([...dismissed, type]));
  };

  const activeWarnings = warnings.filter(w => !dismissed.includes(w.type));

  if (activeWarnings.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {activeWarnings.map((warning) => (
        <div
          key={warning.type}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${
            warning.severity === 'critical' ? 'bg-red-50 border-red-500' :
            warning.severity === 'high' ? 'bg-orange-50 border-orange-500' :
            warning.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
            'bg-blue-50 border-blue-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-lg mr-2">
                  {warning.severity === 'critical' ? '🚨' : 
                   warning.severity === 'high' ? '⚠️' : 
                   warning.severity === 'medium' ? '⏰' : 'ℹ️'}
                </span>
                <h4 className={`font-semibold text-sm ${
                  warning.severity === 'critical' ? 'text-red-800' :
                  warning.severity === 'high' ? 'text-orange-800' :
                  warning.severity === 'medium' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  Subscription Alert
                </h4>
              </div>
              <p className={`text-sm mt-1 ${
                warning.severity === 'critical' ? 'text-red-700' :
                warning.severity === 'high' ? 'text-orange-700' :
                warning.severity === 'medium' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                {warning.message}
              </p>
              <div className="mt-3 flex space-x-2">
                <Link
                  to="/subscription/pricing"
                  className={`text-xs font-medium px-3 py-1 rounded ${
                    warning.severity === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                    warning.severity === 'high' ? 'bg-orange-600 text-white hover:bg-orange-700' :
                    warning.severity === 'medium' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {warning.action}
                </Link>
                {warning.severity !== 'critical' && (
                  <button
                    onClick={() => dismissWarning(warning.type)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissWarning(warning.type)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionWarnings;