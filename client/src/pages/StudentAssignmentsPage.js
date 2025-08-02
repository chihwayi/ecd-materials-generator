import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentAssignmentsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    // Store studentId in localStorage for use in assignment completion
    localStorage.setItem('currentStudentId', studentId);
    fetchAssignments();
  }, [studentId]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignments/student/${studentId}`);
      console.log('Assignments response:', response.data);
      
      // Debug each assignment
      response.data.assignments.forEach((assignment, index) => {
        console.log(`Assignment ${index + 1}:`, assignment.assignment);
        console.log(`Assignment ${index + 1} type:`, assignment.assignment.type);
        console.log(`Assignment ${index + 1} materials:`, assignment.assignment.materials);
        console.log(`Assignment ${index + 1} customTasks:`, assignment.assignment.customTasks);
      });
      
      setAssignments(response.data.assignments);
      if (response.data.assignments.length > 0) {
        setStudent(response.data.assignments[0].student);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (assignmentId) => {
    try {
      await api.post(`/assignments/submit/${assignmentId}`, {
        studentId,
        submissionText
      });
      setSubmissionText('');
      setSelectedAssignment(null);
      fetchAssignments();
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasInteractiveElements = (assignment) => {
    console.log('Checking assignment for interactive elements:', assignment);
    
    if (assignment.type === 'material' && assignment.materials) {
      console.log('Assignment materials:', assignment.materials);
      
      // Handle materials that might be JSON strings, arrays of IDs, or full objects
      let materials = assignment.materials;
      if (typeof materials === 'string') {
        try {
          materials = JSON.parse(materials);
        } catch (e) {
          console.log('Failed to parse materials JSON:', e);
          materials = [];
        }
      }
      
      // If materials is an array of IDs (strings), we can't check elements yet
      if (Array.isArray(materials) && materials.length > 0 && typeof materials[0] === 'string') {
        console.log('Materials are IDs, assuming interactive for material-based assignments');
        return true; // Assume material-based assignments are interactive
      }
      
      // If materials are full objects, check their elements
      const hasInteractive = materials.some(material => {
        console.log('Material:', material);
        return material.elements && material.elements.some(element => {
          console.log('Element:', element);
          return ['drawing-task', 'audio-task', 'image-task', 'drawing-canvas', 'question'].includes(element.type);
        });
      });
      console.log('Has interactive elements:', hasInteractive);
      return hasInteractive;
    }
    if (assignment.type === 'custom' && assignment.customTasks) {
      console.log('Assignment custom tasks:', assignment.customTasks);
      
      // Handle customTasks that might be JSON strings
      let customTasks = assignment.customTasks;
      if (typeof customTasks === 'string') {
        try {
          customTasks = JSON.parse(customTasks);
        } catch (e) {
          console.log('Failed to parse customTasks JSON:', e);
          customTasks = [];
        }
      }
      
      const hasInteractive = customTasks.some(task => 
        ['draw', 'audio', 'image'].includes(task.type)
      );
      console.log('Has interactive custom tasks:', hasInteractive);
      return hasInteractive;
    }
    console.log('No interactive elements found');
    return false;
  };

  const handleStartAssignment = (studentAssignment) => {
    console.log('Starting assignment:', studentAssignment.assignment);
    console.log('Assignment type:', studentAssignment.assignment.type);
    console.log('Assignment materials:', studentAssignment.assignment.materials);
    console.log('Assignment customTasks:', studentAssignment.assignment.customTasks);
    
    const isInteractive = hasInteractiveElements(studentAssignment.assignment);
    console.log('Is interactive:', isInteractive);
    
    if (isInteractive) {
      // Navigate to interactive completion page with studentId
      console.log('Navigating to interactive completion page');
      navigate(`/assignments/${studentAssignment.assignment.id}/complete?studentId=${studentId}`);
    } else {
      // Show text submission for simple assignments
      console.log('Showing text submission form');
      setSelectedAssignment(studentAssignment.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Separate assignments by status
  const pendingAssignments = assignments.filter(sa => sa.status === 'assigned');
  const completedAssignments = assignments.filter(sa => sa.status === 'completed');
  const overdueAssignments = assignments.filter(sa => {
    const dueDate = new Date(sa.assignment.dueDate);
    const now = new Date();
    return sa.status !== 'completed' && dueDate < now;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {student?.firstName} {student?.lastName}'s Assignments
              </h1>
              <p className="text-gray-600 mt-2">
                Complete your assignments and track your progress
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
              <div className="text-sm text-gray-500">Total Assignments</div>
            </div>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">📝</span>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No assignments yet</h2>
            <p className="mt-2 text-gray-600">
              Your teacher will assign homework here. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overdue Assignments */}
            {overdueAssignments.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">⚠️</span>
                  <h2 className="text-xl font-semibold text-red-600">Overdue Assignments</h2>
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {overdueAssignments.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {overdueAssignments.map((studentAssignment) => (
                    <div key={studentAssignment.id} className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {studentAssignment.assignment.title}
                            </h3>
                            <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              OVERDUE
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {studentAssignment.assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-red-600">
                            <span>Due: {new Date(studentAssignment.assignment.dueDate).toLocaleDateString()}</span>
                            <span>Was due {Math.ceil((new Date() - new Date(studentAssignment.assignment.dueDate)) / (1000 * 60 * 60 * 24))} days ago</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStartAssignment(studentAssignment)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                          🚨 Complete Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Assignments */}
            {pendingAssignments.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">📝</span>
                  <h2 className="text-xl font-semibold text-blue-600">Pending Assignments</h2>
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {pendingAssignments.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingAssignments.map((studentAssignment) => (
                    <div key={studentAssignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {studentAssignment.assignment.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {studentAssignment.assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Due: {new Date(studentAssignment.assignment.dueDate).toLocaleDateString()}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              PENDING
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStartAssignment(studentAssignment)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            hasInteractiveElements(studentAssignment.assignment)
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {hasInteractiveElements(studentAssignment.assignment) ? (
                            <>
                              🎨 Start Interactive Assignment
                              <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                                Drawing • Audio • Images
                              </span>
                            </>
                          ) : (
                            'Start Assignment'
                          )}
                        </button>
                        {hasInteractiveElements(studentAssignment.assignment) && (
                          <span className="text-xs text-gray-500 flex items-center">
                            ✨ Interactive elements included
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Assignments */}
            {completedAssignments.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">✅</span>
                  <h2 className="text-xl font-semibold text-green-600">Completed Assignments</h2>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {completedAssignments.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {completedAssignments.map((studentAssignment) => (
                    <div key={studentAssignment.id} className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {studentAssignment.assignment.title}
                            </h3>
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              COMPLETED
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {studentAssignment.assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Status: {
                              studentAssignment.status === 'completed' 
                                ? (studentAssignment.submittedAt 
                                    ? `Submitted on ${new Date(studentAssignment.submittedAt).toLocaleDateString()}` 
                                    : 'Marked as completed')
                                : studentAssignment.status === 'submitted'
                                ? (studentAssignment.submittedAt 
                                    ? `Submitted on ${new Date(studentAssignment.submittedAt).toLocaleDateString()}` 
                                    : 'Submitted')
                                : (studentAssignment.submittedAt 
                                    ? `Submitted on ${new Date(studentAssignment.submittedAt).toLocaleDateString()}` 
                                    : 'Not submitted yet')
                            }</span>
                            {studentAssignment.grade !== null && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Grade: {studentAssignment.grade}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {studentAssignment.grade !== null ? (
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${studentAssignment.grade >= 80 ? 'text-green-600' : studentAssignment.grade >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {studentAssignment.grade}%
                              </div>
                              <div className="text-sm text-gray-500">Grade</div>
                            </div>
                          ) : studentAssignment.status === 'completed' ? (
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Completed</div>
                              <div className="text-sm text-gray-400">Awaiting grade</div>
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Status</div>
                              <div className="text-sm text-gray-400">{studentAssignment.status}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      {studentAssignment.feedback && (
                        <div className="mt-4 p-3 bg-white rounded border border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-1">Teacher Feedback:</div>
                          <p className="text-sm text-gray-600">{studentAssignment.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Submission Modal */}
            {selectedAssignment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">Submit Assignment</h3>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your answer or response..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                  />
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleSubmit(selectedAssignment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Submit Assignment
                    </button>
                    <button
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;