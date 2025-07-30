const { Template } = require('../models');

const sampleTemplates = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Counting Animals',
    description: 'Learn to count with Zimbabwean animals',
    category: 'math',
    subcategory: 'counting',
    difficulty: 'beginner',
    ageGroupMin: 3,
    ageGroupMax: 5,
    culturalTags: ['zimbabwe', 'animals', 'counting'],
    languages: ['en', 'sn', 'nd'],
    content: {
      layout: { type: 'grid', columns: 2 },
      elements: [
        { type: 'image', src: 'elephant.png', count: 3 },
        { type: 'text', content: 'How many elephants?' }
      ]
    },
    thumbnail: 'counting-animals-thumb.png',
    isPremium: false,
    isActive: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Shona Alphabet',
    description: 'Learn Shona letters with cultural objects',
    category: 'language',
    subcategory: 'alphabet',
    difficulty: 'beginner',
    ageGroupMin: 4,
    ageGroupMax: 6,
    culturalTags: ['shona', 'alphabet', 'culture'],
    languages: ['sn', 'en'],
    content: {
      layout: { type: 'list' },
      elements: [
        { type: 'letter', value: 'A', word: 'Asi', image: 'horse.png' }
      ]
    },
    thumbnail: 'shona-alphabet-thumb.png',
    isPremium: false,
    isActive: true
  }
];

const seedTemplates = async () => {
  try {
    await Template.bulkCreate(sampleTemplates, { ignoreDuplicates: true });
    console.log('✅ Sample templates seeded');
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
  }
};

module.exports = { seedTemplates };