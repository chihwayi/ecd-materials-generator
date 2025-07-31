'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const schoolId1 = uuidv4();
    const schoolId2 = uuidv4();
    const systemAdminId = uuidv4();
    const schoolAdminId = uuidv4();
    const teacherId1 = uuidv4();
    const teacherId2 = uuidv4();
    const parentId = uuidv4();
    const templateId1 = uuidv4();
    const templateId2 = uuidv4();
    const materialId1 = uuidv4();
    const studentId1 = uuidv4();
    const studentId2 = uuidv4();

    // Insert Schools
    await queryInterface.bulkInsert('Schools', [
      {
        id: schoolId1,
        name: 'Harare Primary School',
        address: '123 Main Street, Harare, Zimbabwe',
        contactEmail: 'admin@harareprimary.edu.zw',
        contactPhone: '+263-4-123456',
        subscriptionPlan: 'basic',
        subscriptionStatus: 'active',
        maxTeachers: 10,
        maxStudents: 200,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: schoolId2,
        name: 'Bulawayo ECD Center',
        address: '456 Oak Avenue, Bulawayo, Zimbabwe',
        contactEmail: 'info@bulawayoecd.edu.zw',
        contactPhone: '+263-9-789012',
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active',
        maxTeachers: 15,
        maxStudents: 300,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert Users
    await queryInterface.bulkInsert('Users', [
      {
        id: systemAdminId,
        email: 'admin@ecd-system.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'system_admin',
        firstName: 'System',
        lastName: 'Administrator',
        phoneNumber: '+263-4-555-0001',
        language: 'en',
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active',
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: schoolAdminId,
        email: 'admin@harareprimary.edu.zw',
        password: await bcrypt.hash('school123', 12),
        role: 'school_admin',
        firstName: 'Mary',
        lastName: 'Chikwanha',
        phoneNumber: '+263-4-555-0002',
        language: 'en',
        schoolId: schoolId1,
        subscriptionPlan: 'school',
        subscriptionStatus: 'active',
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: teacherId1,
        email: 'teacher@test.com',
        password: await bcrypt.hash('password123', 12),
        role: 'teacher',
        firstName: 'Grace',
        lastName: 'Mukamuri',
        phoneNumber: '+263-4-555-0003',
        language: 'sn',
        schoolId: schoolId1,
        subscriptionPlan: 'teacher',
        subscriptionStatus: 'active',
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: teacherId2,
        email: 'teacher2@bulawayoecd.edu.zw',
        password: await bcrypt.hash('teacher123', 12),
        role: 'teacher',
        firstName: 'Nomsa',
        lastName: 'Ndlovu',
        phoneNumber: '+263-9-555-0004',
        language: 'nd',
        schoolId: schoolId2,
        subscriptionPlan: 'teacher',
        subscriptionStatus: 'active',
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: parentId,
        email: 'parent@example.com',
        password: await bcrypt.hash('parent123', 12),
        role: 'parent',
        firstName: 'John',
        lastName: 'Moyo',
        phoneNumber: '+263-4-555-0005',
        language: 'en',
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert Templates
    await queryInterface.bulkInsert('Templates', [
      {
        id: templateId1,
        name: 'Counting with Elephants',
        description: 'Learn to count from 1 to 10 using Zimbabwe elephants',
        category: 'math',
        subcategory: 'counting',
        difficulty: 'beginner',
        ageGroupMin: 3,
        ageGroupMax: 5,
        culturalTags: ['zimbabwe', 'elephants', 'wildlife'],
        languages: ['en', 'sn', 'nd'],
        content: JSON.stringify({
          layout: 'grid',
          elements: [
            {
              type: 'image',
              src: '/assets/images/animals/elephant.png',
              position: { x: 100, y: 100 }
            },
            {
              type: 'text',
              content: 'Count the elephants',
              position: { x: 100, y: 200 },
              style: { fontSize: 24, color: '#333' }
            }
          ]
        }),
        thumbnail: '/assets/templates/math/counting-elephants-thumb.png',
        previewImages: ['/assets/templates/math/counting-elephants-preview.png'],
        creatorId: systemAdminId,
        downloads: 45,
        rating: 4.5,
        reviewCount: 12,
        isPremium: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: templateId2,
        name: 'Shona Alphabet with Animals',
        description: 'Learn Shona alphabet using local animals',
        category: 'language',
        subcategory: 'alphabet',
        difficulty: 'beginner',
        ageGroupMin: 4,
        ageGroupMax: 6,
        culturalTags: ['shona', 'alphabet', 'animals'],
        languages: ['sn', 'en'],
        content: JSON.stringify({
          layout: 'list',
          elements: [
            {
              type: 'text',
              content: 'A - Ari (Baboon)',
              position: { x: 50, y: 50 }
            },
            {
              type: 'image',
              src: '/assets/images/animals/baboon.png',
              position: { x: 200, y: 50 }
            }
          ]
        }),
        thumbnail: '/assets/templates/language/shona-alphabet-thumb.png',
        previewImages: ['/assets/templates/language/shona-alphabet-preview.png'],
        creatorId: teacherId1,
        downloads: 23,
        rating: 4.2,
        reviewCount: 8,
        isPremium: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert Materials
    await queryInterface.bulkInsert('Materials', [
      {
        id: materialId1,
        title: 'My Elephant Counting Worksheet',
        description: 'Customized counting worksheet for Grade R',
        templateId: templateId1,
        creatorId: teacherId1,
        content: JSON.stringify({
          elements: [
            {
              type: 'image',
              src: '/assets/images/animals/elephant.png',
              position: { x: 100, y: 100 },
              count: 5
            },
            {
              type: 'text',
              content: 'How many elephants can you count?',
              position: { x: 100, y: 250 }
            }
          ]
        }),
        pdfUrl: '/uploads/materials/elephant-counting-worksheet.pdf',
        interactiveUrl: '/materials/interactive/elephant-counting',
        isPublic: false,
        allowDownload: true,
        allowCopy: false,
        views: 15,
        downloads: 8,
        assignments: 2,
        tags: ['counting', 'elephants', 'grade-r'],
        lastAccessed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert Students
    await queryInterface.bulkInsert('Students', [
      {
        id: studentId1,
        firstName: 'Tinashe',
        lastName: 'Mutasa',
        age: 4,
        parentContact: '+263-4-555-1001',
        schoolId: schoolId1,
        teacherId: teacherId1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: studentId2,
        firstName: 'Chipo',
        lastName: 'Sibanda',
        age: 5,
        parentContact: '+263-9-555-1002',
        schoolId: schoolId2,
        teacherId: teacherId2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample Assignment
    const assignmentId = uuidv4();
    await queryInterface.bulkInsert('Assignments', [
      {
        id: assignmentId,
        title: 'Counting Practice',
        description: 'Practice counting with elephants',
        instructions: 'Count the elephants in each picture and write the number',
        materialId: materialId1,
        teacherId: teacherId1,
        studentIds: [studentId1],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        allowLateSubmission: true,
        maxAttempts: 3,
        timeLimit: 30,
        showProgress: true,
        parentNotification: true,
        reminderDays: [1, 3],
        notificationMethods: ['email', 'sms'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert sample Progress
    await queryInterface.bulkInsert('Progress', [
      {
        id: uuidv4(),
        assignmentId: assignmentId,
        studentId: studentId1,
        status: 'in_progress',
        completionPercentage: 60,
        timeSpent: 15,
        attempts: 1,
        interactionData: JSON.stringify({
          clicks: 5,
          correctAnswers: 3,
          incorrectAnswers: 2
        }),
        parentViewed: false,
        lastAccessed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Progress', null, {});
    await queryInterface.bulkDelete('Assignments', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Materials', null, {});
    await queryInterface.bulkDelete('Templates', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Schools', null, {});
  }
};