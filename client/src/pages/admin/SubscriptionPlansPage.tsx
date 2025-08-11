import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface Plan {
  id?: number;
  planId: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays: number;
  maxStudents: number;
  maxTeachers: number;
  maxClasses: number;
  materials: boolean;
  templates: boolean;
  assignments: boolean;
  basicAnalytics: boolean;
  financeModule: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
  storageGB: number;
  monthlyExports: number;
  customTemplates: number;
  isActive: boolean;
}

const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Partial<Plan>>({
    planId: '',
    name: '',
    price: 0,
    currency: 'usd',
    interval: 'month',
    trialDays: 0,
    maxStudents: -1,
    maxTeachers: -1,
    maxClasses: -1,
    materials: true,
    templates: true,
    assignments: true,
    basicAnalytics: true,
    financeModule: false,
    advancedAnalytics: false,
    prioritySupport: false,
    customBranding: false,
    apiAccess: false,
    whiteLabeling: false,
    storageGB: 1,
    monthlyExports: 5,
    customTemplates: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/admin/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await api.put(`/admin/plans/${editingPlan.id}`, formData);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/admin/plans', formData);
        toast.success('Plan created successfully');
      }
      setShowModal(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save plan');
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await api.delete(`/admin/plans/${id}`);
        toast.success('Plan deleted successfully');
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        toast.error('Failed to delete plan');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      planId: '',
      name: '',
      price: 0,
      currency: 'usd',
      interval: 'month',
      trialDays: 0,
      maxStudents: -1,
      maxTeachers: -1,
      maxClasses: -1,
      materials: true,
      templates: true,
      assignments: true,
      basicAnalytics: true,
      financeModule: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whiteLabeling: false,
      storageGB: 1,
      monthlyExports: 5,
      customTemplates: 0,
      isActive: true
    });
    setEditingPlan(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            <div className="px-6 py-8 sm:px-8 sm:py-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">Subscription Plans</h1>
                  <p className="mt-2 text-blue-100">Manage subscription plans and pricing</p>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 rounded-md bg-white text-blue-700 hover:bg-blue-50 transition text-sm"
                >
                  <span className="mr-2">+</span>
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.planId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${plan.price}/{plan.interval}
                      </div>
                      {plan.trialDays > 0 && (
                        <div className="text-xs text-green-600">{plan.trialDays} day trial</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600">
                        <div>Students: {plan.maxStudents === -1 ? '∞' : plan.maxStudents}</div>
                        <div>Teachers: {plan.maxTeachers === -1 ? '∞' : plan.maxTeachers}</div>
                        <div>Classes: {plan.maxClasses === -1 ? '∞' : plan.maxClasses}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {plan.materials && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Materials</span>}
                        {plan.templates && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Templates</span>}
                        {plan.assignments && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Assignments</span>}
                        {plan.basicAnalytics && <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Basic Analytics</span>}
                        {plan.financeModule && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Finance</span>}
                        {plan.advancedAnalytics && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Advanced Analytics</span>}
                        {plan.prioritySupport && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Priority Support</span>}
                        {plan.customBranding && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Custom Branding</span>}
                        {plan.apiAccess && <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">API Access</span>}
                        {plan.whiteLabeling && <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">White Labeling</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Plan ID</label>
                      <input
                        type="text"
                        value={formData.planId}
                        onChange={(e) => setFormData({...formData, planId: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interval</label>
                      <select
                        value={formData.interval}
                        onChange={(e) => setFormData({...formData, interval: e.target.value as 'month' | 'year'})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Students (-1 = unlimited)</label>
                      <input
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Teachers (-1 = unlimited)</label>
                      <input
                        type="number"
                        value={formData.maxTeachers}
                        onChange={(e) => setFormData({...formData, maxTeachers: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Max Classes (-1 = unlimited)</label>
                      <input
                        type="number"
                        value={formData.maxClasses}
                        onChange={(e) => setFormData({...formData, maxClasses: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { key: 'materials', label: 'Materials' },
                      { key: 'templates', label: 'Templates' },
                      { key: 'assignments', label: 'Assignments' },
                      { key: 'basicAnalytics', label: 'Basic Analytics' },
                      { key: 'financeModule', label: 'Finance Module' },
                      { key: 'advancedAnalytics', label: 'Advanced Analytics' },
                      { key: 'prioritySupport', label: 'Priority Support' },
                      { key: 'customBranding', label: 'Custom Branding' },
                      { key: 'apiAccess', label: 'API Access' },
                      { key: 'whiteLabeling', label: 'White Labeling' }
                    ].map(feature => (
                      <div key={feature.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData[feature.key as keyof Plan] as boolean}
                          onChange={(e) => setFormData({...formData, [feature.key]: e.target.checked})}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">{feature.label}</label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingPlan ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;