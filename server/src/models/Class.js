const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'School',
      key: 'id'
    }
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Class',
  timestamps: true
});

module.exports = Class;