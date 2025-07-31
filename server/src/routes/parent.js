const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { Student, Class, User } = require('../models');
const router = express.Router();

// Get parent's children
router.get('/children', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const children = await Student.findAll({
      where: { parent_id: req.user.id },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: User,
          as: 'teacher',
          attributes: ['first_name', 'last_name']
        }
      ],
      order: [['first_name', 'ASC']]
    });

    res.json({ children });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

module.exports = router;