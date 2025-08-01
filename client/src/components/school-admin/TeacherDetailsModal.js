import React, { useState, useEffect } from 'react';
import { schoolAdminService } from '../../services/school-admin.service';

const TeacherDetailsModal = ({ isOpen, onClose, teacherId }) => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    language: 'en'
  });

  useEffect(() => {
    if (isOpen && teacherId) {
      fetchTeacherDetails();
    }
  }, [isOpen, teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await schoolAdminService.getTeacherById(teacherId);
      setTeacher(response.teacher);
      setFormData({
        firstName: response.teacher.firstName,
        lastName: response.teacher.lastName,
        email: response.teacher.email,
        phoneNumber: response.teacher.phoneNumber || '',
        language: response.teacher.language
      });
    } catch (error) {
      console.error('Failed to fetch teacher details:', error);
      alert('Failed to fetch teacher details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await schoolAdminService.updateTeacher(teacherId, formData);
      setIsEditing(false);
      fetchTeacherDetails(); // Refresh data
      alert('Teacher updated successfully!');
    } catch (error) {
      console.error('Failed to update teacher:', error);
      let errorMessage = 'Failed to update teacher';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!window.confirm(`Are you sure you want to ${teacher.isActive ? 'deactivate' : 'activate'} this teacher?`)) {
      return;
    }

    try {
      setLoading(true);
      await schoolAdminService.toggleTeacherStatus(teacherId);
      fetchTeacherDetails(); // Refresh data
      alert(`Teacher ${teacher.isActive ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Failed to toggle teacher status:', error);
      alert('Failed to update teacher status');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Teacher' : 'Teacher Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : teacher ? (
          <div>
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{teacher.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{teacher.lastName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{teacher.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{teacher.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {teacher.language === 'en' ? 'English' : 
                       teacher.language === 'sn' ? 'Shona' : 
                       teacher.language === 'nd' ? 'Ndebele' : teacher.language}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-flex px-2 py-1 text-xs rounded-full ${
                      teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Login</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {teacher.lastLoginAt ? new Date(teacher.lastLoginAt).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Joined</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(teacher.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Teacher
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    className={`flex-1 px-4 py-2 rounded-md ${
                      teacher.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {teacher.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleUpdateTeacher} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="sn">Shona</option>
                      <option value="nd">Ndebele</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Teacher'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Teacher not found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetailsModal; 