import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TeacherAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAssignments();
    // Get current user info
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userInfo);
  }, []);

  const fetchAssignments = async () => {
    try {
      // Get current user info to determine the correct endpoint
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const endpoint = user.role === 'teacher' ? '/assignments/teacher' : '/assignments/school-admin';
      
      const response = await api.get(endpoint);
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (assignment) => {
    const completedCount = assignment.studentAssignments?.filter(sa => sa.status === 'completed' || sa.status === 'submitted').length || 0;
    const gradedCount = assignment.studentAssignments?.filter(sa => sa.status === 'graded').length || 0;
    const totalCount = assignment.studentAssignments?.length || 0;
    
    if (gradedCount === totalCount && totalCount > 0) return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    if (completedCount > 0) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getStatusText = (assignment) => {
    const completedCount = assignment.studentAssignments?.filter(sa => sa.status === 'completed' || sa.status === 'submitted').length || 0;
    const gradedCount = assignment.studentAssignments?.filter(sa => sa.status === 'graded').length || 0;
    const totalCount = assignment.studentAssignments?.length || 0;
    
    if (totalCount === 0) return 'No students';
    if (gradedCount === totalCount) return 'All graded';
    if (completedCount > 0) return `${completedCount}/${totalCount} completed`;
    return 'Pending';
  };

  const canEditAssignment = (assignment) => {
    const hasSubmissions = assignment.studentAssignments?.some(sa => 
      sa.status === 'completed' || sa.status === 'submitted' || sa.status === 'graded'
    );
    return !hasSubmissions;
  };

  const getAssignmentTypeIcon = (type) => {
    switch (type) {
      case 'worksheet': return '📝';
      case 'quiz': return '📊';
      case 'project': return '🎨';
      case 'homework': return '📚';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📝 Assignments</h1>
              <p className="text-orange-100 text-lg">
                {user?.role === 'teacher' 
                  ? 'View and manage student assignments' 
                  : 'Monitor assignments created by teachers'
                }
              </p>
            </div>
            <div className="text-6xl opacity-20">📚</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex justify-end space-x-4">
          {user?.role === 'teacher' && (
            <Link
              to="/create-assignment"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              <span className="text-2xl mr-2">➕</span>
              <span className="font-semibold">Create Assignment</span>
            </Link>
          )}
          {user?.role === 'school_admin' && (
            <Link
              to="/student-assignment-management"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              <span className="text-2xl mr-2">⚙️</span>
              <span className="font-semibold">Manage Student Assignments</span>
            </Link>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'teacher' 
                ? 'No assignments have been created yet' 
                : 'No assignments have been created by teachers yet'
              }
            </p>
            {user?.role === 'teacher' && (
              <Link
                to="/create-assignment"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <span className="text-2xl mr-2">➕</span>
                <span>Create Your First Assignment</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">{getAssignmentTypeIcon(assignment.type)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                      {getStatusText(assignment)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {assignment.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        {assignment.subject}
                      </span>
                      <span className="text-xs text-gray-500">
                        {assignment.gradeLevel}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>👥 {assignment.studentAssignments?.length || 0} students</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center text-sm font-medium"
                    >
                      👁️ View
                    </Link>
                    {canEditAssignment(assignment) ? (
                      <Link
                        to={`/assignments/${assignment.id}/edit`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center text-sm font-medium"
                      >
                        ✏️ Edit
                      </Link>
                    ) : (
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center text-sm font-medium"
                      >
                        📝 Grade
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignmentsPage;