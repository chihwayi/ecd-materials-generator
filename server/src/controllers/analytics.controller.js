const { User, School, Material, Template, Assignment } = require('../models');
const { Op } = require('sequelize');

// Get system statistics
const getSystemStats = async (req, res) => {
  try {
    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      totalSchools,
      activeSchools,
      totalMaterials,
      totalTemplates,
      totalAssignments
    ] = await Promise.all([
      User.count(),
      User.count({ where: { isActive: true } }),
      School.count(),
      School.count({ where: { isActive: true } }),
      Material.count(),
      Template.count(),
      Assignment.count()
    ]);

    // Get users by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role'],
      raw: true
    });

    const roleStats = {
      teacher: 0,
      school_admin: 0,
      parent: 0,
      system_admin: 0
    };

    usersByRole.forEach(stat => {
      roleStats[stat.role] = parseInt(stat.count);
    });

    // Get users by subscription
    const usersBySubscription = await User.findAll({
      attributes: [
        'subscriptionPlan',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['subscriptionPlan'],
      raw: true
    });

    const subscriptionStats = {
      free: 0,
      teacher: 0,
      school: 0,
      premium: 0
    };

    usersBySubscription.forEach(stat => {
      subscriptionStats[stat.subscriptionPlan] = parseInt(stat.count);
    });

    // Get recent activity (last 50 activities)
    const recentActivity = await getRecentSystemActivity(50);

    // Calculate system health (simplified metric)
    const systemHealth = calculateSystemHealth({
      totalUsers,
      activeUsers,
      totalSchools,
      activeSchools
    });

    const stats = {
      totalUsers,
      activeUsers,
      totalSchools,
      activeSchools,
      totalMaterials,
      totalTemplates,
      totalAssignments,
      systemHealth,
      usersByRole: roleStats,
      usersBySubscription: subscriptionStats,
      recentActivity
    };

    res.json(stats);
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user growth analytics
const getUserGrowthAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const userGrowth = await User.findAll({
      attributes: [
        [User.sequelize.fn('DATE', User.sequelize.col('createdAt')), 'date'],
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: dateFilter
        }
      },
      group: [User.sequelize.fn('DATE', User.sequelize.col('createdAt'))],
      order: [[User.sequelize.fn('DATE', User.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json(userGrowth);
  } catch (error) {
    console.error('Get user growth analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get school analytics
const getSchoolAnalytics = async (req, res) => {
  try {
    const schools = await School.findAll({
      include: [{
        model: User,
        attributes: ['id', 'role', 'isActive'],
        separate: true
      }]
    });

    const schoolAnalytics = schools.map(school => {
      const users = school.Users || [];
      const activeUsers = users.filter(user => user.isActive).length;
      const teacherCount = users.filter(user => user.role === 'teacher').length;
      const adminCount = users.filter(user => user.role === 'school_admin').length;
      const parentCount = users.filter(user => user.role === 'parent').length;

      return {
        id: school.id,
        name: school.name,
        subscriptionPlan: school.subscriptionPlan,
        subscriptionStatus: school.subscriptionStatus,
        totalUsers: users.length,
        activeUsers,
        teacherCount,
        adminCount,
        parentCount,
        utilizationRate: school.maxTeachers > 0 ? (teacherCount / school.maxTeachers) * 100 : 0,
        isActive: school.isActive,
        createdAt: school.createdAt
      };
    });

    res.json(schoolAnalytics);
  } catch (error) {
    console.error('Get school analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get system performance metrics
const getSystemPerformance = async (req, res) => {
  try {
    // Database performance metrics
    const dbStats = await User.sequelize.query(
      'SELECT COUNT(*) as total_connections FROM pg_stat_activity WHERE state = \'active\'',
      { type: User.sequelize.QueryTypes.SELECT }
    );

    // Memory usage (simplified)
    const memoryUsage = process.memoryUsage();
    
    // Response time metrics (would be better with actual monitoring)
    const responseTime = {
      avg: Math.random() * 100 + 50, // Mock data
      p95: Math.random() * 200 + 100,
      p99: Math.random() * 500 + 200
    };

    const performance = {
      database: {
        activeConnections: parseInt(dbStats[0]?.total_connections || 0),
        status: 'healthy'
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024)
      },
      responseTime,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    res.json(performance);
  } catch (error) {
    console.error('Get system performance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to get recent system activity
const getRecentSystemActivity = async (limit = 20) => {
  try {
    // Get recent user registrations
    const recentUsers = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: Math.floor(limit / 2)
    });

    // Get recent school registrations
    const recentSchools = await School.findAll({
      attributes: ['id', 'name', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: Math.floor(limit / 4)
    });

    // Get recent materials
    const recentMaterials = await Material.findAll({
      attributes: ['id', 'title', 'createdAt'],
      include: [{
        model: User,
        as: 'creator',
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']],
      limit: Math.floor(limit / 4)
    });

    const activities = [];

    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_created',
        description: `New ${user.role} registered: ${user.firstName} ${user.lastName}`,
        userId: user.id,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        },
        createdAt: user.createdAt
      });
    });

    // Add school activities
    recentSchools.forEach(school => {
      activities.push({
        id: `school_${school.id}`,
        type: 'school_created',
        description: `New school registered: ${school.name}`,
        metadata: { schoolId: school.id, schoolName: school.name },
        createdAt: school.createdAt
      });
    });

    // Add material activities
    recentMaterials.forEach(material => {
      activities.push({
        id: `material_${material.id}`,
        type: 'material_created',
        description: `New material created: ${material.title}`,
        metadata: { 
          materialId: material.id, 
          materialTitle: material.title,
          creatorName: material.creator ? `${material.creator.firstName} ${material.creator.lastName}` : 'Unknown'
        },
        createdAt: material.createdAt
      });
    });

    // Sort by creation date and limit
    return activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

  } catch (error) {
    console.error('Get recent system activity error:', error);
    return [];
  }
};

// Helper function to calculate system health
const calculateSystemHealth = ({ totalUsers, activeUsers, totalSchools, activeSchools }) => {
  let health = 100;

  // Reduce health if too many inactive users
  if (totalUsers > 0) {
    const inactiveUserRate = (totalUsers - activeUsers) / totalUsers;
    if (inactiveUserRate > 0.3) health -= 20;
    else if (inactiveUserRate > 0.1) health -= 10;
  }

  // Reduce health if too many inactive schools
  if (totalSchools > 0) {
    const inactiveSchoolRate = (totalSchools - activeSchools) / totalSchools;
    if (inactiveSchoolRate > 0.2) health -= 15;
    else if (inactiveSchoolRate > 0.1) health -= 5;
  }

  // Add some randomness for demo purposes
  health -= Math.floor(Math.random() * 5);

  return Math.max(health, 0);
};

// Get system health status
const getSystemHealth = async (req, res) => {
  try {
    const [totalUsers, activeUsers, totalSchools, activeSchools] = await Promise.all([
      User.count(),
      User.count({ where: { isActive: true } }),
      School.count(),
      School.count({ where: { isActive: true } })
    ]);

    const health = calculateSystemHealth({ totalUsers, activeUsers, totalSchools, activeSchools });

    res.json({
      status: health > 80 ? 'healthy' : health > 60 ? 'warning' : 'critical',
      health: health,
      services: {
        database: 'connected',
        redis: 'connected',
        storage: 'available'
      },
      metrics: {
        totalUsers,
        activeUsers,
        totalSchools,
        activeSchools
      }
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get activity logs
const getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const activities = await getRecentSystemActivity(limit);
    
    res.json({
      data: activities,
      pagination: {
        page,
        limit,
        total: activities.length,
        totalPages: Math.ceil(activities.length / limit)
      }
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get system logs (simplified version)
const getSystemLogs = async (req, res) => {
  try {
    const level = req.query.level || 'all';
    const limit = parseInt(req.query.limit) || 50;

    // Generate mock system logs for demo
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'System started successfully',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        level: 'info',
        message: 'Database connection established',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 3,
        level: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 4,
        level: 'info',
        message: 'User authentication successful',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 5,
        level: 'error',
        message: 'Failed to process payment',
        timestamp: new Date(Date.now() - 1200000).toISOString()
      }
    ];

    // Filter by level if specified
    const filteredLogs = level === 'all' 
      ? logs 
      : logs.filter(log => log.level === level);

    res.json({
      logs: filteredLogs.slice(0, limit),
      total: filteredLogs.length
    });
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSystemStats,
  getUserGrowthAnalytics,
  getSchoolAnalytics,
  getSystemPerformance,
  getSystemHealth,
  getActivityLogs,
  getSystemLogs
};