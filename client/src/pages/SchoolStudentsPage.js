import React, { useState, useEffect } from 'react';
import { schoolAdminService } from '../services/school-admin.service';
import api from '../services/api';

const SchoolStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await schoolAdminService.getAllStudents();
      setStudents(data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const createParentAccount = async (student) => {
    if (!student.parentEmail) {
      alert('No parent email available for this student');
      return;
    }

    try {
      const response = await api.post(`/students/${student.id}/create-parent`, {
        parentName: student.parentName,
        parentEmail: student.parentEmail,
        parentPhone: student.parentPhone
      });

      if (response.data.parentCredentials) {
        alert(`Parent account created successfully!\n\nLogin Credentials:\nEmail: ${response.data.parentCredentials.email}\nPassword: ${response.data.parentCredentials.password}\n\nPlease share these credentials securely with the parent.`);
        fetchStudents(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create parent account:', error);
      alert('Failed to create parent account');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 All Students</h1>
              <p className="text-indigo-100 text-lg">View and manage all students in your school</p>
            </div>
            <div className="text-6xl opacity-20">🎓</div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students yet</h3>
            <p className="text-gray-600">Students will appear here once they are enrolled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">👤</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.isActive 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {student.firstName} {student.lastName}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📧 {student.parentEmail || 'No email'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>👨‍🏫 {student.assignedTeacher ? `${student.assignedTeacher.firstName} ${student.assignedTeacher.lastName}` : 'Unassigned'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>🎂 {student.age || 'N/A'} years</span>
                      <span>📚 {student.class?.grade || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => createParentAccount(student)}
                      disabled={!student.parentEmail}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      👨‍👩‍👧‍👦 Create Parent Account
                    </button>
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

export default SchoolStudentsPage;