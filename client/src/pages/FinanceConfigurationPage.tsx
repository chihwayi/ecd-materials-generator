import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface FeeConfiguration {
  id?: string;
  monthlyAmount: number;
  termAmount: number;
  term: 'term1' | 'term2' | 'term3';
}

interface OptionalService {
  id?: string;
  name: string;
  category: 'food' | 'transport' | 'uniform' | 'amenity';
  amount: number;
  description?: string;
  term: 'term1' | 'term2' | 'term3';
}

const FinanceConfigurationPage: React.FC = () => {
  const [feeConfig, setFeeConfig] = useState<FeeConfiguration>({
    monthlyAmount: 0,
    termAmount: 0,
    term: 'term1'
  });
  const [services, setServices] = useState<Record<string, OptionalService[]>>({});
  const [newService, setNewService] = useState<OptionalService>({
    name: '',
    category: 'food',
    amount: 0,
    term: 'term1'
  });
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState<OptionalService | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feeResponse, servicesResponse] = await Promise.all([
        api.get('/finance-config/fee-config'),
        api.get('/finance-config/optional-services')
      ]);
      
      if (feeResponse.data.feeConfig) {
        setFeeConfig(feeResponse.data.feeConfig);
      }
      setServices(servicesResponse.data.services);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveFeeConfig = async () => {
    try {
      setLoading(true);
      await api.post('/finance-config/fee-config', feeConfig);
      toast.success('Fee configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save fee configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      if (!newService.name || !newService.amount) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      await api.post('/finance-config/optional-services', newService);
      toast.success('Service added successfully');
      setNewService({ name: '', category: 'food', amount: 0, term: 'term1' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  const handleAssignFees = async () => {
    try {
      if (!feeConfig.id) {
        toast.error('Please save fee configuration first');
        return;
      }
      
      setLoading(true);
      await api.post('/finance-config/assign-fees', {
        feeConfigurationId: feeConfig.id,
        paymentPlan: feeConfig.feeType
      });
      toast.success('Fees assigned to all students successfully');
    } catch (error) {
      toast.error('Failed to assign fees');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: OptionalService) => {
    setEditingService(service);
  };

  const handleUpdateService = async () => {
    try {
      if (!editingService?.id) return;
      
      await api.put(`/finance-config/optional-services/${editingService.id}`, editingService);
      toast.success('Service updated successfully');
      setEditingService(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      if (!confirm('Are you sure you want to delete this service?')) return;
      
      await api.delete(`/finance-config/optional-services/${serviceId}`);
      toast.success('Service deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl text-white">⚙️</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Finance Configuration
                  </h1>
                  <p className="text-blue-100 text-lg max-w-2xl">
                    Set up tuition fees, optional services, and payment plans for your school
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl text-white">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Fee Configuration Display */}
        {feeConfig.id && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              ✅ Current Tuition Fee Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Amount</h3>
                <p className="text-lg font-semibold text-green-600">
                  ${feeConfig.monthlyAmount}/month
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Term</h3>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  🎓 {feeConfig.term.replace('term', 'Term ')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Term Amount</h3>
                <p className="text-lg font-semibold text-blue-600">
                  ${feeConfig.termAmount}/term
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Students can choose monthly or term payment. Update amounts below and save.</p>
            </div>
          </div>
        )}

        {/* Fee Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {feeConfig.id ? 'Update Tuition Fee Setup' : 'Tuition Fee Setup'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
              <select
                value={feeConfig.term}
                onChange={(e) => setFeeConfig({...feeConfig, term: e.target.value as 'term1' | 'term2' | 'term3'})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Amount ($)</label>
              <input
                type="number"
                value={feeConfig.monthlyAmount || ''}
                onChange={(e) => setFeeConfig({...feeConfig, monthlyAmount: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter monthly fee amount"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term Amount ($)</label>
              <input
                type="number"
                value={feeConfig.termAmount || ''}
                onChange={(e) => setFeeConfig({...feeConfig, termAmount: parseFloat(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter term fee amount"
                required
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSaveFeeConfig}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (feeConfig.id ? 'Update Fee Configuration' : 'Save Fee Configuration')}
            </button>
            
            <button
              onClick={handleAssignFees}
              disabled={loading || !feeConfig.id}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Assign to All Students (Default: Monthly)
            </button>
          </div>
        </div>

        {/* Add Optional Service */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Optional Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({...newService, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., School Lunch"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value as any})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="food">🍎 Food & Groceries</option>
                <option value="transport">🚌 Transport</option>
                <option value="uniform">👕 Uniform & Supplies</option>
                <option value="amenity">🎯 Activities & Trips</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={newService.amount || ''}
                onChange={(e) => setNewService({...newService, amount: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
              <select
                value={newService.term}
                onChange={(e) => setNewService({...newService, term: e.target.value as any})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="term1">Term 1</option>
                <option value="term2">Term 2</option>
                <option value="term3">Term 3</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <input
              type="text"
              value={newService.description || ''}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional details about this service"
            />
          </div>
          
          <button
            onClick={handleAddService}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Service
          </button>
        </div>

        {/* Current Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(services).map(([category, categoryServices]) => (
            <div key={category} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                {category === 'food' && '🍎'} 
                {category === 'transport' && '🚌'} 
                {category === 'uniform' && '👕'} 
                {category === 'amenity' && '🎯'} 
                {category} Services
              </h3>
              
              {categoryServices.length === 0 ? (
                <p className="text-gray-500 text-sm">No services added yet</p>
              ) : (
                <div className="space-y-3">
                  {categoryServices.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">Term: {service.term}</p>
                        </div>
                        <div className="text-right flex items-center space-x-3">
                          <span className="text-lg font-semibold text-green-600">${service.amount}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEditService(service)}
                              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id!)}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Service Modal */}
        {editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Service</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({...editingService, category: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="food">🍎 Food & Groceries</option>
                    <option value="transport">🚌 Transport</option>
                    <option value="uniform">👕 Uniform & Supplies</option>
                    <option value="amenity">🎯 Activities & Trips</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={editingService.amount}
                    onChange={(e) => setEditingService({...editingService, amount: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                  <select
                    value={editingService.term}
                    onChange={(e) => setEditingService({...editingService, term: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="term1">Term 1</option>
                    <option value="term2">Term 2</option>
                    <option value="term3">Term 3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdateService}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Update Service
                </button>
                <button
                  onClick={() => setEditingService(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceConfigurationPage;