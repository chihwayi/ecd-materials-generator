import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const StudentAssignmentsPage = () => {
  const { studentId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [studentId]);

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignments/student/${studentId}`);
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
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {student?.first_name} {student?.last_name}'s Assignments
          </h1>
          <p className="text-gray-600 mt-2">View and submit homework assignments</p>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600">Check back later for new assignments from teachers</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((studentAssignment) => (
              <div key={studentAssignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {studentAssignment.assignment.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {studentAssignment.assignment.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Teacher: {studentAssignment.assignment.teacher?.firstName} {studentAssignment.assignment.teacher?.lastName}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(studentAssignment.status)}`}>
                    {studentAssignment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {studentAssignment.assignment.instructions && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                    <p className="text-blue-800">{studentAssignment.assignment.instructions}</p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Due: {new Date(studentAssignment.assignment.dueDate).toLocaleDateString()}</span>
                  {studentAssignment.submittedAt && (
                    <span>Submitted: {new Date(studentAssignment.submittedAt).toLocaleDateString()}</span>
                  )}
                </div>

                {studentAssignment.status === 'assigned' && (
                  <div className="mt-4">
                    {selectedAssignment === studentAssignment.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg"
                          rows="4"
                          placeholder="Enter your answer or response here..."
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleSubmit(studentAssignment.assignment.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            disabled={!submissionText.trim()}
                          >
                            Submit Assignment
                          </button>
                          <button
                            onClick={() => setSelectedAssignment(null)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(studentAssignment.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Start Assignment
                      </button>
                    )}
                  </div>
                )}

                {studentAssignment.submissionText && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Your Submission:</h4>
                    <p className="text-gray-700">{studentAssignment.submissionText}</p>
                  </div>
                )}

                {studentAssignment.status === 'graded' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-green-900">Teacher Feedback:</h4>
                      {studentAssignment.grade && (
                        <span className="text-lg font-bold text-green-800">
                          Grade: {studentAssignment.grade}%
                        </span>
                      )}
                    </div>
                    {studentAssignment.feedback && (
                      <p className="text-green-800">{studentAssignment.feedback}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentsPage;