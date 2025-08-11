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
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkTeacherLimit } = require('../middleware/plan-limits.middleware');

// User management routes (system admin only)
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, checkTeacherLimit, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

// School management routes (system admin only)
router.get('/schools/all', authenticateToken, getAllSchools);
router.post('/schools', authenticateToken, createSchool);
router.put('/schools/:id', authenticateToken, updateSchool);
router.delete('/schools/:id', authenticateToken, deleteSchool);

// User profile route (for authenticated users)
router.get('/profile/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;