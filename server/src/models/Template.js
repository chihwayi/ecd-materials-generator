const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  category: {
    type: DataTypes.ENUM('math', 'language', 'art', 'science', 'cultural'),
    allowNull: false
  },
  subcategory: DataTypes.STRING,
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  ageGroupMin: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  ageGroupMax: {
    type: DataTypes.INTEGER,
    defaultValue: 6
  },
  culturalTags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['en']
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  thumbnail: DataTypes.STRING,
  previewImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  creatorId: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' }
  },
  downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Template;