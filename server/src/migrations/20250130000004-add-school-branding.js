'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Schools', 'logoUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Schools', 'primaryColor', {
      type: Sequelize.STRING,
      defaultValue: '#2563eb',
      allowNull: false
    });

    await queryInterface.addColumn('Schools', 'secondaryColor', {
      type: Sequelize.STRING,
      defaultValue: '#1d4ed8',
      allowNull: false
    });

    await queryInterface.addColumn('Schools', 'accentColor', {
      type: Sequelize.STRING,
      defaultValue: '#fbbf24',
      allowNull: false
    });

    await queryInterface.addColumn('Schools', 'customFont', {
      type: Sequelize.STRING,
      defaultValue: 'Inter',
      allowNull: true
    });

    await queryInterface.addColumn('Schools', 'customDomain', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('Schools', 'brandingEnabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    await queryInterface.addColumn('Schools', 'customCss', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Schools', 'faviconUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Schools', 'schoolMotto', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Schools', 'customHeaderText', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Schools', 'logoUrl');
    await queryInterface.removeColumn('Schools', 'primaryColor');
    await queryInterface.removeColumn('Schools', 'secondaryColor');
    await queryInterface.removeColumn('Schools', 'accentColor');
    await queryInterface.removeColumn('Schools', 'customFont');
    await queryInterface.removeColumn('Schools', 'customDomain');
    await queryInterface.removeColumn('Schools', 'brandingEnabled');
    await queryInterface.removeColumn('Schools', 'customCss');
    await queryInterface.removeColumn('Schools', 'faviconUrl');
    await queryInterface.removeColumn('Schools', 'schoolMotto');
    await queryInterface.removeColumn('Schools', 'customHeaderText');
  }
}; 