const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const FeePayment = sequelize.define('FeePayment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentFeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'StudentFee',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'mobile_money', 'check', 'other'),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'School',
      key: 'id'
    }
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  receiptNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'FeePayment',
  timestamps: true,
  underscored: true
});

module.exports = FeePayment; 