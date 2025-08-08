const { Subscription, School, User } = require('./src/models');

async function addTestSubscription() {
  try {
    console.log('Adding test subscription...');
    
    // First, get or create a test school
    let school = await School.findOne({ where: { name: 'Test School' } });
    
    if (!school) {
      school = await School.create({
        name: 'Test School',
        address: '123 Test Street',
        contactEmail: 'test@school.com',
        contactPhone: '+1234567890',
        subscriptionPlan: 'basic',
        subscriptionStatus: 'active',
        maxTeachers: 10,
        maxStudents: 200,
        isActive: true
      });
      console.log('Created test school:', school.id);
    } else {
      console.log('Using existing test school:', school.id);
    }
    
    // Create a test subscription
    const subscription = await Subscription.create({
      schoolId: school.id,
      planId: 'basic_monthly',
      planName: 'basic',
      status: 'active',
      stripeCustomerId: 'cus_test123',
      stripeSubscriptionId: 'sub_test123',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      trialStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      trialEnd: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
      cancelAtPeriodEnd: false,
      metadata: {
        test: true,
        createdBy: 'test-script'
      }
    });
    
    console.log('Created test subscription:', subscription.id);
    
    // Create a test user for the school
    const user = await User.create({
      email: 'admin@testschool.com',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/7J9qKqG', // 'password123'
      role: 'school_admin',
      firstName: 'Test',
      lastName: 'Admin',
      phoneNumber: '+1234567890',
      language: 'en',
      schoolId: school.id,
      subscriptionPlan: 'free', // Use 'free' instead of 'basic' for User model
      subscriptionStatus: 'active',
      isActive: true
    });
    
    console.log('Created test user:', user.id);
    
    console.log('Test data created successfully!');
    console.log('School ID:', school.id);
    console.log('Subscription ID:', subscription.id);
    console.log('User ID:', user.id);
    
  } catch (error) {
    console.error('Error creating test subscription:', error);
  }
}

addTestSubscription(); 