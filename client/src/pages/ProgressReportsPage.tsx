import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  class?: {
    name: string;
    grade: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  createdAt: string;
}

interface StudentAssignment {
  id: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'graded';
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  submissions?: any;
  assignment: Assignment;
  student: Child;
}

interface ProgressStats {
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  submissionRate: number;
  mathActivities: number;
  artActivities: number;
  readingActivities: number;
  digitalActivities: number;
  offlineActivities: number;
}

const ProgressReportsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      calculateStats();
    }
  }, [selectedChild, assignments]);

  const fetchData = async () => {
    try {
      const response = await api.get('/parent/assignments');
      const assignmentData = response.data.assignments || [];
      setAssignments(assignmentData);

      // Extract unique children from assignments
      const uniqueChildren = assignmentData.reduce((acc: Child[], assignment: StudentAssignment) => {
        const existingChild = acc.find(child => child.id === assignment.student?.id);
        if (!existingChild && assignment.student) {
          acc.push({
            id: assignment.student.id,
            firstName: assignment.student.firstName,
            lastName: assignment.student.lastName,
            age: assignment.student.age,
            class: assignment.student.class
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

  const calculateStats = () => {
    if (!selectedChild) return;

    const childAssignments = assignments.filter(a => a.student.id === selectedChild.id);
    const completedAssignments = childAssignments.filter(a => a.status === 'submitted' || a.status === 'graded');
    const gradedAssignments = childAssignments.filter(a => a.grade !== null && a.grade !== undefined);

    const averageGrade = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length 
      : 0;

    // Categorize activities by type
    const mathActivities = childAssignments.filter(a => 
      a.assignment.title.toLowerCase().includes('math') || 
      a.assignment.title.toLowerCase().includes('number') ||
      a.assignment.title.toLowerCase().includes('count')
    ).length;

    const artActivities = childAssignments.filter(a => 
      a.assignment.title.toLowerCase().includes('art') || 
      a.assignment.title.toLowerCase().includes('draw') ||
      a.assignment.title.toLowerCase().includes('color')
    ).length;

    const readingActivities = childAssignments.filter(a => 
      a.assignment.title.toLowerCase().includes('read') || 
      a.assignment.title.toLowerCase().includes('story') ||
      a.assignment.title.toLowerCase().includes('letter')
    ).length;

    // Debug: Log submission data to understand structure
    console.log('Submission data examples:', completedAssignments.slice(0, 2).map(a => ({
      title: a.assignment.title,
      submissions: a.submissions,
      hasSubmissions: !!a.submissions,
      status: a.status,
      grade: a.grade
    })));

    // Digital activities are those that were completed/submitted (they have submissions or grades)
    // This includes interactive activities like drawing, coloring, puzzles, etc.
    const digitalActivities = completedAssignments.filter(a => 
      a.status === 'submitted' || a.status === 'graded' || a.grade !== null
    ).length;

    // Offline activities are those that were assigned but not completed
    // This would be traditional worksheets or activities done offline
    const offlineActivities = childAssignments.filter(a => 
      a.status === 'assigned' || a.status === 'in_progress'
    ).length;

    setStats({
      totalAssignments: childAssignments.length,
      completedAssignments: completedAssignments.length,
      averageGrade: Math.round(averageGrade),
      submissionRate: childAssignments.length > 0 ? Math.round((completedAssignments.length / childAssignments.length) * 100) : 0,
      mathActivities,
      artActivities,
      readingActivities,
      digitalActivities,
      offlineActivities
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceEmoji = (rate: number) => {
    if (rate >= 90) return '🌟';
    if (rate >= 80) return '⭐';
    if (rate >= 70) return '👍';
    if (rate >= 60) return '📚';
    return '💪';
  };

  const getPerformanceText = (rate: number) => {
    if (rate >= 90) return 'Outstanding!';
    if (rate >= 80) return 'Excellent Work!';
    if (rate >= 70) return 'Good Progress!';
    if (rate >= 60) return 'Keep Going!';
    return 'Needs Support';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRecentActivities = () => {
    if (!selectedChild) return [];
    return assignments
      .filter(a => a.student.id === selectedChild.id && (a.status === 'submitted' || a.status === 'graded'))
      .sort((a, b) => new Date(b.submittedAt || b.assignment.createdAt).getTime() - new Date(a.submittedAt || a.assignment.createdAt).getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading progress report... 📊</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Progress Report</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); fetchData(); }}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                📊 Progress Report
              </h1>
              <p className="text-purple-100 text-lg">
                See how your little star is shining! ✨
              </p>
            </div>
            <div className="text-6xl opacity-20">🌟</div>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">👶</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-600">Your children haven't been assigned any activities yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Child Selection */}
            {children.length > 1 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Child</h2>
                <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedChild?.id === child.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {child.firstName} {child.lastName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedChild && stats && (
              <>
                {/* Child Info Card */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-white">👶</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedChild.firstName} {selectedChild.lastName}
                      </h2>
                      <p className="text-gray-600">
                        {selectedChild.class?.name || 'No Class'}{selectedChild.age ? ` • ${selectedChild.age} years old` : ''}
                      </p>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        stats.submissionRate >= 80 ? 'bg-green-100 text-green-800' :
                        stats.submissionRate >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getPerformanceEmoji(stats.submissionRate)} {getPerformanceText(stats.submissionRate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Total Activities</p>
                        <p className="text-3xl font-bold">{stats.totalAssignments}</p>
                      </div>
                      <div className="text-4xl">📚</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Completed</p>
                        <p className="text-3xl font-bold">{stats.completedAssignments}</p>
                      </div>
                      <div className="text-4xl">✅</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Completion Rate</p>
                        <p className="text-3xl font-bold">{stats.submissionRate}%</p>
                      </div>
                      <div className="text-4xl">📊</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">Average Grade</p>
                        <p className="text-3xl font-bold">{stats.averageGrade > 0 ? `${stats.averageGrade}%` : 'N/A'}</p>
                      </div>
                      <div className="text-4xl">⭐</div>
                    </div>
                  </div>
                </div>

                {/* Learning Areas */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    🎯 Learning Areas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                      <div className="text-3xl mb-2">🔢</div>
                      <h4 className="font-semibold text-gray-900">Mathematics</h4>
                      <p className="text-2xl font-bold text-red-600">{stats.mathActivities}</p>
                      <p className="text-sm text-gray-600">activities</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="text-3xl mb-2">🎨</div>
                      <h4 className="font-semibold text-gray-900">Arts & Crafts</h4>
                      <p className="text-2xl font-bold text-green-600">{stats.artActivities}</p>
                      <p className="text-sm text-gray-600">activities</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="text-3xl mb-2">📖</div>
                      <h4 className="font-semibold text-gray-900">Reading</h4>
                      <p className="text-2xl font-bold text-blue-600">{stats.readingActivities}</p>
                      <p className="text-sm text-gray-600">activities</p>
                    </div>
                  </div>
                </div>

                {/* Activity Types */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    📱 Activity Types
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="text-4xl mr-4">💻</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Digital Activities</h4>
                        <p className="text-2xl font-bold text-purple-600">{stats.digitalActivities}</p>
                        <p className="text-sm text-gray-600">Interactive online tasks</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="text-4xl mr-4">📝</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Offline Activities</h4>
                        <p className="text-2xl font-bold text-orange-600">{stats.offlineActivities}</p>
                        <p className="text-sm text-gray-600">Hands-on learning tasks</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    🕒 Recent Activities
                  </h3>
                  <div className="space-y-4">
                    {getRecentActivities().length > 0 ? (
                      getRecentActivities().map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">
                              {assignment.status === 'graded' ? '⭐' : '✅'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{assignment.assignment.title}</h4>
                              <p className="text-sm text-gray-600">
                                {assignment.submittedAt ? `Completed on ${formatDate(assignment.submittedAt)}` : 'Recently completed'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {assignment.grade !== null && assignment.grade !== undefined ? (
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(assignment.grade)}`}>
                                {assignment.grade}%
                              </div>
                            ) : (
                              <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Submitted
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-gray-600">No completed activities yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Insights */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    💡 Progress Insights
                  </h3>
                  <div className="space-y-3">
                    {stats.submissionRate >= 80 && (
                      <div className="flex items-center space-x-2 text-green-700">
                        <span className="text-lg">🌟</span>
                        <p>Excellent work! Your child is consistently completing activities.</p>
                      </div>
                    )}
                    {stats.averageGrade >= 85 && (
                      <div className="flex items-center space-x-2 text-blue-700">
                        <span className="text-lg">🏆</span>
                        <p>Outstanding performance with high grades!</p>
                      </div>
                    )}
                    {stats.digitalActivities > stats.offlineActivities && (
                      <div className="flex items-center space-x-2 text-purple-700">
                        <span className="text-lg">💻</span>
                        <p>Great engagement with digital learning activities.</p>
                      </div>
                    )}
                    {stats.mathActivities > 0 && (
                      <div className="flex items-center space-x-2 text-red-700">
                        <span className="text-lg">🔢</span>
                        <p>Building strong mathematical foundations.</p>
                      </div>
                    )}
                    {stats.artActivities > 0 && (
                      <div className="flex items-center space-x-2 text-green-700">
                        <span className="text-lg">🎨</span>
                        <p>Developing creativity through arts and crafts.</p>
                      </div>
                    )}
                    {stats.submissionRate < 50 && (
                      <div className="flex items-center space-x-2 text-orange-700">
                        <span className="text-lg">💪</span>
                        <p>Keep encouraging your child to complete more activities!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressReportsPage;