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

async function checkTables() {
  try {
    // Check User table
    const [user] = await sequelize.query("SELECT * FROM \"User\" WHERE email = 'ichihwayi@gmail.com' LIMIT 1");
    console.log('User from User table:', user[0] || 'Not found');
    
    if (user[0]?.schoolId) {
      // Check School table
      const [school] = await sequelize.query(`SELECT * FROM "School" WHERE id = '${user[0].schoolId}' LIMIT 1`);
      console.log('School from School table:', school[0] || 'Not found');
    }
    
    // List all users to see what exists
    const [allUsers] = await sequelize.query("SELECT email, role, \"schoolId\" FROM \"User\" ORDER BY \"createdAt\" DESC LIMIT 5");
    console.log('\nAll users in User table:');
    allUsers.forEach(u => console.log(`- ${u.email} (${u.role}) - School: ${u.schoolId}`));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkTables();