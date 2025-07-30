const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database.config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('teacher', 'school_admin', 'parent', 'system_admin'),
    allowNull: false,
    defaultValue: 'teacher'
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: DataTypes.STRING,
  language: {
    type: DataTypes.ENUM('en', 'sn', 'nd'),
    defaultValue: 'en'
  },
  schoolId: {
    type: DataTypes.UUID,
    references: { model: 'School', key: 'id' }
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'teacher', 'school', 'premium'),
    defaultValue: 'free'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired'),
    defaultValue: 'active'
  },
  subscriptionExpiresAt: DataTypes.DATE,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLoginAt: DataTypes.DATE
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;