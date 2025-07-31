const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const StudentAssignment = sequelize.define('StudentAssignment', {
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
    type: DataTypes.ENUM('assigned', 'in_progress', 'submitted', 'graded'),
    defaultValue: 'assigned'
  },
  submissionText: {
    type: DataTypes.TEXT
  },
  submittedAt: {
    type: DataTypes.DATE
  },
  grade: {
    type: DataTypes.INTEGER
  },
  feedback: {
    type: DataTypes.TEXT
  },
  gradedAt: {
    type: DataTypes.DATE
  },
  gradedBy: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' }
  }
});

module.exports = StudentAssignment;