import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { schoolAdminService } from '../../services/school-admin.service';
import api from '../../services/api';

const BulkStudentAssignmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      fetchUnassignedStudents();
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    try {
      setClassesLoading(true);
      const response = await api.get('/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to fetch classes');
    } finally {
      setClassesLoading(false);
    }
  };

  const fetchUnassignedStudents = async () => {
    try {
      setStudentsLoading(true);
      const data = await schoolAdminService.getUnassignedStudents();
      setUnassignedStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching unassigned students:', error);
      toast.error('Failed to fetch unassigned students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === unassignedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(unassignedStudents.map(student => student.id));
    }
  };

  const handleAssign = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    try {
      setLoading(true);
      const result = await schoolAdminService.bulkAssignStudents(selectedStudents, selectedClass);
      
      toast.success(result.message);
      
      // Reset form
      setSelectedClass('');
      setSelectedStudents([]);
      
      // Close modal and refresh data
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error(error.response?.data?.error || 'Failed to assign students');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Student Assignment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Class</h3>
            {classesLoading ? (
              <div className="text-center py-4">Loading classes...</div>
            ) : (
              <div className="space-y-2">
                {classes.map(classItem => (
                  <label key={classItem.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="class"
                      value={classItem.id}
                      checked={selectedClass === classItem.id}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-gray-700">
                      {classItem.name} - {classItem.classTeacher?.firstName} {classItem.classTeacher?.lastName}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Student Selection */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Students</h3>
              {unassignedStudents.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedStudents.length === unassignedStudents.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {studentsLoading ? (
              <div className="text-center py-4">Loading students...</div>
            ) : unassignedStudents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No unassigned students found
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border rounded-lg p-3">
                {unassignedStudents.map(student => (
                  <label key={student.id} className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-700">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Age: {student.age} | Parent: {student.parent?.firstName} {student.parent?.lastName}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {selectedStudents.length > 0 && selectedClass && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Assignment Summary</h4>
            <p className="text-blue-700">
              Assigning {selectedStudents.length} student(s) to{' '}
              {classes.find(c => c.id === selectedClass)?.name}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Teacher: {classes.find(c => c.id === selectedClass)?.classTeacher?.firstName} {classes.find(c => c.id === selectedClass)?.classTeacher?.lastName}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedClass || selectedStudents.length === 0 || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Assigning...' : `Assign ${selectedStudents.length} Student(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkStudentAssignmentModal; 