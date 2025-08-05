const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const FinancialReport = sequelize.define('FinancialReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  schoolId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'School', key: 'id' },
    field: 'school_id'
  },
  reportType: {
    type: DataTypes.ENUM('revenue', 'expenses', 'payment_trends', 'fee_collection', 'outstanding_fees', 'monthly_summary', 'quarterly_summary', 'yearly_summary'),
    allowNull: false
  },
  reportName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateRange: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Start and end dates for the report period'
  },
  reportData: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Generated report data including charts and analytics'
  },
  exportData: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Data formatted for PDF/Excel export'
  },
  generatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'User', key: 'id' },
    field: 'generated_by'
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
  tableName: 'financial_reports',
  timestamps: true,
  indexes: [
    {
      fields: ['school_id']
    },
    {
      fields: ['report_type']
    },
    {
      fields: ['generated_by']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = FinancialReport; 