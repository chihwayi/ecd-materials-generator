'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('signatures', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      signature_data: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
        comment: 'Base64 encoded signature image data'
      },
      signature_type: {
        type: Sequelize.ENUM('teacher', 'principal', 'admin'),
        allowNull: false,
        defaultValue: 'teacher'
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
    await queryInterface.addIndex('signatures', ['user_id']);
    await queryInterface.addIndex('signatures', ['school_id']);
    await queryInterface.addIndex('signatures', ['signature_type']);
    await queryInterface.addIndex('signatures', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('signatures');
  }
}; 