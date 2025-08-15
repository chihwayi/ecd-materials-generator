'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('financial_reports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      school_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      report_type: {
        type: Sequelize.ENUM('revenue', 'expenses', 'payment_trends', 'fee_collection', 'outstanding_fees', 'monthly_summary', 'quarterly_summary', 'yearly_summary'),
        allowNull: false
      },
      report_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date_range: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: 'Start and end dates for the report period'
      },
      report_data: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: 'Generated report data including charts and analytics'
      },
      export_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Data formatted for PDF/Excel export'
      },
      generated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes
    await queryInterface.addIndex('financial_reports', ['school_id']);
    await queryInterface.addIndex('financial_reports', ['report_type']);
    await queryInterface.addIndex('financial_reports', ['generated_by']);
    await queryInterface.addIndex('financial_reports', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('financial_reports');
  }
}; 