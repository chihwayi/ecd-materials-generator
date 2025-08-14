const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { Student, StudentFeeAssignment, StudentServiceSelection, Payment, OptionalService, FeeConfiguration } = require('../models');
const { Op } = require('sequelize');

// Get students with their fee balances (Finance Manager view)
router.get('/students-balances', authenticateToken, requireRole(['finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { status = 'all' } = req.query;
    
    const students = await Student.findAll({
      where: { schoolId },
      include: [
        {
          model: StudentFeeAssignment,
          as: 'feeAssignments',
          include: [{ model: FeeConfiguration, as: 'feeConfiguration' }]
        },
        {
          model: StudentServiceSelection,
          as: 'serviceSelections',
          include: [{ model: OptionalService, as: 'optionalService' }],
          where: { isSelected: true },
          required: false
        }
      ]
    });
    
    const studentsWithBalances = students.map(student => {
      const feeBalance = student.feeAssignments.reduce((sum, assignment) => 
        sum + parseFloat(assignment.balanceAmount || 0), 0);
      
      const serviceBalance = student.serviceSelections.reduce((sum, selection) => 
        sum + (parseFloat(selection.optionalService.amount) - parseFloat(selection.paidAmount || 0)), 0);
      
      const totalBalance = feeBalance + serviceBalance;
      
      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        className: student.className,
        feeBalance: parseFloat(feeBalance.toFixed(2)),
        serviceBalance: parseFloat(serviceBalance.toFixed(2)),
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        status: totalBalance === 0 ? 'paid' : totalBalance > 0 ? 'pending' : 'overpaid'
      };
    });
    
    // Filter by status
    const filteredStudents = status === 'all' ? studentsWithBalances :
      studentsWithBalances.filter(s => s.status === status);
    
    res.json({ success: true, students: filteredStudents });
  } catch (error) {
    console.error('Error fetching student balances:', error);
    res.status(500).json({ error: 'Failed to fetch student balances' });
  }
});

// Get detailed student payment info
router.get('/student/:studentId/details', authenticateToken, requireRole(['finance_manager']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const schoolId = req.user.schoolId;
    
    const student = await Student.findOne({
      where: { id: studentId, schoolId },
      include: [
        {
          model: StudentFeeAssignment,
          as: 'feeAssignments',
          include: [{ model: FeeConfiguration, as: 'feeConfiguration' }]
        },
        {
          model: StudentServiceSelection,
          as: 'serviceSelections',
          include: [{ model: OptionalService, as: 'optionalService' }]
        }
      ]
    });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Get payment history
    const payments = await Payment.findAll({
      where: { studentId, schoolId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, student, payments });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

// Record payment
router.post('/record-payment', authenticateToken, requireRole(['finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { studentId, paymentType, referenceId, amount, paymentMethod, description } = req.body;
    
    // Create payment record
    const payment = await Payment.create({
      studentId,
      schoolId,
      paymentType,
      referenceId,
      amount,
      paymentMethod,
      description,
      receiptNumber: `RCP-${Date.now()}`,
      recordedBy: req.user.id
    });
    
    // Update balance based on payment type
    if (paymentType === 'tuition') {
      const feeAssignment = await StudentFeeAssignment.findByPk(referenceId);
      if (feeAssignment) {
        const newPaidAmount = parseFloat(feeAssignment.paidAmount) + parseFloat(amount);
        const newBalanceAmount = parseFloat(feeAssignment.totalAmount) - newPaidAmount;
        
        await feeAssignment.update({
          paidAmount: newPaidAmount,
          balanceAmount: Math.max(0, newBalanceAmount),
          status: newBalanceAmount <= 0 ? 'paid' : 'partial'
        });
      }
    } else if (paymentType === 'service') {
      const serviceSelection = await StudentServiceSelection.findByPk(referenceId);
      if (serviceSelection) {
        const newPaidAmount = parseFloat(serviceSelection.paidAmount) + parseFloat(amount);
        await serviceSelection.update({
          paidAmount: newPaidAmount,
          status: 'paid'
        });
      }
    }
    
    res.json({ success: true, payment });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Get payment summary (Finance Manager view - limited)
router.get('/payment-summary', authenticateToken, requireRole(['finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { period = 'month' } = req.query;
    
    const now = new Date();
    let startDate;
    
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'term') {
      // Approximate term start (4 months ago)
      startDate = new Date(now.getFullYear(), now.getMonth() - 4, 1);
    }
    
    const payments = await Payment.findAll({
      where: {
        schoolId,
        createdAt: { [Op.gte]: startDate }
      }
    });
    
    const totalCollected = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const tuitionPayments = payments.filter(p => p.paymentType === 'tuition');
    const servicePayments = payments.filter(p => p.paymentType === 'service');
    
    // Get outstanding balances
    const students = await Student.findAll({
      where: { schoolId },
      include: [
        { model: StudentFeeAssignment, as: 'feeAssignments' },
        { model: StudentServiceSelection, as: 'serviceSelections', where: { isSelected: true }, required: false }
      ]
    });
    
    let totalOutstanding = 0;
    students.forEach(student => {
      student.feeAssignments.forEach(assignment => {
        totalOutstanding += parseFloat(assignment.balanceAmount || 0);
      });
    });
    
    res.json({
      success: true,
      summary: {
        totalCollected: parseFloat(totalCollected.toFixed(2)),
        tuitionCollected: parseFloat(tuitionPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)),
        serviceCollected: parseFloat(servicePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)),
        totalOutstanding: parseFloat(totalOutstanding.toFixed(2)),
        totalPayments: payments.length
      }
    });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    res.status(500).json({ error: 'Failed to fetch payment summary' });
  }
});

module.exports = router;