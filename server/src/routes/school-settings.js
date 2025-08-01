const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { School } = require('../models');
const router = express.Router();

// Get school settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const settings = {
      defaultParentPassword: school.defaultParentPassword || 'parent123',
      schoolName: school.name,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone
    };

    res.json({ settings });
  } catch (error) {
    console.error('Error fetching school settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update school settings
router.put('/settings', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { defaultParentPassword, schoolName, contactEmail, contactPhone } = req.body;

    // Validate required fields
    if (!schoolName) {
      return res.status(400).json({ error: 'School name is required' });
    }

    // Validate email format if provided
    if (contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        return res.status(400).json({ error: 'Invalid contact email format' });
      }
    }

    // Validate password length
    if (defaultParentPassword && defaultParentPassword.length < 6) {
      return res.status(400).json({ error: 'Default parent password must be at least 6 characters long' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    await school.update({
      defaultParentPassword: defaultParentPassword || school.defaultParentPassword,
      name: schoolName,
      contactEmail: contactEmail || school.contactEmail,
      contactPhone: contactPhone || school.contactPhone
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating school settings:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;