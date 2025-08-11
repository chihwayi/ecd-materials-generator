const express = require('express');
const router = express.Router();
const {
  getSystemStats,
  getUserGrowthAnalytics,
  getSchoolAnalytics,
  getSystemPerformance,
  getSystemHealth,
  getActivityLogs,
  getSystemLogs,
  getSchoolUsage,
  getSubscriptionWarnings
} = require('../controllers/analytics.controller');
const { activateTrialPlan } = require('../controllers/subscription.activation.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// System analytics routes (system admin only)
router.get('/system/stats', authenticateToken, requireRole(['system_admin']), getSystemStats);
router.get('/system/performance', authenticateToken, requireRole(['system_admin']), getSystemPerformance);
router.get('/system/health', authenticateToken, requireRole(['system_admin']), getSystemHealth);
router.get('/system/logs', authenticateToken, requireRole(['system_admin']), getSystemLogs);
router.get('/activity/logs', authenticateToken, requireRole(['system_admin']), getActivityLogs);
router.get('/users/growth', authenticateToken, requireRole(['system_admin']), getUserGrowthAnalytics);
router.get('/schools/analytics', authenticateToken, requireRole(['system_admin']), getSchoolAnalytics);

// School usage route (school admin and system admin)
router.get('/school/usage', authenticateToken, requireRole(['school_admin', 'system_admin']), getSchoolUsage);

// Subscription warnings route (school admin)
router.get('/school/subscription-warnings', authenticateToken, requireRole(['school_admin']), getSubscriptionWarnings);

// Trial activation route (school admin)
router.post('/school/activate-trial', authenticateToken, requireRole(['school_admin']), activateTrialPlan);

module.exports = router;