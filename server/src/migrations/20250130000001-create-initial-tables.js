'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create Schools table
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
      address: {
        type: Sequelize.TEXT
      },
      contactEmail: {
        type: Sequelize.STRING,
        validate: { isEmail: true }
      },
      contactPhone: {
        type: Sequelize.STRING
      },
      subscriptionPlan: {
        type: Sequelize.ENUM('free', 'basic', 'premium'),
        defaultValue: 'free'
      },
      subscriptionStatus: {
        type: Sequelize.ENUM('active', 'cancelled', 'expired'),
        defaultValue: 'active'
      },
      maxTeachers: {
        type: Sequelize.INTEGER,
        defaultValue: 5
      },
      maxStudents: {
        type: Sequelize.INTEGER,
        defaultValue: 100
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
        type: Sequelize.ENUM('teacher', 'school_admin', 'parent', 'system_admin'),
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
      phoneNumber: {
        type: Sequelize.STRING
      },
      language: {
        type: Sequelize.ENUM('en', 'sn', 'nd'),
        defaultValue: 'en'
      },
      schoolId: {
        type: Sequelize.UUID,
        references: {
          model: 'Schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
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
      subscriptionExpiresAt: {
        type: Sequelize.DATE
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLoginAt: {
        type: Sequelize.DATE
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.ENUM('math', 'language', 'art', 'science', 'cultural'),
        allowNull: false
      },
      subcategory: {
        type: Sequelize.STRING
      },
      difficulty: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
      },
      ageGroupMin: {
        type: Sequelize.INTEGER,
        defaultValue: 3
      },
      ageGroupMax: {
        type: Sequelize.INTEGER,
        defaultValue: 6
      },
      culturalTags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      languages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['en']
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      previewImages: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      creatorId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      downloads: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        defaultValue: 0.0
      },
      reviewCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isPremium: {
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
      description: {
        type: Sequelize.TEXT
      },
      templateId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Templates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      content: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      pdfUrl: {
        type: Sequelize.STRING
      },
      interactiveUrl: {
        type: Sequelize.STRING
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sharedWith: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        defaultValue: []
      },
      allowDownload: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      allowCopy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      downloads: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      assignments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      lastAccessed: {
        type: Sequelize.DATE
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
      age: {
        type: Sequelize.INTEGER
      },
      parentContact: {
        type: Sequelize.STRING
      },
      schoolId: {
        type: Sequelize.UUID,
        references: {
          model: 'Schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      teacherId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
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
      description: {
        type: Sequelize.TEXT
      },
      instructions: {
        type: Sequelize.TEXT
      },
      materialId: {
        type: Sequelize.UUID,
        references: {
          model: 'Materials',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      teacherId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      studentIds: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        defaultValue: []
      },
      dueDate: {
        type: Sequelize.DATE
      },
      allowLateSubmission: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      maxAttempts: {
        type: Sequelize.INTEGER
      },
      timeLimit: {
        type: Sequelize.INTEGER
      },
      showProgress: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      parentNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      reminderDays: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [1, 3]
      },
      notificationMethods: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['email']
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'completed', 'archived'),
        defaultValue: 'draft'
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
        references: {
          model: 'Assignments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        references: {
          model: 'Students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('not_started', 'in_progress', 'completed', 'overdue'),
        defaultValue: 'not_started'
      },
      completionPercentage: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      completedAt: {
        type: Sequelize.DATE
      },
      timeSpent: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      interactionData: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      teacherComments: {
        type: Sequelize.TEXT
      },
      parentViewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lastAccessed: {
        type: Sequelize.DATE
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

    // Add indexes for better performance
    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['school_id']);
    await queryInterface.addIndex('Users', ['role']);
    await queryInterface.addIndex('Materials', ['creator_id']);
    await queryInterface.addIndex('Materials', ['template_id']);
    await queryInterface.addIndex('Templates', ['category']);
    await queryInterface.addIndex('Templates', ['creator_id']);
    await queryInterface.addIndex('Assignments', ['teacher_id']);
    await queryInterface.addIndex('Assignments', ['material_id']);
    await queryInterface.addIndex('Progress', ['assignment_id']);
    await queryInterface.addIndex('Progress', ['student_id']);
    await queryInterface.addIndex('Students', ['school_id']);
    await queryInterface.addIndex('Students', ['teacher_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Progress');
    await queryInterface.dropTable('Assignments');
    await queryInterface.dropTable('Students');
    await queryInterface.dropTable('Materials');
    await queryInterface.dropTable('Templates');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Schools');
  }
};