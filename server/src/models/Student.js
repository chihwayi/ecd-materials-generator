const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: DataTypes.INTEGER,
  grade: DataTypes.STRING,
  parentName: DataTypes.STRING,
  parentEmail: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  parentPhone: DataTypes.STRING,
  parentId: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' }
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' }
  },
  classId: {
    type: DataTypes.UUID,
    references: { model: 'Class', key: 'id' }
  },
  teacherId: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' }
  },
  language: {
    type: DataTypes.ENUM('en', 'sn', 'nd'),
    defaultValue: 'en'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Student;