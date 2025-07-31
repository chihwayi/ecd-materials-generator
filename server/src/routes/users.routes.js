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
const { authMiddleware } = require('../middleware/auth.middleware');

// User management routes (system admin only)
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

// School management routes (system admin only)
router.get('/schools/all', authMiddleware, getAllSchools);
router.post('/schools', authMiddleware, createSchool);
router.put('/schools/:id', authMiddleware, updateSchool);
router.delete('/schools/:id', authMiddleware, deleteSchool);

// User profile route (for authenticated users)
router.get('/profile/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;