const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { Student, Class, User, School } = require('../models');
const bcrypt = require('bcrypt');
const router = express.Router();

// Create parent account for existing student
router.post('/:id/create-parent', authMiddleware, async (req, res) => {
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
        { parent_id: existingParent.id, parent_name: parentName, parent_email: parentEmail, parent_phone: parentPhone },
        { where: { id: req.params.id, school_id: req.user.schoolId } }
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
      { parent_id: parentUser.id, parent_name: parentName, parent_email: parentEmail, parent_phone: parentPhone },
      { where: { id: req.params.id, school_id: req.user.schoolId } }
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { firstName, lastName, age, grade, classId, parentName, parentEmail, parentPhone, language } = req.body;

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
    if (parentEmail) {
      const existingParent = await User.findOne({ where: { email: parentEmail } });
      
      if (!existingParent) {
        // Get school's default parent password
        const school = await School.findByPk(req.user.schoolId);
        const defaultPassword = school?.defaultParentPassword || 'parent123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);
        
        parentUser = await User.create({
          first_name: parentName || 'Parent',
          last_name: lastName,
          email: parentEmail,
          password: hashedPassword,
          role: 'parent',
          school_id: req.user.schoolId
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
      schoolId: req.user.schoolId
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
    res.status(500).json({ error: 'Failed to create student' });
  }
});

module.exports = router;