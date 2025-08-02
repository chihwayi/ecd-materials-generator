import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface SimpleUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  type: string;
  materials?: any;
  customTasks?: any;
}

interface StudentAssignment {
  id: string;
  studentId: string;
  assignmentId: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'completed' | 'graded';
  submittedAt?: string;
  grade?: number;
  gradedAt?: string;
  parentViewed: boolean;
  assignment: Assignment;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    class?: {
      name: string;
      grade: string;
    };
  };
}

const ParentAssignmentsPage: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'graded'>('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/parent/assignments');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      // Return empty array instead of mock data
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-orange-100 text-orange-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return '📝 Assigned';
      case 'in_progress': return '⏳ In Progress';
      case 'submitted': return '📤 Submitted (Waiting for Grade)';
      case 'completed': return '✅ Completed';
      case 'graded': return '⭐ Graded';
      default: return '📋 Unknown';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    switch (filter) {
      case 'pending':
        return assignment.status === 'assigned' || assignment.status === 'in_progress';
      case 'completed':
        return assignment.status === 'submitted';
      case 'graded':
        return assignment.status === 'graded';
      default:
        return true;
    }
  });

  const pendingGrading = assignments.filter(a => a.status === 'submitted').length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'graded').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments... 📚</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-xl shadow-lg p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          Assignments Dashboard 📚
        </h1>
        <p className="text-lg text-white/90">
          Track your children's learning progress and completed work! ✨
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Assignments</p>
              <p className="text-3xl font-bold">{totalAssignments}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Waiting for Grade</p>
              <p className="text-3xl font-bold">{pendingGrading}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold">{completedAssignments}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({totalAssignments})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({assignments.filter(a => a.status === 'assigned' || a.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Waiting for Grade ({pendingGrading})
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'graded' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Graded ({completedAssignments})
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{assignment.assignment.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {getStatusText(assignment.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="text-lg">👶</span>
                      {assignment.student.firstName} {assignment.student.lastName}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-lg">🏫</span>
                      {assignment.student.class?.name || 'No Class'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-lg">📅</span>
                      Due: {formatDate(assignment.assignment.dueDate)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{assignment.assignment.description}</p>
                  
                  {/* Assignment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{assignment.assignment.type}</span>
                      </div>
                      
                      {assignment.submittedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">{formatDate(assignment.submittedAt)}</span>
                        </div>
                      )}
                      
                      {assignment.gradedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Graded:</span>
                          <span className="font-medium">{formatDate(assignment.gradedAt)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {assignment.grade !== null && assignment.grade !== undefined ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Grade:</span>
                          <span className={`font-bold text-lg ${getGradeColor(assignment.grade)}`}>
                            {assignment.grade}%
                          </span>
                        </div>
                      ) : assignment.status === 'submitted' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium text-yellow-600">⏳ Waiting for teacher to grade</span>
                        </div>
                      ) : null}
                      
                      {!assignment.parentViewed && assignment.status === 'graded' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Viewed:</span>
                          <span className="font-medium text-blue-600">🆕 New grade!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">
              {filter === 'all' ? '📚' : 
               filter === 'pending' ? '⏳' : 
               filter === 'completed' ? '📤' : '✅'}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {filter === 'all' ? 'No Assignments Yet' : 
               filter === 'pending' ? 'No Pending Assignments' : 
               filter === 'completed' ? 'No Assignments Waiting for Grade' : 'No Graded Assignments'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Your children will see assignments here once they are assigned.' : 
               filter === 'pending' ? 'All assignments are either completed or in progress!' : 
               filter === 'completed' ? 'No assignments are currently waiting for teacher grading.' : 'No assignments have been graded yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentAssignmentsPage; 