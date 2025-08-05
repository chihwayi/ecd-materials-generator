const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const StudentFee = sequelize.define('StudentFee', {
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
  feeStructureId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'FeeStructure',
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('not_paid', 'partially_paid', 'fully_paid'),
    defaultValue: 'not_paid'
  },
  paymentType: {
    type: DataTypes.ENUM('monthly', 'term'),
    allowNull: true
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  term: {
    type: DataTypes.ENUM('term1', 'term2', 'term3'),
    allowNull: true
  },
  month: {
    type: DataTypes.ENUM('january', 'february', 'march', 'april', 'may', 'june', 
                         'july', 'august', 'september', 'october', 'november', 'december'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'StudentFee',
  timestamps: true,
  underscored: true
});

module.exports = StudentFee; 