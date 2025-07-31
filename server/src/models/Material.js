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
  type: {
    type: DataTypes.ENUM('worksheet', 'activity', 'assessment', 'story'),
    allowNull: false,
    defaultValue: 'worksheet'
  },
  subject: {
    type: DataTypes.ENUM('math', 'language', 'science', 'art', 'cultural'),
    allowNull: false,
    defaultValue: 'math'
  },
  language: {
    type: DataTypes.ENUM('en', 'sn', 'nd'),
    allowNull: false,
    defaultValue: 'en'
  },
  ageGroup: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '3-5'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    allowNull: false,
    defaultValue: 'draft'
  },
  elements: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' }
  },
  publishedAt: DataTypes.DATE,
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Material;