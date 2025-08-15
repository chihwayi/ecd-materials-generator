'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Subscription table
    await queryInterface.createTable('Subscription', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      school_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'School',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      plan_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      plan_name: {
        type: Sequelize.ENUM('free', 'basic', 'premium', 'enterprise'),
        allowNull: false,
        defaultValue: 'free'
      },
      status: {
        type: Sequelize.ENUM('active', 'cancelled', 'expired', 'past_due', 'unpaid'),
        allowNull: false,
        defaultValue: 'active'
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stripe_subscription_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_period_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      current_period_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trial_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      trial_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancel_at_period_end: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create SubscriptionPayment table
    await queryInterface.createTable('SubscriptionPayment', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Subscription',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      school_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'School',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      stripe_payment_intent_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stripe_invoice_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'usd'
      },
      status: {
        type: Sequelize.ENUM('pending', 'succeeded', 'failed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      period_start: {
        type: Sequelize.DATE,
        allowNull: true
      },
      period_end: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Subscription', ['school_id']);
    await queryInterface.addIndex('Subscription', ['stripe_subscription_id']);
    await queryInterface.addIndex('Subscription', ['status']);
    await queryInterface.addIndex('SubscriptionPayment', ['subscription_id']);
    await queryInterface.addIndex('SubscriptionPayment', ['school_id']);
    await queryInterface.addIndex('SubscriptionPayment', ['stripe_payment_intent_id']);
    await queryInterface.addIndex('SubscriptionPayment', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('SubscriptionPayment');
    await queryInterface.dropTable('Subscription');
  }
}; 