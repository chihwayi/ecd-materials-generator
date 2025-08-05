const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const StudentServicePreference = sequelize.define('StudentServicePreference', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Student',
      key: 'id'
    }
  },
  school_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'School',
      key: 'id'
    }
  },
  tuition_type: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['monthly', 'term']]
    },
    comment: 'Student\'s choice of tuition type'
  },
  transport: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether student opted for transport service'
  },
  food: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether student opted for food service'
  },
  activities: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether student opted for activities service'
  },
  auxiliary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether student opted for auxiliary service'
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().getFullYear().toString()
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes about service preferences'
  }
}, {
  tableName: 'student_service_preferences',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'academic_year']
    }
  ]
});

module.exports = StudentServicePreference; 