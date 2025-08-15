'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create subscription plans first
    const subscriptionPlans = [
      {
        id: uuidv4(),
        name: 'Free Trial',
        description: 'Free trial plan with basic features',
        price: 0.00,
        currency: 'USD',
        interval: 'month',
        trialDays: 30,
        features: JSON.stringify({
          maxStudents: 50,
          maxTeachers: 5,
          maxClasses: 10,
          materials: true,
          templates: true,
          assignments: true,
          basicAnalytics: true,
          financeModule: true,
          advancedAnalytics: false,
          prioritySupport: false,
          customBranding: false,
          apiAccess: false,
          whiteLabeling: false
        }),
        limits: JSON.stringify({
          storageGB: 1,
          monthlyExports: 10,
          customTemplates: 5
        }),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Starter',
        description: 'Perfect for small schools',
        price: 29.99,
        currency: 'USD',
        interval: 'month',
        trialDays: 0,
        features: JSON.stringify({
          maxStudents: 100,
          maxTeachers: 10,
          maxClasses: 20,
          materials: true,
          templates: true,
          assignments: true,
          basicAnalytics: true,
          financeModule: true,
          advancedAnalytics: true,
          prioritySupport: false,
          customBranding: true,
          apiAccess: false,
          whiteLabeling: false
        }),
        limits: JSON.stringify({
          storageGB: 5,
          monthlyExports: 50,
          customTemplates: 25
        }),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Professional',
        description: 'For growing schools with advanced needs',
        price: 79.99,
        currency: 'USD',
        interval: 'month',
        trialDays: 0,
        features: JSON.stringify({
          maxStudents: 500,
          maxTeachers: 50,
          maxClasses: 100,
          materials: true,
          templates: true,
          assignments: true,
          basicAnalytics: true,
          financeModule: true,
          advancedAnalytics: true,
          prioritySupport: true,
          customBranding: true,
          apiAccess: true,
          whiteLabeling: false
        }),
        limits: JSON.stringify({
          storageGB: 25,
          monthlyExports: 200,
          customTemplates: 100
        }),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Enterprise',
        description: 'For large schools and districts',
        price: 199.99,
        currency: 'USD',
        interval: 'month',
        trialDays: 0,
        features: JSON.stringify({
          maxStudents: -1,
          maxTeachers: -1,
          maxClasses: -1,
          materials: true,
          templates: true,
          assignments: true,
          basicAnalytics: true,
          financeModule: true,
          advancedAnalytics: true,
          prioritySupport: true,
          customBranding: true,
          apiAccess: true,
          whiteLabeling: true
        }),
        limits: JSON.stringify({
          storageGB: 100,
          monthlyExports: -1,
          customTemplates: -1
        }),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('SubscriptionPlans', subscriptionPlans);

    // Create demo school
    const schoolId = uuidv4();
    await queryInterface.bulkInsert('Schools', [{
      id: schoolId,
      name: 'Demo Primary School',
      address: '123 Education Street, Harare, Zimbabwe',
      contactEmail: 'admin@demoprimary.edu.zw',
      contactPhone: '+263 4 123 4567',
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      maxTeachers: 5,
      maxStudents: 50,
      isActive: true,
      trial_used: false,
      defaultParentPassword: 'parent123',
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
      accentColor: '#fbbf24',
      customFont: 'Inter',
      brandingEnabled: true,
      schoolMotto: 'Excellence in Early Childhood Development',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create system admin user
    const systemAdminId = uuidv4();
    const schoolAdminId = uuidv4();
    const teacherId = uuidv4();
    const financeManagerId = uuidv4();
    const parentId = uuidv4();

    const hashedPassword = await bcrypt.hash('password123', 12);
    const hashedBrianPassword = await bcrypt.hash('brian123', 12);
    const hashedFinancePassword = await bcrypt.hash('finance123', 12);

    await queryInterface.bulkInsert('Users', [
      {
        id: systemAdminId,
        email: 'admin@system.com',
        password: hashedPassword,
        role: 'system_admin',
        firstName: 'System',
        lastName: 'Administrator',
        phoneNumber: '+263 77 123 4567',
        language: 'en',
        school_id: null,
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: schoolAdminId,
        email: 'bbanda@gmail.com',
        password: hashedBrianPassword,
        role: 'school_admin',
        firstName: 'Brian',
        lastName: 'Banda',
        phoneNumber: '+263 77 234 5678',
        language: 'en',
        school_id: schoolId,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: teacherId,
        email: 'teacher@test.com',
        password: hashedPassword,
        role: 'teacher',
        firstName: 'Mary',
        lastName: 'Teacher',
        phoneNumber: '+263 77 345 6789',
        language: 'en',
        school_id: schoolId,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: financeManagerId,
        email: 'finance@school.com',
        password: hashedFinancePassword,
        role: 'finance',
        firstName: 'Finance',
        lastName: 'Manager',
        phoneNumber: '+263 77 456 7890',
        language: 'en',
        school_id: schoolId,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: parentId,
        email: 'parent@test.com',
        password: hashedPassword,
        role: 'parent',
        firstName: 'John',
        lastName: 'Parent',
        phoneNumber: '+263 77 567 8901',
        language: 'en',
        school_id: schoolId,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create subscription for the demo school
    await queryInterface.bulkInsert('Subscriptions', [{
      id: uuidv4(),
      schoolId: schoolId,
      planName: 'free',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
      trialUsed: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create demo classes
    const class1Id = uuidv4();
    const class2Id = uuidv4();

    await queryInterface.bulkInsert('Classes', [
      {
        id: class1Id,
        name: 'Grade 1A',
        description: 'First grade class A',
        schoolId: schoolId,
        teacherId: teacherId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: class2Id,
        name: 'Grade 1B',
        description: 'First grade class B',
        schoolId: schoolId,
        teacherId: teacherId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo students
    const student1Id = uuidv4();
    const student2Id = uuidv4();
    const student3Id = uuidv4();

    await queryInterface.bulkInsert('Students', [
      {
        id: student1Id,
        firstName: 'Tendai',
        lastName: 'Mukamuri',
        dateOfBirth: new Date('2018-03-15'),
        gender: 'male',
        parentName: 'John Parent',
        parentEmail: 'parent@test.com',
        parentPhone: '+263 77 567 8901',
        address: '456 Student Street, Harare',
        schoolId: schoolId,
        classId: class1Id,
        teacherId: teacherId,
        parentId: parentId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: student2Id,
        firstName: 'Chipo',
        lastName: 'Nyamande',
        dateOfBirth: new Date('2018-07-22'),
        gender: 'female',
        parentName: 'Jane Nyamande',
        parentEmail: 'jane@example.com',
        parentPhone: '+263 77 678 9012',
        address: '789 Learning Avenue, Harare',
        schoolId: schoolId,
        classId: class1Id,
        teacherId: teacherId,
        parentId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: student3Id,
        firstName: 'Tatenda',
        lastName: 'Moyo',
        dateOfBirth: new Date('2018-11-08'),
        gender: 'male',
        parentName: 'Peter Moyo',
        parentEmail: 'peter@example.com',
        parentPhone: '+263 77 789 0123',
        address: '321 Education Road, Harare',
        schoolId: schoolId,
        classId: class2Id,
        teacherId: teacherId,
        parentId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo templates
    const template1Id = uuidv4();
    const template2Id = uuidv4();

    await queryInterface.bulkInsert('Templates', [
      {
        id: template1Id,
        title: 'Basic Counting Template',
        description: 'A template for teaching basic counting skills',
        category: 'Mathematics',
        ageGroup: '4-6',
        language: 'en',
        content: JSON.stringify({
          type: 'counting',
          maxNumber: 10,
          includeImages: true,
          culturalContext: 'zimbabwean'
        }),
        creatorId: teacherId,
        isPublic: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: template2Id,
        title: 'Shona Alphabet Template',
        description: 'Template for learning Shona alphabet',
        category: 'Language',
        ageGroup: '3-5',
        language: 'sn',
        content: JSON.stringify({
          type: 'alphabet',
          includeAudio: true,
          culturalContext: 'shona'
        }),
        creatorId: teacherId,
        isPublic: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo fee configuration
    const feeConfigId = uuidv4();
    await queryInterface.bulkInsert('FeeConfigurations', [{
      id: feeConfigId,
      schoolId: schoolId,
      name: 'Tuition Fee',
      description: 'Monthly tuition fee for students',
      monthlyAmount: 50.00,
      termAmount: 140.00,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create optional services
    const transportServiceId = uuidv4();
    const foodServiceId = uuidv4();

    await queryInterface.bulkInsert('OptionalServices', [
      {
        id: transportServiceId,
        schoolId: schoolId,
        name: 'Transport Service',
        description: 'School bus transportation',
        monthlyAmount: 20.00,
        termAmount: 55.00,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: foodServiceId,
        schoolId: schoolId,
        name: 'Meal Service',
        description: 'Daily school meals',
        monthlyAmount: 30.00,
        termAmount: 85.00,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create student fee assignments
    const feeAssignment1Id = uuidv4();
    const feeAssignment2Id = uuidv4();

    await queryInterface.bulkInsert('StudentFeeAssignments', [
      {
        id: feeAssignment1Id,
        studentId: student1Id,
        feeConfigurationId: feeConfigId,
        paymentPlan: 'monthly',
        totalAmount: 50.00,
        paidAmount: 25.00,
        balance: 25.00,
        status: 'partial',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: feeAssignment2Id,
        studentId: student2Id,
        feeConfigurationId: feeConfigId,
        paymentPlan: 'term',
        totalAmount: 140.00,
        paidAmount: 0.00,
        balance: 140.00,
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create sample payments
    await queryInterface.bulkInsert('Payments', [{
      id: uuidv4(),
      studentId: student1Id,
      feeAssignmentId: feeAssignment1Id,
      amount: 25.00,
      paymentMethod: 'cash',
      transactionReference: 'CASH001',
      notes: 'Partial payment for January',
      recordedBy: financeManagerId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create student service preferences
    await queryInterface.bulkInsert('StudentServicePreferences', [
      {
        id: uuidv4(),
        student_id: student1Id,
        school_id: schoolId,
        transport: true,
        food: true,
        activities: false,
        auxiliary: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        student_id: student2Id,
        school_id: schoolId,
        transport: false,
        food: true,
        activities: true,
        auxiliary: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Initial seed data created successfully');
    console.log('📧 Test accounts:');
    console.log('   System Admin: admin@system.com / password123');
    console.log('   School Admin: bbanda@gmail.com / brian123');
    console.log('   Teacher: teacher@test.com / password123');
    console.log('   Finance Manager: finance@school.com / finance123');
    console.log('   Parent: parent@test.com / password123');
  },

  down: async (queryInterface, Sequelize) => {
    // Delete in reverse order to handle foreign key constraints
    await queryInterface.bulkDelete('StudentServicePreferences', null, {});
    await queryInterface.bulkDelete('Payments', null, {});
    await queryInterface.bulkDelete('StudentFeeAssignments', null, {});
    await queryInterface.bulkDelete('OptionalServices', null, {});
    await queryInterface.bulkDelete('FeeConfigurations', null, {});
    await queryInterface.bulkDelete('Templates', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
    await queryInterface.bulkDelete('Subscriptions', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Schools', null, {});
    await queryInterface.bulkDelete('SubscriptionPlans', null, {});
  }
};