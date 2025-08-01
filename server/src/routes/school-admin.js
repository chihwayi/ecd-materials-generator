const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { User, Student, Material, School, Class } = require('../models');
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
        schoolId: req.user.schoolId 
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
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'password']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const teacher = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: 'teacher',
      schoolId: req.user.schoolId
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
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Handle other Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Get teacher by ID
router.get('/teachers/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    
    const teacher = await User.findOne({
      where: { 
        id,
        role: 'teacher',
        schoolId: req.user.schoolId 
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'language', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ teacher });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// Update teacher
router.put('/teachers/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, language } = req.body;

    const teacher = await User.findOne({
      where: { 
        id,
        role: 'teacher',
        schoolId: req.user.schoolId 
      }
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== teacher.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    await teacher.update({
      firstName: firstName || teacher.firstName,
      lastName: lastName || teacher.lastName,
      email: email || teacher.email,
      phoneNumber: phoneNumber || teacher.phoneNumber,
      language: language || teacher.language
    });

    res.json({ 
      message: 'Teacher updated successfully',
      teacher: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phoneNumber: teacher.phoneNumber,
        language: teacher.language
      }
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Toggle teacher status (activate/deactivate)
router.patch('/teachers/:id/toggle-status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;
    
    const teacher = await User.findOne({
      where: { 
        id,
        role: 'teacher',
        schoolId: req.user.schoolId 
      }
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    await teacher.update({ isActive: !teacher.isActive });

    res.json({ 
      message: `Teacher ${teacher.isActive ? 'activated' : 'deactivated'} successfully`,
      teacher: {
        id: teacher.id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        isActive: teacher.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling teacher status:', error);
    res.status(500).json({ error: 'Failed to toggle teacher status' });
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
        where: { schoolId: req.user.schoolId },
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']]
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
      User.count({ where: { role: 'teacher', schoolId: req.user.schoolId } }),
      Student.count({ where: { schoolId: req.user.schoolId } }),
      Material.count({
        include: [{
          model: User,
          as: 'creator',
          where: { schoolId: req.user.schoolId }
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

// Get all school students (school admin only)
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const students = await Student.findAll({
      where: { schoolId: req.user.schoolId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['firstName', 'lastName', 'email']
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

// Get unassigned students (school admin only)
router.get('/students/unassigned', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const students = await Student.findAll({
      where: { 
        schoolId: req.user.schoolId,
        classId: null // Students not assigned to any class
      },
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    res.json({ students });
  } catch (error) {
    console.error('Error fetching unassigned students:', error);
    res.status(500).json({ error: 'Failed to fetch unassigned students' });
  }
});

// Get individual student details (school admin only)
router.get('/students/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const student = await Student.findOne({
      where: { 
        id: req.params.id,
        schoolId: req.user.schoolId 
      },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Get student progress (school admin only)
router.get('/students/:id/progress', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify student belongs to school
    const student = await Student.findOne({
      where: { 
        id: req.params.id,
        schoolId: req.user.schoolId 
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // For now, return mock progress data
    // In a real implementation, you would fetch from a Progress model
    const progressRecords = [
      {
        id: '1',
        studentId: req.params.id,
        activity: 'Sample Activity',
        type: 'offline',
        score: 85,
        notes: 'Great work!',
        date: new Date().toISOString().split('T')[0],
        recordedBy: 'School Admin'
      }
    ];

    res.json(progressRecords);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ error: 'Failed to fetch student progress' });
  }
});

// Add progress record (school admin only)
router.post('/students/:id/progress', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify student belongs to school
    const student = await Student.findOne({
      where: { 
        id: req.params.id,
        schoolId: req.user.schoolId 
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { activity, type, score, notes } = req.body;

    if (!activity || !type) {
      return res.status(400).json({ error: 'Activity and type are required' });
    }

    // For now, return mock response
    // In a real implementation, you would save to a Progress model
    const newRecord = {
      id: Date.now().toString(),
      studentId: req.params.id,
      activity,
      type,
      score: score ? parseInt(score) : null,
      notes: notes || '',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'School Admin'
    };

    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding progress record:', error);
    res.status(500).json({ error: 'Failed to add progress record' });
  }
});

// Bulk assign students to class (school admin only)
router.post('/students/bulk-assign', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { studentIds, classId } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Student IDs array is required' });
    }

    if (!classId) {
      return res.status(400).json({ error: 'Class ID is required' });
    }

    // Verify class belongs to school and get teacher
    const classInfo = await Class.findOne({
      where: { 
        id: classId,
        schoolId: req.user.schoolId 
      },
      include: [{
        model: User,
        as: 'classTeacher',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Verify all students belong to school
    const students = await Student.findAll({
      where: { 
        id: studentIds,
        schoolId: req.user.schoolId 
      }
    });

    if (students.length !== studentIds.length) {
      return res.status(400).json({ 
        error: 'Some students not found or do not belong to this school' 
      });
    }

    // Update students with class and teacher assignment
    const updatePromises = students.map(student => 
      student.update({
        classId: classId,
        teacherId: classInfo.classTeacher.id
      })
    );

    await Promise.all(updatePromises);

    res.json({
      message: `Successfully assigned ${students.length} students to class`,
      class: {
        id: classInfo.id,
        name: classInfo.name,
        teacher: classInfo.classTeacher
      },
      assignedStudents: students.map(student => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        classId: classId,
        teacherId: classInfo.classTeacher.id
      }))
    });

  } catch (error) {
    console.error('Error bulk assigning students:', error);
    res.status(500).json({ error: 'Failed to bulk assign students' });
  }
});

// Get students by class (school admin only)
router.get('/classes/:classId/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { classId } = req.params;

    // Verify class belongs to school
    const classInfo = await Class.findOne({
      where: { 
        id: classId,
        schoolId: req.user.schoolId 
      }
    });

    if (!classInfo) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const students = await Student.findAll({
      where: { 
        classId: classId,
        schoolId: req.user.schoolId 
      },
      include: [
        {
          model: User,
          as: 'parent',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    res.json({ students });
  } catch (error) {
    console.error('Error fetching class students:', error);
    res.status(500).json({ error: 'Failed to fetch class students' });
  }
});

module.exports = router;