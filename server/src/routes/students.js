const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { Student, Class, User, School } = require('../models');
const { checkStudentLimit } = require('../middleware/plan-limits.middleware');
const bcrypt = require('bcrypt');
const router = express.Router();

// Create parent account for existing student
router.post('/:id/create-parent', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { parentName, parentEmail, parentPhone } = req.body;
    
    const student = await Student.findOne({
      where: { id: req.params.id, schoolId: req.user.schoolId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const existingParent = await User.findOne({ where: { email: parentEmail } });
    if (existingParent) {
      // Link existing parent to student
          await Student.update(
      { parentId: existingParent.id, parentName: parentName, parentEmail: parentEmail, parentPhone: parentPhone },
      { where: { id: req.params.id, schoolId: req.user.schoolId } }
    );
      
      return res.json({
        message: 'Student linked to existing parent account',
        parentCredentials: {
          email: parentEmail,
          password: 'Use existing password or reset via admin',
          message: 'Parent account already exists'
        }
      });
    }

    // Get school's default parent password
    const school = await School.findByPk(req.user.schoolId);
    const defaultPassword = school?.defaultParentPassword || 'parent123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    
    const parentUser = await User.create({
      firstName: parentName || 'Parent',
      lastName: student.lastName,
      email: parentEmail,
      password: hashedPassword,
      role: 'parent',
      schoolId: req.user.schoolId,
      isActive: true
    });

    await Student.update(
      { parentId: parentUser.id, parentName: parentName, parentEmail: parentEmail, parentPhone: parentPhone },
      { where: { id: req.params.id, schoolId: req.user.schoolId } }
    );

    res.json({
      message: 'Parent account created successfully',
      parentCredentials: {
        email: parentEmail,
        password: defaultPassword,
        message: 'Default password - can be reset by school admin'
      }
    });
  } catch (error) {
    console.error('Error creating parent account:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create parent account', details: error.message });
  }
});

// Create student (school admin only)
router.post('/', authenticateToken, checkStudentLimit, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { firstName, lastName, age, grade, classId, parentName, parentEmail, parentPhone, language } = req.body;

    // Validate required fields
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    if (!classId) {
      return res.status(400).json({ error: 'Class selection is required' });
    }

    // Validate age if provided
    if (age && (age < 3 || age > 10)) {
      return res.status(400).json({ error: 'Age must be between 3 and 10 years' });
    }

    // Validate email format if provided
    if (parentEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(parentEmail)) {
        return res.status(400).json({ error: 'Invalid parent email format' });
      }
    }

    // Verify class belongs to school
    const classItem = await Class.findOne({
      where: { id: classId, schoolId: req.user.schoolId }
    });

    if (!classItem) {
      return res.status(400).json({ error: 'Invalid class selection' });
    }

    // Create parent account if email provided
    let parentUser = null;
    let isNewParent = false;
    let defaultPassword = 'parent123';
    
    if (parentEmail) {
      const existingParent = await User.findOne({ where: { email: parentEmail } });
      
      if (!existingParent) {
        // Get school's default parent password
        const school = await School.findByPk(req.user.schoolId);
        defaultPassword = school?.defaultParentPassword || 'parent123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        
        parentUser = await User.create({
          firstName: parentName || 'Parent',
          lastName: lastName,
          email: parentEmail,
          password: hashedPassword,
          role: 'parent',
          schoolId: req.user.schoolId
        });
        isNewParent = true;
      } else {
        parentUser = existingParent;
      }
    }

    const student = await Student.create({
      firstName,
      lastName,
      age: age ? parseInt(age) : null,
      classId,
      teacherId: classItem.teacherId,
      parentName,
      parentEmail,
      parentPhone,
      parentId: parentUser?.id,
      schoolId: req.user.schoolId,
      language: language || 'en'
    });

    res.status(201).json({ 
      message: 'Student and parent account created successfully',
      student,
      parentCredentials: isNewParent ? {
        email: parentEmail,
        password: defaultPassword,
        message: 'Default password - can be reset by school admin'
      } : null
    });
  } catch (error) {
    console.error('Error creating student:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'A student with this information already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create student' });
  }
});

module.exports = router;