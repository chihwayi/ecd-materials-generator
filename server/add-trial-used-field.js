const { School } = require('./src/models');

async function addTrialUsedField() {
  try {
    // Add the column using raw SQL since we can't modify the model easily
    await School.sequelize.query(`
      ALTER TABLE "School" 
      ADD COLUMN IF NOT EXISTS "trial_used" BOOLEAN DEFAULT FALSE;
    `);

    // Update your school to have trialUsed = true
    await School.sequelize.query(`
      UPDATE "School" 
      SET "trial_used" = TRUE 
      WHERE "id" = 'f04bfa37-cf95-4d9b-9eed-2c1c19f45df0';
    `);

    console.log('✅ Added trial_used field and set to true for your school');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addTrialUsedField();