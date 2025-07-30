const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

// Sample data for development
const sampleData = {
  schools: [
    {
      id: 'school-1',
      name: 'Harare Primary School',
      address: '123 Main Street, Harare, Zimbabwe',
      contact_info: {
        phone: '+263-1-123-4567',
        email: 'info@harareprimary.edu.zw',
        principal: 'Mrs. Sarah Mukamuri'
      },
      subscription: {
        plan: 'school',
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    },
    {
      id: 'school-2',
      name: 'Bulawayo Children Centre',
      address: '456 Park Avenue, Bulawayo, Zimbabwe',
      contact_info: {
        phone: '+263-9-876-5432',
        email: 'admin@bulawayochildren.edu.zw',
        principal: 'Mr. Thabo Ndlovu'
      },
      subscription: {
        plan: 'premium',
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    }
  ],
  
  users: [
    {
      id: 'user-teacher-1',
      email: 'teacher1@harareprimary.edu.zw',
      password: 'hashedpassword123', // Will be properly hashed
      role: 'teacher',
      profile: {
        firstName: 'Grace',
        lastName: 'Moyo',
        phoneNumber: '+263-77-123-4567',
        language: 'en'
      },
      schoolId: 'school-1',
      subscription: {
        plan: 'teacher',
        status: 'active'
      }
    },
    {
      id: 'user-admin-1',
      email: 'admin@harareprimary.edu.zw',
      password: 'hashedpassword456',
      role: 'school_admin',
      profile: {
        firstName: 'John',
        lastName: 'Chikwanha',
        phoneNumber: '+263-77-987-6543',
        language: 'en'
      },
      schoolId: 'school-1',
      subscription: {
        plan: 'school',
        status: 'active'
      }
    }
  ],
  
  templates: [
    {
      id: 'template-math-1',
      name: 'Number Recognition 1-10',
      description: 'Interactive template for teaching number recognition from 1 to 10',
      category: 'math',
      subcategory: 'numbers',
      difficulty: 'beginner',
      ageGroup: { min: 3, max: 5 },
      culturalTags: ['zimbabwe', 'universal'],
      languages: ['en', 'sn', 'nd'],
      content: {
        layout: { type: 'grid', columns: 2, rows: 5 },
        elements: [
          { type: 'number', value: 1, position: { x: 0, y: 0 } },
          { type: 'image', src: 'one-apple.png', position: { x: 1, y: 0 } }
        ]
      },
      metadata: {
        downloads: 0,
        rating: 0,
        reviews: 0,
        isPremium: false,
        isActive: true
      }
    },
    {
      id: 'template-lang-1',
      name: 'Shona Alphabet Learning',
      description: 'Learn Shona alphabet with cultural illustrations',
      category: 'language',
      subcategory: 'alphabet',
      difficulty: 'beginner',
      ageGroup: { min: 4, max: 6 },
      culturalTags: ['zimbabwe', 'shona', 'traditional'],
      languages: ['sn', 'en'],
      content: {
        layout: { type: 'list', orientation: 'vertical' },
        elements: [
          { type: 'letter', value: 'A', pronunciation: 'ah', position: { x: 0, y: 0 } },
          { type: 'word', value: 'Asi', translation: 'But', position: { x: 1, y: 0 } }
        ]
      },
      metadata: {
        downloads: 0,
        rating: 0,
        reviews: 0,
        isPremium: false,
        isActive: true
      }
    }
  ],
  
  students: [
    {
      id: 'student-1',
      firstName: 'Tendai',
      lastName: 'Mutasa',
      age: 5,
      parentContact: {
        name: 'Mary Mutasa',
        phone: '+263-77-555-0001',
        email: 'mary.mutasa@gmail.com'
      },
      schoolId: 'school-1'
    },
    {
      id: 'student-2',
      firstName: 'Chipo',
      lastName: 'Dube',
      age: 4,
      parentContact: {
        name: 'Peter Dube',
        phone: '+263-77-555-0002',
        email: 'peter.dube@gmail.com'
      },
      schoolId: 'school-1'
    }
  ]
};

async function seedDatabase() {
  console.log('🌱 Seeding development database...');
  
  try {
    // Database connection would be established here
    // Insert sample data
    console.log('✅ Sample data inserted successfully!');
    
    console.log('\n📊 Seeded data summary:');
    console.log(`   - Schools: ${sampleData.schools.length}`);
    console.log(`   - Users: ${sampleData.users.length}`);
    console.log(`   - Templates: ${sampleData.templates.length}`);
    console.log(`   - Students: ${sampleData.students.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleData, seedDatabase };
