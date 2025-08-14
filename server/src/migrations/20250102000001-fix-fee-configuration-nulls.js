'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update null values before making columns NOT NULL
    await queryInterface.sequelize.query(`
      UPDATE "FeeConfigurations" 
      SET "monthlyAmount" = COALESCE("monthlyAmount", "termAmount" / 3, 100),
          "termAmount" = COALESCE("termAmount", "monthlyAmount" * 3, 300)
      WHERE "monthlyAmount" IS NULL OR "termAmount" IS NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // No rollback needed
  }
};