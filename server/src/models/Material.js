const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Material = sequelize.define('Material', {
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
  templateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'Template', key: 'id' }
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  pdfUrl: DataTypes.STRING,
  interactiveUrl: DataTypes.STRING,
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sharedWith: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  allowDownload: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  allowCopy: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  assignments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  lastAccessed: DataTypes.DATE
});

module.exports = Material;