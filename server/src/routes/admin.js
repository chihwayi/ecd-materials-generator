const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const School = require('../models/School');
const User = require('../models/User');
const { Subscription, SubscriptionPayment, Class, Student } = require('../models');
const { subscriptionPlans } = require('../config/subscription.config');
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

// Get subscriptions overview for system admins
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const subs = await Subscription.findAll({
      include: [
        { model: School, as: 'school', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']]
    });

    // Build response rows and compute stats
    const planPrice = (planName) => {
      const cfg = subscriptionPlans[planName];
      return cfg ? Number(cfg.price) : 0;
    };

    const rows = [];
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let activeCount = 0;
    let cancelledCount = 0;
    let trialCount = 0;
    const planDistribution = {};

    for (const s of subs) {
      const school = s.school;

      // Derive status incl. trial if in trial period
      let status = s.status;
      const now = new Date();
      if (s.trialEnd && new Date(s.trialEnd) > now) {
        status = 'trial';
      }

      // Usage metrics
      const [studentsCount, teachersCount, classesCount] = await Promise.all([
        Student.count({ where: { schoolId: s.schoolId } }),
        User.count({ where: { role: 'teacher', schoolId: s.schoolId } }),
        Class.count({ where: { schoolId: s.schoolId } })
      ]);

      // Amount from plan config (monthly baseline)
      const amount = planPrice(s.planName);
      totalRevenue += amount;
      monthlyRevenue += amount;

      // Stats counters
      if (status === 'active') activeCount += 1;
      if (status === 'cancelled') cancelledCount += 1;
      if (status === 'trial') trialCount += 1;
      planDistribution[s.planName] = (planDistribution[s.planName] || 0) + 1;

      rows.push({
        id: s.id,
        schoolId: s.schoolId,
        schoolName: school ? school.name : 'Unknown',
        planName: s.planName,
        status,
        currentPeriodStart: s.currentPeriodStart,
        currentPeriodEnd: s.currentPeriodEnd,
        trialEnd: s.trialEnd,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        amount,
        usage: {
          students: studentsCount,
          teachers: teachersCount,
          classes: classesCount
        }
      });
    }

    return res.json({
      subscriptions: rows,
      stats: {
        totalSubscriptions: subs.length,
        activeSubscriptions: activeCount,
        trialSubscriptions: trialCount,
        cancelledSubscriptions: cancelledCount,
        totalRevenue,
        monthlyRevenue,
        planDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching admin subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

module.exports = router;