const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { Student, StudentFeeAssignment, StudentServiceSelection, Payment, OptionalService, FeeConfiguration } = require('../models');
const { Op } = require('sequelize');

// Get comprehensive financial analytics (School Admin only)
router.get('/financial-analytics', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { period = 'term' } = req.query;
    
    const now = new Date();
    let startDate;
    
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'term') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 4, 1);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    // Get all payments
    const allPayments = await Payment.findAll({
      where: { schoolId },
      order: [['createdAt', 'DESC']]
    });
    
    const periodPayments = allPayments.filter(p => new Date(p.createdAt) >= startDate);
    
    // Revenue breakdown
    const totalRevenue = allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const periodRevenue = periodPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const tuitionRevenue = allPayments.filter(p => p.paymentType === 'tuition').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const serviceRevenue = allPayments.filter(p => p.paymentType === 'service').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    // Outstanding amounts
    const students = await Student.findAll({
      where: { schoolId },
      include: [
        { model: StudentFeeAssignment, as: 'feeAssignments' },
        { model: StudentServiceSelection, as: 'serviceSelections', where: { isSelected: true }, required: false }
      ]
    });
    
    let totalOutstanding = 0;
    let tuitionOutstanding = 0;
    let serviceOutstanding = 0;
    
    students.forEach(student => {
      student.feeAssignments.forEach(assignment => {
        const balance = parseFloat(assignment.balanceAmount || 0);
        totalOutstanding += balance;
        tuitionOutstanding += balance;
      });
      
      student.serviceSelections.forEach(selection => {
        if (selection.optionalService) {
          const balance = parseFloat(selection.optionalService.amount) - parseFloat(selection.paidAmount || 0);
          if (balance > 0) {
            totalOutstanding += balance;
            serviceOutstanding += balance;
          }
        }
      });
    });
    
    // Payment trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthPayments = allPayments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });
      
      const monthRevenue = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: parseFloat(monthRevenue.toFixed(2)),
        payments: monthPayments.length
      });
    }
    
    // Service category breakdown
    const serviceCategories = await OptionalService.findAll({
      where: { schoolId, isActive: true },
      include: [{
        model: StudentServiceSelection,
        as: 'serviceSelections',
        where: { isSelected: true },
        required: false
      }]
    });
    
    const categoryBreakdown = {};
    serviceCategories.forEach(service => {
      if (!categoryBreakdown[service.category]) {
        categoryBreakdown[service.category] = { revenue: 0, count: 0 };
      }
      
      service.serviceSelections.forEach(selection => {
        categoryBreakdown[service.category].revenue += parseFloat(selection.paidAmount || 0);
        categoryBreakdown[service.category].count += 1;
      });
    });
    
    res.json({
      success: true,
      analytics: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        periodRevenue: parseFloat(periodRevenue.toFixed(2)),
        tuitionRevenue: parseFloat(tuitionRevenue.toFixed(2)),
        serviceRevenue: parseFloat(serviceRevenue.toFixed(2)),
        totalOutstanding: parseFloat(totalOutstanding.toFixed(2)),
        tuitionOutstanding: parseFloat(tuitionOutstanding.toFixed(2)),
        serviceOutstanding: parseFloat(serviceOutstanding.toFixed(2)),
        totalStudents: students.length,
        totalPayments: allPayments.length,
        monthlyTrends,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    res.status(500).json({ error: 'Failed to fetch financial analytics' });
  }
});

// Get detailed revenue reports (School Admin only)
router.get('/revenue-reports', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { startDate, endDate, category = 'all' } = req.query;
    
    let whereClause = { schoolId };
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    if (category !== 'all') {
      whereClause.paymentType = category;
    }
    
    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        { model: Student, as: 'student', attributes: ['firstName', 'lastName', 'className'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    res.json({
      success: true,
      report: {
        payments,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        totalCount: payments.length,
        period: { startDate, endDate },
        category
      }
    });
  } catch (error) {
    console.error('Error fetching revenue reports:', error);
    res.status(500).json({ error: 'Failed to fetch revenue reports' });
  }
});

module.exports = router;