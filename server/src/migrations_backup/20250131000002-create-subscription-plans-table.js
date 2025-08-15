'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SubscriptionPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      planId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'usd'
      },
      interval: {
        type: Sequelize.ENUM('month', 'year'),
        allowNull: false,
        defaultValue: 'month'
      },
      trialDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      maxStudents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1
      },
      maxTeachers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1
      },
      maxClasses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1
      },
      materials: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      templates: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      assignments: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      basicAnalytics: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      financeModule: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      advancedAnalytics: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      prioritySupport: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      customBranding: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      apiAccess: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      whiteLabeling: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      storageGB: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      monthlyExports: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      customTemplates: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SubscriptionPlans');
  }
};