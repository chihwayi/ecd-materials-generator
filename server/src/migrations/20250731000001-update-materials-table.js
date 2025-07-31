'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop foreign key constraints
    try {
      await queryInterface.removeConstraint('Assignments', 'Assignments_materialId_fkey');
    } catch (error) {
      console.log('Foreign key constraint may not exist:', error.message);
    }
    
    // Drop the existing Materials table if it exists
    await queryInterface.dropTable('Materials');
    
    // Create the new Materials table with updated structure
    await queryInterface.createTable('Materials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('worksheet', 'activity', 'assessment', 'story'),
        allowNull: false,
        defaultValue: 'worksheet'
      },
      subject: {
        type: Sequelize.ENUM('math', 'language', 'science', 'art', 'cultural'),
        allowNull: false,
        defaultValue: 'math'
      },
      language: {
        type: Sequelize.ENUM('en', 'sn', 'nd'),
        allowNull: false,
        defaultValue: 'en'
      },
      ageGroup: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '3-5'
      },
      status: {
        type: Sequelize.ENUM('draft', 'published'),
        allowNull: false,
        defaultValue: 'draft'
      },
      elements: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      publishedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      downloads: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Materials');
  }
};