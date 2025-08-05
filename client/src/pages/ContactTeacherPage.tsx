import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  class?: {
    id?: string;
    name: string;
    grade?: string;
    teacher?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
  response?: string;
  respondedAt?: string;
}

const ContactTeacherPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get children from assignments data
      const response = await api.get('/parent/assignments');
      const assignmentData = response.data.assignments || [];
      // Extract unique children with their class and teacher info
      const uniqueChildren = assignmentData.reduce((acc: Child[], assignment: any) => {
        const existingChild = acc.find(child => child.id === assignment.student?.id);
        if (!existingChild && assignment.student) {
          acc.push({
            id: assignment.student.id,
            firstName: assignment.student.firstName,
            lastName: assignment.student.lastName,
            class: assignment.student.class || { name: 'No Class', grade: 'N/A' }
          });
        }
        return acc;
      }, []);

      setChildren(uniqueChildren);
      if (uniqueChildren.length > 0) {
        setSelectedChild(uniqueChildren[0]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild || !messageForm.subject.trim() || !messageForm.content.trim()) {
      return;
    }

    setSending(true);
    try {
      // In a real implementation, this would send to the backend
      const newMessage: Message = {
        id: Date.now().toString(),
        subject: messageForm.subject,
        content: messageForm.content,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setMessageForm({ subject: '', content: '' });
      setShowMessageForm(false);
      
      // Show success message (in real app, this would be a toast notification)
      alert('Message sent successfully! The teacher will respond soon.');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contact information... 📧</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Contact Information</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); fetchData(); }}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                📧 Contact Teacher
              </h1>
              <p className="text-blue-100 text-lg">
                Stay connected with your child's teacher! 👩‍🏫
              </p>
            </div>
            <div className="text-6xl opacity-20">💬</div>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-600">Your children haven't been assigned to any classes yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Child Selection */}
            {children.length > 1 && (
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  👶 Select Child
                </h2>
                <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedChild?.id === child.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {child.firstName} {child.lastName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChild && (
              <>
                {/* Teacher Information */}
                <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    👩‍🏫 Teacher Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-2xl text-white">👩‍🏫</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedChild.class?.teacher?.firstName && selectedChild.class?.teacher?.lastName 
                              ? `${selectedChild.class.teacher.firstName} ${selectedChild.class.teacher.lastName}`
                              : 'Teacher Not Assigned'
                            }
                          </h3>
                          <p className="text-gray-600">{selectedChild.class?.name || 'No Class'} Teacher</p>
                          <p className="text-sm text-gray-500">{selectedChild.class?.teacher?.email || 'No email available'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Class:</span>
                        <span className="font-medium">{selectedChild.class?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grade:</span>
                        <span className="font-medium">{selectedChild.class?.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student:</span>
                        <span className="font-medium">{selectedChild.firstName} {selectedChild.lastName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Options - MOVED TO TOP */}
                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-green-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    🚀 Quick Contact Options
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setMessageForm({
                          subject: 'Question about homework',
                          content: 'Hi, I have a question about my child\'s homework assignment...'
                        });
                        setShowMessageForm(true);
                      }}
                      className="p-4 bg-gradient-to-r from-white to-blue-50 rounded-lg border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                      <h3 className="font-semibold text-gray-900">Homework Help</h3>
                      <p className="text-sm text-gray-600">Ask about assignments or homework</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        setMessageForm({
                          subject: 'Request parent-teacher meeting',
                          content: 'Hi, I would like to schedule a meeting to discuss my child\'s progress...'
                        });
                        setShowMessageForm(true);
                      }}
                      className="p-4 bg-gradient-to-r from-white to-green-50 rounded-lg border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🤝</div>
                      <h3 className="font-semibold text-gray-900">Schedule Meeting</h3>
                      <p className="text-sm text-gray-600">Request a parent-teacher conference</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        setMessageForm({
                          subject: 'Child\'s progress inquiry',
                          content: 'Hi, I would like to know more about how my child is doing in class...'
                        });
                        setShowMessageForm(true);
                      }}
                      className="p-4 bg-gradient-to-r from-white to-purple-50 rounded-lg border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                      <h3 className="font-semibold text-gray-900">Progress Update</h3>
                      <p className="text-sm text-gray-600">Ask about your child's development</p>
                    </button>
                    
                    <button
                      onClick={() => {
                        setMessageForm({
                          subject: 'General inquiry',
                          content: 'Hi, I have a question about...'
                        });
                        setShowMessageForm(true);
                      }}
                      className="p-4 bg-gradient-to-r from-white to-pink-50 rounded-lg border border-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-200 text-left group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">❓</div>
                      <h3 className="font-semibold text-gray-900">General Question</h3>
                      <p className="text-sm text-gray-600">Ask about anything else</p>
                    </button>
                  </div>
                </div>

                {/* Send Message Section */}
                <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg p-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      💬 Send Message
                    </h2>
                    <button
                      onClick={() => setShowMessageForm(!showMessageForm)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                    >
                      {showMessageForm ? 'Cancel' : 'New Message'}
                    </button>
                  </div>

                  {showMessageForm && (
                    <form onSubmit={handleSendMessage} className="space-y-4 mb-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={messageForm.subject}
                          onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter message subject..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={messageForm.content}
                          onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Type your message here..."
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowMessageForm(false)}
                          className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={sending}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {sending ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Message History - BEAUTIFIED */}
                <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg p-6 border border-purple-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    📝 Message History
                  </h2>
                  
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{message.subject}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">{message.content}</p>
                          
                          {message.response ? (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-4 mt-4 rounded-r-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-blue-800 flex items-center">
                                  <span className="mr-2">👩‍🏫</span>
                                  Teacher Response:
                                </span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{formatDate(message.respondedAt!)}</span>
                              </div>
                              <p className="text-blue-700 leading-relaxed">{message.response}</p>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
                              <span className="text-sm text-yellow-800 flex items-center">
                                <span className="mr-2">⏳</span>
                                Waiting for teacher response
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-6xl mb-4">💬</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                      <p className="text-gray-600 mb-4">Start a conversation with your child's teacher!</p>
                      <button
                        onClick={() => setShowMessageForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Send Your First Message
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactTeacherPage;