const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { Assignment, StudentAssignment, Student, Class, User } = require('../models');
const router = express.Router();

// Create batch assignment (teacher only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title, description, instructions, dueDate, classId, type, materials, customTasks } = req.body;

    // Verify teacher owns the class
    const classItem = await Class.findOne({
      where: { id: classId, teacherId: req.user.id }
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found or not assigned to you' });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      instructions,
      dueDate,
      teacherId: req.user.id,
      classId,
      schoolId: req.user.schoolId,
      type: type || 'material',
      materials: materials || [],
      customTasks: customTasks || []
    });

    // Get all students in the class
    const students = await Student.findAll({
      where: { classId }
    });

    // Create student assignments for all students
    const studentAssignments = await Promise.all(
      students.map(student => 
        StudentAssignment.create({
          assignmentId: assignment.id,
          studentId: student.id,
          status: 'assigned'
        })
      )
    );

    res.status(201).json({
      message: `Assignment created and assigned to ${students.length} students`,
      assignment,
      assignedCount: students.length
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get teacher's assignments
router.get('/teacher', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await Assignment.findAll({
      where: { teacherId: req.user.id },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: StudentAssignment,
          as: 'studentAssignments',
          include: [{
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get school admin assignments (all assignments in school)
router.get('/school', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'school_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await Assignment.findAll({
      where: { schoolId: req.user.schoolId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        },
        {
          model: StudentAssignment,
          as: 'studentAssignments',
          include: [{
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get single assignment with materials
router.get('/:assignmentId', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      where: { 
        id: req.params.assignmentId,
        teacherId: req.user.id 
      },
      include: [{
        model: Class,
        as: 'class'
      }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // If assignment type is material, fetch the materials
    let materials = [];
    if (assignment.type === 'material' && assignment.materials) {
      const { Material } = require('../models');
      materials = await Material.findAll({
        where: { id: assignment.materials }
      });
    }

    res.json({
      ...assignment.toJSON(),
      materials
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Get student assignments (for parents)
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify parent owns the student
    const student = await Student.findOne({
      where: { id: req.params.studentId, parentId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const assignments = await StudentAssignment.findAll({
      where: { studentId: req.params.studentId },
      include: [
        {
          model: Assignment,
          as: 'assignment',
          attributes: ['id', 'title', 'description', 'instructions', 'dueDate', 'type', 'materials', 'customTasks'],
          include: [{
            model: User,
            as: 'teacher',
            attributes: ['firstName', 'lastName']
          }]
        },
        {
          model: Student,
          as: 'student',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Fetch full material data for material-based assignments
    const { Material } = require('../models');
    for (let assignment of assignments) {
      if (assignment.assignment.type === 'material' && assignment.assignment.materials && assignment.assignment.materials.length > 0) {
        try {
          const materials = await Material.findAll({
            where: { id: assignment.assignment.materials }
          });
          assignment.assignment.materials = materials;
        } catch (error) {
          console.error('Error fetching materials:', error);
          assignment.assignment.materials = [];
        }
      }
    }

    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Submit assignment (parent/student)
router.post('/submit/:assignmentId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { studentId, submissionText } = req.body;

    // Verify parent owns the student
    const student = await Student.findOne({
      where: { id: studentId, parentId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentAssignment = await StudentAssignment.findOne({
      where: { 
        assignmentId: req.params.assignmentId,
        studentId 
      }
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await studentAssignment.update({
      status: 'submitted',
      submissionText,
      submittedAt: new Date()
    });

    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
});

// Grade assignment (teacher)
router.post('/grade/:studentAssignmentId', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { grade, feedback } = req.body;

    // Convert letter grade to numeric grade
    const gradeMap = {
      'A': 90,
      'B': 80,
      'C': 70,
      'D': 60,
      'F': 50
    };

    const numericGrade = gradeMap[grade] || parseInt(grade) || null;

    const studentAssignment = await StudentAssignment.findOne({
      where: { id: req.params.studentAssignmentId },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacherId: req.user.id }
      }]
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await studentAssignment.update({
      status: 'graded',
      grade: numericGrade,
      feedback,
      gradedAt: new Date(),
      gradedBy: req.user.id
    });

    res.json({ message: 'Assignment graded successfully' });
  } catch (error) {
    console.error('Error grading assignment:', error);
    res.status(500).json({ error: 'Failed to grade assignment' });
  }
});

// Get assignment for student completion
router.get('/:assignmentId/student', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { studentId } = req.query;

    // Verify parent owns the student
    const student = await Student.findOne({
      where: { id: studentId, parentId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentAssignment = await StudentAssignment.findOne({
      where: { 
        assignmentId: req.params.assignmentId,
        studentId 
      },
      include: [{
        model: Assignment,
        as: 'assignment',
        include: [{
          model: Class,
          as: 'class'
        }]
      }]
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // If assignment type is material, fetch the materials
    let materials = [];
    if (studentAssignment.assignment.type === 'material' && studentAssignment.assignment.materials) {
      const { Material } = require('../models');
      materials = await Material.findAll({
        where: { id: studentAssignment.assignment.materials }
      });
    }

    res.json({
      assignment: {
        ...studentAssignment.assignment.toJSON(),
        materials
      },
      studentSubmission: studentAssignment.submissions || {}
    });
  } catch (error) {
    console.error('Error fetching assignment for student:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Complete assignment (student)
router.post('/:assignmentId/complete', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { studentId, submissions } = req.body;

    // Verify parent owns the student
    const student = await Student.findOne({
      where: { id: studentId, parentId: req.user.id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentAssignment = await StudentAssignment.findOne({
      where: { 
        assignmentId: req.params.assignmentId,
        studentId 
      }
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await studentAssignment.update({
      status: 'completed',
      submissions,
      completedAt: new Date()
    });

    res.json({ message: 'Assignment completed successfully' });
  } catch (error) {
    console.error('Error completing assignment:', error);
    res.status(500).json({ error: 'Failed to complete assignment' });
  }
});

// Get assignment submissions for teacher review
router.get('/:assignmentId/submissions', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignment = await Assignment.findOne({
      where: { 
        id: req.params.assignmentId,
        teacherId: req.user.id 
      },
      include: [{
        model: Class,
        as: 'class'
      }]
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const studentAssignments = await StudentAssignment.findAll({
      where: { assignmentId: req.params.assignmentId },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      assignment,
      submissions: studentAssignments
    });
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;