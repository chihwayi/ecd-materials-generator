const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'Student', key: 'id' }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('general', 'progress_update', 'behavior_note', 'achievement', 'concern'),
    defaultValue: 'general'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'Message',
  timestamps: true
});

module.exports = Message; 