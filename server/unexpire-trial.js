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

async function unexpireTrial() {
  try {
    const schoolId = 'f04bfa37-cf95-4d9b-9eed-2c1c19f45df0';
    
    // Set expiry date to 30 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    await sequelize.query(`
      UPDATE "School" 
      SET subscription_expires_at = '${futureDate.toISOString()}',
          subscription_status = 'active'
      WHERE id = '${schoolId}'
    `);
    
    console.log('Trial reactivated successfully');
    console.log('New expiry date:', futureDate.toISOString());
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

unexpireTrial();