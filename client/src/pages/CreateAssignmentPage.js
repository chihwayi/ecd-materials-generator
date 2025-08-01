import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { materialsService } from '../services/materials.service.ts';

const CreateAssignmentPage = () => {
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
  }, []);

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

      const response = await api.post('/assignments', assignmentData);
      alert(`Assignment created successfully and assigned to ${response.data.assignedCount} students!`);
      setFormData({
        title: '',
        description: '',
        instructions: '',
        dueDate: '',
        classId: ''
      });
      setSelectedMaterials([]);
      setCustomTasks([]);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
          <p className="text-gray-600 mt-2">Create and assign homework to all students in a class.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignment Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Math Practice - Counting to 20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assignment Type</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="material"
                    checked={assignmentType === 'material'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Use Existing Materials</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="custom"
                    checked={assignmentType === 'custom'}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">Create Custom Tasks</span>
                </label>
              </div>
            </div>

            {assignmentType === 'material' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Materials</label>
                <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {materials.length === 0 ? (
                    <p className="text-gray-500 text-sm">No materials available. Create some materials first.</p>
                  ) : (
                    <div className="space-y-2">
                      {materials.map((material) => (
                        <label key={material.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedMaterials.includes(material.id)}
                            onChange={() => handleMaterialToggle(material.id)}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{material.title}</div>
                            <div className="text-xs text-gray-500">
                              {material.subject} • {material.type} • {material.ageGroup}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {selectedMaterials.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {selectedMaterials.length} material(s) selected
                  </p>
                )}
              </div>
            )}

            {assignmentType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Custom Tasks</label>
                <div className="mt-2 space-y-3">
                  {customTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium capitalize">{task.type} Task</span>
                        <button
                          type="button"
                          onClick={() => removeCustomTask(task.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Task title"
                        value={task.title}
                        onChange={(e) => updateCustomTask(task.id, { title: e.target.value })}
                        className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <textarea
                        placeholder="Instructions for students"
                        value={task.instructions}
                        onChange={(e) => updateCustomTask(task.id, { instructions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows="2"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => addCustomTask('draw')}
                      className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      + Add Drawing Task
                    </button>
                    <button
                      type="button"
                      onClick={() => addCustomTask('image')}
                      className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      + Add Image Task
                    </button>
                    <button
                      type="button"
                      onClick={() => addCustomTask('audio')}
                      className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    >
                      + Add Audio Task
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Brief description of what students need to do"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Detailed instructions for parents and students"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    {classItem.name} (Grade {classItem.grade}) - {classItem.students?.length || 0} students
                  </option>
                ))}
              </select>
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
                disabled={loading || (assignmentType === 'material' && selectedMaterials.length === 0) || (assignmentType === 'custom' && customTasks.length === 0)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : `Create ${assignmentType === 'material' ? 'Material-Based' : 'Custom'} Assignment`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignmentPage;