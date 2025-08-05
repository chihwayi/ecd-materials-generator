import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import api from '../services/api';

interface FeeStructure {
  id: string;
  name: string;
  type: 'monthly' | 'term' | 'transport' | 'food' | 'activities' | 'auxiliary';
  amount: number;
  description?: string;
  academicYear: string;
  term?: 'term1' | 'term2' | 'term3' | 'all';
  month?: string;
  isActive: boolean;
  category: 'tuition' | 'transport' | 'food' | 'activities' | 'auxiliary';
  frequency: 'monthly' | 'term' | 'one-time';
  dueDate?: string;
}

interface FeeStatistics {
  totalStudents: number;
  totalFees: number;
  totalPaid: number;
  totalOutstanding: number;
  feeStats: Array<{
    status: string;
    count: number;
    totalAmount: number;
    totalPaid: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    totalAmount: number;
    totalPaid: number;
    outstanding: number;
  }>;
}

const SchoolAdminFeeManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [statistics, setStatistics] = useState<FeeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'monthly' as 'monthly' | 'term' | 'transport' | 'food' | 'activities' | 'auxiliary',
    category: 'tuition' as 'tuition' | 'transport' | 'food' | 'activities' | 'auxiliary',
    frequency: 'monthly' as 'monthly' | 'term' | 'one-time',
    amount: '',
    description: '',
    academicYear: new Date().getFullYear().toString(),
    term: 'all' as 'term1' | 'term2' | 'term3' | 'all',
    month: 'all' as string,
    dueDate: ''
  });

  const [generateData, setGenerateData] = useState({
    academicYear: new Date().getFullYear().toString(),
    term: '',
    month: '',
    feeStructureId: ''
  });

  useEffect(() => {
    fetchFeeStructures();
    fetchStatistics();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const response = await api.get('/fees/structures');
      setFeeStructures(response.data);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/fees/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFeeStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter a fee structure name');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    try {
      // Convert amount to number and prepare data for backend
      const feeStructureData = {
        name: formData.name,
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        academicYear: formData.academicYear
      };

      console.log('Sending fee structure data:', feeStructureData);

      const response = await api.post('/fees/structures', feeStructureData);
      console.log('Response:', response.data);
      setShowCreateForm(false);
      setFormData({
        name: '',
        type: 'monthly',
        category: 'tuition',
        frequency: 'monthly',
        amount: '',
        description: '',
        academicYear: new Date().getFullYear().toString(),
        term: 'all',
        month: 'all',
        dueDate: ''
      });
      fetchFeeStructures();
    } catch (error) {
      console.error('Error creating fee structure:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
        alert(`Failed to create fee structure: ${error.response.data.error || 'Unknown error'}`);
      } else {
        alert('Failed to create fee structure. Please try again.');
      }
    }
  };

  const handleGenerateFees = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/fees/generate', generateData);
      setShowGenerateForm(false);
      setGenerateData({
        academicYear: new Date().getFullYear().toString(),
        term: '',
        month: '',
        feeStructureId: ''
      });
      fetchStatistics();
    } catch (error) {
      console.error('Error generating fees:', error);
    }
  };

  const handleDeleteFeeStructure = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await api.delete(`/fees/structures/${id}`);
        fetchFeeStructures();
      } catch (error) {
        console.error('Error deleting fee structure:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_paid': return 'text-green-600 bg-green-100';
      case 'partially_paid': return 'text-yellow-600 bg-yellow-100';
      case 'not_paid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fully_paid': return 'Fully Paid';
      case 'partially_paid': return 'Partially Paid';
      case 'not_paid': return 'Not Paid';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tuition': return 'bg-blue-100 text-blue-800';
      case 'transport': return 'bg-green-100 text-green-800';
      case 'food': return 'bg-yellow-100 text-yellow-800';
      case 'activities': return 'bg-purple-100 text-purple-800';
      case 'auxiliary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tuition': return '📚';
      case 'transport': return '🚌';
      case 'food': return '🍽️';
      case 'activities': return '🎨';
      case 'auxiliary': return '🔧';
      default: return '💰';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fee management... 💰</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                💰 Comprehensive Fee Management
              </h1>
              <p className="text-blue-100 text-lg">
                Manage all school fees including tuition, transport, food, activities, and auxiliary costs
              </p>
            </div>
            <div className="text-6xl opacity-20">🏫</div>
          </div>
        </div>

        {/* Navigation to Finance */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Financial Operations & Reporting</h2>
              <p className="text-gray-600">View financial reports, payment tracking, and revenue analytics</p>
            </div>
            <Link
              to="/school-finance"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              📊 View Finance Dashboard
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Students</p>
                  <p className="text-3xl font-bold">{statistics.totalStudents}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Fees</p>
                  <p className="text-3xl font-bold">${statistics.totalFees.toLocaleString()}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Paid</p>
                  <p className="text-3xl font-bold">${statistics.totalPaid.toLocaleString()}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Outstanding</p>
                  <p className="text-3xl font-bold">${statistics.totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {statistics?.categoryBreakdown && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fee Category Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statistics.categoryBreakdown.map((category) => (
                <div key={category.category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category)} mb-2`}>
                    {getCategoryIcon(category.category)} {category.category}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${category.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-semibold text-green-600">${category.totalPaid.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Paid</p>
                  <p className="text-sm font-semibold text-red-600">${category.outstanding.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Outstanding</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            ➕ Create Fee Structure
          </button>
          <button
            onClick={() => setShowGenerateForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            📊 Generate Student Fees
          </button>
        </div>

        {/* Fee Structures */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fee Structures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeStructures.map((structure) => (
              <div key={structure.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(structure.category)}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{structure.name}</h3>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(structure.category)}`}>
                      {structure.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      structure.frequency === 'monthly' ? 'bg-blue-100 text-blue-800' : 
                      structure.frequency === 'term' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {structure.frequency}
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">${structure.amount}</p>
                <p className="text-sm text-gray-600 mb-4">{structure.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {structure.academicYear} • {structure.term || structure.month || 'All'}
                  </span>
                  <button
                    onClick={() => handleDeleteFeeStructure(structure.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Status Breakdown */}
        {statistics && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fee Status Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statistics.feeStats.map((stat) => (
                <div key={stat.status} className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(stat.status)}`}>
                    {getStatusText(stat.status)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.count}</p>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">${stat.totalAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Amount</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Fee Structure Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Fee Structure</h3>
              <form onSubmit={handleCreateFeeStructure}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const category = e.target.value as any;
                        // Set type based on category
                        let type = 'monthly';
                        if (category === 'transport') type = 'transport';
                        else if (category === 'food') type = 'food';
                        else if (category === 'activities') type = 'activities';
                        else if (category === 'auxiliary') type = 'auxiliary';
                        
                        setFormData({ 
                          ...formData, 
                          category,
                          type: type as any
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="tuition">📚 Tuition Fees</option>
                      <option value="transport">🚌 Transport Fees</option>
                      <option value="food">🍽️ Food & Nutrition</option>
                      <option value="activities">🎨 Activities & Sports</option>
                      <option value="auxiliary">🔧 Auxiliary Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {!formData.category && (
                        <option value="monthly">📅 Select Category First</option>
                      )}
                      {formData.category === 'tuition' && (
                        <>
                          <option value="monthly">📅 Monthly Tuition</option>
                          <option value="term">📚 Term Tuition</option>
                        </>
                      )}
                      {formData.category === 'transport' && (
                        <>
                          <option value="transport">🚌 Transport Fee</option>
                          <option value="monthly">📅 Monthly Transport</option>
                        </>
                      )}
                      {formData.category === 'food' && (
                        <>
                          <option value="food">🍽️ Food Fee</option>
                          <option value="monthly">📅 Monthly Food</option>
                        </>
                      )}
                      {formData.category === 'activities' && (
                        <>
                          <option value="activities">🎨 Activities Fee</option>
                          <option value="term">📚 Term Activities</option>
                        </>
                      )}
                      {formData.category === 'auxiliary' && (
                        <>
                          <option value="auxiliary">🔧 Auxiliary Fee</option>
                          <option value="monthly">📅 Monthly Auxiliary</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Billing Frequency</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="monthly">📅 Monthly</option>
                      <option value="term">📚 Per Term</option>
                      <option value="one-time">💳 One-time Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {formData.frequency === 'term' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
                      <select
                        value={formData.term}
                        onChange={(e) => setFormData({ ...formData, term: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Terms</option>
                        <option value="term1">Term 1</option>
                        <option value="term2">Term 2</option>
                        <option value="term3">Term 3</option>
                      </select>
                    </div>
                  )}

                  {formData.frequency === 'monthly' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                      <select
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Months</option>
                        <option value="january">January</option>
                        <option value="february">February</option>
                        <option value="march">March</option>
                        <option value="april">April</option>
                        <option value="may">May</option>
                        <option value="june">June</option>
                        <option value="july">July</option>
                        <option value="august">August</option>
                        <option value="september">September</option>
                        <option value="october">October</option>
                        <option value="november">November</option>
                        <option value="december">December</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Create Structure
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Generate Fees Modal */}
        {showGenerateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Generate Student Fees</h3>
              <form onSubmit={handleGenerateFees}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure</label>
                    <select
                      value={generateData.feeStructureId}
                      onChange={(e) => setGenerateData({ ...generateData, feeStructureId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Fee Structure</option>
                      {feeStructures.map((structure) => (
                        <option key={structure.id} value={structure.id}>
                          {structure.name} - ${structure.amount} ({structure.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                    <input
                      type="text"
                      value={generateData.academicYear}
                      onChange={(e) => setGenerateData({ ...generateData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Term (Optional)</label>
                    <select
                      value={generateData.term}
                      onChange={(e) => setGenerateData({ ...generateData, term: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Term</option>
                      <option value="term1">Term 1</option>
                      <option value="term2">Term 2</option>
                      <option value="term3">Term 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month (Optional)</label>
                    <select
                      value={generateData.month}
                      onChange={(e) => setGenerateData({ ...generateData, month: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Month</option>
                      <option value="january">January</option>
                      <option value="february">February</option>
                      <option value="march">March</option>
                      <option value="april">April</option>
                      <option value="may">May</option>
                      <option value="june">June</option>
                      <option value="july">July</option>
                      <option value="august">August</option>
                      <option value="september">September</option>
                      <option value="october">October</option>
                      <option value="november">November</option>
                      <option value="december">December</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Generate Fees
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGenerateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolAdminFeeManagementPage; 