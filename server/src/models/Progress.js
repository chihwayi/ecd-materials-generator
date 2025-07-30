const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  assignmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Assignment', key: 'id' }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Student', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'overdue'),
    defaultValue: 'not_started'
  },
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 }
  },
  completedAt: DataTypes.DATE,
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  interactionData: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  answers: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  autoFeedback: DataTypes.JSONB,
  teacherComments: DataTypes.TEXT,
  parentViewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastAccessed: DataTypes.DATE
});

module.exports = Progress;