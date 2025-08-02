const express = require('express');
const { authMiddleware: authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { Material, Assignment, Student, Template, Class, StudentAssignment } = require('../models');
const sequelize = require('../config/database.config'); // Fixed import path
const router = express.Router();

// Get teacher dashboard stats
router.get('/dashboard/stats', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get basic counts
    const [materialsCount, assignmentsCount, studentsCount] = await Promise.all([
      Material.count({ where: { creator_id: teacherId } }),
      Assignment.count({ where: { teacher_id: teacherId } }),
      Student.count({ where: { teacher_id: teacherId } })
    ]);

    // Get assignment statistics from StudentAssignment table
    const totalStudentAssignments = await StudentAssignment.count({
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }]
    });

    const submittedAssignments = await StudentAssignment.count({
      where: { status: 'submitted' },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }]
    });

    const gradedAssignments = await StudentAssignment.count({
      where: { status: 'graded' },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }]
    });

    // Calculate completion rate (submitted + graded / total)
    const completionRate = totalStudentAssignments > 0 
      ? Math.round(((submittedAssignments + gradedAssignments) / totalStudentAssignments) * 100) 
      : 0;

    res.json({
      materialsCreated: materialsCount,
      activeAssignments: assignmentsCount,
      students: studentsCount,
      totalStudentAssignments,
      submittedAssignments,
      gradedAssignments,
      completionRate
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get teacher's recent activity
router.get('/dashboard/activity', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {

    const teacherId = req.user.id;

    // Debug: Check raw database data
    const rawMaterials = await sequelize.query(
      'SELECT id, title, created_at, updated_at FROM "Material" WHERE creator_id = :teacherId ORDER BY created_at DESC LIMIT 5',
      {
        replacements: { teacherId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    console.log('Raw SQL materials:', rawMaterials);

    const recentMaterials = await Material.findAll({
      where: { creator_id: teacherId },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'created_at', 'updated_at'],
      raw: false
    });

    const recentAssignments = await Assignment.findAll({
      where: { teacher_id: teacherId },
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'created_at', 'updated_at', 'is_active'],
      raw: false
    });

    console.log('Recent materials raw data:', recentMaterials.map(m => ({ 
      id: m.id, 
      title: m.title, 
      created_at: m.created_at,
      created_at_type: typeof m.created_at,
      dataValues: m.dataValues
    })));
    console.log('Recent assignments raw data:', recentAssignments.map(a => ({ 
      id: a.id, 
      title: a.title, 
      created_at: a.created_at,
      created_at_type: typeof a.created_at,
      dataValues: a.dataValues
    })));

    const activity = [
      ...recentMaterials.map(material => {
        console.log('Material created_at:', material.created_at);
        console.log('Material updated_at:', material.updated_at);
        const dateToUse = material.created_at || material.updated_at || new Date();
        return {
          id: material.id,
          type: 'material_created',
          description: `Created material: ${material.title}`,
          createdAt: dateToUse
        };
      }),
      ...recentAssignments.map(assignment => {
        console.log('Assignment created_at:', assignment.created_at);
        console.log('Assignment updated_at:', assignment.updated_at);
        const dateToUse = assignment.created_at || assignment.updated_at || new Date();
        return {
          id: assignment.id,
          type: 'assignment_created',
          description: `Created assignment: ${assignment.title}`,
          createdAt: dateToUse
        };
      })
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    console.log('Final activity array:', activity);
    res.json({ activity });
  } catch (error) {
    console.error('Error fetching teacher activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Get teacher's grading analytics
router.get('/dashboard/grading', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get pending grades (submitted assignments)
    const pendingGrades = await StudentAssignment.count({
      where: { status: 'submitted' },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }]
    });

    // Get average grade
    const gradedAssignments = await StudentAssignment.findAll({
      where: { 
        status: 'graded',
        grade: { [require('sequelize').Op.not]: null }
      },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }],
      attributes: ['grade']
    });

    const averageGrade = gradedAssignments.length > 0
      ? Math.round(gradedAssignments.reduce((sum, sa) => sum + sa.grade, 0) / gradedAssignments.length)
      : 0;

    // Get assignments graded this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const gradedThisWeek = await StudentAssignment.count({
      where: { 
        status: 'graded',
        graded_at: { [require('sequelize').Op.gte]: oneWeekAgo }
      },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId }
      }]
    });

    // Generate grading insights
    const insights = [];
    
    if (pendingGrades > 0) {
      insights.push({
        message: `${pendingGrades} assignment${pendingGrades > 1 ? 's' : ''} need${pendingGrades > 1 ? '' : 's'} grading`,
        type: 'pending',
        date: new Date().toISOString()
      });
    }

    if (gradedThisWeek > 0) {
      insights.push({
        message: `Graded ${gradedThisWeek} assignment${gradedThisWeek > 1 ? 's' : ''} this week`,
        type: 'efficiency',
        date: new Date().toISOString()
      });
    }

    if (averageGrade > 0) {
      insights.push({
        message: `Average grade: ${averageGrade}%`,
        type: 'performance',
        date: new Date().toISOString()
      });
    }

    res.json({
      pendingGrades,
      averageGrade,
      gradedThisWeek,
      gradingInsights: insights
    });
  } catch (error) {
    console.error('Error fetching grading analytics:', error);
    res.status(500).json({ error: 'Failed to fetch grading analytics' });
  }
});

