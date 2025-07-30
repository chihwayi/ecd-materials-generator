const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

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
  description: DataTypes.TEXT,
  instructions: DataTypes.TEXT,
  materialId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Material', key: 'id' }
  },
  teacherId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  studentIds: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false
  },
  dueDate: DataTypes.DATE,
  allowLateSubmission: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  maxAttempts: DataTypes.INTEGER,
  timeLimit: DataTypes.INTEGER,
  showProgress: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  parentNotification: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  reminderDays: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [3, 1]
  },
  notificationMethods: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['email']
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
    defaultValue: 'draft'
  }
});

module.exports = Assignment;