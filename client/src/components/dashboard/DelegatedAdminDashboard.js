import React from 'react';
import { Link } from 'react-router-dom';

const DelegatedAdminDashboard = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          to="/regional-schools"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Regional Schools</h3>
          <p className="text-sm text-gray-600">Manage assigned schools</p>
        </Link>

        <Link
          to="/school-reports"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">School Reports</h3>
          <p className="text-sm text-gray-600">View performance reports</p>
        </Link>

        <Link
          to="/support-tickets"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Support Tickets</h3>
          <p className="text-sm text-gray-600">Handle school support</p>
        </Link>

        <Link
          to="/regional-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Regional Analytics</h3>
          <p className="text-sm text-gray-600">Regional insights</p>
        </Link>
      </div>

      {/* Regional Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Schools</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teachers</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regional Performance</p>
              <p className="text-3xl font-bold text-green-600">85%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent School Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">🏫</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">School activities will appear here.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Support Queue</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">🎫</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending tickets</h3>
              <p className="mt-1 text-sm text-gray-500">Support requests will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Delegated Administrator</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>You have administrative access to manage schools in your assigned region. Contact the system administrator for additional permissions or support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegatedAdminDashboard;