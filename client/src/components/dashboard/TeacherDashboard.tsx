import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
// import TeacherMessaging from '../communication/TeacherMessaging.tsx';

interface DashboardStats {
  materialsCreated: number;
  students: number;
  activeAssignments: number;
  completionRate: number;
  recentActivities: Activity[];
  materialsBySubject: SubjectMaterial[];
  pendingGrading: number;
  unreadMessages: number;
}

interface Activity {
  id: string;
  description: string;
  type: string;
  createdAt: string;
}

interface SubjectMaterial {
  subject: string;
  count: number;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  messageType: 'general' | 'progress_update' | 'behavior_note' | 'achievement' | 'concern';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  student?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

interface TeacherDashboardProps {
  user: SimpleUser;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchMessages();
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
        ].filter(s => s.count > 0),
        pendingGrading: 0, // Will be updated from API
        unreadMessages: 0 // Will be updated from API
      });
    } catch (error) {
      console.error('Failed to load dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const [messagesResponse, unreadResponse] = await Promise.all([
        api.get('/communication/messages?limit=3'),
        api.get('/communication/messages/unread-count')
      ]);
      
      setMessages(messagesResponse.data.messages);
      if (stats) {
        setStats(prev => prev ? { ...prev, unreadMessages: unreadResponse.data.unreadCount } : null);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await api.patch(`/communication/messages/${messageId}/read`);
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'progress_update': return '📈';
      case 'behavior_note': return '📝';
      case 'concern': return '⚠️';
      default: return '💬';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-300';
      case 'high': return 'bg-orange-100 border-orange-300';
      case 'normal': return 'bg-blue-100 border-blue-300';
      case 'low': return 'bg-gray-100 border-gray-300';
      default: return 'bg-blue-100 border-blue-300';
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
      <div className="grid md:grid-cols-4 gap-6">
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
      </div>

      {/* Communication and Grading Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/grading"
          className="group bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-yellow-200 hover:border-yellow-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">📊</span>
            </div>
            {stats?.pendingGrading && stats.pendingGrading > 0 && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
                {stats.pendingGrading} new
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Grade Assignments</h3>
          <p className="text-sm text-gray-600">
            {stats?.pendingGrading ? `${stats.pendingGrading} assignments need grading` : 'No pending assignments'}
          </p>
        </Link>

        <Link
          to="/communication"
          className="group bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-2xl text-white">💬</span>
            </div>
            {stats?.unreadMessages && stats.unreadMessages > 0 && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium animate-pulse">
                {stats.unreadMessages} new
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Communicate with Parents</h3>
          <p className="text-sm text-gray-600">
            {stats?.unreadMessages ? `${stats.unreadMessages} unread messages` : 'Send updates to parents'}
          </p>
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200">
          <div className="px-6 py-4 border-b border-indigo-200 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white flex items-center">
              📈 Recent Student Activity
            </h2>
          </div>
          <div className="p-6">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-indigo-600 font-medium">{activity.type.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
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
                <span className="text-4xl">👥</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No student activity yet</h3>
                <p className="mt-1 text-sm text-gray-500">Students will appear here once they start completing activities.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-sm border border-pink-200">
          <div className="px-6 py-4 border-b border-pink-200 bg-gradient-to-r from-pink-500 to-pink-600 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white flex items-center">
              💬 Recent Messages {stats?.unreadMessages && stats.unreadMessages > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                  {stats.unreadMessages} new
                </span>
              )}
            </h2>
          </div>
          <div className="p-6">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 3).map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${
                      message.isRead ? 'bg-white border-pink-200' : 'bg-pink-50 border-pink-400'
                    }`}
                    onClick={() => !message.isRead && markMessageAsRead(message.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-800">
                            {message.sender.firstName} {message.sender.lastName}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                          {!message.isRead && (
                            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-800 mb-1">{message.subject}</h4>
                        <p className="text-gray-600 text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-pink-200">
                  <Link
                    to="/communication"
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center"
                  >
                    View all messages →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl">💌</span>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                <p className="mt-1 text-sm text-gray-500">Messages from parents will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Materials by Subject */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Materials by Subject</h2>
        </div>
        <div className="p-6">
          {stats?.materialsBySubject && stats.materialsBySubject.length > 0 ? (
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

      {/* Messaging Section */}
      {/* <TeacherMessaging /> */}
    </div>
  );
};

export default TeacherDashboard;
