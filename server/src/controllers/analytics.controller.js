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

    // Simplified query to avoid potential SQL issues
    const users = await User.findAll({
      attributes: ['createdAt'],
      where: {
        createdAt: {
          [Op.gte]: dateFilter
        }
      },
      order: [['createdAt', 'ASC']]
    });

    // Process data in JavaScript to avoid SQL function issues
    const growthData = {};
    users.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0];
      growthData[date] = (growthData[date] || 0) + 1;
    });

    const userGrowth = Object.entries(growthData).map(([date, count]) => ({
      date,
      count
    }));

    res.json(userGrowth);
  } catch (error) {
    console.error('Get user growth analytics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get school analytics
const getSchoolAnalytics = async (req, res) => {
  try {
    const { SubscriptionPlan, Student, Class } = require('../models');
    
    const schools = await School.findAll({
      include: [{
        model: User,
        attributes: ['id', 'role', 'isActive'],
        separate: true
      }]
    });

    const schoolAnalytics = await Promise.all(schools.map(async school => {
      const users = school.Users || [];
      const activeUsers = users.filter(user => user.isActive).length;
      const teacherCount = users.filter(user => user.role === 'teacher').length;
      const adminCount = users.filter(user => user.role === 'school_admin').length;
      const parentCount = users.filter(user => user.role === 'parent').length;
      
      // Get actual counts
      const [studentCount, classCount] = await Promise.all([
        Student.count({ where: { schoolId: school.id } }),
        Class.count({ where: { schoolId: school.id } })
      ]);
      
      // Get subscription plan limits using utility function
      const { getSchoolLimits } = require('../utils/subscription.utils');
      const limits = await getSchoolLimits(school);
      const maxTeachers = limits.maxTeachers;
      const maxStudents = limits.maxStudents;
      const maxClasses = limits.maxClasses;

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
        studentCount,
        classCount,
        limits: {
          maxTeachers,
          maxStudents,
          maxClasses
        },
        utilization: {
          teachers: maxTeachers > 0 ? ((teacherCount + adminCount) / maxTeachers) * 100 : 0,
          students: maxStudents > 0 ? (studentCount / maxStudents) * 100 : 0,
          classes: maxClasses > 0 ? (classCount / maxClasses) * 100 : 0
        },
        warnings: {
          teachersNearLimit: maxTeachers > 0 && ((teacherCount + adminCount) / maxTeachers) >= 0.9,
          studentsNearLimit: maxStudents > 0 && (studentCount / maxStudents) >= 0.9,
          classesNearLimit: maxClasses > 0 && (classCount / maxClasses) >= 0.9
        },
        isActive: school.isActive,
        createdAt: school.createdAt
      };
    }));

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

// Get subscription warnings for school
const getSubscriptionWarnings = async (req, res) => {
  try {
    const SubscriptionService = require('../services/subscription.service');
    const schoolId = req.user.schoolId;
    
    if (!schoolId) {
      return res.status(400).json({ message: 'School ID not found' });
    }
    
    const warnings = await SubscriptionService.getSubscriptionWarnings(schoolId);
    res.json({ warnings });
  } catch (error) {
    console.error('Get subscription warnings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get school usage for school admin
const getSchoolUsage = async (req, res) => {
  console.log('🔍 Debug - getSchoolUsage function called');
  console.log('🔍 Debug - User:', req.user);
  try {
    const { SubscriptionPlan, Student, Class } = require('../models');
    const schoolId = req.user.schoolId;
    
    if (!schoolId) {
      return res.status(400).json({ message: 'School ID not found' });
    }
    
    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    // Get actual counts (include school_admin in teacher count)
    const [teacherCount, adminCount, studentCount, classCount] = await Promise.all([
      User.count({ where: { schoolId, role: 'teacher' } }),
      User.count({ where: { schoolId, role: 'school_admin' } }),
      Student.count({ where: { schoolId } }),
      Class.count({ where: { schoolId } })
    ]);
    
    const totalTeacherUsers = teacherCount + adminCount;
    
    // Define correct limits for each plan
    const planLimits = {
      'free': { maxStudents: 50, maxTeachers: 5, maxClasses: 10 },
      'starter': { maxStudents: 30, maxTeachers: 3, maxClasses: 2 },
      'basic': { maxStudents: 70, maxTeachers: 6, maxClasses: 4 },
      'professional': { maxStudents: 150, maxTeachers: 12, maxClasses: 10 },
      'enterprise': { maxStudents: -1, maxTeachers: -1, maxClasses: -1 }
    };
    
    const currentPlanLimits = planLimits[school.subscriptionPlan] || planLimits['free'];
    
    // Map to existing DB plans for features only
    const planMapping = {
      'free': 'free',
      'starter': 'basic',
      'basic': 'basic', 
      'professional': 'premium',
      'enterprise': 'enterprise'
    };
    
    const planId = planMapping[school.subscriptionPlan] || 'free';
    
    console.log('🔍 Debug - School subscription plan:', school.subscriptionPlan);
    console.log('🔍 Debug - Mapped planId:', planId);
    
    // Test database connection
    const allPlans = await SubscriptionPlan.findAll();
    console.log('🔍 Debug - All plans in database:', allPlans.map(p => ({ planId: p.planId, name: p.name })));
    
    // Get subscription plan limits
    const plan = await SubscriptionPlan.findOne({ where: { planId } });
    console.log('🔍 Debug - Found plan:', plan ? plan.name : 'NOT FOUND');
    console.log('🔍 Debug - Plan object:', plan ? JSON.stringify(plan.toJSON(), null, 2) : 'NULL');
    console.log('🔍 Debug - Plan lookup result:', plan ? 'FOUND' : 'NOT FOUND');
    console.log('🔍 Debug - About to check if plan exists...');
    if (!plan) {
      console.log('🔍 Debug - Plan NOT found, using fallback');
      const now = new Date();
      const isActive = Boolean(school.subscriptionExpiresAt) && new Date(school.subscriptionExpiresAt) > now && ['active', 'trial', 'grace_period'].includes(school.subscriptionStatus || 'active');
      
      // Get plan name based on school's subscription plan
      const planNames = {
        'free': 'Free Trial',
        'starter': 'Starter Plan',
        'basic': 'Basic Plan',
        'professional': 'Professional Plan',
        'premium': 'Premium Plan',
        'enterprise': 'Enterprise Plan'
      };
      
      // Use correct plan limits
      const maxTeachers = currentPlanLimits.maxTeachers;
      const maxStudents = currentPlanLimits.maxStudents;
      const maxClasses = currentPlanLimits.maxClasses;
      
      const teacherPercentage = maxTeachers > 0 ? Math.round((totalTeacherUsers / maxTeachers) * 100) : 0;
      const studentPercentage = maxStudents > 0 ? Math.round((studentCount / maxStudents) * 100) : 0;
      const classPercentage = maxClasses > 0 ? Math.round((classCount / maxClasses) * 100) : 0;
      
      const warnings = [];
      if (teacherPercentage >= 90) warnings.push({ type: 'teachers', message: 'Teacher limit almost reached', percentage: teacherPercentage });
      if (studentPercentage >= 90) warnings.push({ type: 'students', message: 'Student limit almost reached', percentage: studentPercentage });
      if (classPercentage >= 90) warnings.push({ type: 'classes', message: 'Class limit almost reached', percentage: classPercentage });
      
      const daysRemaining = school.subscriptionExpiresAt ? Math.max(0, Math.ceil((new Date(school.subscriptionExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : 0;
      
      return res.json({
        plan: {
          name: planNames[school.subscriptionPlan] || 'Free Trial',
          planId: school.subscriptionPlan,
          daysRemaining: school.subscriptionExpiresAt ? daysRemaining : null,
          canActivate: !school.subscriptionExpiresAt,
          isActive
        },
        usage: {
          teachers: {
            current: totalTeacherUsers,
            limit: maxTeachers,
            percentage: teacherPercentage,
            unlimited: false
          },
          students: {
            current: studentCount,
            limit: maxStudents,
            percentage: studentPercentage,
            unlimited: false
          },
          classes: {
            current: classCount,
            limit: maxClasses,
            percentage: classPercentage,
            unlimited: false
          }
        },
        warnings,
        features: {
          materials: true,
          templates: true,
          assignments: true,
          financeModule: false,
          advancedAnalytics: false,
          customBranding: false
        }
      });
    }
    
    const now = new Date();
    const maxTeachers = currentPlanLimits.maxTeachers;
    const maxStudents = currentPlanLimits.maxStudents;
    const maxClasses = currentPlanLimits.maxClasses;
    
    const teacherPercentage = maxTeachers > 0 ? Math.round((totalTeacherUsers / maxTeachers) * 100) : 0;
    const studentPercentage = maxStudents > 0 ? Math.round((studentCount / maxStudents) * 100) : 0;
    const classPercentage = maxClasses > 0 ? Math.round((classCount / maxClasses) * 100) : 0;
    
    const warnings = [];
    if (teacherPercentage >= 90) warnings.push({ type: 'teachers', message: 'Teacher limit almost reached', percentage: teacherPercentage });
    if (studentPercentage >= 90) warnings.push({ type: 'students', message: 'Student limit almost reached', percentage: studentPercentage });
    if (classPercentage >= 90) warnings.push({ type: 'classes', message: 'Class limit almost reached', percentage: classPercentage });
    
    // Calculate days remaining based on subscription expiry
    const daysRemaining = school.subscriptionExpiresAt ? Math.max(0, Math.ceil((new Date(school.subscriptionExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : 0;
    
    const isActive = Boolean(school.subscriptionExpiresAt) && new Date(school.subscriptionExpiresAt) > now && ['active', 'trial', 'grace_period'].includes(school.subscriptionStatus || 'active');

    console.log('🔍 Debug - Plan details:', {
      name: plan?.name,
      trialDays: plan?.trialDays,
      daysRemaining,
      subscriptionExpiresAt: school.subscriptionExpiresAt
    });
    
    // Get correct plan name based on school's subscription plan
    const planNames = {
      'free': 'Free Trial',
      'starter': 'Starter Plan',
      'basic': 'Basic Plan',
      'professional': 'Professional Plan',
      'premium': 'Premium Plan',
      'enterprise': 'Enterprise Plan'
    };
    
    const usage = {
      plan: {
        name: planNames[school.subscriptionPlan] || plan?.name || 'Free Trial',
        planId: school.subscriptionPlan,
        daysRemaining: school.subscriptionExpiresAt ? daysRemaining : null,
        canActivate: !school.subscriptionExpiresAt,
        isActive
      },
      usage: {
        teachers: {
          current: totalTeacherUsers,
          limit: maxTeachers,
          percentage: teacherPercentage,
          unlimited: maxTeachers === -1
        },
        students: {
          current: studentCount,
          limit: maxStudents,
          percentage: studentPercentage,
          unlimited: maxStudents === -1
        },
        classes: {
          current: classCount,
          limit: maxClasses,
          percentage: classPercentage,
          unlimited: maxClasses === -1
        }
      },
      warnings,
      features: {
        materials: plan?.materials || true,
        templates: plan?.templates || true,
        assignments: plan?.assignments || true,
        financeModule: plan?.financeModule || false,
        advancedAnalytics: plan?.advancedAnalytics || false,
        customBranding: plan?.customBranding || false
      }
    };
    
    res.json(usage);
  } catch (error) {
    console.error('Get school usage error:', error);
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
  getSystemLogs,
  getSchoolUsage,
  getSubscriptionWarnings
};