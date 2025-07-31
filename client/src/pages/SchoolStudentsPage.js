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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Students</h1>
          <p className="text-gray-600 mt-2">View all students in your school.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <span className="text-6xl">👥</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No students yet</h3>
            <p className="mt-2 text-gray-500">Students will appear here once they are enrolled.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.parentEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.teacher ? `${student.teacher.first_name} ${student.teacher.last_name}` : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.age || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class?.grade || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!student.parentId && student.parentEmail ? (
                        <button 
                          onClick={() => createParentAccount(student)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Create Parent Login
                        </button>
                      ) : student.parentId ? (
                        <span className="text-green-600">Parent Account Active</span>
                      ) : (
                        <span className="text-gray-400">No Parent Email</span>
                      )}
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

export default SchoolStudentsPage;