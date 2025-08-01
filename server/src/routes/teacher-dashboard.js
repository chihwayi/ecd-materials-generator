const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { Material, Assignment, Student, Template, Class } = require('../models');
const router = express.Router();

// Get teacher dashboard stats
router.get('/teacher/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teacherId = req.user.id;

    const [materialsCount, assignmentsCount, studentsCount] = await Promise.all([
      Material.count({ where: { creator_id: teacherId } }),
      Assignment.count({ where: { teacher_id: teacherId } }),
      Student.count({ where: { teacher_id: teacherId } })
    ]);

    // Calculate completion rate based on active assignments
    const activeAssignments = await Assignment.count({
      where: { teacher_id: teacherId, is_active: true }
    });

    res.json({
      materialsCreated: materialsCount,
      activeAssignments: assignmentsCount,
      students: studentsCount,
      completionRate: activeAssignments > 0 ? Math.round((assignmentsCount / activeAssignments) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get teacher's recent activity
router.get('/teacher/activity', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teacherId = req.user.id;

    const recentMaterials = await Material.findAll({
      where: { creator_id: teacherId },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'created_at']
    });

    const recentAssignments = await Assignment.findAll({
      where: { teacher_id: teacherId },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'created_at', 'is_active']
    });

    const activity = [
      ...recentMaterials.map(material => ({
        id: material.id,
        type: 'material_created',
        description: `Created material: ${material.title}`,
        createdAt: material.created_at
      })),
      ...recentAssignments.map(assignment => ({
        id: assignment.id,
        type: 'assignment_created',
        description: `Created assignment: ${assignment.title}`,
        createdAt: assignment.created_at
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    res.json({ activity });
  } catch (error) {
    console.error('Error fetching teacher activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router; 