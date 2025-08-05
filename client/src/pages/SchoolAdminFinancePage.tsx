import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import api from '../services/api';

interface FinanceStatistics {
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
  recentPayments?: any[];
  categoryBreakdown: Array<{
    category: string;
    totalAmount: number;
    totalPaid: number;
    outstanding: number;
  }>;
}

interface FeeStructure {
  id: string;
  name: string;
  type: string;
  category: string;
  frequency: string;
  amount: number;
  description?: string;
  academicYear: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  parentContact?: string;
}

const SchoolAdminFinancePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statistics, setStatistics] = useState<FinanceStatistics | null>(null);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, structuresResponse, studentsResponse] = await Promise.all([
        api.get('/fees/statistics'),
        api.get('/fees/structures'),
        api.get('/school-admin/students')
      ]);
      
      setStatistics(statsResponse.data);
      setFeeStructures(structuresResponse.data);
      setStudents(studentsResponse.data.students || studentsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedFeeStructure || !paymentAmount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const paymentData = {
        studentId: selectedStudent.id,
        feeStructureId: selectedFeeStructure.id,
        amount: parseFloat(paymentAmount),
        paymentMethod,
        paymentDate,
        academicYear: new Date().getFullYear().toString()
      };

      await api.post('/fees/payments', paymentData);
      
      // Reset form
      setShowPaymentModal(false);
      setSelectedStudent(null);
      setSelectedFeeStructure(null);
      setPaymentAmount('');
      setPaymentMethod('cash');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      
      // Refresh data
      fetchData();
      
      alert('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment. Please try again.');
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
          <p className="mt-4 text-gray-600">Loading financial reports... 📊</p>
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
                💰 School Admin Finance Manager
              </h1>
              <p className="text-blue-100 text-lg">
                Comprehensive financial management, payment tracking, and revenue analytics for School Administrators
              </p>
              <p className="text-blue-200 text-sm mt-2">
                🎯 You are accessing the School Admin Finance Dashboard
              </p>
            </div>
            <div className="text-6xl opacity-20">🏦</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="text-3xl mb-2">💳</div>
            <h3 className="text-lg font-semibold">Record Payment</h3>
            <p className="text-sm opacity-90">Process student payments</p>
          </button>

          <Link
            to="/fee-management"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold">Manage Fees</h3>
            <p className="text-sm opacity-90">Create fee structures</p>
          </Link>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold">Generate Reports</h3>
            <p className="text-sm opacity-90">Financial analytics</p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="text-lg font-semibold">Send Reminders</h3>
            <p className="text-sm opacity-90">Payment notifications</p>
          </div>
        </div>

        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Fees</p>
                  <p className="text-3xl font-bold">${statistics.totalFees.toLocaleString()}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Collected</p>
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

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Collection Rate</p>
                  <p className="text-3xl font-bold">
                    {statistics.totalFees > 0 
                      ? Math.round((statistics.totalPaid / statistics.totalFees) * 100)
                      : 0}%
                  </p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fee Structures Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Fee Structures</h2>
            <div className="space-y-4">
              {feeStructures.map((structure) => (
                <div key={structure.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{structure.name}</h3>
                      <p className="text-sm text-gray-600">{structure.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(structure.category)}`}>
                          {getCategoryIcon(structure.category)} {structure.category}
                        </span>
                        <span className="text-sm text-gray-500">{structure.frequency}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${structure.amount}</p>
                      <p className="text-sm text-gray-500">{structure.academicYear}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Financial Activity</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Monthly Collection Trend</span>
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Payment Processing Time</span>
                  <span className="text-sm text-blue-600">2.3 days avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Outstanding Recovery Rate</span>
                  <span className="text-sm text-orange-600">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {statistics?.categoryBreakdown && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {statistics.categoryBreakdown.map((category) => (
                <div key={category.category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category.category)} mb-2`}>
                    {getCategoryIcon(category.category)} {category.category}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">${category.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-lg font-semibold text-green-600">${category.totalPaid.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Collected</p>
                  <p className="text-sm font-semibold text-red-600">${category.outstanding.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Outstanding</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Recording Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Record Payment</h3>
              <form onSubmit={handleRecordPayment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                    <select
                      value={selectedStudent?.id || ''}
                      onChange={(e) => {
                        const student = students.find(s => s.id === e.target.value);
                        setSelectedStudent(student || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee Structure</label>
                    <select
                      value={selectedFeeStructure?.id || ''}
                      onChange={(e) => {
                        const structure = feeStructures.find(s => s.id === e.target.value);
                        setSelectedFeeStructure(structure || null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Fee Structure</option>
                      {feeStructures.map((structure) => (
                        <option key={structure.id} value={structure.id}>
                          {structure.name} - ${structure.amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cash">💵 Cash</option>
                      <option value="bank_transfer">🏦 Bank Transfer</option>
                      <option value="mobile_money">📱 Mobile Money</option>
                      <option value="check">📄 Check</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
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

export default SchoolAdminFinancePage; 