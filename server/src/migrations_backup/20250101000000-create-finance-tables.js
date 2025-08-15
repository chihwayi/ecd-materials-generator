'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create FeeConfigurations table
    await queryInterface.createTable('FeeConfigurations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Schools',
          key: 'id'
        }
      },
      feeType: {
        type: Sequelize.ENUM('monthly', 'term', 'flexible'),
        allowNull: false,
        defaultValue: 'flexible'
      },
      monthlyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      termAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      term: {
        type: Sequelize.ENUM('term1', 'term2', 'term3'),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: () => new Date().getFullYear()
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create OptionalServices table
    await queryInterface.createTable('OptionalServices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Schools',
          key: 'id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('food', 'transport', 'uniform', 'amenity'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      term: {
        type: Sequelize.ENUM('term1', 'term2', 'term3'),
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: () => new Date().getFullYear()
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create StudentFeeAssignments table
    await queryInterface.createTable('StudentFeeAssignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        }
      },
      feeConfigurationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'FeeConfigurations',
          key: 'id'
        }
      },
      paymentPlan: {
        type: Sequelize.ENUM('monthly', 'term'),
        allowNull: false
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paidAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      balanceAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'partial', 'paid'),
        defaultValue: 'pending'
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

    // Create Payments table
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        }
      },
      feeAssignmentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'StudentFeeAssignments',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'bank_transfer', 'mobile_money', 'check'),
        allowNull: false
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('Payments');
    await queryInterface.dropTable('StudentFeeAssignments');
    await queryInterface.dropTable('OptionalServices');
    await queryInterface.dropTable('FeeConfigurations');
  }
};