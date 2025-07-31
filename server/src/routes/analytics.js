const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { User, School, Material, Student } = require('../models');
const router = express.Router();

// User growth analytics
router.get('/users/growth', authMiddleware, async (req, res) => {
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
router.get('/schools/performance', authMiddleware, async (req, res) => {
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
router.get('/overview', authMiddleware, async (req, res) => {
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

module.exports = router;