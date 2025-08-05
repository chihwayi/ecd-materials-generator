const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const {
  getStudentServicePreferences,
  saveStudentServicePreferences,
  getAllStudentServicePreferences
} = require('../controllers/studentServicePreferences.controller');

// Get student service preferences
router.get('/:studentId', authenticateToken, requireRole(['school_admin', 'finance']), getStudentServicePreferences);

// Save student service preferences
router.post('/:studentId', authenticateToken, requireRole(['school_admin', 'finance']), saveStudentServicePreferences);

// Update student service preferences
router.put('/:studentId', authenticateToken, requireRole(['school_admin', 'finance']), saveStudentServicePreferences);

// Get all student service preferences for the school
router.get('/', authenticateToken, requireRole(['school_admin', 'finance']), getAllStudentServicePreferences);

module.exports = router; 