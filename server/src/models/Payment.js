const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Student',
      key: 'id'
    }
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'School',
      key: 'id'
    }
  },
  paymentType: {
    type: DataTypes.ENUM('tuition', 'service'),
    allowNull: false
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true // Can be feeAssignmentId or serviceSelectionId
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'mobile_money'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  }
});

module.exports = Payment;