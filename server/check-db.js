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

async function checkDB() {
  try {
    const [userResult] = await sequelize.query("SELECT * FROM \"Users\" WHERE email = 'ichihwayi@gmail.com' LIMIT 1");
    console.log('User:', userResult[0] || 'Not found');
    
    if (userResult[0]?.schoolId) {
      const [schoolResult] = await sequelize.query(`SELECT * FROM "School" WHERE id = '${userResult[0].schoolId}' LIMIT 1`);
      console.log('School:', schoolResult[0] || 'Not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkDB();