'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('FeeStructure', 'category', {
      type: Sequelize.ENUM('tuition', 'transport', 'food', 'activities', 'auxiliary'),
      allowNull: false,
      defaultValue: 'tuition'
    });

    await queryInterface.addColumn('FeeStructure', 'frequency', {
      type: Sequelize.ENUM('monthly', 'term', 'one-time'),
      allowNull: false,
      defaultValue: 'monthly'
    });

    await queryInterface.addColumn('FeeStructure', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update the type enum to include new values
    await queryInterface.changeColumn('FeeStructure', 'type', {
      type: Sequelize.ENUM('monthly', 'term', 'transport', 'food', 'activities', 'auxiliary'),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('FeeStructure', 'category');
    await queryInterface.removeColumn('FeeStructure', 'frequency');
    await queryInterface.removeColumn('FeeStructure', 'dueDate');

    // Revert the type enum
    await queryInterface.changeColumn('FeeStructure', 'type', {
      type: Sequelize.ENUM('monthly', 'term'),
      allowNull: false
    });
  }
}; 