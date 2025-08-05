const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { User, School, Material, Student } = require('../models');
const router = express.Router();

// User growth analytics
router.get('/users/growth', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { period = '30d' } = req.query;
    
    // Simple mock data for now
    const mockData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'New Users',
        data: [12, 19, 8, 15],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    };

    res.json(mockData);
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ error: 'Failed to fetch user growth data' });
  }
});

// School analytics
router.get('/schools/performance', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const mockData = {
      labels: ['School A', 'School B', 'School C'],
      datasets: [{
        label: 'Performance Score',
        data: [85, 92, 78],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B']
      }]
    };

    res.json(mockData);
  } catch (error) {
    console.error('Error fetching school performance:', error);
    res.status(500).json({ error: 'Failed to fetch school performance data' });
  }
});

// System overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [totalUsers, totalSchools, totalMaterials, totalStudents] = await Promise.all([
      User.count(),
      School.count(),
      Material.count(),
      Student.count()
    ]);

    res.json({
      totalUsers,
      totalSchools,
      totalMaterials,
      totalStudents,
      systemHealth: 'Good',
      uptime: '99.9%'
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({ error: 'Failed to fetch system overview' });
  }
});

// System stats
router.get('/system/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [totalUsers, totalSchools, totalMaterials, totalStudents] = await Promise.all([
      User.count(),
      School.count(),
      Material.count(),
      Student.count()
    ]);

    // Get user counts by role
    const usersByRole = {
      system_admin: await User.count({ where: { role: 'system_admin' } }),
      school_admin: await User.count({ where: { role: 'school_admin' } }),
      teacher: await User.count({ where: { role: 'teacher' } }),
      parent: await User.count({ where: { role: 'parent' } })
    };

    // Get user counts by subscription
    const usersBySubscription = {
      free: await User.count({ where: { subscriptionPlan: 'free' } }),
      teacher: await User.count({ where: { subscriptionPlan: 'teacher' } }),
      school: await User.count({ where: { subscriptionPlan: 'school' } }),
      premium: await User.count({ where: { subscriptionPlan: 'premium' } })
    };

    res.json({
      totalUsers,
      totalSchools,
      totalMaterials,
      totalStudents,
      activeUsers: totalUsers,
      activeSchools: totalSchools,
      systemHealth: 95,
      usersByRole,
      usersBySubscription,
      recentActivity: []
    });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// System performance
router.get('/system/performance', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const mockData = {
      cpu: 45,
      memory: {
        used: 512,
        total: 1024
      },
      disk: 38,
      network: 78,
      database: {
        status: 'Connected',
        activeConnections: 12
      },
      responseTime: {
        avg: 150,
        min: 50,
        max: 300
      },
      uptime: 7200
    };

    res.json(mockData);
  } catch (error) {
    console.error('Error fetching system performance:', error);
    res.status(500).json({ error: 'Failed to fetch system performance' });
  }
});

// School analytics
router.get('/schools/analytics', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'system_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const schools = await School.findAll({
      include: [{
        model: User,
        attributes: ['id', 'role']
      }]
    });

    const analytics = schools.map(school => ({
      id: school.id,
      name: school.name,
      userCount: school.Users?.length || 0,
      teacherCount: school.Users?.filter(u => u.role === 'teacher').length || 0,
      adminCount: school.Users?.filter(u => u.role === 'school_admin').length || 0
    }));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching school analytics:', error);
    res.status(500).json({ error: 'Failed to fetch school analytics' });
  }
});

module.exports = router;