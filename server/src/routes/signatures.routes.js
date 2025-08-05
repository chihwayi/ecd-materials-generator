const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  getUserSignature,
  getSchoolSignatures,
  uploadSignature,
  deleteSignature,
  getSignatureForReports
} = require('../controllers/signatures.controller');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get current user's signature
router.get('/my-signature', async (req, res) => {
  try {
    await getUserSignature({ params: { userId: req.user.id } }, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch signature',
      error: error.message
    });
  }
});

// Get specific user's signature (for admins)
router.get('/user/:userId', async (req, res) => {
  // Check if user is admin or requesting their own signature
  if (req.user.role !== 'school_admin' && req.user.role !== 'system_admin' && req.user.id !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  await getUserSignature(req, res);
});

// Get school signatures (for admins)
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
  
  await getSchoolSignatures(req, res);
});

// Upload/Update signature
router.post('/upload', uploadSignature);

// Delete signature
router.delete('/:signatureId', deleteSignature);

// Get signature for progress reports (public endpoint for reports)
router.get('/report/:userId/:signatureType?', getSignatureForReports);

module.exports = router; 