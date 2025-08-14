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

async function listUsers() {
  try {
    const [users] = await sequelize.query("SELECT email, role, \"schoolId\" FROM \"Users\" ORDER BY \"createdAt\" DESC LIMIT 10");
    console.log('Recent users:');
    users.forEach(user => console.log(`- ${user.email} (${user.role}) - School: ${user.schoolId}`));
    
    const [schools] = await sequelize.query("SELECT id, name, \"subscriptionPlan\", \"subscription_expires_at\" FROM \"School\" ORDER BY \"createdAt\" DESC LIMIT 5");
    console.log('\nRecent schools:');
    schools.forEach(school => console.log(`- ${school.name} (${school.subscriptionPlan}) - Expires: ${school.subscription_expires_at}`));
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

listUsers();