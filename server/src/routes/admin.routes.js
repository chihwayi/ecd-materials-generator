const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { 
  User, 
  School, 
  Material, 
  Assignment, 
  Student, 
  Class, 
  Template, 
  Progress, 
  StudentAssignment, 
  Message, 
  FeeStructure, 
  StudentFee, 
  FeePayment, 
  Signature, 
  FinancialReport, 
  Receipt, 
  StudentServicePreference, 
  Subscription, 
  SubscriptionPayment,
  AuditLog,
  SystemNotification
} = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { logoUpload, faviconUpload, processBrandingImage } = require('../middleware/upload.middleware');
const path = require('path');

// Admin-only middleware
const adminOnly = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  });
};

// Maintenance mode middleware
const checkMaintenanceMode = (req, res, next) => {
  if (maintenanceMode && req.user && req.user.role !== 'system_admin') {
    return res.status(503).json({ 
      message: 'System is currently under maintenance. Please try again later.',
      maintenanceMode: true 
    });
  }
  next();
};

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
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false
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
      maxTeachers: 1, // Only school admin initially
      maxStudents: 0, // No students until trial/subscription activated
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

// Delete school
router.delete('/schools/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const school = await School.findByPk(req.params.id);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Delete related records first to avoid foreign key constraints
    await Promise.all([
      User.destroy({ where: { schoolId: req.params.id } }),
      Student.destroy({ where: { schoolId: req.params.id } }),
      Class.destroy({ where: { schoolId: req.params.id } }),
      Assignment.destroy({ where: { schoolId: req.params.id } }),
      FeeStructure.destroy({ where: { schoolId: req.params.id } }),
      Signature.destroy({ where: { schoolId: req.params.id } }),
      FinancialReport.destroy({ where: { schoolId: req.params.id } }),
      Receipt.destroy({ where: { schoolId: req.params.id } }),
      StudentServicePreference.destroy({ where: { school_id: req.params.id } }),
      Subscription.destroy({ where: { schoolId: req.params.id } }),
      SubscriptionPayment.destroy({ where: { schoolId: req.params.id } })
    ]);

    await school.destroy();
    res.json({ message: 'School and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ error: 'Failed to delete school: ' + error.message });
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

// Delegated Admin Dashboard Stats
router.get('/delegated-admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'delegated_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // For now, return mock data since the School model doesn't have delegatedAdminId
    // In production, this would query schools assigned to the delegated admin
    const mockData = {
      totalUsers: 8,
      totalSchools: 2,
      totalMaterials: 25,
      totalAssignments: 15,
      recentActivities: [
        {
          id: '1',
          type: 'user_created',
          description: 'New teacher account created',
          schoolName: 'Springfield Elementary',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'material_created',
          description: 'New learning material uploaded',
          schoolName: 'Lincoln High School',
          timestamp: new Date(Date.now() - 180000).toISOString()
        }
      ],
      assignedSchools: [
        {
          id: '1',
          name: 'Springfield Elementary',
          userCount: 5,
          materialCount: 12,
          lastActivity: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Lincoln High School',
          userCount: 3,
          materialCount: 13,
          lastActivity: new Date(Date.now() - 360000).toISOString()
        }
      ]
    };

    res.json(mockData);
  } catch (error) {
    console.error('Error fetching delegated admin dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// System logs endpoint
router.get('/logs', adminOnly, async (req, res) => {
  try {
    const { level = 'all', limit = 100 } = req.query;
    
    // Mock logs data - in production, read from actual log files
    const mockLogs = [
      { id: 1, level: 'info', message: 'System started successfully', timestamp: new Date().toISOString() },
      { id: 2, level: 'info', message: 'Database connection established', timestamp: new Date(Date.now() - 300000).toISOString() },
      { id: 3, level: 'warn', message: 'High memory usage detected', timestamp: new Date(Date.now() - 600000).toISOString() },
      { id: 4, level: 'error', message: 'Failed to connect to external service', timestamp: new Date(Date.now() - 900000).toISOString() },
      { id: 5, level: 'info', message: 'User authentication successful', timestamp: new Date(Date.now() - 1200000).toISOString() }
    ];

    let filteredLogs = mockLogs;
    if (level !== 'all') {
      filteredLogs = mockLogs.filter(log => log.level === level);
    }

    res.json({
      logs: filteredLogs.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// Activity logs endpoint
router.get('/activity', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    // Mock activity data - in production, fetch from activity log table
    const mockActivities = [
      { id: 1, type: 'user_created', description: 'New teacher account created', user: 'John Doe', timestamp: new Date().toISOString() },
      { id: 2, type: 'material_created', description: 'New learning material uploaded', user: 'Jane Smith', timestamp: new Date(Date.now() - 180000).toISOString() },
      { id: 3, type: 'school_updated', description: 'School information updated', user: 'Admin User', timestamp: new Date(Date.now() - 360000).toISOString() },
      { id: 4, type: 'user_login', description: 'User logged in successfully', user: 'Teacher Mike', timestamp: new Date(Date.now() - 540000).toISOString() },
      { id: 5, type: 'assignment_created', description: 'New assignment created', user: 'Sarah Wilson', timestamp: new Date(Date.now() - 720000).toISOString() }
    ];

    const offset = (page - 1) * limit;
    const paginatedActivities = mockActivities.slice(offset, offset + parseInt(limit));

    res.json({
      data: paginatedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockActivities.length,
        totalPages: Math.ceil(mockActivities.length / limit)
      }
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
});

// System health endpoint
router.get('/health', adminOnly, async (req, res) => {
  try {
    // In production, check actual service health
    const health = {
      status: 'healthy',
      services: {
        database: 'connected',
        redis: 'connected',
        storage: 'available'
      },
      timestamp: new Date().toISOString()
    };

    res.json(health);
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Failed to check system health' });
  }
});

// System settings endpoints
router.get('/settings', adminOnly, async (req, res) => {
  try {
    const maintenanceMode = getMaintenanceMode();
    res.json({ ...systemSettings, maintenanceMode });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/settings', adminOnly, async (req, res) => {
  try {
    const { defaultLanguage, sessionTimeout, enableRegistration, enableNotifications } = req.body;
    
    // Update system settings
    systemSettings = {
      defaultLanguage: defaultLanguage || systemSettings.defaultLanguage,
      sessionTimeout: sessionTimeout || systemSettings.sessionTimeout,
      enableRegistration: enableRegistration !== undefined ? enableRegistration : systemSettings.enableRegistration,
      enableNotifications: enableNotifications !== undefined ? enableNotifications : systemSettings.enableNotifications
    };
    
    console.log('System settings updated:', systemSettings);
    
    res.json({ message: 'Settings updated successfully', settings: systemSettings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// Bulk user operations
router.patch('/users/bulk', adminOnly, async (req, res) => {
  try {
    const { userIds, updates } = req.body;
    
    // In production, perform bulk update on users
    console.log('Bulk updating users:', userIds, updates);
    
    res.json({ message: `Successfully updated ${userIds.length} users` });
  } catch (error) {
    console.error('Bulk update users error:', error);
    res.status(500).json({ message: 'Failed to bulk update users' });
  }
});

router.delete('/users/bulk', adminOnly, async (req, res) => {
  try {
    const { userIds } = req.body;
    
    // In production, perform bulk delete on users
    console.log('Bulk deleting users:', userIds);
    
    res.json({ message: `Successfully deleted ${userIds.length} users` });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    res.status(500).json({ message: 'Failed to bulk delete users' });
  }
});

// Export endpoints
router.get('/export/users', adminOnly, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    // Mock CSV data - in production, generate from actual user data
    const csvData = `Email,First Name,Last Name,Role,School,Created At
teacher@test.com,John,Doe,teacher,Test School,2024-01-01
admin@test.com,Jane,Smith,school_admin,Test School,2024-01-02`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users_export_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvData);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ message: 'Failed to export users' });
  }
});

router.get('/export/schools', adminOnly, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    // Mock CSV data - in production, generate from actual school data
    const csvData = `Name,Address,Contact Email,Contact Phone,Subscription Plan,Created At
Test School,123 Main St,contact@testschool.com,+263123456789,free,2024-01-01
Demo School,456 Oak Ave,info@demoschool.com,+263987654321,school,2024-01-02`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=schools_export_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvData);
  } catch (error) {
    console.error('Export schools error:', error);
    res.status(500).json({ message: 'Failed to export schools' });
  }
});

// Maintenance endpoints
// Persistent maintenance mode using file system
const fs = require('fs');
const maintenanceFile = path.join(__dirname, '../../maintenance.json');

// Helper functions for persistent maintenance mode
const getMaintenanceMode = () => {
  try {
    if (fs.existsSync(maintenanceFile)) {
      const data = fs.readFileSync(maintenanceFile, 'utf8');
      const config = JSON.parse(data);
      return config.enabled || false;
    }
  } catch (error) {
    console.error('Failed to read maintenance mode:', error);
  }
  return false;
};

const setMaintenanceMode = (mode) => {
  try {
    const config = { enabled: mode, timestamp: new Date().toISOString() };
    fs.writeFileSync(maintenanceFile, JSON.stringify(config, null, 2));
    console.log(`Maintenance mode set to: ${mode}`);
  } catch (error) {
    console.error('Failed to save maintenance mode:', error);
  }
};

let systemSettings = {
  defaultLanguage: 'en',
  sessionTimeout: 60,
  enableRegistration: true,
  enableNotifications: true
};

router.post('/maintenance/enable', adminOnly, async (req, res) => {
  try {
    setMaintenanceMode(true);
    console.log('Maintenance mode enabled');
    
    res.json({ message: 'Maintenance mode enabled', maintenanceMode: true });
  } catch (error) {
    console.error('Enable maintenance error:', error);
    res.status(500).json({ message: 'Failed to enable maintenance mode' });
  }
});

router.post('/maintenance/disable', adminOnly, async (req, res) => {
  try {
    setMaintenanceMode(false);
    console.log('Maintenance mode disabled');
    
    res.json({ message: 'Maintenance mode disabled', maintenanceMode: false });
  } catch (error) {
    console.error('Disable maintenance error:', error);
    res.status(500).json({ message: 'Failed to disable maintenance mode' });
  }
});

router.get('/maintenance/status', adminOnly, async (req, res) => {
  try {
    res.json({ maintenanceMode: getMaintenanceMode() });
  } catch (error) {
    console.error('Get maintenance status error:', error);
    res.status(500).json({ message: 'Failed to get maintenance status' });
  }
});

router.post('/cache/clear', adminOnly, async (req, res) => {
  try {
    // In production, clear Redis cache
    console.log('Clearing system cache');
    
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ message: 'Failed to clear cache' });
  }
});

// Get audit logs
router.get('/audit-logs', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50, action, resource } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;
    
    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email'],
        required: false
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    res.json({
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
});

// Get system notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const NotificationService = require('../services/notification.service');
    const notifications = await NotificationService.getNotifications(req.user.role);
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const NotificationService = require('../services/notification.service');
    await NotificationService.markAsRead(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Bulk user operations
router.post('/users/bulk-import', adminOnly, async (req, res) => {
  try {
    const { users } = req.body;
    const bcrypt = require('bcrypt');
    const results = { success: 0, failed: 0, errors: [] };
    
    for (const userData of users) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password || 'temp123', 12);
        await User.create({
          ...userData,
          password: hashedPassword,
          isActive: true
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email: userData.email, error: error.message });
      }
    }
    
    res.json({ message: 'Bulk import completed', results });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Failed to import users' });
  }
});

// System announcements
router.post('/announcements', adminOnly, async (req, res) => {
  try {
    const { title, message, targetRole = 'all' } = req.body;
    const NotificationService = require('../services/notification.service');
    
    await NotificationService.createNotification(
      'info',
      title,
      message,
      { isAnnouncement: true },
      targetRole
    );
    
    res.json({ message: 'Announcement sent successfully' });
  } catch (error) {
    console.error('Send announcement error:', error);
    res.status(500).json({ message: 'Failed to send announcement' });
  }
});

// Get payment history for financial monitoring
router.get('/payments', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50, schoolId, planId, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (schoolId) where.schoolId = schoolId;
    if (planId) where.planId = planId;
    if (status) where.status = status;
    
    const { count, rows: payments } = await SubscriptionPayment.findAndCountAll({
      where,
      include: [
        {
          model: School,
          attributes: ['id', 'name', 'contactEmail'],
          required: true
        },
        {
          model: require('../models').SubscriptionPlan,
          attributes: ['name', 'price', 'currency', 'interval'],
          required: false
        }
      ],
      order: [['paymentDate', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    // Calculate financial stats
    const totalRevenue = await SubscriptionPayment.sum('amount', { where: { status: 'completed' } });
    const monthlyRevenue = await SubscriptionPayment.sum('amount', {
      where: {
        status: 'completed',
        paymentDate: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });
    
    const stats = {
      totalPayments: count,
      totalRevenue: totalRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
      averagePayment: count > 0 ? (totalRevenue || 0) / count : 0
    };
    
    res.json({
      payments,
      stats,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payment data' });
  }
});

// Get subscription monitoring data
router.get('/subscriptions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin' && req.user.role !== 'delegated_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const { SubscriptionPlan, Student, Class } = require('../models');
    
    // Get all schools with their subscription data
    const schools = await School.findAll({
      include: [{
        model: User,
        attributes: ['id', 'role'],
        separate: true
      }]
    });
    
    const subscriptions = await Promise.all(schools.map(async (school) => {
      const users = school.Users || [];
      const teacherCount = users.filter(u => u.role === 'teacher').length;
      const adminCount = users.filter(u => u.role === 'school_admin').length;
      
      const [studentCount, classCount] = await Promise.all([
        Student.count({ where: { schoolId: school.id } }),
        Class.count({ where: { schoolId: school.id } })
      ]);
      
      const plan = await SubscriptionPlan.findOne({ where: { planId: school.subscriptionPlan } });
      
      return {
        id: school.id,
        schoolId: school.id,
        schoolName: school.name,
        planName: plan?.name || school.subscriptionPlan,
        status: school.subscriptionStatus,
        currentPeriodStart: school.createdAt,
        currentPeriodEnd: school.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        trialEnd: school.subscriptionPlan === 'free_trial' ? school.subscriptionExpiresAt : null,
        cancelAtPeriodEnd: school.subscriptionStatus === 'cancelled',
        amount: plan?.price || 0,
        usage: {
          students: studentCount,
          teachers: teacherCount + adminCount,
          classes: classCount
        }
      };
    }));
    
    // Calculate stats
    const stats = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      trialSubscriptions: subscriptions.filter(s => s.planName.toLowerCase().includes('trial') || s.planName.toLowerCase().includes('free')).length,
      cancelledSubscriptions: subscriptions.filter(s => s.status === 'cancelled').length,
      totalRevenue: req.user.role === 'system_admin' ? subscriptions.reduce((sum, s) => sum + s.amount, 0) : 0,
      monthlyRevenue: req.user.role === 'system_admin' ? subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0) : 0,
      planDistribution: subscriptions.reduce((acc, s) => {
        acc[s.planName] = (acc[s.planName] || 0) + 1;
        return acc;
      }, {})
    };
    
    if (req.user.role === 'delegated_admin') {
      subscriptions.forEach(sub => { sub.amount = 0; });
    }
    
    res.json({ subscriptions, stats });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Failed to fetch subscription data' });
  }
});

// Complete database backup endpoint
router.get('/backup/complete', adminOnly, async (req, res) => {
  try {
    console.log('Starting complete database backup...');
    
    // Get counts for metadata without loading all data
    const [userCount, schoolCount, studentCount, classCount, materialCount] = await Promise.all([
      User.count(),
      School.count(),
      Student.count(),
      Class.count(),
      Material.count()
    ]);
    
    // Fetch essential data only (without large includes)
    const [users, schools] = await Promise.all([
      User.findAll({ attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'] }),
      School.findAll({ attributes: ['id', 'name', 'contactEmail', 'createdAt'] })
    ]);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: {
        users,
        schools
      },
      metadata: {
        totalTables: 19,
        totalRecords: userCount + schoolCount + studentCount + classCount + materialCount,
        backupSize: 'Essential Data Only',
        exportedBy: req.user.email,
        note: 'Simplified backup to prevent memory issues'
      }
    };
    
    res.json(backupData);
  } catch (error) {
    console.error('Complete database backup error:', error);
    res.status(500).json({ message: 'Failed to create complete backup' });
  }
});

router.post('/backup/database', adminOnly, async (req, res) => {
  try {
    // In production, trigger database backup
    console.log('Starting database backup');
    
    res.json({ message: 'Database backup initiated' });
  } catch (error) {
    console.error('Database backup error:', error);
    res.status(500).json({ message: 'Failed to start database backup' });
  }
});

// Password reset endpoints for system admin
router.post('/users/reset-password', adminOnly, async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Find the user to reset password for
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
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
      userEmail: targetUser.email,
      userName: `${targetUser.firstName} ${targetUser.lastName}`
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get users for password reset (system admin can reset any user)
router.get('/users/reset-password', adminOnly, async (req, res) => {
  try {
    const { role, search } = req.query;
    const whereClause = {};

    if (role && role !== 'all') {
      whereClause.role = role;
    }

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive'],
      order: [['firstName', 'ASC']],
      limit: 100
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users for password reset:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin User Management Endpoints
router.get('/users', adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const { role, search, isActive, schoolId } = req.query;
    const whereClause = {};

    if (role && role !== '') {
      whereClause.role = role;
    }

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (isActive !== undefined && isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }

    if (schoolId && schoolId !== '') {
      whereClause.schoolId = schoolId;
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: School,
          attributes: ['id', 'name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      data: users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/users', adminOnly, async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phoneNumber,
      language,
      schoolId,
      subscriptionPlan
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phoneNumber,
      language: language || 'en',
      schoolId,
      subscriptionPlan: subscriptionPlan || 'free',
      isActive: true
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/users/:id', adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // Remove password from update data if not provided
    if (!updateData.password) {
      delete updateData.password;
    } else {
      // Hash new password if provided
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update(updateData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent delegated admin from deleting system admin accounts
    if (req.user.role === 'delegated_admin' && user.role === 'system_admin') {
      return res.status(403).json({ error: 'Cannot delete system administrator accounts' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.put('/users/:id/toggle-status', adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isActive: !user.isActive });

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
});

router.delete('/users/bulk', adminOnly, async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    await User.destroy({
      where: { id: userIds }
    });

    res.json({ message: `${userIds.length} users deleted successfully` });
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

router.put('/users/bulk', adminOnly, async (req, res) => {
  try {
    const { userIds, updateData } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Update data is required' });
    }

    await User.update(updateData, {
      where: { id: userIds }
    });

    res.json({ message: `${userIds.length} users updated successfully` });
  } catch (error) {
    console.error('Error bulk updating users:', error);
    res.status(500).json({ error: 'Failed to update users' });
  }
});

router.get('/users/export', adminOnly, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const users = await User.findAll({
      include: [
        {
          model: School,
          attributes: ['name'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (format === 'csv') {
      const csvData = [
        ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'School', 'Status', 'Created At'].join(','),
        ...users.map(user => [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.role,
          user.School?.name || 'N/A',
          user.isActive ? 'Active' : 'Inactive',
          user.createdAt
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users_export_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvData);
    } else {
      res.json({ users });
    }
  } catch (error) {
    console.error('Error exporting users:', error);
    res.status(500).json({ error: 'Failed to export users' });
  }
});

router.post('/users/:id/reset-password', adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new password if not provided
    const password = newPassword || crypto.randomBytes(8).toString('hex');
    
    // Use the model's update method to trigger the beforeUpdate hook
    await user.update({ password });

    res.json({ 
      message: 'Password reset successfully',
      temporaryPassword: newPassword ? undefined : password,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

router.get('/users/:email/debug', adminOnly, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({ found: false, message: 'User not found' });
    }

    res.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        schoolId: user.schoolId,
        createdAt: user.createdAt,
        hasPassword: !!user.password,
        passwordLength: user.password ? user.password.length : 0
      }
    });
  } catch (error) {
    console.error('Debug user error:', error);
    res.status(500).json({ error: 'Failed to debug user' });
  }
});

module.exports = router;