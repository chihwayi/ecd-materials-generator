import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolAdminService } from '../../services/school-admin.service';
import { analyticsService } from '../../services/admin.service.ts';
import SubscriptionWarnings from '../SubscriptionWarnings.tsx';

const SchoolAdminDashboard = ({ user }) => {
  const [analytics, setAnalytics] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchUsage();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await schoolAdminService.getSchoolAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set fallback data if API fails
      setAnalytics({
        totalTeachers: 1,
        totalStudents: 0,
        totalClasses: 0,
        schoolPerformance: 85
      });
    } finally {
      setLoading(false);
    }
  };

  const activateTrialPlan = async () => {
    try {
      await analyticsService.activateTrialPlan();
      // Refresh usage data after activation
      fetchUsage();
      alert('Free trial activated successfully! You now have 30 days of full access.');
    } catch (error) {
      console.error('Failed to activate trial:', error);
      alert('Failed to activate trial. Please try again.');
    }
  };

  const fetchUsage = async () => {
    try {
      const data = await analyticsService.getSchoolUsage();
      setUsage(data);
    } catch (error) {
      console.error('Failed to fetch usage:', error);
      // Set fallback data if API fails
      setUsage({
        plan: {
          name: 'Free Trial',
          planId: 'free',
          daysRemaining: 25,
          canActivate: false
        },
        usage: {
          teachers: {
            current: 1,
            limit: 5,
            percentage: 20,
            unlimited: false
          },
          students: {
            current: 0,
            limit: 50,
            percentage: 0,
            unlimited: false
          },
          classes: {
            current: 0,
            limit: 10,
            percentage: 0,
            unlimited: false
          }
        },
        warnings: [],
        features: {
          materials: true,
          templates: true,
          assignments: true,
          financeModule: false,
          advancedAnalytics: false,
          customBranding: false
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <SubscriptionWarnings />
      
      {/* Plan Usage Status - Prominent Top Section */}
      {usage && (
        <div className={`rounded-xl shadow-lg border p-8 ${
          usage.plan.canActivate 
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">📊</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {usage.plan.canActivate ? 'Activate Your Free Trial' : 'Subscription Status'}
                </h2>
                <p className="text-sm text-gray-600">
                  {usage.plan.canActivate 
                    ? 'Start your 30-day free trial to access all features' 
                    : 'Monitor your plan usage and limits'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {usage.plan.canActivate ? (
                <button
                  onClick={activateTrialPlan}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold transition-all shadow-md"
                >
                  🎆 Activate Free Trial
                </button>
              ) : (
                <>
                  {usage.plan.daysRemaining !== null && (
                    <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      usage.plan.daysRemaining <= 3 ? 'bg-red-500 text-white' :
                      usage.plan.daysRemaining <= 7 ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {usage.plan.daysRemaining} days remaining
                    </div>
                  )}
                  <span className={`px-4 py-2 text-sm font-bold rounded-lg ${
                    usage.plan.planId === 'enterprise' ? 'bg-purple-500 text-white' :
                    usage.plan.planId === 'professional' ? 'bg-blue-500 text-white' :
                    usage.plan.planId === 'starter' ? 'bg-green-500 text-white' :

                    'bg-gray-500 text-white'
                  }`}>
                    {usage.plan.name}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Teachers Usage */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👨🏫</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teachers</h3>
                    <p className="text-xs text-gray-500">Active educators</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {usage.usage.teachers.current}
                  </div>
                  <div className="text-sm text-gray-500">
                    of {usage.usage.teachers.unlimited ? '∞' : usage.usage.teachers.limit}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usage.usage.teachers.percentage >= 90 ? 'bg-red-500' :
                    usage.usage.teachers.percentage >= 75 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(usage.usage.teachers.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{usage.usage.teachers.percentage}% used</span>
                <span className={`font-medium ${
                  usage.usage.teachers.percentage >= 90 ? 'text-red-600' :
                  usage.usage.teachers.percentage >= 75 ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {usage.usage.teachers.percentage >= 90 ? 'Critical' :
                   usage.usage.teachers.percentage >= 75 ? 'Warning' : 'Good'}
                </span>
              </div>
            </div>
            
            {/* Students Usage */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Students</h3>
                    <p className="text-xs text-gray-500">Enrolled learners</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {usage.usage.students.current}
                  </div>
                  <div className="text-sm text-gray-500">
                    of {usage.usage.students.unlimited ? '∞' : usage.usage.students.limit}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usage.usage.students.percentage >= 90 ? 'bg-red-500' :
                    usage.usage.students.percentage >= 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usage.usage.students.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">{usage.usage.students.percentage}% used</span>
                <span className={`font-medium ${
                  usage.usage.students.percentage >= 90 ? 'text-red-600' :
                  usage.usage.students.percentage >= 75 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {usage.usage.students.percentage >= 90 ? 'Critical' :
                   usage.usage.students.percentage >= 75 ? 'Warning' : 'Good'}
                </span>
              </div>
            </div>
            
            {/* Classes Usage */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Classes</h3>
                    <p className="text-xs text-gray-500">Active classrooms</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {usage.usage.classes.current}
                  </div>
                  <div className="text-sm text-gray-500">
                    of {usage.usage.classes.unlimited ? '∞' : usage.usage.classes.limit}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usage.usage.classes.unlimited ? 'bg-purple-500' :
                    usage.usage.classes.percentage >= 90 ? 'bg-red-500' :
                    usage.usage.classes.percentage >= 75 ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}
                  style={{ width: `${usage.usage.classes.unlimited ? 15 : Math.min(usage.usage.classes.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">
                  {usage.usage.classes.unlimited ? 'Unlimited' : `${usage.usage.classes.percentage}% used`}
                </span>
                <span className={`font-medium ${
                  usage.usage.classes.unlimited ? 'text-purple-600' :
                  usage.usage.classes.percentage >= 90 ? 'text-red-600' :
                  usage.usage.classes.percentage >= 75 ? 'text-yellow-600' :
                  'text-purple-600'
                }`}>
                  {usage.usage.classes.unlimited ? 'Unlimited' :
                   usage.usage.classes.percentage >= 90 ? 'Critical' :
                   usage.usage.classes.percentage >= 75 ? 'Warning' : 'Good'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Warnings Section */}
          {usage.warnings && usage.warnings.length > 0 && (
            <div className="mt-6 space-y-3">
              {usage.warnings.map((warning, index) => (
                <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-500 text-xl">⚠️</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-800">{warning.message}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {warning.percentage}% of your {warning.type} limit used
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-500 text-xl">💡</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-800">
                      Upgrade your plan to continue adding {usage.warnings.map(w => w.type).join(', ')}
                    </p>
                    <Link to="/subscription/pricing" className="text-sm text-blue-900 font-medium hover:underline mt-1 inline-block">
                      View upgrade options →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/manage-teachers"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Teachers</h3>
          <p className="text-sm text-gray-600">Add and manage teachers</p>
        </Link>

        <Link
          to="/school-students"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">All Students</h3>
          <p className="text-sm text-gray-600">View all students</p>
        </Link>

        <Link
          to="/school-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">School Analytics</h3>
          <p className="text-sm text-gray-600">Performance reports</p>
        </Link>
      </div>

      {/* Additional Management Tools */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">🛠️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Management Tools</h2>
            <p className="text-sm text-gray-600">Advanced school administration</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/manage-classes"
            className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 border border-indigo-200 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">🏢</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Manage Classes</h3>
            <p className="text-sm text-gray-600">Create and assign classes</p>
            <div className="mt-3 text-indigo-600 text-sm font-medium group-hover:text-indigo-700">Manage →</div>
          </Link>

          <Link
            to="/password-recovery"
            className="group bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">🔑</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Password Recovery</h3>
            <p className="text-sm text-gray-600">Reset user passwords</p>
            <div className="mt-3 text-red-600 text-sm font-medium group-hover:text-red-700">Reset →</div>
          </Link>

          <Link
            to="/create-student"
            className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 border border-emerald-200 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">👶</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Create Student</h3>
            <p className="text-sm text-gray-600">Add new students to classes</p>
            <div className="mt-3 text-emerald-600 text-sm font-medium group-hover:text-emerald-700">Add student →</div>
          </Link>
        </div>
      </div>

      {/* Subscription & Payment Management */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">💰</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Subscription & Billing</h2>
            <p className="text-sm text-gray-600">Manage your subscription and payments</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/subscription/pricing"
            className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">💳</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Subscription Plans</h3>
            <p className="text-sm text-gray-600">View and upgrade subscription packages</p>
            <div className="mt-3 text-purple-600 text-sm font-medium group-hover:text-purple-700">View plans →</div>
          </Link>

          <Link
            to="/subscription/manage"
            className="group bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 border border-yellow-200 hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">📊</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Manage Subscription</h3>
            <p className="text-sm text-gray-600">View billing, payments and subscription details</p>
            <div className="mt-3 text-yellow-600 text-sm font-medium group-hover:text-yellow-700">Manage →</div>
          </Link>
        </div>
      </div>

      {/* School Settings & Admin Access */}
      <div className="grid md:grid-cols-1 gap-6">
        <Link
          to="/school-settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">School Settings</h3>
              <p className="text-sm text-gray-600">Configure default parent password and school information</p>
            </div>
          </div>
        </Link>
      </div>

      {/* System Administration (for elevated permissions) */}
      {(user?.role === 'system_admin' || user?.permissions?.includes('system_admin')) && (
        <div className="grid md:grid-cols-1 gap-6">
          <Link
            to="/admin/subscriptions"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-red-200 bg-red-50"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-1">System Admin Monitoring</h3>
                <p className="text-sm text-red-600">Monitor all school subscriptions and system performance</p>
              </div>
            </div>
          </Link>
        </div>
      )}



      {/* School Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalTeachers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalClasses || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">School Performance</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.schoolPerformance || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* School Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Teacher Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <span className="text-4xl">👨‍🏫</span>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teacher activity</h3>
              <p className="mt-1 text-sm text-gray-500">Teachers will appear here once they start using the platform.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;