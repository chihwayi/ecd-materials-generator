const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Signature = sequelize.define('Signature', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' },
    field: 'user_id'
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' },
    field: 'school_id'
  },
  signatureData: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Base64 encoded signature image data'
  },
  signatureType: {
    type: DataTypes.ENUM('teacher', 'principal', 'admin'),
    allowNull: false,
    defaultValue: 'teacher'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'signatures',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['school_id']
    },
    {
      fields: ['signature_type']
    }
  ]
});

module.exports = Signature; 