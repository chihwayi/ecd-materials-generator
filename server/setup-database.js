#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Setting up ECD Materials Generator Database...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('📝 Please copy .env.example to .env and configure your database settings.');
  process.exit(1);
}

try {
  // Load environment variables
  require('dotenv').config({ path: envPath });
  
  console.log('📋 Database Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || '5432'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'ecd_db'}`);
  console.log(`   User: ${process.env.DB_USER || 'ecd_user'}\n`);

  // Check if database connection works
  console.log('🔍 Testing database connection...');
  const { connectDatabase } = require('./src/utils/database');
  
  connectDatabase().then(async () => {
    console.log('✅ Database connection successful!\n');
    
    // Run migrations
    console.log('📦 Running database migrations...');
    try {
      execSync('npx sequelize-cli db:migrate', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Migrations completed successfully!\n');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
    
    // Run seeds
    console.log('🌱 Seeding database with initial data...');
    try {
      execSync('npx sequelize-cli db:seed:all', { 
        stdio: 'inherit',
        cwd: __dirname 
      });
      console.log('✅ Database seeded successfully!\n');
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      process.exit(1);
    }
    
    console.log('🎉 Database setup completed successfully!\n');
    console.log('📧 Test Accounts Created:');
    console.log('   System Admin: admin@system.com / password123');
    console.log('   School Admin: bbanda@gmail.com / brian123');
    console.log('   Teacher: teacher@test.com / password123');
    console.log('   Finance Manager: finance@school.com / finance123');
    console.log('   Parent: parent@test.com / password123\n');
    console.log('🚀 You can now start the application with: npm run dev');
    
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure PostgreSQL is running');
    console.log('   2. Check your database credentials in .env file');
    console.log('   3. Ensure the database exists or create it manually');
    console.log('   4. Verify network connectivity to database server');
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}