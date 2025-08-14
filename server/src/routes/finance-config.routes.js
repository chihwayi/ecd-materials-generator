const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { FeeConfiguration, OptionalService, Student, StudentFeeAssignment, StudentServiceSelection } = require('../models');

// Get current fee configuration
router.get('/fee-config', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const currentYear = new Date().getFullYear();
    
    const feeConfig = await FeeConfiguration.findOne({
      where: { schoolId, year: currentYear, isActive: true }
    });
    
    res.json({ success: true, feeConfig });
  } catch (error) {
    console.error('Error fetching fee config:', error);
    res.status(500).json({ error: 'Failed to fetch fee configuration' });
  }
});

// Set fee configuration
router.post('/fee-config', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { monthlyAmount, termAmount, term } = req.body;
    const currentYear = new Date().getFullYear();
    
    // Deactivate existing config
    await FeeConfiguration.update(
      { isActive: false },
      { where: { schoolId, year: currentYear } }
    );
    
    // Create new config with both amounts
    const feeConfig = await FeeConfiguration.create({
      schoolId,
      feeType: 'flexible', // Both monthly and term available
      monthlyAmount,
      termAmount,
      term,
      year: currentYear
    });
    
    res.json({ success: true, feeConfig });
  } catch (error) {
    console.error('Error setting fee config:', error);
    res.status(500).json({ error: 'Failed to set fee configuration' });
  }
});

// Get optional services
router.get('/optional-services', authenticateToken, requireRole(['school_admin', 'finance_manager']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const currentYear = new Date().getFullYear();
    
    const services = await OptionalService.findAll({
      where: { schoolId, year: currentYear, isActive: true },
      order: [['category', 'ASC'], ['name', 'ASC']]
    });
    
    // Group by category
    const groupedServices = {
      food: services.filter(s => s.category === 'food'),
      transport: services.filter(s => s.category === 'transport'),
      uniform: services.filter(s => s.category === 'uniform'),
      amenity: services.filter(s => s.category === 'amenity')
    };
    
    res.json({ success: true, services: groupedServices });
  } catch (error) {
    console.error('Error fetching optional services:', error);
    res.status(500).json({ error: 'Failed to fetch optional services' });
  }
});

// Add optional service
router.post('/optional-services', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { name, category, amount, description, term } = req.body;
    const currentYear = new Date().getFullYear();
    
    const service = await OptionalService.create({
      schoolId,
      name,
      category,
      amount,
      description,
      term,
      year: currentYear
    });
    
    res.json({ success: true, service });
  } catch (error) {
    console.error('Error adding optional service:', error);
    res.status(500).json({ error: 'Failed to add optional service' });
  }
});

// Update optional service
router.put('/optional-services/:id', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, description, isActive } = req.body;
    
    const service = await OptionalService.findByPk(id);
    if (!service || service.schoolId !== req.user.schoolId) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    await service.update({ name, amount, description, isActive });
    
    res.json({ success: true, service });
  } catch (error) {
    console.error('Error updating optional service:', error);
    res.status(500).json({ error: 'Failed to update optional service' });
  }
});

// Assign fees to all students with default monthly plan
router.post('/assign-fees', authenticateToken, requireRole(['school_admin']), async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { feeConfigurationId } = req.body;
    
    const feeConfig = await FeeConfiguration.findByPk(feeConfigurationId);
    if (!feeConfig || feeConfig.schoolId !== schoolId) {
      return res.status(404).json({ error: 'Fee configuration not found' });
    }
    
    const students = await Student.findAll({ where: { schoolId } });
    
    const assignments = [];
    for (const student of students) {
      // Check if assignment already exists
      const existing = await StudentFeeAssignment.findOne({
        where: { studentId: student.id, feeConfigurationId }
      });
      
      if (!existing) {
        // Default to monthly plan, can be changed later
        const assignment = await StudentFeeAssignment.create({
          studentId: student.id,
          feeConfigurationId,
          paymentPlan: 'monthly',
          totalAmount: feeConfig.monthlyAmount,
          balanceAmount: feeConfig.monthlyAmount
        });
        assignments.push(assignment);
      }
    }
    
    res.json({ success: true, assignmentsCreated: assignments.length });
  } catch (error) {
    console.error('Error assigning fees:', error);
    res.status(500).json({ error: 'Failed to assign fees' });
  }
});

// Update student payment plan
router.put('/student-payment-plan/:studentId', authenticateToken, requireRole(['school_admin', 'finance_manager']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { paymentPlan, feeConfigurationId } = req.body;
    
    const assignment = await StudentFeeAssignment.findOne({
      where: { studentId, feeConfigurationId }
    });
    
    if (!assignment) {
      return res.status(404).json({ error: 'Fee assignment not found' });
    }
    
    const feeConfig = await FeeConfiguration.findByPk(feeConfigurationId);
    const newTotalAmount = paymentPlan === 'monthly' ? feeConfig.monthlyAmount : feeConfig.termAmount;
    const newBalanceAmount = newTotalAmount - assignment.paidAmount;
    
    await assignment.update({
      paymentPlan,
      totalAmount: newTotalAmount,
      balanceAmount: newBalanceAmount
    });
    
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('Error updating payment plan:', error);
    res.status(500).json({ error: 'Failed to update payment plan' });
  }
});

module.exports = router;