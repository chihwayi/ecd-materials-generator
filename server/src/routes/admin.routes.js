const express = require('express');
const router = express.Router();
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Admin-only middleware
const adminOnly = [authenticateToken, requireRole(['system_admin'])];

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

module.exports = router;