const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  planId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'usd'
  },
  interval: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'month'
  },
  trialDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  maxTeachers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  maxClasses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: -1
  },
  materials: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  templates: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  assignments: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  basicAnalytics: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  financeModule: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  advancedAnalytics: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  prioritySupport: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  customBranding: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  apiAccess: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  whiteLabeling: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  storageGB: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  monthlyExports: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  customTemplates: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'SubscriptionPlans',
  underscored: false,
  timestamps: false
});

module.exports = SubscriptionPlan;