const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const StudentFeeAssignment = sequelize.define('StudentFeeAssignment', {
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
  feeConfigurationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'FeeConfiguration',
      key: 'id'
    }
  },
  paymentPlan: {
    type: DataTypes.ENUM('monthly', 'term'),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  balanceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'partial', 'paid'),
    defaultValue: 'pending'
  }
});

module.exports = StudentFeeAssignment;