const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const OptionalService = sequelize.define('OptionalService', {
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
  category: {
    type: DataTypes.ENUM('food', 'transport', 'uniform', 'amenity'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
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

module.exports = OptionalService;