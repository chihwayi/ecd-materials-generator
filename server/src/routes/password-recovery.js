const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const router = express.Router();

// Reset password for teachers/parents (school admin only)
router.post('/reset-password', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { userId, newPassword } = req.body;

    // Verify user belongs to same school
    const targetUser = await User.findOne({
      where: { 
        id: userId,
        school_id: req.user.schoolId,
        role: ['teacher', 'parent']
      }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found or access denied' });
    }

    // Generate new password if not provided
    const password = newPassword || crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    res.json({ 
      message: 'Password reset successfully',
      temporaryPassword: newPassword ? undefined : password,
      userEmail: targetUser.email
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get users for password reset (teachers and parents only)
router.get('/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { role } = req.query;
    const whereClause = { 
      school_id: req.user.schoolId
    };

    if (role && ['teacher', 'parent'].includes(role)) {
      whereClause.role = role;
    } else {
      whereClause.role = ['teacher', 'parent'];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'is_active'],
      order: [['first_name', 'ASC']]
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;