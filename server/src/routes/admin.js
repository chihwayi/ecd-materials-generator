const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const School = require('../models/School');
const User = require('../models/User');
const { logoUpload, faviconUpload, processBrandingImage } = require('../middleware/upload.middleware');
const path = require('path');

// Get all schools with branding data
router.get('/schools', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const schools = await School.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role']
        }
      ]
    });

    res.json({ schools });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

// Create new school with branding
router.post('/schools', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      name,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan,
      maxTeachers,
      maxStudents,
      primaryColor,
      secondaryColor,
      accentColor,
      customFont,
      schoolMotto,
      customHeaderText
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'School name is required' });
    }

    // Validate email format if provided
    if (contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        return res.status(400).json({ error: 'Invalid contact email format' });
      }
    }

    // Validate color formats
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return res.status(400).json({ error: 'Invalid primary color format. Use hex format (e.g., #2563eb)' });
    }
    if (secondaryColor && !colorRegex.test(secondaryColor)) {
      return res.status(400).json({ error: 'Invalid secondary color format. Use hex format (e.g., #1d4ed8)' });
    }
    if (accentColor && !colorRegex.test(accentColor)) {
      return res.status(400).json({ error: 'Invalid accent color format. Use hex format (e.g., #fbbf24)' });
    }

    const school = await School.create({
      name,
      address,
      contactEmail,
      contactPhone,
      subscriptionPlan: subscriptionPlan || 'free',
      maxTeachers: maxTeachers || 5,
      maxStudents: maxStudents || 100,
      primaryColor: primaryColor || '#2563eb',
      secondaryColor: secondaryColor || '#1d4ed8',
      accentColor: accentColor || '#fbbf24',
      customFont: customFont || 'Inter',
      schoolMotto,
      customHeaderText,
      brandingEnabled: true
    });

    res.status(201).json({ 
      message: 'School created successfully',
      school
    });
  } catch (error) {
    console.error('Error creating school:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    res.status(500).json({ error: 'Failed to create school' });
  }
});

// Upload logo for school (system admin)
router.post('/schools/:schoolId/logo', authenticateToken, logoUpload, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { schoolId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Process the uploaded image
    const processedPath = await processBrandingImage(req.file.path, {
      width: 300,
      height: 300,
      quality: 85
    });

    // Generate URL for the processed image
    const logoUrl = `/uploads/branding/${path.basename(processedPath)}`;

    // Update school with new logo URL
    await school.update({ logoUrl });

    res.json({ 
      message: 'Logo uploaded successfully',
      logoUrl
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Failed to upload logo' });
  }
});

// Upload favicon for school (system admin)
router.post('/schools/:schoolId/favicon', authenticateToken, faviconUpload, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { schoolId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No favicon file uploaded' });
    }

    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Process the uploaded favicon
    const processedPath = await processBrandingImage(req.file.path, {
      width: 32,
      height: 32,
      quality: 90
    });

    // Generate URL for the processed favicon
    const faviconUrl = `/uploads/branding/${path.basename(processedPath)}`;

    // Update school with new favicon URL
    await school.update({ faviconUrl });

    res.json({ 
      message: 'Favicon uploaded successfully',
      faviconUrl
    });
  } catch (error) {
    console.error('Error uploading favicon:', error);
    res.status(500).json({ error: 'Failed to upload favicon' });
  }
});

// Update school branding (system admin)
router.put('/schools/:schoolId/branding', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { schoolId } = req.params;
    const {
      primaryColor,
      secondaryColor,
      accentColor,
      customFont,
      schoolMotto,
      customHeaderText,
      brandingEnabled
    } = req.body;

    // Validate color formats
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (primaryColor && !colorRegex.test(primaryColor)) {
      return res.status(400).json({ error: 'Invalid primary color format. Use hex format (e.g., #2563eb)' });
    }
    if (secondaryColor && !colorRegex.test(secondaryColor)) {
      return res.status(400).json({ error: 'Invalid secondary color format. Use hex format (e.g., #1d4ed8)' });
    }
    if (accentColor && !colorRegex.test(accentColor)) {
      return res.status(400).json({ error: 'Invalid accent color format. Use hex format (e.g., #fbbf24)' });
    }

    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    await school.update({
      primaryColor: primaryColor || school.primaryColor,
      secondaryColor: secondaryColor || school.secondaryColor,
      accentColor: accentColor || school.accentColor,
      customFont: customFont || school.customFont,
      schoolMotto: schoolMotto || school.schoolMotto,
      customHeaderText: customHeaderText || school.customHeaderText,
      brandingEnabled: brandingEnabled !== undefined ? brandingEnabled : school.brandingEnabled
    });

    res.json({ message: 'School branding updated successfully' });
  } catch (error) {
    console.error('Error updating school branding:', error);
    res.status(500).json({ error: 'Failed to update school branding' });
  }
});

module.exports = router; 