import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import api from '../../services/api';

interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

interface ChildStats {
  childId: string;
  childName: string;
  className: string;
  teacherName: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  overdueAssignments: number;
  gradedAssignments: number;
  averageGrade: number;
  completionRate: number;
}

interface OverallStats {
  totalChildren: number;
  totalAssignments: number;
  totalCompleted: number;
  totalPending: number;
  totalOverdue: number;
  overallCompletionRate: number;
}

interface Activity {
  id: string;
  childName: string;
  assignmentTitle: string;
  status: string;
  submittedAt: string;
  grade: number | null;
  gradedAt: string | null;
  studentId: string;
  parentViewed: boolean;
}

interface Notification {
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  icon: string;
}

interface Message {
  id: string;
  sender: {
    firstName: string;
    lastName: string;
  };
  subject: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  messageType: string;
}

interface DashboardData {
  childrenStats: ChildStats[];
  overallStats: OverallStats;
  recentActivities: Activity[];
  notifications: Notification[];
}

interface ParentDashboardProps {
  user: SimpleUser;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchMessages();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/parent/dashboard/stats');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Keep loading state for fallback UI
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const [messagesResponse, unreadResponse] = await Promise.all([
        api.get('/communication/messages?limit=5'),
        api.get('/communication/messages/unread-count')
      ]);
      
      setMessages(messagesResponse.data.messages || []);
      setUnreadCount(unreadResponse.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await api.patch(`/communication/messages/${messageId}/read`);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Refresh the unread count from server
      const response = await api.get('/communication/messages/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'submitted': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Done';
      case 'submitted': return '📤 Submitted';
      case 'assigned': return '📝 Working';
      case 'overdue': return '⚠️ Late';
      default: return '📋 Pending';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your little stars... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kid-Friendly Header */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-lg text-white/90">
          Let's see how your little stars are shining today! ✨
        </p>
      </div>

      {/* Statistics Cards */}
      {dashboardData && dashboardData.overallStats.totalChildren > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Little Stars</p>
                <p className="text-3xl font-bold">{dashboardData.overallStats.totalChildren}</p>
              </div>
              <div className="text-4xl">👶</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-blue-400 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Done</p>
                <p className="text-3xl font-bold">{dashboardData.overallStats.totalCompleted}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Working</p>
                <p className="text-3xl font-bold">{dashboardData.overallStats.totalPending}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-pink-400 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Messages</p>
                <p className="text-3xl font-bold">{unreadCount}</p>
              </div>
              <div className="text-4xl">💌</div>
            </div>
          </div>
        </div>
      )}

      {/* Children Progress */}
      {dashboardData && dashboardData.childrenStats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.childrenStats.map((child) => (
            <div key={child.childId} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{child.childName}</h3>
                  <p className="text-gray-600">{child.className} • {child.teacherName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  child.completionRate >= 80 ? 'text-green-600 bg-green-100' :
                  child.completionRate >= 60 ? 'text-blue-600 bg-blue-100' : 'text-orange-600 bg-orange-100'
                }`}>
                  {child.completionRate >= 80 ? '🌟 Super Star' : 
                   child.completionRate >= 60 ? '⭐ Doing Great' : '📝 Needs Help'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Assignments</span>
                  <span className="font-semibold">{child.completedAssignments}/{child.totalAssignments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">{child.completionRate}%</span>
                </div>
                {child.averageGrade > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Grade</span>
                    <span className="font-semibold">{child.averageGrade}%</span>
                  </div>
                )}
                {child.overdueAssignments > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Overdue</span>
                    <span className="font-semibold text-red-600">{child.overdueAssignments}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Children Message */}
      {dashboardData && dashboardData.childrenStats.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">👶</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Children Assigned</h3>
          <p className="text-gray-600">Your children haven't been assigned to your account yet.</p>
        </div>
      )}

      {/* Messages from Teachers */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            Messages from Teachers 💌
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.slice(0, 3).map((message) => (
              <div 
                key={message.id}
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition-colors ${
                  message.isRead ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-400'
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
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">{message.subject}</h4>
                    <p className="text-gray-600 text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">💌</div>
              <p>No messages yet from teachers</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      {dashboardData && dashboardData.recentActivities.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            Recent Activities 📋
          </h2>

          <div className="space-y-4">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">
                  {activity.status === 'completed' ? '✅' : 
                   activity.status === 'assigned' ? '📝' : '⚠️'}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{activity.assignmentTitle}</h4>
                  <p className="text-sm text-gray-600">{activity.childName}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(activity.submittedAt)}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {getStatusText(activity.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          Quick Actions 🚀
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all"
            onClick={() => navigate('/parent/assignments')}
          >
            <span className="text-xl">📚</span>
            <span>View Assignments</span>
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all"
            onClick={() => navigate('/parent/progress-reports')}
          >
            <span className="text-xl">📊</span>
            <span>Progress Reports</span>
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all"
            onClick={() => navigate('/parent/contact-teacher')}
          >
            <span className="text-xl">💬</span>
            <span>Contact Teacher</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard; 