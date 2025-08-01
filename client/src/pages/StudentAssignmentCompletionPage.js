import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const StudentAssignmentCompletionPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [studentSubmission, setStudentSubmission] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/student`);
      setAssignment(response.data.assignment);
      setStudentSubmission(response.data.studentSubmission || {});
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompletion = (taskId, data) => {
    setStudentSubmission(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...data,
        completedAt: new Date().toISOString()
      }
    }));
  };

  const handleFinishAssignment = async () => {
    setSubmitting(true);
    try {
      await api.post(`/assignments/${assignmentId}/complete`, {
        submissions: studentSubmission
      });
      toast.success('Assignment completed successfully!');
      navigate('/student-assignments');
    } catch (error) {
      console.error('Failed to complete assignment:', error);
      toast.error('Failed to complete assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMaterialTask = (material) => (
    <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
      <p className="text-gray-600 mb-4">{material.description}</p>
      
      {/* Render material content based on elements */}
      {material.elements?.map((element, index) => (
        <div key={index} className="mb-4">
          {element.type === 'drawing-task' && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-2">✏️ {element.content.task}</h4>
              <p className="text-sm text-gray-600 mb-3">{element.content.instructions}</p>
              <canvas
                width={800}
                height={400}
                className="border border-gray-300 rounded w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="mt-2 flex space-x-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  🧽 Eraser
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                  Clear Canvas
                </button>
              </div>
            </div>
          )}
          
          {element.type === 'audio-task' && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-2">🎤 {element.content.task}</h4>
              <p className="text-sm text-gray-600 mb-3">{element.content.instructions}</p>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  🎙️ Start Recording
                </button>
                <span className="text-sm text-gray-500">00:00</span>
              </div>
            </div>
          )}
          
          {element.type === 'image-task' && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-2">📸 {element.content.task}</h4>
              <p className="text-sm text-gray-600 mb-3">{element.content.instructions}</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-500">Click to upload image</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCustomTask = (task) => (
    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 mb-4">{task.instructions}</p>
      
      {task.type === 'draw' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">✏️ Drawing Task</h4>
          <canvas
            width={800}
            height={400}
            className="border border-gray-300 rounded w-full"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="mt-2 flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              🧽 Eraser
            </button>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
              Clear Canvas
            </button>
          </div>
        </div>
      )}
      
      {task.type === 'audio' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">🎤 Audio Task</h4>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              🎙️ Start Recording
            </button>
            <span className="text-sm text-gray-500">00:00</span>
          </div>
        </div>
      )}
      
      {task.type === 'image' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">📸 Image Task</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-500">Click to upload image</p>
            <input type="file" accept="image/*" className="hidden" />
          </div>
        </div>
      )}
    </div>
  );

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
            onClick={() => navigate('/student-assignments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {assignment.instructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">📋 Instructions</h3>
            <p className="text-blue-800">{assignment.instructions}</p>
          </div>
        )}

        <div className="space-y-6">
          {assignment.type === 'material' && assignment.materials?.map(renderMaterialTask)}
          {assignment.type === 'custom' && assignment.customTasks?.map(renderCustomTask)}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
              <p className="text-gray-600 mt-1">Click the button below when you've completed all tasks.</p>
            </div>
            <button
              onClick={handleFinishAssignment}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {submitting ? 'Submitting...' : '✅ Finish Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentCompletionPage; 