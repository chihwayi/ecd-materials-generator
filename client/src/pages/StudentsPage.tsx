import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-hot-toast';
import { Student, ProgressRecord, studentsService } from '../services/students.service.ts';

const StudentsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newProgress, setNewProgress] = useState({
    activity: '',
    type: 'digital' as 'digital' | 'offline',
    score: '',
    notes: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await studentsService.getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressRecords = async (studentId: string) => {
    try {
      const records = await studentsService.getStudentProgress(studentId);
      setProgressRecords(records);
    } catch (error) {
      console.error('Error fetching progress records:', error);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    fetchProgressRecords(student.id);
  };

  const handleAddProgress = async () => {
    if (!selectedStudent || !newProgress.activity.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const record = await studentsService.addProgressRecord(selectedStudent.id, {
        activity: newProgress.activity,
        type: newProgress.type,
        score: newProgress.score ? parseInt(newProgress.score) : undefined,
        notes: newProgress.notes
      });

      setProgressRecords(prev => [record, ...prev]);
      setNewProgress({ activity: '', type: 'digital', score: '', notes: '' });
      setShowAddProgress(false);
      toast.success('Progress recorded successfully');
    } catch (error) {
      console.error('Error adding progress record:', error);
      toast.error('Failed to record progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 My Students</h1>
              <p className="text-green-100 text-lg">Manage and track progress for your assigned students</p>
            </div>
            <div className="text-6xl opacity-20">🎓</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  👥 Students ({students.length})
                </h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
                      selectedStudent?.id === student.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedStudent?.id === student.id
                          ? 'bg-white bg-opacity-20'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        <span className="text-lg text-white">👤</span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          selectedStudent?.id === student.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className={`text-sm ${
                          selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {student.class?.name || 'No Class'} • {student.age || 'N/A'} years
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Details and Progress */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Info Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      📊 Student Progress
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-white">👤</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedStudent.firstName} {selectedStudent.lastName}
                        </h3>
                        <p className="text-gray-600">
                          {selectedStudent.class?.name || 'No Class'} • {selectedStudent.age || 'N/A'} years old
                        </p>
                        <p className="text-sm text-gray-500">
                          Student ID: {selectedStudent.id}
                        </p>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Activities</p>
                            <p className="text-2xl font-bold text-blue-900">{progressRecords.length}</p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">📈</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700">Digital Activities</p>
                            <p className="text-2xl font-bold text-green-900">
                              {progressRecords.filter(r => r.type === 'digital').length}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">💻</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Offline Activities</p>
                            <p className="text-2xl font-bold text-purple-900">
                              {progressRecords.filter(r => r.type === 'offline').length}
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">📝</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Progress Button */}
                    <button
                      onClick={() => setShowAddProgress(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold mb-6"
                    >
                      ➕ Add Progress Record
                    </button>

                    {/* Progress Records */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        📋 Recent Progress Records
                      </h3>
                      {progressRecords.length > 0 ? (
                        <div className="space-y-3">
                          {progressRecords.map((record) => (
                            <div key={record.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{record.activity}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  record.type === 'digital' 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                                }`}>
                                  {record.type === 'digital' ? '💻 Digital' : '📝 Offline'}
                                </span>
                              </div>
                              {record.score && (
                                <p className="text-sm text-gray-600 mb-2">
                                  Score: <span className="font-semibold text-green-600">{record.score}%</span>
                                </p>
                              )}
                              {record.notes && (
                                <p className="text-sm text-gray-600">{record.notes}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {record.date ? new Date(record.date).toLocaleDateString() : 'No date'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">📊</div>
                          <p className="text-gray-600">No progress records yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-600">Choose a student from the list to view their progress and add new records.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Progress Modal */}
        {showAddProgress && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Progress Record</h3>
                <button
                  onClick={() => setShowAddProgress(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                  <input
                    type="text"
                    value={newProgress.activity}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, activity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter activity name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newProgress.type}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, type: e.target.value as 'digital' | 'offline' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="digital">💻 Digital</option>
                    <option value="offline">📝 Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score (optional)</label>
                  <input
                    type="number"
                    value={newProgress.score}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, score: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter score (0-100)"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={newProgress.notes}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    rows={3}
                    placeholder="Add any notes about the activity"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddProgress(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgress}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  Add Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;