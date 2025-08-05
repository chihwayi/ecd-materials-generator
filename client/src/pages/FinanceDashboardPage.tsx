import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  grade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  class?: {
    id: string;
    name: string;
    grade: string;
  };
}

interface StudentFee {
  id: string;
  amount: number;
  paidAmount: number;
  status: 'not_paid' | 'partially_paid' | 'fully_paid';
  dueDate: string;
  paymentType: 'monthly' | 'term';
  academicYear: string;
  term?: string;
  month?: string;
  feeStructure: {
    name: string;
    type: string;
    description?: string;
  };
}

interface FeePayment {
  id: string;
  amount: number;
  paymentMethod: string;
  receiptNumber?: string;
  paymentDate: string;
  notes?: string;
  studentId: string;
  feeStructureId: string;
  student?: {
    firstName: string;
    lastName: string;
  };
  feeStructure?: {
    name: string;
    type: string;
  };
  recordedByUser?: {
    firstName: string;
    lastName: string;
  };
}

interface FeeStructure {
  id: string;
  name: string;
  type: string;
  category: string;
  frequency: string;
  amount: string;
  description?: string;
  academicYear: string;
}

const FinanceDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, Student[]>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [studentPayments, setStudentPayments] = useState<FeePayment[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFeeStructure, setSelectedFeeStructure] = useState<FeeStructure | null>(null);
  const [showServicePreferencesModal, setShowServicePreferencesModal] = useState(false);
  const [selectedStudentForServices, setSelectedStudentForServices] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Student service preferences state
  const [studentServices, setStudentServices] = useState<Record<string, {
    tuitionType: 'monthly' | 'term' | null;
    transport: boolean;
    food: boolean;
    activities: boolean;
    auxiliary: boolean;
  }>>({});

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    receiptNumber: '',
    notes: '',
    academicYear: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchStudents();
    fetchFeeStructures();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoadingStudents(true);
      console.log('Fetching students for finance role...');
      const response = await api.get('/finance/students');
      console.log('Students response:', response.data);
      setStudentsByClass(response.data.studentsByClass);
      
      // Calculate total students
      const total = Object.values(response.data.studentsByClass).reduce((sum: number, students: any) => sum + students.length, 0);
      setTotalStudents(total);
    } catch (error) {
      console.error('Error fetching students:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      }
      // Set empty state to prevent infinite loading
      setStudentsByClass({});
    } finally {
      setIsLoadingStudents(false);
      setLoading(false);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      console.log('Fetching fee structures...');
      const response = await api.get('/fees/structures');
      console.log('Fee structures response:', response.data);
      setFeeStructures(response.data);
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      }
    }
  };

  const fetchStudentFees = async (studentId: string) => {
    try {
      console.log('Fetching fees for student:', studentId);
      const response = await api.get(`/finance/students/${studentId}/fees`);
      console.log('Student fees response:', response.data);
      setSelectedStudent(response.data.student);
      
      // Also fetch all payments for this student
      const paymentsResponse = await api.get('/fees/payments');
      console.log('Payments response:', paymentsResponse.data);
      
      // Filter payments for this specific student
      const studentPayments = paymentsResponse.data.filter((payment: any) => 
        payment.studentId === studentId
      );
      setStudentPayments(studentPayments);
    } catch (error) {
      console.error('Error fetching student fees:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
      }
      // Set empty state to prevent errors
      setStudentPayments([]);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeStructure || !selectedStudent) return;

    try {
      console.log('Recording payment for student:', selectedStudent.id, 'fee structure:', selectedFeeStructure.id);
      
      const paymentPayload = {
        studentId: selectedStudent.id,
        feeStructureId: selectedFeeStructure.id,
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentDate: new Date().toISOString().split('T')[0], // Today's date
        academicYear: paymentData.academicYear,
        receiptNumber: paymentData.receiptNumber || undefined,
        notes: paymentData.notes || undefined
      };

      console.log('Payment payload:', paymentPayload);

      const response = await api.post('/fees/payments', paymentPayload);
      console.log('Payment recorded successfully:', response.data);

      setShowPaymentModal(false);
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        receiptNumber: '',
        notes: '',
        academicYear: new Date().getFullYear().toString()
      });
      setSelectedFeeStructure(null);

      // Refresh student data
      if (selectedStudent) {
        fetchStudentFees(selectedStudent.id);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      if (error.response) {
        console.error('Backend error:', error.response.data);
        alert(`Failed to record payment: ${error.response.data.error || 'Unknown error'}`);
      } else {
        alert('Failed to record payment. Please try again.');
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'bank_transfer': return '🏦';
      case 'mobile_money': return '📱';
      case 'check': return '💳';
      default: return '💰';
    }
  };

  // Get all students flattened for filtering and pagination
  const allStudents = Object.entries(studentsByClass).flatMap(([className, students]) =>
    students.map(student => ({ ...student, className }))
  );

  // Filter students by search term and class
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  // Get unique class names for filter
  const classNames = Object.keys(studentsByClass);

  // Calculate total fee value based on parent's choice (monthly vs term) and optional services
  const calculateTotalFeeValue = () => {
    const tuitionFees = feeStructures.filter(fee => fee.type === 'monthly' || fee.type === 'term');
    const optionalServices = feeStructures.filter(fee => 
      fee.type === 'transport' || fee.type === 'food' || fee.type === 'activities' || fee.type === 'auxiliary'
    );
    
    // Parent chooses either monthly OR term fees, not both
    const monthlyTuition = tuitionFees.find(fee => fee.type === 'monthly');
    const termTuition = tuitionFees.find(fee => fee.type === 'term');
    
    let tuitionValue = 0;
    if (monthlyTuition) {
      // If monthly tuition is chosen, multiply by 3 months
      tuitionValue = parseFloat(monthlyTuition.amount) * 3;
    } else if (termTuition) {
      // If term tuition is chosen, use the term amount
      tuitionValue = parseFloat(termTuition.amount);
    }
    
    // Optional services are added based on parent's choice (to be toggled by finance manager)
    // For now, we'll show all optional services as available
    const optionalServicesValue = optionalServices.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
    
    return tuitionValue + optionalServicesValue;
  };

  // Calculate fees for a specific student based on their service preferences
  const calculateStudentFees = (studentId: string) => {
    const studentPrefs = studentServices[studentId] || {
      tuitionType: null,
      transport: false,
      food: false,
      activities: false,
      auxiliary: false
    };

    let totalFees = 0;
    const applicableFees: FeeStructure[] = [];

    // Add tuition based on student's choice
    if (studentPrefs.tuitionType) {
      const tuitionFee = feeStructures.find(fee => fee.type === studentPrefs.tuitionType);
      if (tuitionFee) {
        if (studentPrefs.tuitionType === 'monthly') {
          totalFees += parseFloat(tuitionFee.amount) * 3;
        } else {
          totalFees += parseFloat(tuitionFee.amount);
        }
        applicableFees.push(tuitionFee);
      }
    }

    // Add optional services based on student's preferences
    feeStructures.forEach(fee => {
      if (fee.type === 'transport' && studentPrefs.transport) {
        totalFees += parseFloat(fee.amount);
        applicableFees.push(fee);
      } else if (fee.type === 'food' && studentPrefs.food) {
        totalFees += parseFloat(fee.amount);
        applicableFees.push(fee);
      } else if (fee.type === 'activities' && studentPrefs.activities) {
        totalFees += parseFloat(fee.amount);
        applicableFees.push(fee);
      } else if (fee.type === 'auxiliary' && studentPrefs.auxiliary) {
        totalFees += parseFloat(fee.amount);
        applicableFees.push(fee);
      }
    });

    return { totalFees, applicableFees };
  };

  const totalFeeValue = calculateTotalFeeValue();

  // Determine which tuition option is active
  const getActiveTuitionOption = () => {
    const monthlyTuition = feeStructures.find(fee => fee.type === 'monthly');
    const termTuition = feeStructures.find(fee => fee.type === 'term');
    
    if (monthlyTuition) {
      return { type: 'monthly', fee: monthlyTuition, total: parseFloat(monthlyTuition.amount) * 3 };
    } else if (termTuition) {
      return { type: 'term', fee: termTuition, total: parseFloat(termTuition.amount) };
    }
    return null;
  };

  const activeTuition = getActiveTuitionOption();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fee recording system... 💰</p>
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
                💰 Finance Role Dashboard
              </h1>
              <p className="text-blue-100 text-lg">
                Record student fee payments and track balances for Finance Managers
              </p>
              <p className="text-blue-200 text-sm mt-2">
                🎯 You are accessing the Finance Role Dashboard
              </p>
            </div>
            <div className="text-6xl opacity-20">📊</div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fee Structures</p>
                <p className="text-2xl font-bold text-gray-900">{feeStructures.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fee Value</p>
                <p className="text-2xl font-bold text-purple-900">
                  ${totalFeeValue.toLocaleString()}
                </p>
                {activeTuition && (
                  <p className="text-xs text-purple-600 mt-1">
                    {activeTuition.type === 'monthly' 
                      ? `📅 Monthly tuition: $${activeTuition.fee.amount} × 3 months = $${activeTuition.total}`
                      : `📚 Term tuition: $${activeTuition.total} (one-time)`
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${studentPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name or parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
            
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classNames.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>

            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-300">
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Students ({filteredStudents.length})</h2>
              
              {/* Students List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoadingStudents ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading students...</p>
                  </div>
                ) : (
                  paginatedStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => fetchStudentFees(student.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === student.id 
                          ? 'bg-blue-100 border-2 border-blue-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.parentName} • {student.className}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{student.age} years</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                      Showing {startIndex + 1}-{Math.min(startIndex + studentsPerPage, filteredStudents.length)} of {filteredStudents.length} students
                    </span>
                    <span className="text-xs">
                      Total: {totalStudents} students
                    </span>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                  
                  {/* Quick Page Navigation for Large Datasets */}
                  {totalPages > 10 && (
                    <div className="flex justify-center items-center space-x-1">
                      {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-2 py-1 text-xs rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-500 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 10 && (
                        <span className="px-2 py-1 text-xs text-gray-500">...</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Student Fee Details */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <p className="text-gray-600">
                      {selectedStudent.parentName} • {selectedStudent.class?.name || 'No Class'} • {selectedStudent.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Age: {selectedStudent.age}</p>
                    <p className="text-sm text-gray-500">{selectedStudent.parentEmail}</p>
                    <button
                      onClick={() => {
                        setSelectedStudentForServices(selectedStudent);
                        setShowServicePreferencesModal(true);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm transition-colors hover:bg-blue-600"
                    >
                      ⚙️ Manage Services
                    </button>
                  </div>
                </div>

                {/* Fee Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Student's Total Fees</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${(() => {
                        const { totalFees } = calculateStudentFees(selectedStudent.id);
                        return totalFees.toFixed(2);
                      })()}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Paid</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${studentPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Balance Due</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ${(() => {
                        const { totalFees } = calculateStudentFees(selectedStudent.id);
                        const totalPaid = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
                        return Math.max(0, totalFees - totalPaid).toFixed(2);
                      })()}
                    </p>
                  </div>
                </div>

                {/* Fee Details */}
                <div className="mb-6">
                  {/* Tuition Choice Explanation */}
                  {activeTuition && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">💰 Tuition Fee Choice</h4>
                      <p className="text-sm text-blue-800">
                        {activeTuition.type === 'monthly' 
                          ? `Parents have chosen <strong>Monthly Tuition</strong> ($${activeTuition.fee.amount}/month × 3 months = $${activeTuition.total}). This option spreads payments over time but costs more overall.`
                          : `Parents have chosen <strong>Term Tuition</strong> ($${activeTuition.total} one-time). This option is cheaper overall but requires upfront payment.`
                        }
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        💡 Only one tuition option can be active at a time. Other fees (transport, food, activities) are added to the chosen tuition option.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Student's Applicable Fees</h3>
                    <div className="flex items-center space-x-2">
                      {activeTuition && (
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {activeTuition.type === 'monthly' ? '📅 Monthly Tuition Active' : '📚 Term Tuition Active'}
                        </div>
                      )}
                      <label className="text-sm text-gray-600">Sort by:</label>
                      <select
                        onChange={(e) => {
                          const sortBy = e.target.value;
                          const sorted = [...feeStructures].sort((a, b) => {
                            switch (sortBy) {
                              case 'amount':
                                return parseFloat(b.amount) - parseFloat(a.amount);
                              case 'name':
                                return a.name.localeCompare(b.name);
                              case 'type':
                                return a.type.localeCompare(b.type);
                              case 'frequency':
                                return a.frequency.localeCompare(b.frequency);
                              default:
                                return 0;
                            }
                          });
                          setFeeStructures(sorted);
                        }}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="amount">Amount (High to Low)</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="type">Type (A-Z)</option>
                        <option value="frequency">Frequency (A-Z)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(() => {
                      const { applicableFees } = calculateStudentFees(selectedStudent.id);
                      return applicableFees.length > 0 ? (
                        applicableFees.map((fee) => {
                          // Calculate monthly equivalent for comparison
                          const monthlyEquivalent = fee.frequency === 'monthly' 
                            ? parseFloat(fee.amount) 
                            : parseFloat(fee.amount) / 3;
                          
                          return (
                            <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-medium text-gray-900">{fee.name}</p>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    fee.frequency === 'monthly' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {fee.frequency === 'monthly' ? '📅 Monthly' : '📚 Term'}
                                  </span>
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                    ✅ Applicable
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Amount: ${fee.amount} • Academic Year: {fee.academicYear} • Type: {fee.type}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Description: {fee.description || 'N/A'}
                                </p>
                                {fee.frequency === 'monthly' ? (
                                  <p className="text-xs text-blue-600 mt-1">
                                    💡 Monthly payment: ${fee.amount} per month
                                  </p>
                                ) : (
                                  <p className="text-xs text-green-600 mt-1">
                                    💡 Term payment: ${fee.amount} for 3 months (${monthlyEquivalent.toFixed(2)}/month equivalent)
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${fee.amount}</p>
                                <p className="text-xs text-gray-500">
                                  {fee.frequency === 'monthly' ? 'Monthly' : 'Term (3 months)'}
                                </p>
                                <button
                                  onClick={() => {
                                    setSelectedFeeStructure(fee);
                                    setShowPaymentModal(true);
                                  }}
                                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded text-sm transition-colors hover:bg-green-600"
                                >
                                  Record Payment
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <p>No fees are currently applicable for this student.</p>
                          <p className="text-sm mt-2">Click "Manage Services" to configure their fee preferences.</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                    {studentPayments.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-600">Sort by:</label>
                        <select
                          onChange={(e) => {
                            const sortBy = e.target.value;
                            const sorted = [...studentPayments].sort((a, b) => {
                              switch (sortBy) {
                                case 'date':
                                  return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
                                case 'amount':
                                  return b.amount - a.amount;
                                case 'method':
                                  return a.paymentMethod.localeCompare(b.paymentMethod);
                                default:
                                  return 0;
                              }
                            });
                            setStudentPayments(sorted);
                          }}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="date">Date (Recent First)</option>
                          <option value="amount">Amount (High to Low)</option>
                          <option value="method">Payment Method (A-Z)</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {studentPayments.length > 0 ? (
                      studentPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.feeStructure?.name || 'Unknown Fee'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                              </p>
                              {payment.notes && (
                                <p className="text-sm text-gray-500">{payment.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${payment.amount}</p>
                            <p className="text-sm text-gray-600">
                              by {payment.recordedByUser?.firstName || 'Unknown'} {payment.recordedByUser?.lastName || ''}
                            </p>
                            {payment.receiptNumber && (
                              <p className="text-xs text-gray-500">Receipt: {payment.receiptNumber}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No payment history found for this student.</p>
                        <p className="text-sm mt-2">Record a payment using the fee structures above.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Student</h3>
                <p className="text-gray-600">Choose a student from the list to view their fee details and record payments</p>
              </div>
            )}
          </div>
        </div>

        {/* Record Payment Modal */}
        {showPaymentModal && selectedFeeStructure && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Record Payment</h3>
              <form onSubmit={handleRecordPayment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fee</label>
                    <p className="text-gray-900 font-medium">{selectedFeeStructure.name}</p>
                    <p className="text-sm text-gray-600">
                      Amount: ${selectedFeeStructure.amount} • Academic Year: {selectedFeeStructure.academicYear}
                    </p>
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Payment Schedule:</span> {
                          selectedFeeStructure.frequency === 'monthly' 
                            ? `$${selectedFeeStructure.amount} per month` 
                            : `$${selectedFeeStructure.amount} for 3 months (${(parseFloat(selectedFeeStructure.amount) / 3).toFixed(2)}/month equivalent)`
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedFeeStructure.frequency === 'monthly' 
                          ? '📅 Monthly payments are typically higher but spread over time'
                          : '📚 Term payments are cheaper overall but paid upfront'
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      max={selectedFeeStructure.amount}
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum: ${selectedFeeStructure.amount} ({selectedFeeStructure.frequency === 'monthly' ? 'monthly' : 'term'} fee)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={paymentData.paymentMethod}
                      onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="check">Check</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Number (Optional)</label>
                    <input
                      type="text"
                      value={paymentData.receiptNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, receiptNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
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

        {/* Service Preferences Modal */}
        {showServicePreferencesModal && selectedStudentForServices && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Service Preferences - {selectedStudentForServices.firstName} {selectedStudentForServices.lastName}
              </h3>
              
              <div className="space-y-6">
                {/* Tuition Choice */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">💰 Tuition Fee Choice</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="tuitionType"
                        value="monthly"
                        checked={studentServices[selectedStudentForServices.id]?.tuitionType === 'monthly'}
                        onChange={(e) => {
                          setStudentServices(prev => ({
                            ...prev,
                            [selectedStudentForServices.id]: {
                              ...prev[selectedStudentForServices.id],
                              tuitionType: 'monthly' as const
                            }
                          }));
                        }}
                        className="text-blue-600"
                      />
                      <span className="text-gray-900">📅 Monthly Tuition (spread over 3 months)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="tuitionType"
                        value="term"
                        checked={studentServices[selectedStudentForServices.id]?.tuitionType === 'term'}
                        onChange={(e) => {
                          setStudentServices(prev => ({
                            ...prev,
                            [selectedStudentForServices.id]: {
                              ...prev[selectedStudentForServices.id],
                              tuitionType: 'term' as const
                            }
                          }));
                        }}
                        className="text-blue-600"
                      />
                      <span className="text-gray-900">📚 Term Tuition (one-time payment)</span>
                    </label>
                  </div>
                </div>

                {/* Optional Services */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🚌 Optional Services</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={studentServices[selectedStudentForServices.id]?.transport || false}
                          onChange={(e) => {
                            setStudentServices(prev => ({
                              ...prev,
                              [selectedStudentForServices.id]: {
                                ...prev[selectedStudentForServices.id],
                                transport: e.target.checked
                              }
                            }));
                          }}
                          className="text-blue-600"
                        />
                        <span className="text-gray-900">🚌 Transport Service</span>
                      </div>
                      <span className="text-sm text-gray-600">$40/month</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={studentServices[selectedStudentForServices.id]?.food || false}
                          onChange={(e) => {
                            setStudentServices(prev => ({
                              ...prev,
                              [selectedStudentForServices.id]: {
                                ...prev[selectedStudentForServices.id],
                                food: e.target.checked
                              }
                            }));
                          }}
                          className="text-blue-600"
                        />
                        <span className="text-gray-900">🍽️ Food Service</span>
                      </div>
                      <span className="text-sm text-gray-600">$40/month</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={studentServices[selectedStudentForServices.id]?.activities || false}
                          onChange={(e) => {
                            setStudentServices(prev => ({
                              ...prev,
                              [selectedStudentForServices.id]: {
                                ...prev[selectedStudentForServices.id],
                                activities: e.target.checked
                              }
                            }));
                          }}
                          className="text-blue-600"
                        />
                        <span className="text-gray-900">🎨 Activities & Leisure</span>
                      </div>
                      <span className="text-sm text-gray-600">$30/month</span>
                    </label>
                    
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={studentServices[selectedStudentForServices.id]?.auxiliary || false}
                          onChange={(e) => {
                            setStudentServices(prev => ({
                              ...prev,
                              [selectedStudentForServices.id]: {
                                ...prev[selectedStudentForServices.id],
                                auxiliary: e.target.checked
                              }
                            }));
                          }}
                          className="text-blue-600"
                        />
                        <span className="text-gray-900">🔧 Auxiliary Services</span>
                      </div>
                      <span className="text-sm text-gray-600">$20/month</span>
                    </label>
                  </div>
                </div>

                {/* Total Calculation */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">💰 Total Calculation</h4>
                  {(() => {
                    const { totalFees, applicableFees } = calculateStudentFees(selectedStudentForServices.id);
                    return (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Selected Services:</p>
                        <ul className="text-sm text-gray-700 mb-3">
                          {applicableFees.map(fee => (
                            <li key={fee.id} className="flex justify-between">
                              <span>{fee.name}</span>
                              <span>${fee.amount}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t pt-2">
                          <p className="text-lg font-bold text-gray-900 flex justify-between">
                            <span>Total:</span>
                            <span>${totalFees.toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowServicePreferencesModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-200"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowServicePreferencesModal(false)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
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

export default FinanceDashboardPage;