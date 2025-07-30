const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllSchools,
  createSchool,
  updateSchool,
  deleteSchool
} = require('../controllers/users.controller');
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');

// User management routes (system admin only)
router.get('/', authenticateToken, requireRole(['system_admin']), getAllUsers);
router.get('/:id', authenticateToken, requireRole(['system_admin']), getUserById);
router.post('/', authenticateToken, requireRole(['system_admin']), createUser);
router.put('/:id', authenticateToken, requireRole(['system_admin']), updateUser);
router.delete('/:id', authenticateToken, requireRole(['system_admin']), deleteUser);

// School management routes (system admin only)
router.get('/schools/all', authenticateToken, requireRole(['system_admin']), getAllSchools);
router.post('/schools', authenticateToken, requireRole(['system_admin']), createSchool);
router.put('/schools/:id', authenticateToken, requireRole(['system_admin']), updateSchool);
router.delete('/schools/:id', authenticateToken, requireRole(['system_admin']), deleteSchool);

// User profile route (for authenticated users)
router.get('/profile/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;