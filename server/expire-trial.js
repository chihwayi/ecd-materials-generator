require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecd_db',
  process.env.DB_USER || 'ecd_user', 
  process.env.DB_PASSWORD || 'ecd_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

async function expireTrial() {
  try {
    const schoolId = 'f04bfa37-cf95-4d9b-9eed-2c1c19f45df0';
    
    // Set expiry date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    await sequelize.query(`
      UPDATE "School" 
      SET subscription_expires_at = '${yesterday.toISOString()}',
          subscription_status = 'expired'
      WHERE id = '${schoolId}'
    `);
    
    console.log('Trial expired successfully');
    console.log('Expiry date set to:', yesterday.toISOString());
    
    // Verify the change
    const [school] = await sequelize.query(`SELECT subscription_expires_at, subscription_status FROM "School" WHERE id = '${schoolId}'`);
    console.log('Updated school:', school[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

expireTrial();