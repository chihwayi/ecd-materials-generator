const { SubscriptionPlan } = require('./src/models');

async function addStarterPlan() {
  try {
    // Check if starter plan already exists
    const existingPlan = await SubscriptionPlan.findOne({ where: { planId: 'starter' } });
    
    if (existingPlan) {
      console.log('Starter plan already exists');
      return;
    }

    // Add the starter plan
    await SubscriptionPlan.create({
      planId: 'starter',
      name: 'Starter Plan',
      price: 15.99,
      currency: 'usd',
      interval: 'month',
      trialDays: 0,
      maxStudents: 30,
      maxTeachers: 3,
      maxClasses: 2,
      materials: true,
      templates: true,
      assignments: true,
      basicAnalytics: true,
      financeModule: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whiteLabeling: false,
      storageGB: 5,
      monthlyExports: 10,
      customTemplates: 2,
      isActive: true
    });

    console.log('✅ Starter plan added successfully');
  } catch (error) {
    console.error('❌ Error adding starter plan:', error);
  }
}

addStarterPlan();