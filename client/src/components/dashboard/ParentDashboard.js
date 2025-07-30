import React from 'react';
import { Link } from 'react-router-dom';

const ParentDashboard = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          to="/child-progress"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📈</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Child's Progress</h3>
          <p className="text-sm text-gray-600">View learning progress</p>
        </Link>

        <Link
          to="/assignments"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Assignments</h3>
          <p className="text-sm text-gray-600">View child's assignments</p>
        </Link>

        <Link
          to="/materials"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Learning Materials</h3>
          <p className="text-sm text-gray-600">Browse materials</p>
        </Link>

        <Link
          to="/communication"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Teacher Messages</h3>
          <p className="text-sm text-gray-600">Communicate with teachers</p>
        </Link>
      </div>

      {/* Child Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Assignments</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Learning Streak</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">0%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">hours this week</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Child Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">📚</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Your child's learning activities will appear here.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">📋</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming assignments</h3>
              <p className="mt-1 text-sm text-gray-500">New assignments from teachers will appear here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Tips */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Parenting Tip</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Encourage your child to practice learning materials for 15-20 minutes daily. Consistent practice helps build strong foundations in early childhood development.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;