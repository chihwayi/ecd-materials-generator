const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  classId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Class', key: 'id' }
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' }
  },
  type: {
    type: DataTypes.ENUM('material', 'custom'),
    defaultValue: 'material'
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  customTasks: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Assignment;