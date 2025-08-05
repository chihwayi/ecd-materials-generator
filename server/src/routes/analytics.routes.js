const express = require('express');
const router = express.Router();
const {
  getSystemStats,
  getUserGrowthAnalytics,
  getSchoolAnalytics,
  getSystemPerformance,
  getSystemHealth,
  getActivityLogs,
  getSystemLogs
} = require('../controllers/analytics.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// System analytics routes (system admin only)
router.get('/system/stats', authenticateToken, requireRole(['system_admin']), getSystemStats);
router.get('/system/performance', authenticateToken, requireRole(['system_admin']), getSystemPerformance);
router.get('/system/health', authenticateToken, requireRole(['system_admin']), getSystemHealth);
router.get('/system/logs', authenticateToken, requireRole(['system_admin']), getSystemLogs);
router.get('/activity/logs', authenticateToken, requireRole(['system_admin']), getActivityLogs);
router.get('/users/growth', authenticateToken, requireRole(['system_admin']), getUserGrowthAnalytics);
router.get('/schools/analytics', authenticateToken, requireRole(['system_admin']), getSchoolAnalytics);

module.exports = router;