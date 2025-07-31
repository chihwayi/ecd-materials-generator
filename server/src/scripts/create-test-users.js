const { User, School } = require('../models');
const { connectDatabase } = require('../utils/database');

const createTestUsers = async () => {
  try {
    await connectDatabase();

    // Create a test school
    const school = await School.create({
      name: 'Test Primary School',
      address: '123 Test Street, Harare',
      contactEmail: 'admin@testschool.com',
      contactPhone: '+263 77 123 4567'
    });

    // Create test users
    const users = [
      {
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher',
        firstName: 'Test',
        lastName: 'Teacher',
        schoolId: school.id
      },
      {
        email: 'admin@test.com',
        password: 'password123',
        role: 'school_admin',
        firstName: 'School',
        lastName: 'Admin',
        schoolId: school.id
      },
      {
        email: 'parent@test.com',
        password: 'password123',
        role: 'parent',
        firstName: 'Test',
        lastName: 'Parent',
        schoolId: school.id
      },
      {
        email: 'system@test.com',
        password: 'password123',
        role: 'system_admin',
        firstName: 'System',
        lastName: 'Admin'
      }
    ];

    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Teacher: teacher@test.com / password123');
    console.log('School Admin: admin@test.com / password123');
    console.log('Parent: parent@test.com / password123');
    console.log('System Admin: system@test.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();