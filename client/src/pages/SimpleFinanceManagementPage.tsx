import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  parentContact?: string;
}

interface FeeAssignment {
  id: string;
  studentId: string;
  paymentPlan: 'monthly' | 'term';
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'pending' | 'partial' | 'paid';
  student: Student;
  termTotal: number; // calculated total for the term
}

interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference?: string;
  student?: Student;
}

const SimpleFinanceManagementPage: React.FC = () => {
  const [feeAssignments, setFeeAssignments] = useState<FeeAssignment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<FeeAssignment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'partial' | 'paid'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsResponse, paymentsResponse] = await Promise.all([
        api.get('/simple-finance/fee-assignments'),
        api.get('/simple-finance/payments')
      ]);
      
      setFeeAssignments(assignmentsResponse.data.assignments || []);
      setPayments(paymentsResponse.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment || !paymentAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > selectedAssignment.balanceAmount) {
      toast.error('Payment amount cannot exceed balance amount');
      return;
    }

    try {
      const paymentData = {
        feeAssignmentId: selectedAssignment.id,
        studentId: selectedAssignment.studentId,
        amount,
        paymentMethod,
        paymentDate,
        reference: reference || undefined
      };

      await api.post('/simple-finance/payments', paymentData);
      
      // Reset form
      setShowPaymentModal(false);
      setSelectedAssignment(null);
      setPaymentAmount('');
      setPaymentMethod('cash');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setReference('');
      
      // Refresh data
      fetchData();
      
      toast.success('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'partial': return '⚠️';
      case 'pending': return '❌';
      default: return '❓';
    }
  };

  const filteredAssignments = feeAssignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const stats = {
    total: feeAssignments.length,
    paid: feeAssignments.filter(a => a.status === 'paid').length,
    partial: feeAssignments.filter(a => a.status === 'partial').length,
    pending: feeAssignments.filter(a => a.status === 'pending').length,
    totalRevenue: feeAssignments.reduce((sum, a) => sum + a.termTotal, 0),
    collectedRevenue: feeAssignments.reduce((sum, a) => sum + a.paidAmount, 0),
    outstandingRevenue: feeAssignments.reduce((sum, a) => sum + a.balanceAmount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading finance data... 💰</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-8">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-8 py-12 sm:px-12 sm:py-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-3xl text-white">💳</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Finance Management
                  </h1>
                  <p className="text-green-100 text-lg max-w-2xl">
                    Record payments, track student balances, and manage school finances with flexible payment plans
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-4xl text-white">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Students</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Fully Paid</p>
                <p className="text-3xl font-bold">{stats.paid}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Partially Paid</p>
                <p className="text-3xl font-bold">{stats.partial}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Not Paid</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Expected Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Collected Revenue</h3>
            <p className="text-3xl font-bold text-green-600">${stats.collectedRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.totalRevenue > 0 ? Math.round((stats.collectedRevenue / stats.totalRevenue) * 100) : 0}% collected
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Outstanding Revenue</h3>
            <p className="text-3xl font-bold text-red-600">${stats.outstandingRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Students</h3>
          <div className="flex flex-wrap gap-3">
            {[{key: 'all', label: 'All Students', icon: '👥'}, 
              {key: 'pending', label: 'Not Paid', icon: '❌'}, 
              {key: 'partial', label: 'Partially Paid', icon: '⚠️'}, 
              {key: 'paid', label: 'Fully Paid', icon: '✅'}].map(({key, label, icon}) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === key 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Students Fee Assignments */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Student Fee Assignments ({filteredAssignments.length})
            </h2>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              💳 Record Payment
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Term Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Paid</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Balance</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {assignment.student.firstName} {assignment.student.lastName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.paymentPlan === 'monthly' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {assignment.paymentPlan === 'monthly' ? '📅 Monthly' : '📊 Term'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ${assignment.termTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      ${assignment.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-600">
                      ${assignment.balanceAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusIcon(assignment.status)} {assignment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {assignment.status !== 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowPaymentModal(true);
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Record Payment</h3>
              <form onSubmit={handleRecordPayment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                    <select
                      value={selectedAssignment?.id || ''}
                      onChange={(e) => {
                        const assignment = feeAssignments.find(a => a.id === e.target.value);
                        setSelectedAssignment(assignment || null);
                        setPaymentAmount(assignment?.balanceAmount.toString() || '');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Student</option>
                      {feeAssignments.filter(a => a.status !== 'paid').map((assignment) => (
                        <option key={assignment.id} value={assignment.id}>
                          {assignment.student.firstName} {assignment.student.lastName} - 
                          Balance: ${assignment.balanceAmount}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedAssignment && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Payment Plan: <span className="font-medium">{selectedAssignment.paymentPlan}</span></p>
                        <p>Term Total: <span className="font-medium">${selectedAssignment.termTotal}</span></p>
                        <p>Already Paid: <span className="font-medium text-green-600">${selectedAssignment.paidAmount}</span></p>
                        <p>Balance Due: <span className="font-medium text-red-600">${selectedAssignment.balanceAmount}</span></p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount ($) 
                      {selectedAssignment && (
                        <span className="text-xs text-gray-500">
                          (Max: ${selectedAssignment.balanceAmount})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      max={selectedAssignment?.balanceAmount || undefined}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reference (Optional)</label>
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Payment reference or note"
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

export default SimpleFinanceManagementPage;