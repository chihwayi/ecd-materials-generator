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

    const school = await School.findByPk(req.user.school_id);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const settings = {
      defaultParentPassword: school.default_parent_password || 'parent123',
      schoolName: school.name,
      contactEmail: school.contact_email,
      contactPhone: school.contact_phone
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

    const school = await School.findByPk(req.user.school_id);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    await school.update({
      default_parent_password: defaultParentPassword,
      name: schoolName,
      contact_email: contactEmail,
      contact_phone: contactPhone
    });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating school settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;