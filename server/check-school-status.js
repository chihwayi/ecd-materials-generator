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

async function checkSchool() {
  try {
    const schoolId = 'f04bfa37-cf95-4d9b-9eed-2c1c19f45df0';
    const [school] = await sequelize.query(`SELECT * FROM "School" WHERE id = '${schoolId}' LIMIT 1`);
    
    console.log('School details:');
    console.log(school[0] || 'School not found');
    
    // Check if trial is activated (has expiry date)
    if (school[0]) {
      const hasExpiryDate = !!school[0].subscription_expires_at;
      console.log('\nTrial Status:');
      console.log('- Has expiry date:', hasExpiryDate);
      console.log('- Subscription plan:', school[0].subscription_plan);
      console.log('- Should be blocked:', school[0].subscription_plan === 'free' && !hasExpiryDate);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkSchool();