const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const FeeStructure = sequelize.define('FeeStructure', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'School',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('monthly', 'term', 'transport', 'food', 'activities', 'auxiliary'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('tuition', 'transport', 'food', 'activities', 'auxiliary'),
    allowNull: false,
    defaultValue: 'tuition'
  },
  frequency: {
    type: DataTypes.ENUM('monthly', 'term', 'one-time'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false
  },
  term: {
    type: DataTypes.ENUM('term1', 'term2', 'term3', 'all'),
    allowNull: true
  },
  month: {
    type: DataTypes.ENUM('january', 'february', 'march', 'april', 'may', 'june', 
                         'july', 'august', 'september', 'october', 'november', 'december', 'all'),
    allowNull: true
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'FeeStructure',
  timestamps: true,
  underscored: true
});

module.exports = FeeStructure; 