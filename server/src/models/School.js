const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: DataTypes.TEXT,
  contactEmail: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  contactPhone: DataTypes.STRING,
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'basic', 'premium'),
    defaultValue: 'free'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired'),
    defaultValue: 'active'
  },
  maxTeachers: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = School;