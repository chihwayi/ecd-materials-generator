import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const TeacherMessaging = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientType: 'individual',
    selectedStudents: [],
    subject: '',
    content: '',
    messageType: 'general',
    priority: 'normal'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/teacher/students');
      console.log('Students API response:', response.data);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.recipientType === 'individual' && formData.selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    setLoading(true);

    try {
      const messageData = {
        recipientType: formData.recipientType,
        recipients: formData.recipientType === 'individual' ? formData.selectedStudents : [],
        subject: formData.subject,
        content: formData.content,
        messageType: formData.messageType,
        priority: formData.priority
      };

      await api.post('/communication/send-message', messageData);
      
      toast.success('Message sent successfully!');
      
      // Reset form
      setFormData({
        recipientType: 'individual',
        selectedStudents: [],
        subject: '',
        content: '',
        messageType: 'general',
        priority: 'normal'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: students.map(student => student.id)
    }));
  };

  const handleClearSelection = () => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: []
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'progress_update': return '📈';
      case 'behavior_note': return '📝';
      case 'achievement': return '🏆';
      case 'concern': return '⚠️';
      default: return '💬';
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border border-teal-200">
      <div className="px-6 py-4 border-b border-teal-200 bg-gradient-to-r from-teal-500 to-teal-600 rounded-t-xl">
        <h2 className="text-lg font-semibold text-white flex items-center">
          💬 Send Message to Parents
        </h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Message Recipients
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="individual"
                  checked={formData.recipientType === 'individual'}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value }))}
                  className="mr-2 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Individual Students</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recipientType"
                  value="broadcast"
                  checked={formData.recipientType === 'broadcast'}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientType: e.target.value }))}
                  className="mr-2 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">All Students (Broadcast)</span>
              </label>
            </div>
          </div>

          {/* Student Selection */}
          {formData.recipientType === 'individual' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Select Students ({formData.selectedStudents.length} selected)
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-md hover:bg-teal-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
                {students.map((student) => {
                  console.log('Rendering student:', student);
                  return (
                    <label key={student.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedStudents.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {student.class?.name || 'No Class'}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Type
              </label>
              <select
                value={formData.messageType}
                onChange={(e) => setFormData(prev => ({ ...prev, messageType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="general">💬 General</option>
                <option value="progress_update">📈 Progress Update</option>
                <option value="behavior_note">📝 Behavior Note</option>
                <option value="achievement">🏆 Achievement</option>
                <option value="concern">⚠️ Concern</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="low">🟢 Low</option>
                <option value="normal">🔵 Normal</option>
                <option value="high">🟡 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter message subject..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your message here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              required
            />
          </div>

          {/* Preview */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getMessageTypeIcon(formData.messageType)}</span>
                <span className="text-sm font-medium text-gray-900">{formData.subject || 'No subject'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                  {formData.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {formData.content || 'No content yet...'}
              </p>
              <p className="text-xs text-gray-500">
                To: {formData.recipientType === 'broadcast' 
                  ? `All students (${students.length})` 
                  : `${formData.selectedStudents.length} selected student(s)`}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">📤</span>
                  Send Message
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherMessaging; 