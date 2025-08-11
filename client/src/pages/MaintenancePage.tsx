import React, { useEffect, useState } from 'react';

const MaintenancePage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is system admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'system_admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminAccess = () => {
    localStorage.removeItem('maintenanceMode');
    window.location.href = '/admin';
  };

  const handleRetry = () => {
    localStorage.removeItem('maintenanceMode');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Maintenance Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg mb-4">
            <span className="text-4xl text-white">🔧</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Maintenance</h1>
          <p className="text-gray-600">We're currently performing system maintenance</p>
        </div>

        {/* Maintenance Message */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="text-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-yellow-800 font-medium">
                Our system is temporarily unavailable for scheduled maintenance.
              </p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p>• We're working to improve your experience</p>
              <p>• All your data is safe and secure</p>
              <p>• Normal service will resume shortly</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                <strong>Expected Duration:</strong> 15-30 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isAdmin && (
            <button
              onClick={handleAdminAccess}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              🔑 Admin Access
            </button>
          )}
          
          <button
            onClick={handleRetry}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
          >
            🔄 Try Again
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Need urgent assistance?</p>
          <p>Contact: <span className="font-medium text-gray-700">support@ecdmaterials.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;