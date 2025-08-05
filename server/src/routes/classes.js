const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { Class, User, Student, School } = require('../models');
const router = express.Router();

// Get all classes for school admin
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const classes = await Class.findAll({
      where: { schoolId: req.user.schoolId },
      include: [
        {
          model: User,
          as: 'classTeacher',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Create new class
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, grade, description, teacherId, maxStudents } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Class name is required' });
    }

    // Validate maxStudents
    if (maxStudents && (maxStudents < 1 || maxStudents > 50)) {
      return res.status(400).json({ error: 'Max students must be between 1 and 50' });
    }

    // Verify teacher belongs to school if provided
    if (teacherId) {
      const teacher = await User.findOne({
        where: { 
          id: teacherId,
          role: 'teacher',
          schoolId: req.user.schoolId,
          isActive: true
        }
      });
      
      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher selection' });
      }
    }

    const newClass = await Class.create({
      name,
      grade,
      description,
      teacherId: teacherId || null,
      maxStudents: maxStudents || 30,
      schoolId: req.user.schoolId
    });

    const classWithTeacher = await Class.findByPk(newClass.id, {
      include: [{
        model: User,
        as: 'classTeacher',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(201).json({ 
      message: 'Class created successfully',
      class: classWithTeacher
    });
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update class
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, grade, description, teacherId, maxStudents } = req.body;
    
    await Class.update(
      { name, grade, description, teacherId, maxStudents },
      { where: { id: req.params.id, schoolId: req.user.schoolId } }
    );

    const updatedClass = await Class.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'classTeacher',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.json({ 
      message: 'Class updated successfully',
      class: updatedClass
    });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Get class students
router.get('/:id/students', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const classInfo = await Class.findOne({
      where: { id: req.params.id, schoolId: req.user.schoolId },
      include: [{
        model: User,
        as: 'classTeacher',
        attributes: ['firstName', 'lastName']
      }]
    });

    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const students = await Student.findAll({
      where: { classId: req.params.id },
      order: [['firstName', 'ASC']]
    });

    res.json({ class: classInfo, students });
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ error: 'Failed to fetch class students' });
  }
});

// Get available teachers for assignment
router.get('/available-teachers', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const teachers = await User.findAll({
      where: { 
        role: 'teacher',
        schoolId: req.user.schoolId,
        isActive: true
      },
      attributes: ['id', 'firstName', 'lastName', 'email'],
      order: [['firstName', 'ASC']]
    });

    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

module.exports = router;