import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { User } from '../../types/user.types';

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalMaterials: number;
  totalAssignments: number;
  completionRate: number;
  recentActivities: SchoolActivity[];
  materialsBySubject: SubjectMaterial[];
  classStats: ClassStats[];
}

interface SchoolActivity {
  id: string;
  type: 'student_created' | 'teacher_created' | 'assignment_created' | 'material_created';
  description: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

interface SubjectMaterial {
  subject: string;
  count: number;
}

interface ClassStats {
  id: string;
  name: string;
  teacherName: string;
  studentCount: number;
  assignmentCount: number;
  completionRate: number;
}

interface SchoolDashboardProps {
  user: User;
}

const SchoolDashboard: React.FC<SchoolDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/school-admin/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student_created': return '👤';
      case 'teacher_created': return '👨‍🏫';
      case 'assignment_created': return '📝';
      case 'material_created': return '📄';
      default: return '📊';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Math': return '🔢';
      case 'Language': return '📚';
      case 'Art': return '🎨';
      case 'Science': return '🔬';
      case 'Social Studies': return '🌍';
      default: return '📖';
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
          to="/create-student"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Add Student</h3>
          <p className="text-sm text-gray-600">Register new student</p>
        </Link>

        <Link
          to="/manage-teachers"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Teachers</h3>
          <p className="text-sm text-gray-600">View and manage staff</p>
        </Link>

        <Link
          to="/manage-classes"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Classes</h3>
          <p className="text-sm text-gray-600">Organize students</p>
        </Link>

        <Link
          to="/school-analytics"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600">View school insights</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalTeachers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalClasses || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
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
            <h2 className="text-lg font-semibold text-gray-900">Recent School Activity</h2>
          </div>
          <div className="p-6">
            {stats?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        {activity.user && (
                          <p className="text-xs text-gray-500">
                            by {activity.user.firstName} {activity.user.lastName}
                          </p>
                        )}
                      </div>
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
                    to="/school-analytics"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all activity →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">📊</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">Activity will appear here as teachers and students use the system.</p>
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
                        <span className="text-sm">{getSubjectIcon(subject.subject)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-gray-600">{subject.count} materials</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <Link
                    to="/school-materials"
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
                <p className="mt-1 text-sm text-gray-500">Teachers will create materials that appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Class Overview */}
      {stats?.classStats && stats.classStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Class Overview</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {stats.classStats.map((classStat) => (
                <div key={classStat.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{classStat.name}</h3>
                      <p className="text-sm text-gray-600">Teacher: {classStat.teacherName}</p>
                    </div>
                    <Link
                      to={`/class-students/${classStat.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      View Class
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{classStat.studentCount}</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{classStat.assignmentCount}</div>
                      <div className="text-xs text-gray-600">Assignments</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${classStat.completionRate >= 80 ? 'text-green-600' : classStat.completionRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {classStat.completionRate}%
                      </div>
                      <div className="text-xs text-gray-600">Completion</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Materials</span>
              <span className="font-medium">{stats?.totalMaterials || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Assignments</span>
              <span className="font-medium">{stats?.totalAssignments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Completion</span>
              <span className="font-medium">{stats?.completionRate || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/create-student"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm text-center"
            >
              👤 Add New Student
            </Link>
            <Link
              to="/manage-teachers"
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm text-center"
            >
              👨‍🏫 Manage Teachers
            </Link>
            <Link
              to="/school-settings"
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm text-center"
            >
              ⚙️ School Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
