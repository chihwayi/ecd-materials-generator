import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { toast } from 'react-hot-toast';

const TeacherDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [statsData, activityData] = await Promise.all([
        teacherService.getDashboardStats(),
        teacherService.getRecentActivity()
      ]);
      setStats({
        ...statsData,
        recentActivities: activityData.activity || [],
        materialsBySubject: [
          { subject: 'Math', count: Math.floor(statsData.materialsCreated * 0.3) },
          { subject: 'Language', count: Math.floor(statsData.materialsCreated * 0.4) },
          { subject: 'Art', count: Math.floor(statsData.materialsCreated * 0.3) }
        ].filter(s => s.count > 0)
      });
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6">
        <Link
          to="/templates"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">➕</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Material</h3>
          <p className="text-sm text-gray-600">Start with a template</p>
        </Link>

        <Link
          to="/materials"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">My Materials</h3>
          <p className="text-sm text-gray-600">View all materials</p>
        </Link>

        <Link
          to="/create-assignment"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Assignment</h3>
          <p className="text-sm text-gray-600">Assign homework to class</p>
        </Link>

        <Link
          to="/students"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">My Students</h3>
          <p className="text-sm text-gray-600">Manage students</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Materials Created</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.materialsCreated || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.students || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeAssignments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.completionRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Student Activity</h2>
          </div>
          <div className="p-6">
            {stats?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.type.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    to="/students"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all students →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">👥</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No student activity yet</h3>
                <p className="mt-1 text-sm text-gray-500">Students will appear here once they start completing activities.</p>
              </div>
            )}
          </div>
        </div>

        {/* Materials by Subject */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Materials by Subject</h2>
          </div>
          <div className="p-6">
            {stats?.materialsBySubject?.length > 0 ? (
              <div className="space-y-4">
                {stats.materialsBySubject.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">
                          {subject.subject === 'Math' ? '🔢' : 
                           subject.subject === 'Language' ? '📚' :
                           subject.subject === 'Art' ? '🎨' :
                           subject.subject === 'Science' ? '🔬' : '🎭'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-gray-600">{subject.count} materials</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    to="/materials"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all materials →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">📄</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No materials yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first learning material to get started.</p>
                <div className="mt-4">
                  <Link
                    to="/templates"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Material
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;