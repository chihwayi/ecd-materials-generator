import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const TeacherAssignmentReviewPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});

  useEffect(() => {
    fetchAssignmentSubmissions();
  }, [assignmentId]);

  const fetchAssignmentSubmissions = async () => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      setAssignment(response.data.assignment);
      setStudentSubmissions(response.data.submissions);
    } catch (error) {
      console.error('Failed to fetch assignment submissions:', error);
      toast.error('Failed to load assignment submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (studentAssignmentId, grade, feedback) => {
    setGrading(prev => ({ ...prev, [studentAssignmentId]: true }));
    try {
      await api.post(`/assignments/grade/${studentAssignmentId}`, {
        grade,
        feedback
      });
      toast.success('Assignment graded successfully!');
      fetchAssignmentSubmissions(); // Refresh data
    } catch (error) {
      console.error('Failed to grade assignment:', error);
      toast.error('Failed to grade assignment');
    } finally {
      setGrading(prev => ({ ...prev, [studentAssignmentId]: false }));
    }
  };

  const renderSubmissionContent = (submission) => {
    if (!submission.submissions) return null;

    return Object.entries(submission.submissions).map(([taskId, taskData]) => (
      <div key={taskId} className="border border-gray-200 rounded-lg p-4 mb-3">
        <h4 className="font-medium text-gray-900 mb-2">Task {taskId}</h4>
        
        {taskData.type === 'draw' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Drawing Submission</p>
            {taskData.canvasData && (
              <img 
                src={taskData.canvasData} 
                alt="Student drawing" 
                className="max-w-full h-auto border border-gray-300 rounded"
              />
            )}
          </div>
        )}
        
        {taskData.type === 'audio' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Audio Recording</p>
            {taskData.audioUrl && (
              <audio controls className="w-full">
                <source src={taskData.audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
        
        {taskData.type === 'image' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Image Upload</p>
            {taskData.imageUrl && (
              <img 
                src={taskData.imageUrl} 
                alt="Student uploaded image" 
                className="max-w-full h-auto border border-gray-300 rounded"
              />
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          Completed: {new Date(taskData.completedAt).toLocaleString()}
        </div>
      </div>
    ));
  };

  const renderGradingForm = (submission) => {
    const [grade, setGrade] = useState(submission.grade || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');

    return (
      <div className="border border-gray-200 rounded-lg p-4 mt-3">
        <h4 className="font-medium text-gray-900 mb-3">Grade & Feedback</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Select Grade</option>
              <option value="A">A (Excellent)</option>
              <option value="B">B (Good)</option>
              <option value="C">C (Satisfactory)</option>
              <option value="D">D (Needs Improvement)</option>
              <option value="F">F (Unsatisfactory)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-sm">
              {submission.status === 'completed' && (
                <span className="text-green-600">✅ Completed</span>
              )}
              {submission.status === 'graded' && (
                <span className="text-blue-600">📝 Graded</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows="3"
            placeholder="Provide constructive feedback..."
          />
        </div>
        
        <button
          onClick={() => handleGradeSubmission(submission.id, grade, feedback)}
          disabled={grading[submission.id] || !grade}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {grading[submission.id] ? 'Grading...' : 'Save Grade'}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/assignments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const completedSubmissions = studentSubmissions.filter(s => s.status === 'completed');
  const gradedSubmissions = studentSubmissions.filter(s => s.status === 'graded');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
              <p className="text-gray-600 mt-2">{assignment.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Due Date</div>
              <div className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{studentSubmissions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{completedSubmissions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Graded:</span>
                <span className="font-medium text-blue-600">{gradedSubmissions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-orange-600">
                  {studentSubmissions.length - completedSubmissions.length - gradedSubmissions.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Assignment Type</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{assignment.type}</span>
              </div>
              {assignment.type === 'material' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Materials:</span>
                  <span className="font-medium">{assignment.materials?.length || 0}</span>
                </div>
              )}
              {assignment.type === 'custom' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks:</span>
                  <span className="font-medium">{assignment.customTasks?.length || 0}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">
                  {studentSubmissions.length > 0 
                    ? Math.round((completedSubmissions.length / studentSubmissions.length) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grading Rate:</span>
                <span className="font-medium">
                  {completedSubmissions.length > 0 
                    ? Math.round((gradedSubmissions.length / completedSubmissions.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Student Submissions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {studentSubmissions.map((submission) => (
              <div key={submission.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {submission.student.firstName} {submission.student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted: {submission.completedAt ? new Date(submission.completedAt).toLocaleString() : 'Not submitted'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      submission.status === 'completed' ? 'bg-green-100 text-green-800' :
                      submission.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {submission.status === 'completed' ? '✅ Completed' :
                       submission.status === 'graded' ? '📝 Graded' :
                       '⏳ Pending'}
                    </span>
                    {submission.grade && (
                      <div className="mt-1 text-sm font-medium text-gray-900">
                        Grade: {submission.grade}
                      </div>
                    )}
                  </div>
                </div>

                {submission.status === 'completed' && renderSubmissionContent(submission)}
                {submission.status === 'completed' && renderGradingForm(submission)}
                
                {submission.status === 'graded' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">📝 Teacher Feedback</h4>
                    <p className="text-blue-800">{submission.feedback}</p>
                    <div className="mt-2 text-sm text-blue-600">
                      Graded on: {new Date(submission.gradedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentReviewPage; 