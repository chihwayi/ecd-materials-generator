const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const StudentServiceSelection = sequelize.define('StudentServiceSelection', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Student',
      key: 'id'
    }
  },
  optionalServiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'OptionalService',
      key: 'id'
    }
  },
  isSelected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'opted_out'),
    defaultValue: 'pending'
  }
});

module.exports = StudentServiceSelection;