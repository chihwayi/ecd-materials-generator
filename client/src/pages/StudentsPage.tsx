import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-hot-toast';
import { studentsService, Student, ProgressRecord } from '../services/students.service.ts';

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
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressRecords = async (studentId: string) => {
    try {
      const records = await studentsService.getStudentProgress(studentId);
      setProgressRecords(records);
    } catch (error) {
      toast.error('Failed to load progress records');
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
      toast.error('Failed to record progress');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="mt-2 text-gray-600">Manage and track progress for your assigned students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Students ({students.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedStudent?.id === student.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-500">Age {student.age} • {student.className}</p>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${(student.progress.completedActivities / student.progress.totalActivities) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {student.progress.completedActivities}/{student.progress.totalActivities} activities
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedStudent.name}</h2>
                      <p className="text-gray-600">Parent: {selectedStudent.parentName}</p>
                    </div>
                    <button
                      onClick={() => setShowAddProgress(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Record Progress
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedStudent.progress.completedActivities}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedStudent.progress.averageScore}%
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedStudent.age}
                      </div>
                      <div className="text-sm text-gray-600">Years Old</div>
                    </div>
                  </div>
                </div>

                {/* Progress Records */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Progress Records</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {progressRecords.map((record) => (
                      <div key={record.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900">{record.activity}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                record.type === 'digital' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {record.type}
                              </span>
                              {record.score && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  {record.score}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                            <p className="text-xs text-gray-500 mt-2">{record.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-600">Choose a student from the list to view their progress and record new activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Progress Modal */}
        {showAddProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Record Progress</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                  <input
                    type="text"
                    value={newProgress.activity}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, activity: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Coloring activity, Reading practice"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newProgress.type}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, type: e.target.value as 'digital' | 'offline' }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="digital">Digital Activity</option>
                    <option value="offline">Offline Activity</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Score (optional)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress.score}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, score: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newProgress.notes}
                    onChange={(e) => setNewProgress(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={3}
                    placeholder="Observations, feedback, or notes about the activity"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAddProgress(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProgress}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Record Progress
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