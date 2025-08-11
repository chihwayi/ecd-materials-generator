const SubscriptionPlan = require('../models/SubscriptionPlan');

/**
 * Get subscription limits for a school based on their plan
 */
const getSchoolLimits = async (school) => {
  // If school has no subscription expiry date, it's inactive
  if (!school.subscriptionExpiresAt) {
    return {
      maxStudents: 0,
      maxTeachers: 0,
      maxClasses: 0,
      storageGB: 0
    };
  }

  // Check if subscription is expired
  const now = new Date();
  if (school.subscriptionExpiresAt < now) {
    return {
      maxStudents: 0,
      maxTeachers: 0,
      maxClasses: 0,
      storageGB: 0
    };
  }

  // Get plan limits from SubscriptionPlan table
  const planMapping = {
    'free': 'free_trial',
    'basic': 'basic',
    'premium': 'professional'
  };

  const planId = planMapping[school.subscriptionPlan] || 'free_trial';
  
  try {
    const plan = await SubscriptionPlan.findOne({ 
      where: { planId, isActive: true } 
    });

    if (plan) {
      return {
        maxStudents: plan.maxStudents,
        maxTeachers: plan.maxTeachers,
        maxClasses: plan.maxClasses,
        storageGB: plan.storageGB
      };
    }
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
  }

  // Fallback to default free trial limits
  return {
    maxStudents: 50,
    maxTeachers: 5,
    maxClasses: 10,
    storageGB: 5
  };
};

/**
 * Check if school can add more of a resource type
 */
const canAddResource = async (school, resourceType, currentCount) => {
  const limits = await getSchoolLimits(school);
  
  switch (resourceType) {
    case 'students':
      return limits.maxStudents === -1 || currentCount < limits.maxStudents;
    case 'teachers':
      return limits.maxTeachers === -1 || currentCount < limits.maxTeachers;
    case 'classes':
      return limits.maxClasses === -1 || currentCount < limits.maxClasses;
    default:
      return false;
  }
};

module.exports = {
  getSchoolLimits,
  canAddResource
};