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
    const completedCount = assignment.studentAssignments?.filter(sa => sa.status === 'completed').length || 0;
    const gradedCount = assignment.studentAssignments?.filter(sa => sa.status === 'graded').length || 0;
    const totalCount = assignment.studentAssignments?.length || 0;
    
    if (gradedCount === totalCount && totalCount > 0) return 'bg-green-100 text-green-800';
    if (completedCount > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (assignment) => {
    const completedCount = assignment.studentAssignments?.filter(sa => sa.status === 'completed').length || 0;
    const gradedCount = assignment.studentAssignments?.filter(sa => sa.status === 'graded').length || 0;
    const totalCount = assignment.studentAssignments?.length || 0;
    
    if (totalCount === 0) return 'No students';
    if (gradedCount === totalCount) return 'All graded';
    if (completedCount > 0) return `${completedCount}/${totalCount} completed`;
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'teacher' 
                ? 'View and manage student assignments' 
                : 'Monitor assignments created by teachers'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            {user?.role === 'teacher' && (
              <Link
                to="/create-assignment"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Assignment
              </Link>
            )}
            {user?.role === 'school_admin' && (
              <Link
                to="/student-assignment-management"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Manage Student Assignments
              </Link>
            )}
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-4">
              {user?.role === 'teacher' 
                ? 'No assignments have been created yet' 
                : 'No assignments have been created by teachers yet'
              }
            </p>
            {user?.role === 'teacher' && (
              <Link
                to="/create-assignment"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Assignment
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.class?.name}</div>
                      <div className="text-sm text-gray-500">{assignment.class?.grade}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(assignment)}`}>
                        {getStatusText(assignment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user?.role === 'teacher' && (
                        <Link
                          to={`/assignments/${assignment.id}/review`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Review Submissions
                        </Link>
                      )}
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignmentsPage;