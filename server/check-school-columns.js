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

async function checkColumns() {
  try {
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'School' 
      ORDER BY ordinal_position
    `);
    console.log('School table columns:');
    columns.forEach(col => console.log(`- ${col.column_name}: ${col.data_type}`));
    
    const [schools] = await sequelize.query("SELECT * FROM \"School\" LIMIT 2");
    console.log('\nSample school data:');
    console.log(schools[0]);
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

checkColumns();