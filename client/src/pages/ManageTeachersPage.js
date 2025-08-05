import React, { useState, useEffect } from 'react';
import { schoolAdminService } from '../services/school-admin.service';
import TeacherDetailsModal from '../components/school-admin/TeacherDetailsModal';

const ManageTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await schoolAdminService.getTeachers();
      setTeachers(data.teachers);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      await schoolAdminService.createTeacher(formData);
      setShowCreateModal(false);
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
      fetchTeachers();
      alert('Teacher created successfully!');
    } catch (error) {
      console.error('Failed to create teacher:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to create teacher';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details.join(', ');
      }
      
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleViewDetails = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setShowDetailsModal(true);
  };

  const handleToggleStatus = async (teacherId) => {
    if (!window.confirm('Are you sure you want to toggle this teacher\'s status?')) {
      return;
    }

    try {
      await schoolAdminService.toggleTeacherStatus(teacherId);
      fetchTeachers(); // Refresh the list
      alert('Teacher status updated successfully!');
    } catch (error) {
      console.error('Failed to toggle teacher status:', error);
      alert('Failed to update teacher status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                👨🏫 Manage Teachers
              </h1>
              <p className="text-blue-100 text-lg">
                Add and manage teachers in your school
              </p>
            </div>
            <div className="text-6xl opacity-20">🎓</div>
          </div>
        </div>

        {/* Add Teacher Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            ➕ Add Teacher
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading teachers... 👨🏫</p>
            </div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👨🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers yet</h3>
            <p className="text-gray-600">Teachers will appear here once they are added to your school.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">👨🏫</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      teacher.isActive 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }`}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📧 {teacher.email}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>📅 Joined {new Date(teacher.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(teacher.id)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center text-sm font-medium"
                    >
                      👁️ View Details
                    </button>
                    <button
                      onClick={() => handleToggleStatus(teacher.id)}
                      className={`flex-1 px-4 py-2 rounded-lg text-center text-sm font-medium transition-all duration-200 ${
                        teacher.isActive 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      }`}
                    >
                      {teacher.isActive ? '❌ Deactivate' : '✅ Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Teacher Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">👨🏫 Add New Teacher</h2>
              <form onSubmit={handleCreateTeacher}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Create Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teacher Details Modal */}
        <TeacherDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTeacherId(null);
            fetchTeachers(); // Refresh list in case changes were made
          }}
          teacherId={selectedTeacherId}
        />
      </div>
    </div>
  );
};

export default ManageTeachersPage;