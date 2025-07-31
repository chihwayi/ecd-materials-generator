require('dotenv').config();
const { connectDatabase } = require('../utils/database');

const addClassTable = async () => {
  try {
    await connectDatabase();
    console.log('🔄 Adding Class table...');
    
    const { Class } = require('../models');
    
    // Force sync the Class table
    await Class.sync({ force: false });
    
    console.log('✅ Class table added successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add Class table:', error);
    process.exit(1);
  }
};

addClassTable();