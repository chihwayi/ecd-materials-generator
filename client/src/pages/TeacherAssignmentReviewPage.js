import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const TeacherAssignmentReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'completed', 'graded', 'pending'
  const [grades, setGrades] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  // Convert numeric grade to letter grade for display
  const getLetterGrade = (numericGrade) => {
    if (!numericGrade) return '';
    if (numericGrade >= 90) return 'A';
    if (numericGrade >= 80) return 'B';
    if (numericGrade >= 70) return 'C';
    if (numericGrade >= 60) return 'D';
    return 'F';
  };

  useEffect(() => {
    fetchAssignmentSubmissions();
  }, [id]);

  const fetchAssignmentSubmissions = async () => {
    try {
      const response = await api.get(`/assignments/${id}/submissions`);
      console.log('Assignment submissions response:', response.data);
      setStudentSubmissions(response.data.submissions);
      
      // Always fetch full assignment details with materials
      try {
        const assignmentResponse = await api.get(`/assignments/${id}`);
        console.log('Full assignment response:', assignmentResponse.data);
        setAssignment(assignmentResponse.data);
      } catch (error) {
        console.error('Failed to fetch full assignment details:', error);
        // Fallback to assignment from submissions response
        setAssignment(response.data.assignment);
      }
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

  const getFilteredSubmissions = () => {
    switch (activeTab) {
      case 'completed':
        return studentSubmissions.filter(s => s.status === 'completed' || s.status === 'submitted');
      case 'graded':
        return studentSubmissions.filter(s => s.status === 'graded');
      case 'pending':
        return studentSubmissions.filter(s => s.status === 'pending' || s.status === 'assigned');
      default:
        return studentSubmissions;
    }
  };

  const renderSubmissionContent = (submission) => {
    console.log('Submission data:', submission);
    console.log('Submissions object:', submission.submissions);
    
    if (!submission.submissions || Object.keys(submission.submissions).length === 0) {
      console.log('No submissions object found or empty');
      return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-3">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-yellow-600 mr-2">📝</span>
            Student Work
          </h4>
          <p className="text-gray-600">No detailed submission data available</p>
        </div>
      );
    }

    // Handle object structure where keys are element IDs
    return Object.entries(submission.submissions).map(([elementId, taskData]) => (
      <div key={elementId} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-3">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-blue-600 mr-2">📋</span>
          Task {elementId}
        </h4>
        {renderTaskContent(taskData, elementId)}
      </div>
    ));
  };

  const renderTaskContent = (taskData, elementId) => {
    console.log('Task data:', taskData);
    console.log('Assignment data:', assignment);
    console.log('Assignment materials:', assignment?.materials);
    
    // Get the question content from assignment materials
    const getQuestionContent = (elementId) => {
      if (!assignment?.materials) {
        console.log('No materials found in assignment');
        return null;
      }
      
      console.log('Looking for element ID:', elementId);
      console.log('Materials array:', assignment.materials);
      
      for (const material of assignment.materials) {
        console.log('Checking material:', material);
        if (material.elements) {
          console.log('Material elements:', material.elements);
          const element = material.elements.find(el => el.id === elementId);
          if (element) {
            console.log('Found element:', element);
            return element;
          }
        }
      }
      console.log('Element not found');
      return null;
    };

    const questionContent = getQuestionContent(elementId);
    console.log('Question content:', questionContent);
    
    // Handle drawing/canvas data
    if (taskData.canvasData) {
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-2">🎨</span>
            Drawing Submission
          </p>
          {questionContent && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Task:</p>
              <p className="text-gray-700">{questionContent.content?.task || questionContent.content?.question || 'Drawing task'}</p>
              {questionContent.content?.instructions && (
                <p className="text-gray-600 text-sm mt-1">{questionContent.content.instructions}</p>
              )}
            </div>
          )}
          <img 
            src={taskData.canvasData} 
            alt="Student drawing" 
            className="max-w-full h-auto border border-blue-300 rounded-lg shadow-sm"
          />
          {taskData.completedAt && (
            <div className="text-xs text-gray-500 mt-3 flex items-center">
              <span className="mr-2">⏰</span>
              Completed: {new Date(taskData.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    
    // Handle audio recording
    if (taskData.audioData) {
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-2">🎤</span>
            Audio Recording
          </p>
          {questionContent && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Task:</p>
              <p className="text-gray-700">{questionContent.content?.task || questionContent.content?.question || 'Audio recording task'}</p>
              {questionContent.content?.instructions && (
                <p className="text-gray-600 text-sm mt-1">{questionContent.content.instructions}</p>
              )}
            </div>
          )}
          <audio controls className="w-full">
            <source src={taskData.audioData} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          {taskData.completedAt && (
            <div className="text-xs text-gray-500 mt-3 flex items-center">
              <span className="mr-2">⏰</span>
              Completed: {new Date(taskData.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    
    // Handle image upload
    if (taskData.imageData) {
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-2">📷</span>
            Image Upload
          </p>
          {questionContent && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Task:</p>
              <p className="text-gray-700">{questionContent.content?.task || questionContent.content?.question || 'Image upload task'}</p>
              {questionContent.content?.instructions && (
                <p className="text-gray-600 text-sm mt-1">{questionContent.content.instructions}</p>
              )}
            </div>
          )}
          <img 
            src={taskData.imageData} 
            alt="Student uploaded image" 
            className="max-w-full h-auto border border-blue-300 rounded-lg shadow-sm"
          />
          {taskData.fileName && (
            <p className="text-xs text-gray-500 mt-2">File: {taskData.fileName}</p>
          )}
          {taskData.completedAt && (
            <div className="text-xs text-gray-500 mt-3 flex items-center">
              <span className="mr-2">⏰</span>
              Completed: {new Date(taskData.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      );
    }

    // Handle text answer
    if (taskData.answer || taskData.text || taskData.content) {
      // Check if this is a question with a correct answer
      const correctAnswerIndex = questionContent?.content?.correct;
      const options = questionContent?.content?.options;
      const correctAnswer = correctAnswerIndex !== undefined && options 
        ? options[correctAnswerIndex] 
        : questionContent?.content?.correctAnswer || questionContent?.content?.answer || questionContent?.correctAnswer;
      const studentAnswer = taskData.answer || taskData.text || taskData.content;
      
      console.log('Question content structure:', questionContent);
      console.log('Correct answer index:', correctAnswerIndex);
      console.log('Options:', options);
      console.log('Correct answer:', correctAnswer);
      console.log('Student answer:', studentAnswer);
      
      const isCorrect = correctAnswer && studentAnswer && 
                       studentAnswer.toString().toLowerCase().trim() === correctAnswer.toString().toLowerCase().trim();
      
      console.log('Is correct:', isCorrect);
      
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-2">📝</span>
            Text Answer
          </p>
          {questionContent && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Question:</p>
              <p className="text-gray-700">{questionContent.content?.question || questionContent.content?.task || 'Text question'}</p>
              {questionContent.content?.instructions && (
                <p className="text-gray-600 text-sm mt-1">{questionContent.content.instructions}</p>
              )}
              {correctAnswer && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">Correct Answer: {correctAnswer}</p>
                </div>
              )}
              {/* Debug: Show full question content structure */}
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">Debug: Question Content Structure</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(questionContent, null, 2)}
                </pre>
              </details>
            </div>
          )}
          <div className={`p-3 rounded-lg border ${
            correctAnswer 
              ? (isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200')
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-800">Student's Answer:</p>
              {correctAnswer && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              )}
            </div>
            <p className={`text-lg font-medium ${
              correctAnswer 
                ? (isCorrect ? 'text-green-800' : 'text-red-800')
                : 'text-gray-800'
            }`}>
              {studentAnswer}
            </p>
          </div>
          {taskData.completedAt && (
            <div className="text-xs text-gray-500 mt-3 flex items-center">
              <span className="mr-2">⏰</span>
              Completed: {new Date(taskData.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      );
    }

    // Handle multiple choice answer with auto-marking
    if (taskData.selectedAnswer !== undefined) {
      const correctAnswerIndex = questionContent?.content?.correct;
      const isCorrect = correctAnswerIndex !== undefined && 
                       taskData.selectedAnswer === correctAnswerIndex;
      
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <span className="mr-2">✅</span>
            Multiple Choice Answer
          </p>
          {questionContent && (
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Question:</p>
              <p className="text-gray-700">{questionContent.content?.question || 'Multiple choice question'}</p>
              {questionContent.content?.options && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-800 mb-1">Options:</p>
                  <div className="space-y-1">
                    {questionContent.content.options.map((option, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                          index === taskData.selectedAnswer 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200'
                        }`}>
                          {index === taskData.selectedAnswer ? '✓' : ''}
                        </span>
                        <span className={`${
                          index === taskData.selectedAnswer 
                            ? 'font-medium' 
                            : ''
                        }`}>
                          {option}
                        </span>
                        {correctAnswerIndex !== undefined && (
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${
                            index === correctAnswerIndex
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {index === correctAnswerIndex ? 'Correct' : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-800">
                Selected Answer: {questionContent?.content?.options?.[taskData.selectedAnswer] || taskData.selectedAnswer}
              </p>
              {correctAnswerIndex !== undefined && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
              )}
            </div>
            {taskData.answer && (
              <p className="text-gray-600 text-sm mt-1">Answer: {taskData.answer}</p>
            )}
          </div>
          {taskData.completedAt && (
            <div className="text-xs text-gray-500 mt-3 flex items-center">
              <span className="mr-2">⏰</span>
              Completed: {new Date(taskData.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      );
    }

    // Generic fallback for any other data
    return (
      <div>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <span className="mr-2">📄</span>
          Student Work
        </p>
        {questionContent && (
          <div className="bg-gray-50 p-3 rounded-lg mb-3">
            <p className="text-sm font-medium text-gray-800 mb-1">Task:</p>
            <p className="text-gray-700">{questionContent.content?.question || questionContent.content?.task || 'Task'}</p>
            {questionContent.content?.instructions && (
              <p className="text-gray-600 text-sm mt-1">{questionContent.content.instructions}</p>
            )}
          </div>
        )}
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(taskData, null, 2)}
          </pre>
        </div>
        {taskData.completedAt && (
          <div className="text-xs text-gray-500 mt-3 flex items-center">
            <span className="mr-2">⏰</span>
            Completed: {new Date(taskData.completedAt).toLocaleString()}
          </div>
        )}
      </div>
    );
  };

  const renderGradingForm = (submission) => {
    const grade = grades[submission.id] || submission.grade || '';
    const feedback = feedbacks[submission.id] || submission.feedback || '';

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mt-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-green-600 mr-2">📝</span>
          Grade & Feedback
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrades(prev => ({ ...prev, [submission.id]: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="px-4 py-3 bg-green-100 rounded-lg text-sm">
              <span className="text-green-700 font-medium">✅ Ready for Grading</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedbacks(prev => ({ ...prev, [submission.id]: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows="4"
            placeholder="Provide constructive feedback..."
          />
        </div>
        
        <button
          onClick={() => handleGradeSubmission(submission.id, grade, feedback)}
          disabled={grading[submission.id] || !grade}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {grading[submission.id] ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Grading...
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">💾</span>
              Save Grade
            </div>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-6">The assignment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/assignments')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
          >
            ← Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  const completedSubmissions = studentSubmissions.filter(s => s.status === 'completed' || s.status === 'submitted');
  const gradedSubmissions = studentSubmissions.filter(s => s.status === 'graded');
  const pendingSubmissions = studentSubmissions.filter(s => s.status === 'pending' || s.status === 'assigned');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => navigate('/assignments')}
                  className="mr-4 text-blue-100 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <h1 className="text-3xl font-bold">{assignment.title}</h1>
              </div>
              <p className="text-blue-100 text-lg mb-4">{assignment.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  {studentSubmissions.length} Students
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  {assignment.type} Assignment
                </div>
              </div>
            </div>
            <div className="text-6xl opacity-20">📝</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{studentSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Graded</p>
                <p className="text-3xl font-bold text-blue-600">{gradedSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{pendingSubmissions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Students', count: studentSubmissions.length, icon: '👥' },
                { key: 'completed', label: 'Ready to Grade', count: completedSubmissions.length, icon: '✅' },
                { key: 'graded', label: 'Graded', count: gradedSubmissions.length, icon: '📝' },
                { key: 'pending', label: 'Pending', count: pendingSubmissions.length, icon: '⏳' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {getFilteredSubmissions().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">
                  {activeTab === 'all' && 'No students have been assigned to this assignment yet.'}
                  {activeTab === 'completed' && 'No students have completed this assignment yet.'}
                  {activeTab === 'graded' && 'No assignments have been graded yet.'}
                  {activeTab === 'pending' && 'All students have either completed or been graded.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {getFilteredSubmissions().map((submission) => (
                  <div key={submission.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {submission.student?.firstName} {submission.student?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="mr-4">📧 {submission.student?.email}</span>
                          <span>📅 Class: {submission.student?.class?.name}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {submission.completedAt 
                            ? `Submitted: ${new Date(submission.completedAt).toLocaleString()}`
                            : 'Not submitted yet'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          submission.status === 'completed' || submission.status === 'submitted' 
                            ? 'bg-green-100 text-green-800' :
                          submission.status === 'graded' 
                            ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {submission.status === 'completed' || submission.status === 'submitted' ? '✅ Ready to Grade' :
                           submission.status === 'graded' ? '📝 Graded' :
                           '⏳ Pending'}
                        </span>
                        {submission.grade && (
                          <div className="mt-2 text-sm font-bold text-gray-900">
                            Grade: {getLetterGrade(submission.grade)}
                          </div>
                        )}
                      </div>
                    </div>

                    {(submission.status === 'completed' || submission.status === 'submitted') && renderSubmissionContent(submission)}
                    {(submission.status === 'completed' || submission.status === 'submitted') && renderGradingForm(submission)}
                    
                    {submission.status === 'graded' && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                          <span className="text-blue-600 mr-2">📝</span>
                          Teacher Feedback
                        </h4>
                        {submission.grade && (
                          <div className="mb-3">
                            <span className="inline-flex px-3 py-1 text-sm font-bold rounded-full bg-blue-100 text-blue-800">
                              Grade: {getLetterGrade(submission.grade)}
                            </span>
                          </div>
                        )}
                        <p className="text-blue-800 mb-3">{submission.feedback}</p>
                        <div className="text-sm text-blue-600 flex items-center">
                          <span className="mr-2">⏰</span>
                          Graded on: {new Date(submission.gradedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentReviewPage; 