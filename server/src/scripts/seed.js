require('dotenv').config();
const { connectDatabase } = require('../utils/database');
const { seedTemplates } = require('../seeds/templates');
const { seedUsers } = require('../seeds/users');

const runSeeds = async () => {
  try {
    await connectDatabase();
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedTemplates();
    
    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeds();