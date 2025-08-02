import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { materialsService } from '../services/materials.service.ts';

const CreateAssignmentPage = () => {
  const { id } = useParams();
  const [classes, setClasses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignmentType, setAssignmentType] = useState('material'); // 'material' or 'custom'
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    classId: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchMaterials();
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      console.log('Fetching materials...');
      const response = await materialsService.getAllMaterials(1, 50);
      console.log('Materials response:', response);
      // The backend returns materials in response.data
      setMaterials(response.data || []);
      console.log('Materials set:', response.data || []);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const fetchAssignment = async () => {
    try {
      const response = await api.get(`/assignments/${id}`);
      const assignment = response.data;
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        instructions: assignment.instructions || '',
        dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
        classId: assignment.classId || ''
      });
      setAssignmentType(assignment.type || 'material');
      if (assignment.type === 'material' && assignment.materials) {
        setSelectedMaterials(assignment.materials.map(m => m.id || m));
      }
      if (assignment.type === 'custom' && assignment.customTasks) {
        setCustomTasks(assignment.customTasks);
      }
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
    }
  };

  const handleMaterialToggle = (materialId) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const addCustomTask = (type) => {
    const newTask = {
      id: Date.now().toString(),
      type,
      title: '',
      instructions: ''
    };
    setCustomTasks(prev => [...prev, newTask]);
  };

  const updateCustomTask = (taskId, updates) => {
    setCustomTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const removeCustomTask = (taskId) => {
    setCustomTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assignmentData = {
        ...formData,
        type: assignmentType,
        materials: assignmentType === 'material' ? selectedMaterials : [],
        customTasks: assignmentType === 'custom' ? customTasks : []
      };

      let response;
      if (id) {
        // Update existing assignment
        response = await api.put(`/assignments/${id}`, assignmentData);
        alert('Assignment updated successfully!');
      } else {
        // Create new assignment
        response = await api.post('/assignments', assignmentData);
        alert(`Assignment created successfully and assigned to ${response.data.assignedCount} students!`);
      }

      // Reset form only for new assignments
      if (!id) {
        setFormData({
          title: '',
          description: '',
          instructions: '',
          dueDate: '',
          classId: ''
        });
        setSelectedMaterials([]);
        setCustomTasks([]);
      }
    } catch (error) {
      console.error('Failed to save assignment:', error);
      alert(id ? 'Failed to update assignment' : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📝 {id ? 'Edit' : 'Create'} Assignment</h1>
              <p className="text-yellow-100 text-lg">{id ? 'Update your assignment' : 'Create a new assignment for your students'}</p>
            </div>
            <div className="text-6xl opacity-20">📚</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl -mt-6 -mx-6 mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center">
                📋 Basic Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assignment title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.grade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the assignment"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Assignment Type */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-xl -mt-6 -mx-6 mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center">
                🎯 Assignment Type
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignmentType"
                    value="material"
                    checked={assignmentType === 'material'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">📚 Use Existing Materials</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="assignmentType"
                    value="custom"
                    checked={assignmentType === 'custom'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">✏️ Custom Tasks</span>
                </label>
              </div>
            </div>
          </div>

          {/* Materials Selection */}
          {assignmentType === 'material' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl -mt-6 -mx-6 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  📚 Select Materials
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {materials.map((material) => (
                  <label
                    key={material.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedMaterials.includes(material.id)
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleMaterialToggle(material.id)}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{material.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {material.subject}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {material.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tasks */}
          {assignmentType === 'custom' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-xl -mt-6 -mx-6 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  ✏️ Custom Tasks
                </h2>
              </div>
              
              <div className="space-y-4">
                {customTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Task {task.type}</h3>
                      <button
                        type="button"
                        onClick={() => removeCustomTask(task.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => updateCustomTask(task.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter task title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                        <textarea
                          value={task.instructions}
                          onChange={(e) => updateCustomTask(task.id, { instructions: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter task instructions"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => addCustomTask('reading')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    📖 Add Reading Task
                  </button>
                  <button
                    type="button"
                    onClick={() => addCustomTask('writing')}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    ✍️ Add Writing Task
                  </button>
                  <button
                    type="button"
                    onClick={() => addCustomTask('activity')}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                  >
                    🎯 Add Activity Task
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-t-xl -mt-6 -mx-6 mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center">
                📝 Instructions
              </h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructions for Students</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide clear instructions for your students"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {id ? 'Updating Assignment...' : 'Creating Assignment...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl mr-2">📝</span>
                  {id ? 'Update Assignment' : 'Create Assignment'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentPage;