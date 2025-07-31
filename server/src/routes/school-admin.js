const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { User, Student, Material, School, Class } = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();

// Get school teachers
router.get('/teachers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teachers = await User.findAll({
      where: { 
        role: 'teacher',
        school_id: req.user.schoolId 
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt'],
      order: [['firstName', 'ASC']]
    });

    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Create teacher
router.post('/teachers', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { firstName, lastName, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const teacher = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'teacher',
      school_id: req.user.schoolId
    });

    res.status(201).json({ 
      message: 'Teacher created successfully',
      teacher: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email
      }
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Get all school students
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const students = await Student.findAll({
      where: { schoolId: req.user.schoolId },
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: ['first_name', 'last_name']
        },
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    res.json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get school materials
router.get('/materials', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const materials = await Material.findAll({
      include: [{
        model: User,
        as: 'creator',
        where: { school_id: req.user.schoolId },
        attributes: ['firstName', 'lastName']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({ materials });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get school analytics
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [teachersCount, studentsCount, materialsCount] = await Promise.all([
      User.count({ where: { role: 'teacher', school_id: req.user.schoolId } }),
      Student.count({ where: { schoolId: req.user.schoolId } }),
      Material.count({
        include: [{
          model: User,
          as: 'creator',
          where: { school_id: req.user.schoolId }
        }]
      })
    ]);

    res.json({
      totalTeachers: teachersCount,
      totalStudents: studentsCount,
      totalMaterials: materialsCount,
      schoolPerformance: 85 // Mock data
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;