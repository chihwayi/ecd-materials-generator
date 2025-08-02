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
      const [statsData, activityData, gradingData] = await Promise.all([
        teacherService.getDashboardStats(),
        teacherService.getRecentActivity(),
        teacherService.getGradingAnalytics()
      ]);
      setStats({
        ...statsData,
        ...gradingData,
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}! 👨‍🏫</h1>
            <p className="text-blue-100 text-lg">Ready to inspire and educate today?</p>
          </div>
          <div className="text-6xl opacity-20">📚</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-5 gap-6">
        <Link
          to="/templates"
          className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-300 transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl text-white">➕</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Material</h3>
          <p className="text-sm text-gray-600">Start with a template</p>
        </Link>

        <Link
          to="/materials"
          className="group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-green-200 hover:border-green-300 transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl text-white">📄</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">My Materials</h3>
          <p className="text-sm text-gray-600">View all materials</p>
        </Link>

        <Link
          to="/create-assignment"
          className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-300 transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl text-white">📝</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Assignment</h3>
          <p className="text-sm text-gray-600">Assign homework to class</p>
        </Link>

        <Link
          to="/students"
          className="group bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-200 hover:border-orange-300 transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl text-white">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">My Students</h3>
          <p className="text-sm text-gray-600">Manage students</p>
        </Link>

        <Link
          to="/messaging"
          className="group bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-teal-200 hover:border-teal-300 transform hover:-translate-y-1"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl text-white">💬</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Messaging</h3>
          <p className="text-sm text-gray-600">Communicate with parents</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Materials Created</p>
              <p className="text-3xl font-bold text-blue-900">{stats?.materialsCreated || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Students</p>
              <p className="text-3xl font-bold text-green-900">{stats?.students || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Active Assignments</p>
              <p className="text-3xl font-bold text-purple-900">{stats?.activeAssignments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Completion Rate</p>
              <p className="text-3xl font-bold text-orange-900">{stats?.completionRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Analytics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-sm border border-teal-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-teal-700">Pending Grades</p>
              <p className="text-3xl font-bold text-teal-900">{stats?.pendingGrades || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Average Grade</p>
              <p className="text-3xl font-bold text-emerald-900">{stats?.averageGrade || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl shadow-sm border border-pink-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-700">Graded This Week</p>
              <p className="text-3xl font-bold text-pink-900">{stats?.gradedThisWeek || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">✅</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200">
          <div className="px-6 py-4 border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white flex items-center">
              📈 Recent Student Activity
            </h2>
          </div>
          <div className="p-6">
            {stats?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => {
                  console.log('Activity data:', activity);
                  const activityDate = activity.createdAt || activity.created_at || activity.date;
                  console.log('Activity date:', activityDate);
                  
                  return (
                    <div key={activity.id} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-indigo-600 font-medium">{activity.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {activityDate ? new Date(activityDate).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-indigo-200">
                  <Link
                    to="/students"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                  >
                    View all students →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Grading Insights */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-sm border border-pink-200">
          <div className="px-6 py-4 border-b border-pink-200 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white flex items-center">
              📝 Grading Insights
            </h2>
          </div>
          <div className="p-6">
            {stats?.gradingInsights?.length > 0 ? (
              <div className="space-y-4">
                {stats.gradingInsights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                      <p className="text-xs text-pink-600 font-medium">{insight.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {insight.date ? new Date(insight.date).toLocaleDateString() : 'Today'}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-pink-200">
                  <Link
                    to="/assignments"
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center"
                  >
                    View all assignments →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-pink-100">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">No pending grades</p>
                    <p className="text-xs text-pink-600 font-medium">All caught up!</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-500 text-2xl">✅</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-pink-200">
                  <Link
                    to="/assignments"
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center"
                  >
                    View assignments →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Materials by Subject */}
      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-sm border border-pink-200">
        <div className="px-6 py-4 border-b border-pink-200 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white flex items-center">
            📚 Materials by Subject
          </h2>
        </div>
        <div className="p-6">
          {stats?.materialsBySubject?.length > 0 ? (
            <div className="space-y-4">
              {stats.materialsBySubject.map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-pink-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-white">
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
              <div className="pt-4 border-t border-pink-200">
                <Link
                  to="/materials"
                  className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center"
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
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
                >
                  Create Material
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;