const subscriptionService = require('./src/services/subscription.service');

async function testSubscriptionService() {
  try {
    console.log('Testing subscription service...');
    
    // Test getting plans
    const plans = require('./src/config/subscription.config');
    console.log('Available plans:', Object.keys(plans.subscriptionPlans));
    
    // Test getting school subscription (this should work even if no subscription exists)
    try {
      const subscription = await subscriptionService.getSchoolSubscription('test-school-id');
      console.log('School subscription test:', subscription ? 'Found' : 'No subscription found');
    } catch (error) {
      console.log('School subscription test error:', error.message);
    }
    
    // Test getting school usage
    try {
      const usage = await subscriptionService.getSchoolUsage('test-school-id');
      console.log('School usage test:', usage);
    } catch (error) {
      console.log('School usage test error:', error.message);
    }
    
    console.log('Subscription service test completed');
    
  } catch (error) {
    console.error('Error testing subscription service:', error);
  }
}

testSubscriptionService(); 