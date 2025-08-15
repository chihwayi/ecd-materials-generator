const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { Student, StudentFee, FeePayment, User, Class } = require('../models');
const FeeStructure = require('../models/FeeStructure');
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

// Record a payment (updated to work with new fee structure)
router.post('/payments', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentId, feeStructureId, amount, paymentMethod, paymentDate, academicYear, receiptNumber, notes } = req.body;

    // Validate required fields
    if (!studentId || !feeStructureId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify student belongs to the school
    const student = await Student.findOne({
      where: { 
        id: studentId,
        schoolId: req.user.schoolId 
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Verify fee structure belongs to the school
    const { FeeStructure } = require('../models');
    const feeStructure = await FeeStructure.findOne({
      where: { 
        id: feeStructureId,
        schoolId: req.user.schoolId 
      }
    });

    if (!feeStructure) {
      return res.status(404).json({ error: 'Fee structure not found' });
    }

    // First, find or create a StudentFee record
    let studentFee = await StudentFee.findOne({
      where: {
        studentId,
        feeStructureId,
        schoolId: req.user.schoolId
      }
    });

    if (!studentFee) {
      // Create a new StudentFee record
      studentFee = await StudentFee.create({
        studentId,
        feeStructureId,
        schoolId: req.user.schoolId,
        amount: parseFloat(feeStructure.amount),
        paidAmount: 0,
        status: 'not_paid',
        academicYear: academicYear || new Date().getFullYear().toString(),
        paymentType: feeStructure.frequency === 'monthly' ? 'monthly' : 'term'
      });
    }

    // Create the payment record
    const payment = await FeePayment.create({
      studentFeeId: studentFee.id,
      amount: parseFloat(amount),
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      academicYear: academicYear || new Date().getFullYear().toString(),
      receiptNumber,
      notes,
      recordedBy: req.user.id,
      schoolId: req.user.schoolId
    });

    // Update the StudentFee record with the new paid amount
    const newPaidAmount = parseFloat(studentFee.paidAmount) + parseFloat(amount);
    const newStatus = newPaidAmount >= parseFloat(studentFee.amount) ? 'fully_paid' : 
                     newPaidAmount > 0 ? 'partially_paid' : 'not_paid';
    
    await studentFee.update({
      paidAmount: newPaidAmount,
      status: newStatus
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
              attributes: ['name', 'type']
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

    // Automatically create receipt for the payment
    try {
      const { Receipt } = require('../models');
      const generateReceiptNumber = require('../controllers/receipts.controller').generateReceiptNumber;
      
      const receiptNum = await generateReceiptNumber(req.user.schoolId);
      
      await Receipt.create({
        receiptNumber: receiptNum,
        paymentId: payment.id,
        schoolId: req.user.schoolId,
        studentId: studentId,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        academicYear: academicYear || new Date().getFullYear().toString(),
        feeStructureName: feeStructure.name,
        studentName: `${student.firstName} ${student.lastName}`,
        recordedBy: req.user.id,
        recordedByName: `${req.user.firstName} ${req.user.lastName}`,
        notes: notes
      });
    } catch (receiptError) {
      console.error('Error creating receipt:', receiptError);
      // Don't fail the payment if receipt creation fails
    }

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: createdPayment
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Get payment history with filters
router.get('/payments', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    const { studentId, startDate, endDate, paymentMethod, status } = req.query;
    
    let whereClause = { schoolId: req.user.schoolId };
    let includeClause = [
      {
        model: StudentFee,
        as: 'studentFee',
        include: [
          {
            model: Student,
            as: 'student',
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

// Get fee structures for finance role
router.get('/fee-structures', authenticateToken, requireRole(['finance']), async (req, res) => {
  try {
    console.log('Finance user requesting fee structures for school:', req.user.schoolId);
    const feeStructures = await FeeStructure.findAll({
      where: {
        schoolId: req.user.schoolId,
        isActive: true
      },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Found fee structures:', feeStructures.length);
    res.json(feeStructures);
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
});

module.exports = router; 