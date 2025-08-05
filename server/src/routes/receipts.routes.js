const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const {
  createReceipt,
  getReceipt,
  getSchoolReceipts,
  generatePDFReceipt,
  markAsPrinted
} = require('../controllers/receipts.controller');

// Create receipt from payment (finance only)
router.post('/create', authenticateToken, requireRole(['finance']), createReceipt);

// Get receipt by ID (finance only)
router.get('/:receiptId', authenticateToken, requireRole(['finance']), getReceipt);

// Get all receipts for school (finance only)
router.get('/school/all', authenticateToken, requireRole(['finance']), getSchoolReceipts);

// Generate PDF receipt (finance only)
router.get('/:receiptId/pdf', authenticateToken, requireRole(['finance']), generatePDFReceipt);

// Mark receipt as printed (finance only)
router.put('/:receiptId/print', authenticateToken, requireRole(['finance']), markAsPrinted);

module.exports = router; 