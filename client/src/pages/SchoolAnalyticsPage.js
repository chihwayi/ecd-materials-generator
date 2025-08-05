import React, { useState, useEffect } from 'react';
import { schoolAdminService } from '../services/school-admin.service';

const SchoolAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await schoolAdminService.getSchoolAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                📊 School Analytics
              </h1>
              <p className="text-green-100 text-lg">
                Performance reports and insights for your school
              </p>
            </div>
            <div className="text-6xl opacity-20">📈</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics... 📊</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Teachers</p>
                    <p className="text-3xl font-bold">{analytics?.totalTeachers || 0}</p>
                  </div>
                  <div className="text-4xl">👨🏫</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Students</p>
                    <p className="text-3xl font-bold">{analytics?.totalStudents || 0}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Learning Materials</p>
                    <p className="text-3xl font-bold">{analytics?.totalMaterials || 0}</p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">School Performance</p>
                    <p className="text-3xl font-bold">{analytics?.schoolPerformance || 0}%</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>
            </div>

            {/* Charts and Reports */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    👨🏫 Teacher Activity
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">👨🏫</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Performance</h3>
                    <p className="text-gray-600">Detailed teacher analytics coming soon.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    📈 Student Progress
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl text-white">📈</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Progress</h3>
                    <p className="text-gray-600">Student progress tracking coming soon.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  🏆 School Performance Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-4xl mb-2">👨🏫</div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">85%</div>
                    <div className="text-sm font-medium text-gray-700">Teacher Engagement</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-4xl mb-2">👥</div>
                    <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                    <div className="text-sm font-medium text-gray-700">Student Participation</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">78%</div>
                    <div className="text-sm font-medium text-gray-700">Material Usage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolAnalyticsPage;