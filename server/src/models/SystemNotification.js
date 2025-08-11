const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const SystemNotification = sequelize.define('SystemNotification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'error', 'success'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  targetRole: {
    type: DataTypes.ENUM('system_admin', 'delegated_admin', 'all'),
    defaultValue: 'system_admin'
  }
});

module.exports = SystemNotification;