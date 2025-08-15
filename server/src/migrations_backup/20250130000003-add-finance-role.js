'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'finance' role to the Users table
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('teacher', 'school_admin', 'parent', 'system_admin', 'finance'),
      allowNull: false,
      defaultValue: 'teacher'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'finance' role from the Users table
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('teacher', 'school_admin', 'parent', 'system_admin'),
      allowNull: false,
      defaultValue: 'teacher'
    });
  }
}; 