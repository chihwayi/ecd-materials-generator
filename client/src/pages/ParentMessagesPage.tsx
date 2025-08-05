import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface Message {
  id: string;
  subject: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  messageType: 'general' | 'progress_update' | 'behavior_note' | 'achievement' | 'concern';
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  recipient: {
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
  response?: string;
  respondedAt?: string;
}

interface Conversation {
  id: string;
  teacherName: string;
  studentName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const ParentMessagesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/communication/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await api.get(`/communication/conversations/${conversationId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await api.put(`/communication/messages/${messageId}/read`);
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      setConversations(prev => prev.map(conv => ({
        ...conv,
        unreadCount: conv.unreadCount > 0 ? conv.unreadCount - 1 : 0
      })));
      
      // Refresh conversations to get updated unread counts
      fetchConversations();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !replyText.trim()) return;

    setSending(true);
    try {
      const response = await api.post('/communication/send-message', {
        recipientId: selectedConversation.id,
        subject: `Re: ${messages[0]?.subject || 'Message'}`,
        content: replyText,
        messageType: 'general',
        priority: 'normal'
      });

      const newMessage: Message = {
        id: response.data.message.id,
        subject: response.data.message.subject,
        content: replyText,
        createdAt: new Date().toISOString(),
        isRead: false,
        priority: 'normal',
        messageType: 'general',
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        recipient: {
          id: selectedConversation.id,
          firstName: selectedConversation.teacherName.split(' ')[0],
          lastName: selectedConversation.teacherName.split(' ')[1] || '',
          role: 'teacher'
        }
      };

      setMessages(prev => [newMessage, ...prev]);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'progress_update': return '📊';
      case 'behavior_note': return '📝';
      case 'achievement': return '🏆';
      case 'concern': return '⚠️';
      default: return '💬';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conv.unreadCount > 0) ||
                         (filter === 'urgent' && conv.messages.some(m => m.priority === 'urgent'));
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages... 💬</p>
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
                💬 Parent Messages
              </h1>
              <p className="text-blue-100 text-lg">
                Stay connected with teachers! 📧
              </p>
            </div>
            <div className="text-6xl opacity-20">👨‍👩‍👧‍👦</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilter('urgent')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'urgent' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>

              {/* Conversations */}
              <div className="space-y-3">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {conversation.teacherName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {conversation.studentName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(conversation.lastMessageTime)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages</h3>
                    <p className="text-gray-600">No conversations found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages View */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
                {/* Conversation Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedConversation.teacherName}
                      </h2>
                      <p className="text-gray-600">
                        Teacher of {selectedConversation.studentName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {selectedConversation.teacherName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === user.id ? 'justify-end' : 'justify-start'}`}
                        onClick={() => !message.isRead && message.sender.id !== user.id && markAsRead(message.id)}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                            message.sender.id === user.id
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">
                              {getMessageTypeIcon(message.messageType)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.sender.id === user.id 
                                ? 'bg-white bg-opacity-20 text-white' 
                                : getPriorityColor(message.priority)
                            }`}>
                              {message.priority}
                            </span>
                            {!message.isRead && message.sender.id !== user.id && (
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{message.subject}</h4>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender.id === user.id ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">💬</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
                      <p className="text-gray-600">Start the conversation!</p>
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={sendReply} className="flex gap-3">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentMessagesPage; 