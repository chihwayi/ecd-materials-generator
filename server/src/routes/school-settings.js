const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const School = require('../models/School');
const { logoUpload, faviconUpload, brandingAssetsUpload, processBrandingImage } = require('../middleware/upload.middleware');
const path = require('path');

// Get school settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    res.json({ settings: school });
  } catch (error) {
    console.error('Error fetching school settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update school settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { 
      defaultParentPassword, 
      schoolName, 
      contactEmail, 
      contactPhone,
      primaryColor,
      secondaryColor,
      accentColor,
      customFont,
      schoolMotto,
      customHeaderText,
      brandingEnabled
    } = req.body;

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

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    await school.update({
      defaultParentPassword: defaultParentPassword || school.defaultParentPassword,
      name: schoolName,
      contactEmail: contactEmail || school.contactEmail,
      contactPhone: contactPhone || school.contactPhone,
      primaryColor: primaryColor || school.primaryColor,
      secondaryColor: secondaryColor || school.secondaryColor,
      accentColor: accentColor || school.accentColor,
      customFont: customFont || school.customFont,
      schoolMotto: schoolMotto || school.schoolMotto,
      customHeaderText: customHeaderText || school.customHeaderText,
      brandingEnabled: brandingEnabled !== undefined ? brandingEnabled : school.brandingEnabled
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

// Upload school logo
router.post('/upload-logo', authenticateToken, logoUpload, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No logo file uploaded' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Process the uploaded image
    let processedPath;
    try {
      processedPath = await processBrandingImage(req.file.path, {
        width: 300,
        height: 300,
        quality: 85
      });
    } catch (error) {
      console.error('Image processing failed, using original file:', error);
      processedPath = req.file.path;
    }

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

// Upload school favicon
router.post('/upload-favicon', authenticateToken, faviconUpload, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No favicon file uploaded' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Process the uploaded favicon
    let processedPath;
    try {
      processedPath = await processBrandingImage(req.file.path, {
        width: 32,
        height: 32,
        quality: 90
      });
    } catch (error) {
      console.error('Favicon processing failed, using original file:', error);
      processedPath = req.file.path;
    }

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

// Get school branding data
router.get('/branding', authenticateToken, async (req, res) => {
  try {
    // Allow all authenticated users to access branding data for their school
    if (!req.user.schoolId) {
      return res.status(400).json({ error: 'No school associated with user' });
    }

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const brandingData = {
      logoUrl: school.logoUrl,
      faviconUrl: school.faviconUrl,
      primaryColor: school.primaryColor,
      secondaryColor: school.secondaryColor,
      accentColor: school.accentColor,
      customFont: school.customFont,
      schoolMotto: school.schoolMotto,
      customHeaderText: school.customHeaderText,
      brandingEnabled: school.brandingEnabled
    };

    res.json({ branding: brandingData });
  } catch (error) {
    console.error('Error fetching branding data:', error);
    res.status(500).json({ error: 'Failed to fetch branding data' });
  }
});

// Update custom CSS
router.put('/custom-css', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { customCss } = req.body;

    const school = await School.findByPk(req.user.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    await school.update({ customCss });

    res.json({ message: 'Custom CSS updated successfully' });
  } catch (error) {
    console.error('Error updating custom CSS:', error);
    res.status(500).json({ error: 'Failed to update custom CSS' });
  }
});

module.exports = router;