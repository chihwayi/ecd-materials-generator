const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const School = sequelize.define('School', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: DataTypes.TEXT,
  contactEmail: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  contactPhone: DataTypes.STRING,
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'basic', 'premium'),
    defaultValue: 'free'
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired', 'grace_period', 'payment_failed'),
    defaultValue: 'active'
  },
  subscriptionExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastPaymentAttempt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentFailureCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxTeachers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  trialUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'trial_used'
  },
  defaultParentPassword: {
    type: DataTypes.STRING,
    defaultValue: 'parent123'
  },
  // Branding and Customization Fields
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#2563eb', // Default blue
    validate: {
      is: /^#[0-9A-F]{6}$/i // Hex color validation
    }
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#1d4ed8', // Default darker blue
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  accentColor: {
    type: DataTypes.STRING,
    defaultValue: '#fbbf24', // Default gold
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  customFont: {
    type: DataTypes.STRING,
    defaultValue: 'Inter',
    allowNull: true
  },
  customDomain: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  brandingEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  customCss: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  faviconUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  schoolMotto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customHeaderText: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = School;