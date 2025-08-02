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
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name'
  },
  age: DataTypes.INTEGER,
  grade: DataTypes.STRING,
  parentName: {
    type: DataTypes.STRING,
    field: 'parent_name'
  },
  parentEmail: {
    type: DataTypes.STRING,
    validate: { isEmail: true },
    field: 'parent_email'
  },
  parentPhone: {
    type: DataTypes.STRING,
    field: 'parent_phone'
  },
  parentId: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' },
    field: 'parent_id'
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' },
    field: 'school_id'
  },
  classId: {
    type: DataTypes.UUID,
    references: { model: 'Class', key: 'id' },
    field: 'class_id'
  },
  teacherId: {
    type: DataTypes.UUID,
    references: { model: 'User', key: 'id' },
    field: 'teacher_id'
  },
  language: {
    type: DataTypes.ENUM('en', 'sn', 'nd'),
    defaultValue: 'en'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
});

module.exports = Student;