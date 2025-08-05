const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { Student, StudentFee, FeePayment, FeeStructure, User, Class } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database.config');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Get all students for finance view (grouped by class)
router.get('/students', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { schoolId: req.user.schoolId },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'grade']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ],
      order: [['firstName', 'ASC']]
    });

    // Group students by class
    const studentsByClass = students.reduce((acc, student) => {
      const className = student.class ? student.class.name : 'No Class';
      if (!acc[className]) {
        acc[className] = [];
      }
      acc[className].push(student);
      return acc;
    }, {});

    res.json({ studentsByClass });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student fee details
router.get('/students/:studentId/fees', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findOne({
      where: { 
        id: studentId,
        schoolId: req.user.schoolId 
      },
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'grade']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get student fees
    const studentFees = await StudentFee.findAll({
      where: { studentId },
      include: [
        {
          model: FeeStructure,
          as: 'feeStructure',
          attributes: ['name', 'type', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get payment history
    const payments = await FeePayment.findAll({
      include: [
        {
          model: StudentFee,
          as: 'studentFee',
          where: { studentId },
          attributes: []
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['paymentDate', 'DESC']]
    });

    // Calculate totals
    const totalFees = studentFees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
    const totalPaid = studentFees.reduce((sum, fee) => sum + parseFloat(fee.paidAmount), 0);
    const outstanding = totalFees - totalPaid;

    res.json({
      student,
      fees: studentFees,
      payments,
      totals: {
        totalFees,
        totalPaid,
        outstanding
      }
    });
  } catch (error) {
    console.error('Error fetching student fees:', error);
    res.status(500).json({ error: 'Failed to fetch student fees' });
  }
});

// Record a payment
router.post('/payments', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentFeeId, amount, paymentMethod, receiptNumber, notes } = req.body;

    // Validate student fee exists
    const studentFee = await StudentFee.findOne({
      where: { id: studentFeeId },
      include: [
        {
          model: Student,
          as: 'student',
          where: { schoolId: req.user.schoolId },
          attributes: []
        }
      ]
    });

    if (!studentFee) {
      return res.status(404).json({ error: 'Student fee not found' });
    }

    // Create payment record
    const payment = await FeePayment.create({
      studentFeeId,
      amount,
      paymentMethod,
      receiptNumber,
      notes,
      recordedBy: req.user.id,
      paymentDate: new Date()
    });

    // Update student fee paid amount
    const newPaidAmount = parseFloat(studentFee.paidAmount) + parseFloat(amount);
    const totalAmount = parseFloat(studentFee.amount);
    
    let status = 'not_paid';
    if (newPaidAmount >= totalAmount) {
      status = 'fully_paid';
    } else if (newPaidAmount > 0) {
      status = 'partially_paid';
    }

    await studentFee.update({
      paidAmount: newPaidAmount,
      status
    });

    // Fetch updated payment with associations
    const createdPayment = await FeePayment.findByPk(payment.id, {
      include: [
        {
          model: StudentFee,
          as: 'studentFee',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['firstName', 'lastName']
            },
            {
              model: FeeStructure,
              as: 'feeStructure',
              attributes: ['name']
            }
          ]
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    res.status(201).json(createdPayment);
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Get payment history with filters
router.get('/payments', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentId, startDate, endDate, paymentMethod, status } = req.query;
    
    let whereClause = {};
    let includeClause = [
      {
        model: StudentFee,
        as: 'studentFee',
        include: [
          {
            model: Student,
            as: 'student',
            where: { schoolId: req.user.schoolId },
            attributes: ['id', 'firstName', 'lastName']
          },
          {
            model: FeeStructure,
            as: 'feeStructure',
            attributes: ['name', 'type']
          }
        ]
      },
      {
        model: User,
        as: 'recordedByUser',
        attributes: ['firstName', 'lastName']
      }
    ];

    if (studentId) {
      includeClause[0].where = { studentId };
    }

    if (startDate && endDate) {
      whereClause.paymentDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    if (status) {
      includeClause[0].where = { ...includeClause[0].where, status };
    }

    const payments = await FeePayment.findAll({
      where: whereClause,
      include: includeClause,
      order: [['paymentDate', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Create new student (finance role can register students)
router.post('/students', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { 
      firstName, lastName, age, grade, parentName, parentEmail, 
      parentPhone, classId, language 
    } = req.body;

    // Create parent user if email provided
    let parentId = null;
    if (parentEmail) {
      const existingParent = await User.findOne({
        where: { email: parentEmail }
      });

      if (existingParent) {
        parentId = existingParent.id;
      } else {
        // Create new parent user
        const parentUser = await User.create({
          email: parentEmail,
          password: 'defaultPassword123', // Should be changed by parent
          firstName: parentName.split(' ')[0] || parentName,
          lastName: parentName.split(' ').slice(1).join(' ') || '',
          role: 'parent',
          phoneNumber: parentPhone,
          schoolId: req.user.schoolId
        });
        parentId = parentUser.id;
      }
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      age,
      grade,
      parentName,
      parentEmail,
      parentPhone,
      parentId,
      schoolId: req.user.schoolId,
      classId,
      language: language || 'en',
      isActive: true
    });

    // Fetch student with associations
    const createdStudent = await Student.findByPk(student.id, {
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'grade']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });

    res.status(201).json(createdStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/students/:studentId', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    const student = await Student.findOne({
      where: { 
        id: studentId,
        schoolId: req.user.schoolId 
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await student.update(updateData);

    // Fetch updated student with associations
    const updatedStudent = await Student.findByPk(studentId, {
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'grade']
        },
        {
          model: User,
          as: 'parent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }
      ]
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Get recent payments for finance dashboard
router.get('/recent-payments', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const recentPayments = await FeePayment.findAll({
      include: [
        {
          model: StudentFee,
          as: 'studentFee',
          include: [
            {
              model: Student,
              as: 'student',
              where: { schoolId: req.user.schoolId },
              attributes: ['firstName', 'lastName']
            },
            {
              model: FeeStructure,
              as: 'feeStructure',
              attributes: ['name', 'type']
            }
          ]
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['paymentDate', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ payments: recentPayments });
  } catch (error) {
    console.error('Error fetching recent payments:', error);
    res.status(500).json({ error: 'Failed to fetch recent payments' });
  }
});

// Get available classes for student assignment
router.get('/classes', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const classes = await Class.findAll({
      where: { schoolId: req.user.schoolId },
      order: [['name', 'ASC']]
    });

    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

module.exports = router; 