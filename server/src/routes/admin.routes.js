const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Admin-only middleware
const adminOnly = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  });
};

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

module.exports = router;