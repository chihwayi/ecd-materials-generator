import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { schoolAdminService } from '../services/school-admin.service';
import BulkStudentAssignmentModal from '../components/school-admin/BulkStudentAssignmentModal';
import api from '../services/api';

const StudentAssignmentPage = () => {
  const [classes, setClasses] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classStudents, setClassStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchUnassignedStudents();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedStudents = async () => {
    try {
      const data = await schoolAdminService.getUnassignedStudents();
      setUnassignedStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching unassigned students:', error);
      toast.error('Failed to fetch unassigned students');
    }
  };

  const fetchClassStudents = async (classId) => {
    try {
      const data = await schoolAdminService.getStudentsByClass(classId);
      setClassStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching class students:', error);
      toast.error('Failed to fetch class students');
    }
  };

  const handleBulkAssignmentSuccess = () => {
    fetchUnassignedStudents();
    if (selectedClass) {
      fetchClassStudents(selectedClass);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Assignment Management</h1>
        <button
          onClick={() => setShowBulkModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Bulk Assign Students
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Unassigned Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Unassigned Students</h2>
          {unassignedStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No unassigned students found</p>
              <p className="text-sm mt-2">All students are assigned to classes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedStudents.map(student => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Age: {student.age} | Grade: {student.grade}
                      </p>
                      <p className="text-sm text-gray-500">
                        Parent: {student.parent?.firstName} {student.parent?.lastName}
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Unassigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Class Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Class Students</h2>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a class</option>
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name} - {classItem.classTeacher?.firstName} {classItem.classTeacher?.lastName}
                </option>
              ))}
            </select>
          </div>

          {!selectedClass ? (
            <div className="text-center py-8 text-gray-500">
              <p>Select a class to view students</p>
            </div>
          ) : classStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No students assigned to this class</p>
            </div>
          ) : (
            <div className="space-y-3">
              {classStudents.map(student => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Age: {student.age} | Grade: {student.grade}
                      </p>
                      <p className="text-sm text-gray-500">
                        Parent: {student.parent?.firstName} {student.parent?.lastName}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">
            {unassignedStudents.length + classStudents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unassigned</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {unassignedStudents.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Assigned</h3>
          <p className="text-3xl font-bold text-green-600">
            {classStudents.length}
          </p>
        </div>
      </div>

      {/* Bulk Assignment Modal */}
      <BulkStudentAssignmentModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={handleBulkAssignmentSuccess}
      />
    </div>
  );
};

export default StudentAssignmentPage; 