// Get teacher's materials
router.get('/materials', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {

    const teacherId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: materials } = await Material.findAndCountAll({
      where: { creator_id: teacherId },
      include: [{
        model: Template,
        attributes: ['name', 'category']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      materials,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching teacher materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get teacher's classes
router.get('/classes', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {

    const classes = await Class.findAll({
      where: { teacher_id: req.user.id },
      include: [{
        model: Student,
        as: 'students',
        attributes: ['id', 'first_name', 'last_name']
      }],
      order: [['name', 'ASC']]
    });

    res.json({ classes });
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get teacher's students
router.get('/students', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    console.log('Fetching students for teacher:', teacherId);

    const students = await Student.findAll({
      where: { teacher_id: teacherId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name', 'grade']
        }
      ],
      order: [['first_name', 'ASC']],
      attributes: ['id', 'first_name', 'last_name', 'class_id', 'age'],
      raw: false
    });

    console.log('Raw students data:', JSON.stringify(students, null, 2));

    const formattedStudents = students.map(student => {
      console.log('Student object keys:', Object.keys(student));
      console.log('Student dataValues:', student.dataValues);
      
      return {
        id: student.id,
        firstName: student.dataValues?.first_name || student.first_name || 'Unknown',
        lastName: student.dataValues?.last_name || student.last_name || 'Student',
        age: student.age || 5,
        class: student.class ? {
          name: student.class.name,
          grade: student.class.grade
        } : { name: 'No Class', grade: 'N/A' }
      };
    });

    console.log('Formatted students:', JSON.stringify(formattedStudents, null, 2));
    res.json({ students: formattedStudents });
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get individual student details (teacher only)
router.get('/students/:id', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {

    const teacherId = req.user.id;
    const studentId = req.params.id;

    const student = await Student.findOne({
      where: { 
        id: studentId,
        teacher_id: teacherId 
      },
      include: [{
        model: Class,
        as: 'class',
        attributes: ['name', 'grade']
      }]
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

// Get student progress (teacher only)
router.get('/students/:id/progress', authenticateToken, requireRole(['teacher']), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const studentId = req.params.id;

    // Verify student belongs to teacher
    const student = await Student.findOne({
      where: { 
        id: studentId,
        teacher_id: teacherId 
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get real assignment data from StudentAssignment table
    const studentAssignments = await StudentAssignment.findAll({
      where: { student_id: studentId },
      include: [{
        model: Assignment,
        as: 'assignment',
        where: { teacher_id: teacherId },
        attributes: ['title', 'created_at']
      }],
      order: [['created_at', 'DESC']]
    });

    // Convert StudentAssignment records to progress format
    const progressRecords = studentAssignments.map(sa => ({
      id: sa.id,
      studentId: sa.student_id,
      activity: sa.assignment.title,
      type: sa.status === 'submitted' || sa.status === 'graded' ? 'digital' : 'offline',
      score: sa.grade || undefined,
      notes: sa.feedback || `Status: ${sa.status}`,
      date: sa.submitted_at || sa.created_at,
      recordedBy: 'System'
    }));

    res.json(progressRecords);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    res.status(500).json({ error: 'Failed to fetch student progress' });
  }
});

module.exports = router;