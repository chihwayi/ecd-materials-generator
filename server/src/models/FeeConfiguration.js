const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const FeeConfiguration = sequelize.define('FeeConfiguration', {
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
  feeType: {
    type: DataTypes.ENUM('monthly', 'term', 'flexible'),
    allowNull: false,
    defaultValue: 'flexible'
  },
  monthlyAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  termAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  term: {
    type: DataTypes.ENUM('term1', 'term2', 'term3'),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: () => new Date().getFullYear()
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = FeeConfiguration;