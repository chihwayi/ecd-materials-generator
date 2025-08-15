const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Receipt = sequelize.define('Receipt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'FeePayment', key: 'id' },
    field: 'payment_id'
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' },
    field: 'school_id'
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Student', key: 'id' },
    field: 'student_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'mobile_money', 'check', 'other'),
    allowNull: false,
    field: 'payment_method'
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'payment_date'
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'academic_year'
  },
  term: {
    type: DataTypes.STRING,
    allowNull: true
  },
  month: {
    type: DataTypes.STRING,
    allowNull: true
  },
  feeStructureName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'fee_structure_name'
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'student_name'
  },
  parentName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'parent_name'
  },
  className: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'class_name'
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' },
    field: 'recorded_by'
  },
  recordedByName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'recorded_by_name'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPrinted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_printed'
  },
  printedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'printed_at'
  },
  printedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'User', key: 'id' },
    field: 'printed_by'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'receipt',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['receipt_number'] },
    { fields: ['payment_id'] },
    { fields: ['school_id'] },
    { fields: ['student_id'] },
    { fields: ['recorded_by'] },
    { fields: ['created_at'] }
  ]
});

module.exports = Receipt; 