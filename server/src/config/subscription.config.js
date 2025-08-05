const subscriptionPlans = {
  free: {
    id: 'price_free',
    name: 'Free Trial',
    price: 0,
    currency: 'usd',
    interval: 'month',
    trialDays: 30,
    features: {
      maxStudents: 50,
      maxTeachers: 5,
      maxClasses: 10,
      materials: true,
      templates: true,
      assignments: true,
      basicAnalytics: true,
      financeModule: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false,
      whiteLabeling: false
    },
    limits: {
      storageGB: 1,
      monthlyExports: 5,
      customTemplates: 0
    }
  },
  basic: {
    id: 'price_basic_monthly',
    name: 'Basic Plan',
    price: 29.99,
    currency: 'usd',
    interval: 'month',
    trialDays: 0,
    features: {
      maxStudents: 200,
      maxTeachers: 15,
      maxClasses: 25,
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
    },
    limits: {
      storageGB: 10,
      monthlyExports: 50,
      customTemplates: 5
    }
  },
  premium: {
    id: 'price_premium_monthly',
    name: 'Premium Plan',
    price: 79.99,
    currency: 'usd',
    interval: 'month',
    trialDays: 0,
    features: {
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
    },
    limits: {
      storageGB: 50,
      monthlyExports: 200,
      customTemplates: 25
    }
  },
  enterprise: {
    id: 'price_enterprise_monthly',
    name: 'Enterprise Plan',
    price: 199.99,
    currency: 'usd',
    interval: 'month',
    trialDays: 0,
    features: {
      maxStudents: -1, // Unlimited
      maxTeachers: -1, // Unlimited
      maxClasses: -1, // Unlimited
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
    },
    limits: {
      storageGB: 500,
      monthlyExports: -1, // Unlimited
      customTemplates: -1 // Unlimited
    }
  }
};

// Annual plans with 20% discount
const annualPlans = {
  basic: {
    id: 'price_basic_yearly',
    name: 'Basic Plan (Annual)',
    price: 287.90, // 29.99 * 12 * 0.8 (20% discount)
    currency: 'usd',
    interval: 'year',
    trialDays: 0,
    features: subscriptionPlans.basic.features,
    limits: subscriptionPlans.basic.limits
  },
  premium: {
    id: 'price_premium_yearly',
    name: 'Premium Plan (Annual)',
    price: 767.90, // 79.99 * 12 * 0.8 (20% discount)
    currency: 'usd',
    interval: 'year',
    trialDays: 0,
    features: subscriptionPlans.premium.features,
    limits: subscriptionPlans.premium.limits
  },
  enterprise: {
    id: 'price_enterprise_yearly',
    name: 'Enterprise Plan (Annual)',
    price: 1919.90, // 199.99 * 12 * 0.8 (20% discount)
    currency: 'usd',
    interval: 'year',
    trialDays: 0,
    features: subscriptionPlans.enterprise.features,
    limits: subscriptionPlans.enterprise.limits
  }
};

// Stripe product and price IDs
const stripeConfig = {
  products: {
    basic: 'prod_basic_plan',
    premium: 'prod_premium_plan',
    enterprise: 'prod_enterprise_plan'
  },
  prices: {
    basic_monthly: 'price_basic_monthly',
    basic_yearly: 'price_basic_yearly',
    premium_monthly: 'price_premium_monthly',
    premium_yearly: 'price_premium_yearly',
    enterprise_monthly: 'price_enterprise_monthly',
    enterprise_yearly: 'price_enterprise_yearly'
  }
};

// Feature descriptions for UI
const featureDescriptions = {
  materials: 'Access to educational materials and content library',
  templates: 'Use and customize learning templates',
  assignments: 'Create and manage student assignments',
  basicAnalytics: 'Basic reporting and analytics',
  financeModule: 'Student fee management and financial tracking',
  advancedAnalytics: 'Advanced reporting, insights, and data export',
  prioritySupport: 'Priority customer support with faster response times',
  customBranding: 'Custom school branding and logo',
  apiAccess: 'API access for integrations',
  whiteLabeling: 'White-label solution for resellers'
};

// Usage tracking metrics
const usageMetrics = {
  students: 'Number of enrolled students',
  teachers: 'Number of active teachers',
  classes: 'Number of classes created',
  materials: 'Number of materials accessed',
  assignments: 'Number of assignments created',
  storage: 'Storage used in GB',
  exports: 'Number of data exports',
  templates: 'Number of custom templates'
};

module.exports = {
  subscriptionPlans,
  annualPlans,
  stripeConfig,
  featureDescriptions,
  usageMetrics,
  
  // Helper functions
  getPlanById: (planId) => {
    return subscriptionPlans[planId] || annualPlans[planId];
  },
  
  getAllPlans: () => {
    return {
      ...subscriptionPlans,
      ...annualPlans
    };
  },
  
  isFeatureEnabled: (plan, feature) => {
    const planConfig = subscriptionPlans[plan] || annualPlans[plan];
    return planConfig?.features[feature] || false;
  },
  
  getPlanLimit: (plan, limit) => {
    const planConfig = subscriptionPlans[plan] || annualPlans[plan];
    return planConfig?.limits[limit] || 0;
  },
  
  isUnlimited: (value) => {
    return value === -1;
  }
}; 