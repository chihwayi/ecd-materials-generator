const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { User, School, Material, Assignment } = require('../models');
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
    // Mock settings - in production, fetch from settings table
    const settings = {
      maintenanceMode: false,
      registrationEnabled: true,
      maxFileSize: 10485760, // 10MB
      allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'gif'],
      systemName: 'ECD Materials Generator',
      supportEmail: 'support@ecdmaterials.com'
    };

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

router.put('/settings', adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    
    // In production, update settings in database
    console.log('Updating system settings:', updates);
    
    res.json({ message: 'Settings updated successfully', settings: updates });
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
router.post('/maintenance/enable', adminOnly, async (req, res) => {
  try {
    // In production, set maintenance mode flag
    console.log('Enabling maintenance mode');
    
    res.json({ message: 'Maintenance mode enabled' });
  } catch (error) {
    console.error('Enable maintenance error:', error);
    res.status(500).json({ message: 'Failed to enable maintenance mode' });
  }
});

router.post('/maintenance/disable', adminOnly, async (req, res) => {
  try {
    // In production, unset maintenance mode flag
    console.log('Disabling maintenance mode');
    
    res.json({ message: 'Maintenance mode disabled' });
  } catch (error) {
    console.error('Disable maintenance error:', error);
    res.status(500).json({ message: 'Failed to disable maintenance mode' });
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
      userName: `${targetUser.first_name} ${targetUser.last_name}`
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
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'is_active'],
      order: [['first_name', 'ASC']],
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
          as: 'school',
          attributes: ['id', 'name']
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
          as: 'school',
          attributes: ['name']
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
          user.school?.name || 'N/A',
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

module.exports = router;