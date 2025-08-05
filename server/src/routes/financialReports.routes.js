const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  generateReport,
  getSchoolReports,
  getReport,
  deleteReport,
  exportReport
} = require('../controllers/financialReports.controller');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Generate new financial report
router.post('/generate', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access. Only administrators can generate financial reports.'
    });
  }
  
  await generateReport(req, res);
});

// Get all reports for a school
router.get('/school/:schoolId', async (req, res) => {
  // Check if user is admin and belongs to the school
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  if (req.user.role === 'school_admin' && req.user.schoolId !== req.params.schoolId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access to this school'
    });
  }
  
  await getSchoolReports(req, res);
});

// Get specific report
router.get('/:reportId', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  await getReport(req, res);
});

// Delete report
router.delete('/:reportId', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  await deleteReport(req, res);
});

// Export report
router.get('/:reportId/export', async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  await exportReport(req, res);
});

module.exports = router; 