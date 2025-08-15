#!/usr/bin/env node

const { connectDatabase } = require('./src/utils/database');
const { QueryInterface } = require('sequelize');

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...\n');
  
  try {
    const sequelize = await connectDatabase();
    const queryInterface = sequelize.getQueryInterface();
    
    // Check if SequelizeMeta table exists (indicates migrations have been run)
    const tables = await queryInterface.showAllTables();
    console.log(`📊 Found ${tables.length} tables in database`);
    
    if (tables.includes('SequelizeMeta')) {
      const [migrations] = await sequelize.query('SELECT * FROM "SequelizeMeta" ORDER BY name');
      console.log(`✅ ${migrations.length} migrations have been applied:`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('⚠️  No migrations found - database needs to be set up');
    }
    
    // Check key tables
    const keyTables = ['Schools', 'Users', 'Students', 'Classes', 'FeeConfigurations'];
    const missingTables = keyTables.filter(table => !tables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ All key tables present');
      
      // Check for sample data
      const [schools] = await sequelize.query('SELECT COUNT(*) as count FROM "Schools"');
      const [users] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
      const [students] = await sequelize.query('SELECT COUNT(*) as count FROM "Students"');
      
      console.log(`\n📈 Data Summary:`);
      console.log(`   Schools: ${schools[0].count}`);
      console.log(`   Users: ${users[0].count}`);
      console.log(`   Students: ${students[0].count}`);
      
      if (schools[0].count > 0 && users[0].count > 0) {
        console.log('✅ Sample data is present');
      } else {
        console.log('⚠️  No sample data found - run seeds to add test data');
      }
    } else {
      console.log(`❌ Missing tables: ${missingTables.join(', ')}`);
      console.log('💡 Run: npm run db:setup');
    }
    
    await sequelize.close();
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your database credentials in .env file');
    console.log('   3. Create the database if it doesn\'t exist');
    console.log('   4. Run: npm run db:setup');
  }
}

checkDatabaseStatus();