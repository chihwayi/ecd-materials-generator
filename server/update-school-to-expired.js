const { School, User } = require('./src/models');

async function updateSchoolToExpired() {
  try {
    // Find your user first
    const user = await User.findOne({ where: { email: 'ichihwayi@gmail.com' } });
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 Found user:', user.firstName, user.lastName);
    console.log('🏫 School ID:', user.schoolId);

    // Find and update the school
    const school = await School.findByPk(user.schoolId);
    if (!school) {
      console.log('❌ School not found');
      return;
    }

    console.log('🏫 Current school:', school.name);
    console.log('📋 Current plan:', school.subscriptionPlan);
    console.log('📅 Current expires:', school.subscriptionExpiresAt);

    // Update school to expired free plan
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await school.update({
      subscriptionPlan: 'free',
      subscriptionStatus: 'expired',
      subscriptionExpiresAt: yesterday,
      trialUsed: true // Mark trial as used so free plan won't show in subscription page
    });

    console.log('✅ School updated to expired free plan');
    console.log('📋 New plan: free');
    console.log('📅 Expired on:', yesterday.toISOString());
    console.log('🚫 Trial used: true');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateSchoolToExpired();