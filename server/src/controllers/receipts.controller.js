const { Receipt, FeePayment, Student, User, School, StudentFee, FeeStructure } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique receipt number
const generateReceiptNumber = async (schoolId) => {
  const year = new Date().getFullYear();
  const prefix = `RCP-${year}`;
  
  // Get the last receipt number for this school and year
  const lastReceipt = await Receipt.findOne({
    where: {
      schoolId,
      receiptNumber: {
        [Op.like]: `${prefix}-%`
      }
    },
    order: [['receiptNumber', 'DESC']]
  });

  let sequence = 1;
  if (lastReceipt) {
    const lastSequence = parseInt(lastReceipt.receiptNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}-${sequence.toString().padStart(6, '0')}`;
};

// Create receipt from payment
const createReceipt = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const userId = req.user.id;
    const schoolId = req.user.schoolId;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    // Get payment with all related data
    const payment = await FeePayment.findOne({
      where: { id: paymentId, schoolId },
      include: [
        {
          model: StudentFee,
          as: 'studentFee',
          include: [
            {
              model: Student,
              as: 'student',
              include: [
                {
                  model: User,
                  as: 'parent',
                  attributes: ['firstName', 'lastName']
                },
                {
                  model: Class,
                  as: 'class',
                  attributes: ['name']
                }
              ]
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

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if receipt already exists
    const existingReceipt = await Receipt.findOne({
      where: { paymentId }
    });

    if (existingReceipt) {
      return res.status(400).json({
        success: false,
        message: 'Receipt already exists for this payment'
      });
    }

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber(schoolId);

    // Create receipt
    const receipt = await Receipt.create({
      receiptNumber,
      paymentId,
      schoolId,
      studentId: payment.studentFee.student.id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      academicYear: payment.academicYear,
      term: payment.studentFee.term,
      month: payment.studentFee.month,
      feeStructureName: payment.studentFee.feeStructure.name,
      studentName: `${payment.studentFee.student.firstName} ${payment.studentFee.student.lastName}`,
      parentName: payment.studentFee.student.parent ? 
        `${payment.studentFee.student.parent.firstName} ${payment.studentFee.student.parent.lastName}` : null,
      className: payment.studentFee.student.class?.name,
      recordedBy: payment.recordedBy,
      recordedByName: `${payment.recordedByUser.firstName} ${payment.recordedByUser.lastName}`,
      notes: payment.notes
    });

    res.json({
      success: true,
      message: 'Receipt created successfully',
      receipt
    });

  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create receipt',
      error: error.message
    });
  }
};

// Get receipt by ID
const getReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const schoolId = req.user.schoolId;

    const receipt = await Receipt.findOne({
      where: { id: receiptId, schoolId },
      include: [
        {
          model: Student,
          as: 'student'
        },
        {
          model: FeePayment,
          as: 'payment'
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        },
        {
          model: User,
          as: 'printedByUser',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    res.json({
      success: true,
      receipt
    });

  } catch (error) {
    console.error('Error getting receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipt',
      error: error.message
    });
  }
};

// Get all receipts for school
const getSchoolReceipts = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { page = 1, limit = 20, search } = req.query;

    const whereClause = { schoolId };
    if (search) {
      whereClause[Op.or] = [
        { receiptNumber: { [Op.iLike]: `%${search}%` } },
        { studentName: { [Op.iLike]: `%${search}%` } },
        { parentName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const receipts = await Receipt.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      success: true,
      receipts: receipts.rows,
      total: receipts.count,
      totalPages: Math.ceil(receipts.count / parseInt(limit)),
      currentPage: parseInt(page)
    });

  } catch (error) {
    console.error('Error getting school receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get receipts',
      error: error.message
    });
  }
};

// Generate PDF receipt
const generatePDFReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const schoolId = req.user.schoolId;

    const receipt = await Receipt.findOne({
      where: { id: receiptId, schoolId },
      include: [
        {
          model: School,
          as: 'school'
        },
        {
          model: Student,
          as: 'student'
        },
        {
          model: FeePayment,
          as: 'payment'
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="receipt-${receipt.receiptNumber}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add school logo if available
    if (receipt.school.logoUrl) {
      const logoPath = path.join(__dirname, '..', '..', receipt.school.logoUrl);
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 50, { width: 100 });
      }
    }

    // School header
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text(receipt.school.name || 'School Name', 50, 160)
       .fontSize(12)
       .font('Helvetica')
       .text('Official Receipt', 50, 190);

    // Receipt details
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('RECEIPT', 50, 220)
       .fontSize(12)
       .font('Helvetica')
       .text(`Receipt No: ${receipt.receiptNumber}`, 50, 250)
       .text(`Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`, 50, 270)
       .text(`Time: ${new Date(receipt.paymentDate).toLocaleTimeString()}`, 50, 290);

    // Student information
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('STUDENT INFORMATION', 50, 330)
       .fontSize(12)
       .font('Helvetica')
       .text(`Name: ${receipt.studentName}`, 50, 360)
       .text(`Class: ${receipt.className || 'N/A'}`, 50, 380)
       .text(`Parent: ${receipt.parentName || 'N/A'}`, 50, 400);

    // Payment details
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('PAYMENT DETAILS', 50, 440)
       .fontSize(12)
       .font('Helvetica')
       .text(`Fee Structure: ${receipt.feeStructureName}`, 50, 470)
       .text(`Amount: $${parseFloat(receipt.amount).toFixed(2)}`, 50, 490)
       .text(`Payment Method: ${receipt.paymentMethod.replace('_', ' ').toUpperCase()}`, 50, 510)
       .text(`Academic Year: ${receipt.academicYear}`, 50, 530);

    if (receipt.term) {
      doc.text(`Term: ${receipt.term}`, 50, 550);
    }
    if (receipt.month) {
      doc.text(`Month: ${receipt.month}`, 50, 570);
    }

    // Recorded by
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Recorded by: ${receipt.recordedByName}`, 50, 600);

    // Notes
    if (receipt.notes) {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Notes: ${receipt.notes}`, 50, 630);
    }

    // Footer
    doc.fontSize(10)
       .font('Helvetica')
       .text('This is an official receipt. Please keep it for your records.', 50, 700)
       .text('Thank you for your payment!', 50, 720);

    // Mark as printed
    await receipt.update({
      isPrinted: true,
      printedAt: new Date(),
      printedBy: req.user.id
    });

    doc.end();

  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF receipt',
      error: error.message
    });
  }
};

// Mark receipt as printed
const markAsPrinted = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const schoolId = req.user.schoolId;
    const userId = req.user.id;

    const receipt = await Receipt.findOne({
      where: { id: receiptId, schoolId }
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    await receipt.update({
      isPrinted: true,
      printedAt: new Date(),
      printedBy: userId
    });

    res.json({
      success: true,
      message: 'Receipt marked as printed',
      receipt
    });

  } catch (error) {
    console.error('Error marking receipt as printed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark receipt as printed',
      error: error.message
    });
  }
};

module.exports = {
  createReceipt,
  getReceipt,
  getSchoolReceipts,
  generatePDFReceipt,
  markAsPrinted,
  generateReceiptNumber
}; 