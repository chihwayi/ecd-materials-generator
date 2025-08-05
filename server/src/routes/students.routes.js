const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Get teacher's assigned students
router.get('/', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Mock data for now - replace with actual database queries
    const students = [
      {
        id: '1',
        name: 'Tinashe Mukamuri',
        parentName: 'Grace Mukamuri',
        parentEmail: 'grace.mukamuri@email.com',
        age: 5,
        className: 'Grade R Blue',
        enrollmentDate: '2024-01-15',
        progress: {
          completedActivities: 12,
          totalActivities: 20,
          averageScore: 85
        },
        recentActivities: [
          { id: '1', name: 'Draw Your Name', type: 'drawing', completedAt: '2024-01-20', score: 90 },
          { id: '2', name: 'Count to 10', type: 'math', completedAt: '2024-01-18', score: 80 }
        ]
      },
      {
        id: '2',
        name: 'Chipo Ndoro',
        parentName: 'Memory Ndoro',
        parentEmail: 'memory.ndoro@email.com',
        age: 4,
        className: 'Grade R Blue',
        enrollmentDate: '2024-01-10',
        progress: {
          completedActivities: 8,
          totalActivities: 20,
          averageScore: 78
        },
        recentActivities: [
          { id: '3', name: 'Color Shapes', type: 'art', completedAt: '2024-01-19', score: 85 }
        ]
      },
      {
        id: '3',
        name: 'Tafadzwa Moyo',
        parentName: 'Blessing Moyo',
        parentEmail: 'blessing.moyo@email.com',
        age: 5,
        className: 'Grade R Blue',
        enrollmentDate: '2024-01-08',
        progress: {
          completedActivities: 10,
          totalActivities: 20,
          averageScore: 75
        },
        recentActivities: [
          { id: '4', name: 'Letter Recognition', type: 'language', completedAt: '2024-01-17', score: 70 }
        ]
      }
    ];

    res.json(students);
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student progress records
router.get('/:studentId/progress', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Mock data for now - replace with actual database queries
    const progressRecords = [
      {
        id: '1',
        studentId,
        activity: 'Coloring Book Activity',
        type: 'offline',
        score: 85,
        notes: 'Great attention to detail, stayed within lines',
        date: '2024-01-20',
        recordedBy: req.user.name
      },
      {
        id: '2',
        studentId,
        activity: 'Playground Social Skills',
        type: 'offline',
        notes: 'Shared toys well with other children',
        date: '2024-01-19',
        recordedBy: req.user.name
      },
      {
        id: '3',
        studentId,
        activity: 'Digital Math Game',
        type: 'digital',
        score: 92,
        notes: 'Excellent counting skills, completed all levels',
        date: '2024-01-18',
        recordedBy: 'System'
      }
    ];

    res.json(progressRecords);
  } catch (error) {
    console.error('Progress records fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch progress records' });
  }
});

// Add progress record for student
router.post('/:studentId/progress', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { activity, type, score, notes } = req.body;

    if (!activity || !type) {
      return res.status(400).json({ message: 'Activity and type are required' });
    }

    // Mock response - replace with actual database insertion
    const newRecord = {
      id: Date.now().toString(),
      studentId,
      activity,
      type,
      score: score ? parseInt(score) : null,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      recordedBy: req.user.name
    };

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Add progress record error:', error);
    res.status(500).json({ message: 'Failed to add progress record' });
  }
});

// Get student details
router.get('/:studentId', authenticateToken, requireRole(['teacher', 'school_admin']), async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Mock data for now - replace with actual database query
    const student = {
      id: studentId,
      name: 'Tinashe Mukamuri',
      parentName: 'Grace Mukamuri',
      parentEmail: 'grace.mukamuri@email.com',
      parentPhone: '+263 77 123 4567',
      age: 5,
      dateOfBirth: '2019-03-15',
      className: 'Grade R Blue',
      enrollmentDate: '2024-01-15',
      address: '123 Harare Street, Harare',
      emergencyContact: {
        name: 'John Mukamuri',
        relationship: 'Father',
        phone: '+263 77 987 6543'
      },
      progress: {
        completedActivities: 12,
        totalActivities: 20,
        averageScore: 85
      },
      recentActivities: [
        { id: '1', name: 'Draw Your Name', type: 'drawing', completedAt: '2024-01-20', score: 90 },
        { id: '2', name: 'Count to 10', type: 'math', completedAt: '2024-01-18', score: 80 }
      ]
    };

    res.json(student);
  } catch (error) {
    console.error('Student details fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch student details' });
  }
});

module.exports = router;