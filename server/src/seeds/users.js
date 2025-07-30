const { User } = require('../models');

const sampleUsers = [
  {
    email: 'admin@school.com',
    password: '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'school_admin'
  },
  {
    email: 'parent@test.com',
    password: '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'parent'
  },
  {
    email: 'system@admin.com',
    password: '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    firstName: 'Admin',
    lastName: 'User',
    role: 'system_admin'
  }
];

const seedUsers = async () => {
  try {
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }
    console.log('✅ Sample users seeded');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

module.exports = { seedUsers };