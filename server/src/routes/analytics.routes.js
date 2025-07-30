const express = require('express');
const router = express.Router();
const {
  getSystemStats,
  getUserGrowthAnalytics,
  getSchoolAnalytics,
  getSystemPerformance
} = require('../controllers/analytics.controller');
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');

// System analytics routes (system admin only)
router.get('/system/stats', authenticateToken, requireRole(['system_admin']), getSystemStats);
router.get('/system/performance', authenticateToken, requireRole(['system_admin']), getSystemPerformance);
router.get('/users/growth', authenticateToken, requireRole(['system_admin']), getUserGrowthAnalytics);
router.get('/schools/analytics', authenticateToken, requireRole(['system_admin']), getSchoolAnalytics);

module.exports = router;