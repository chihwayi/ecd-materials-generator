const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { FeeConfiguration, StudentFeeAssignment, Student, Payment } = require('../models');

// Get fee assignments with calculated term totals
router.get('/fee-assignments', authenticateToken, requireRole(['school_admin', 'finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const currentYear = new Date().getFullYear();
    
    const assignments = await StudentFeeAssignment.findAll({
      include: [
        {
          model: Student,
          where: { schoolId },
          attributes: ['id', 'firstName', 'lastName', 'parentContact']
        },
        {
          model: FeeConfiguration,
          where: { year: currentYear, isActive: true }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate term totals based on payment plan
    const assignmentsWithTermTotal = assignments.map(assignment => {
      const feeConfig = assignment.FeeConfiguration;
      let termTotal;
      
      if (assignment.paymentPlan === 'monthly') {
        // Monthly plan: monthly amount × 3 months = term total
        termTotal = feeConfig.monthlyAmount * 3;
      } else {
        // Term plan: just the term amount
        termTotal = feeConfig.termAmount;
      }
      
      return {
        id: assignment.id,
        studentId: assignment.studentId,
        paymentPlan: assignment.paymentPlan,
        totalAmount: assignment.totalAmount,
        paidAmount: assignment.paidAmount,
        balanceAmount: assignment.balanceAmount,
        status: assignment.status,
        student: assignment.Student,
        termTotal: parseFloat(termTotal)
      };
    });
    
    res.json({ success: true, assignments: assignmentsWithTermTotal });
  } catch (error) {
    console.error('Error fetching fee assignments:', error);
    res.status(500).json({ error: 'Failed to fetch fee assignments' });
  }
});

// Get payments
router.get('/payments', authenticateToken, requireRole(['school_admin', 'finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    
    const payments = await Payment.findAll({
      include: [
        {
          model: Student,
          where: { schoolId },
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['paymentDate', 'DESC']],
      limit: 50
    });
    
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Record payment
router.post('/payments', authenticateToken, requireRole(['school_admin', 'finance_manager']), async (req, res) => {
  try {
    const { feeAssignmentId, studentId, amount, paymentMethod, paymentDate, reference } = req.body;
    
    const assignment = await StudentFeeAssignment.findByPk(feeAssignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Fee assignment not found' });
    }
    
    if (amount > assignment.balanceAmount) {
      return res.status(400).json({ error: 'Payment amount exceeds balance' });
    }
    
    // Create payment record
    const payment = await Payment.create({
      studentId,
      feeAssignmentId,
      amount,
      paymentMethod,
      paymentDate,
      reference
    });
    
    // Update assignment
    const newPaidAmount = parseFloat(assignment.paidAmount) + parseFloat(amount);
    const newBalanceAmount = parseFloat(assignment.totalAmount) - newPaidAmount;
    
    let newStatus = 'pending';
    if (newBalanceAmount <= 0) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    }
    
    await assignment.update({
      paidAmount: newPaidAmount,
      balanceAmount: Math.max(0, newBalanceAmount),
      status: newStatus
    });
    
    res.json({ success: true, payment, assignment });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

module.exports = router;