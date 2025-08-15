'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Schools table first (referenced by other tables)
    await queryInterface.createTable('Schools', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: Sequelize.TEXT,
      contactEmail: {
        type: Sequelize.STRING,
        validate: { isEmail: true }
      },
      contactPhone: Sequelize.STRING,
      subscriptionPlan: {
        type: Sequelize.ENUM('free', 'basic', 'premium'),
        defaultValue: 'free'
      },
      subscriptionStatus: {
        type: Sequelize.ENUM('active', 'cancelled', 'expired', 'grace_period', 'payment_failed'),
        defaultValue: 'active'
      },
      subscriptionExpiresAt: Sequelize.DATE,
      lastPaymentAttempt: Sequelize.DATE,
      paymentFailureCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      maxTeachers: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      maxStudents: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      trial_used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      defaultParentPassword: {
        type: Sequelize.STRING,
        defaultValue: 'parent123'
      },
      logoUrl: Sequelize.STRING,
      primaryColor: {
        type: Sequelize.STRING,
        defaultValue: '#2563eb'
      },
      secondaryColor: {
        type: Sequelize.STRING,
        defaultValue: '#1d4ed8'
      },
      accentColor: {
        type: Sequelize.STRING,
        defaultValue: '#fbbf24'
      },
      customFont: {
        type: Sequelize.STRING,
        defaultValue: 'Inter'
      },
      customDomain: {
        type: Sequelize.STRING,
        unique: true
      },
      brandingEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      customCss: Sequelize.TEXT,
      faviconUrl: Sequelize.STRING,
      schoolMotto: Sequelize.STRING,
      customHeaderText: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('teacher', 'school_admin', 'parent', 'system_admin', 'finance'),
        allowNull: false,
        defaultValue: 'teacher'
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: Sequelize.STRING,
      language: {
        type: Sequelize.ENUM('en', 'sn', 'nd'),
        defaultValue: 'en'
      },
      school_id: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'SET NULL'
      },
      subscriptionPlan: {
        type: Sequelize.ENUM('free', 'teacher', 'school', 'premium'),
        defaultValue: 'free'
      },
      subscriptionStatus: {
        type: Sequelize.ENUM('active', 'cancelled', 'expired'),
        defaultValue: 'active'
      },
      subscriptionExpiresAt: Sequelize.DATE,
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLoginAt: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Classes table
    await queryInterface.createTable('Classes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      teacherId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Students table
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateOfBirth: Sequelize.DATE,
      gender: Sequelize.ENUM('male', 'female', 'other'),
      parentName: Sequelize.STRING,
      parentEmail: Sequelize.STRING,
      parentPhone: Sequelize.STRING,
      address: Sequelize.TEXT,
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      classId: {
        type: Sequelize.UUID,
        references: { model: 'Classes', key: 'id' },
        onDelete: 'SET NULL'
      },
      teacherId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      parentId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Templates table
    await queryInterface.createTable('Templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      ageGroup: Sequelize.STRING,
      language: {
        type: Sequelize.ENUM('en', 'sn', 'nd'),
        defaultValue: 'en'
      },
      content: {
        type: Sequelize.JSON,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Materials table
    await queryInterface.createTable('Materials', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      ageGroup: Sequelize.STRING,
      language: {
        type: Sequelize.ENUM('en', 'sn', 'nd'),
        defaultValue: 'en'
      },
      content: {
        type: Sequelize.JSON,
        allowNull: false
      },
      creatorId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      templateId: {
        type: Sequelize.UUID,
        references: { model: 'Templates', key: 'id' },
        onDelete: 'SET NULL'
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Assignments table
    await queryInterface.createTable('Assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      instructions: Sequelize.TEXT,
      dueDate: Sequelize.DATE,
      totalPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 100
      },
      teacherId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      classId: {
        type: Sequelize.UUID,
        references: { model: 'Classes', key: 'id' },
        onDelete: 'CASCADE'
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      materialId: {
        type: Sequelize.UUID,
        references: { model: 'Materials', key: 'id' },
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'completed'),
        defaultValue: 'draft'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create StudentAssignments table
    await queryInterface.createTable('StudentAssignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      assignmentId: {
        type: Sequelize.UUID,
        references: { model: 'Assignments', key: 'id' },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      submissionData: Sequelize.JSON,
      submittedAt: Sequelize.DATE,
      grade: Sequelize.DECIMAL(5, 2),
      feedback: Sequelize.TEXT,
      gradedAt: Sequelize.DATE,
      gradedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('assigned', 'in_progress', 'submitted', 'graded'),
        defaultValue: 'assigned'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Progress table
    await queryInterface.createTable('Progress', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      assignmentId: {
        type: Sequelize.UUID,
        references: { model: 'Assignments', key: 'id' },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      completionPercentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      timeSpent: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      lastAccessedAt: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Messages table
    await queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      senderId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      recipientId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'SET NULL'
      },
      subject: Sequelize.STRING,
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      readAt: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create FeeStructures table
    await queryInterface.createTable('FeeStructures', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      frequency: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'annually'),
        defaultValue: 'monthly'
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create StudentFees table
    await queryInterface.createTable('StudentFees', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      feeStructureId: {
        type: Sequelize.UUID,
        references: { model: 'FeeStructures', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      dueDate: Sequelize.DATE,
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'overdue'),
        defaultValue: 'pending'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create FeePayments table
    await queryInterface.createTable('FeePayments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentFeeId: {
        type: Sequelize.UUID,
        references: { model: 'StudentFees', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'bank_transfer', 'mobile_money', 'card'),
        defaultValue: 'cash'
      },
      transactionReference: Sequelize.STRING,
      recordedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      notes: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create new Finance tables
    await queryInterface.createTable('FeeConfigurations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      monthlyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      termAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('OptionalServices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      monthlyAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      termAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('StudentFeeAssignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      feeConfigurationId: {
        type: Sequelize.UUID,
        references: { model: 'FeeConfigurations', key: 'id' },
        onDelete: 'CASCADE'
      },
      paymentPlan: {
        type: Sequelize.ENUM('monthly', 'term'),
        defaultValue: 'monthly'
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paidAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'partial', 'paid'),
        defaultValue: 'pending'
      },
      dueDate: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('StudentServiceSelections', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      optionalServiceId: {
        type: Sequelize.UUID,
        references: { model: 'OptionalServices', key: 'id' },
        onDelete: 'CASCADE'
      },
      paymentPlan: {
        type: Sequelize.ENUM('monthly', 'term'),
        defaultValue: 'monthly'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      feeAssignmentId: {
        type: Sequelize.UUID,
        references: { model: 'StudentFeeAssignments', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      paymentMethod: {
        type: Sequelize.ENUM('cash', 'bank_transfer', 'mobile_money', 'card'),
        defaultValue: 'cash'
      },
      transactionReference: Sequelize.STRING,
      notes: Sequelize.TEXT,
      recordedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create other supporting tables
    await queryInterface.createTable('Signatures', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      signatureData: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('FinancialReports', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      reportType: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'annual'),
        allowNull: false
      },
      reportData: {
        type: Sequelize.JSON,
        allowNull: false
      },
      generatedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Receipts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      receiptNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      paymentId: {
        type: Sequelize.UUID,
        references: { model: 'FeePayments', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      recordedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      printedBy: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      printedAt: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('StudentServicePreferences', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      student_id: {
        type: Sequelize.UUID,
        references: { model: 'Students', key: 'id' },
        onDelete: 'CASCADE'
      },
      school_id: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      transport: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      food: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      activities: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      auxiliary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Subscription tables
    await queryInterface.createTable('SubscriptionPlans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.TEXT,
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      interval: {
        type: Sequelize.ENUM('month', 'year'),
        allowNull: false
      },
      trialDays: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      features: {
        type: Sequelize.JSON,
        allowNull: false
      },
      limits: {
        type: Sequelize.JSON,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      planName: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('trial', 'active', 'cancelled', 'expired'),
        defaultValue: 'trial'
      },
      currentPeriodStart: Sequelize.DATE,
      currentPeriodEnd: Sequelize.DATE,
      cancelAtPeriodEnd: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      trialUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      stripeSubscriptionId: Sequelize.STRING,
      stripeCustomerId: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('SubscriptionPayments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      subscriptionId: {
        type: Sequelize.UUID,
        references: { model: 'Subscriptions', key: 'id' },
        onDelete: 'CASCADE'
      },
      schoolId: {
        type: Sequelize.UUID,
        references: { model: 'Schools', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      status: {
        type: Sequelize.ENUM('pending', 'succeeded', 'failed'),
        defaultValue: 'pending'
      },
      stripePaymentIntentId: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('AuditLogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resource: Sequelize.STRING,
      resourceId: Sequelize.UUID,
      details: Sequelize.JSON,
      ipAddress: Sequelize.STRING,
      userAgent: Sequelize.TEXT,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    await queryInterface.createTable('SystemNotifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('info', 'warning', 'error', 'success'),
        defaultValue: 'info'
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      readAt: Sequelize.DATE,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['school_id']);
    await queryInterface.addIndex('Students', ['schoolId']);
    await queryInterface.addIndex('Students', ['classId']);
    await queryInterface.addIndex('Students', ['parentId']);
    await queryInterface.addIndex('Assignments', ['teacherId']);
    await queryInterface.addIndex('Assignments', ['classId']);
    await queryInterface.addIndex('StudentAssignments', ['assignmentId', 'studentId']);
    await queryInterface.addIndex('Messages', ['senderId', 'recipientId']);
    await queryInterface.addIndex('FeePayments', ['studentFeeId']);
    await queryInterface.addIndex('StudentFeeAssignments', ['studentId']);
    await queryInterface.addIndex('Payments', ['studentId', 'feeAssignmentId']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to handle foreign key constraints
    const tables = [
      'SystemNotifications',
      'AuditLogs',
      'SubscriptionPayments',
      'Subscriptions',
      'SubscriptionPlans',
      'StudentServicePreferences',
      'Receipts',
      'FinancialReports',
      'Signatures',
      'Payments',
      'StudentServiceSelections',
      'StudentFeeAssignments',
      'OptionalServices',
      'FeeConfigurations',
      'FeePayments',
      'StudentFees',
      'FeeStructures',
      'Messages',
      'Progress',
      'StudentAssignments',
      'Assignments',
      'Materials',
      'Templates',
      'Students',
      'Classes',
      'Users',
      'Schools'
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};