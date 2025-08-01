import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CreateStudentPage = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    classId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/students', formData);
      
      // Show parent credentials if created
      if (response.data.parentCredentials) {
        alert(`Student and parent account created successfully!\n\nParent Login Credentials:\nEmail: ${response.data.parentCredentials.email}\nPassword: ${response.data.parentCredentials.password}\n\nPlease share these credentials securely with the parent.`);
      } else {
        alert('Student created successfully!');
      }
      
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        classId: '',
        parentName: '',
        parentEmail: '',
        parentPhone: ''
      });
    } catch (error) {
      console.error('Failed to create student:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to create student';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details.join(', ');
      }
      
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Student</h1>
          <p className="text-gray-600 mt-2">Add a new student to your school.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                min="3"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assign to Class</label>
              <select
                required
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name} (Grade {classItem.grade}) - {classItem.classTeacher ? `${classItem.classTeacher.firstName} ${classItem.classTeacher.lastName}` : 'No Teacher'}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Parent Phone</label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStudentPage;