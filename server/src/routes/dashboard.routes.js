const express = require('express');
const router = express.Router();
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Get teacher dashboard statistics
router.get('/teacher/stats', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Mock data for now - replace with actual database queries
    const stats = {
      totalMaterials: 24,
      publishedMaterials: 18,
      draftMaterials: 6,
      totalStudents: 15,
      activeStudents: 12,
      completedActivities: 156,
      averageScore: 82,
      recentActivities: [
        {
          id: '1',
          studentName: 'Tinashe Mukamuri',
          activityName: 'Draw Your Name',
          score: 90,
          completedAt: new Date().toISOString()
        },
        {
          id: '2',
          studentName: 'Chipo Ndoro',
          activityName: 'Color Shapes',
          score: 85,
          completedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          studentName: 'Tafadzwa Moyo',
          activityName: 'Count to 10',
          score: 78,
          completedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      materialsBySubject: [
        { subject: 'Math', count: 8 },
        { subject: 'Language', count: 6 },
        { subject: 'Art', count: 5 },
        { subject: 'Science', count: 3 },
        { subject: 'Cultural', count: 2 }
      ],
      studentProgress: [
        {
          studentName: 'Tinashe Mukamuri',
          completedActivities: 12,
          totalActivities: 15,
          averageScore: 88
        },
        {
          studentName: 'Chipo Ndoro',
          completedActivities: 8,
          totalActivities: 15,
          averageScore: 82
        },
        {
          studentName: 'Tafadzwa Moyo',
          completedActivities: 10,
          totalActivities: 15,
          averageScore: 75
        }
      ]
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get teacher's classes
router.get('/teacher/classes', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Mock data for now - replace with actual database queries
    const classes = [
      {
        id: '1',
        name: 'Grade R Blue',
        studentCount: 15,
        ageGroup: '4-5 years'
      }
    ];

    res.json(classes);
  } catch (error) {
    console.error('Teacher classes error:', error);
    res.status(500).json({ message: 'Failed to fetch teacher classes' });
  }
});

module.exports = router;