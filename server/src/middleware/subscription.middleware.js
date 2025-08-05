const subscriptionService = require('../services/subscription.service');

// Middleware to check if a specific feature is enabled for the school
const requireFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const schoolId = req.user.schoolId;
      
      if (!schoolId) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'School ID not found'
        });
      }

      const access = await subscriptionService.canAccessFeature(schoolId, feature);
      
      if (!access.allowed) {
        return res.status(403).json({
          error: 'Feature not available',
          message: access.reason || 'This feature is not included in your current plan',
          feature,
          upgradeRequired: true
        });
      }

      next();
    } catch (error) {
      console.error('Error checking feature access:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to verify feature access'
      });
    }
  };
};

// Middleware to check if school has active subscription
const requireActiveSubscription = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId;
    
    if (!schoolId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'School ID not found'
      });
    }

    const subscription = await subscriptionService.getSchoolSubscription(schoolId);
    
    if (!subscription || subscription.status !== 'active') {
      return res.status(403).json({
        error: 'Subscription required',
        message: 'An active subscription is required to access this feature',
        upgradeRequired: true
      });
    }

    next();
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify subscription status'
    });
  }
};

// Middleware to check usage limits
const checkUsageLimits = async (req, res, next) => {
  try {
    const schoolId = req.user.schoolId;
    
    if (!schoolId) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'School ID not found'
      });
    }

    const limits = await subscriptionService.checkUsageLimits(schoolId);
    
    if (!limits.allowed) {
      return res.status(403).json({
        error: 'Usage limit exceeded',
        message: limits.reason || 'You have reached your plan limits',
        limits: limits.limits,
        upgradeRequired: true
      });
    }

    // Add usage info to request for potential use
    req.usageInfo = limits;
    next();
  } catch (error) {
    console.error('Error checking usage limits:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify usage limits'
    });
  }
};

// Middleware to check specific usage limits (e.g., student count)
const checkSpecificLimit = (metric) => {
  return async (req, res, next) => {
    try {
      const schoolId = req.user.schoolId;
      
      if (!schoolId) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'School ID not found'
        });
      }

      const limits = await subscriptionService.checkUsageLimits(schoolId);
      
      if (!limits.allowed) {
        return res.status(403).json({
          error: 'Usage limit exceeded',
          message: limits.reason || 'You have reached your plan limits',
          upgradeRequired: true
        });
      }

      // Check specific metric
      const metricLimit = limits.limits[metric];
      if (metricLimit && !metricLimit.allowed) {
        return res.status(403).json({
          error: `${metric} limit exceeded`,
          message: `You have reached your ${metric} limit. Please upgrade your plan.`,
          current: metricLimit.current,
          limit: metricLimit.limit,
          upgradeRequired: true
        });
      }

      next();
    } catch (error) {
      console.error('Error checking specific usage limit:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to verify usage limits'
      });
    }
  };
};

// Helper function to get subscription info for response
const getSubscriptionInfo = async (schoolId) => {
  try {
    const summary = await subscriptionService.getSubscriptionSummary(schoolId);
    return {
      plan: summary.subscription?.planName || 'free',
      status: summary.subscription?.status || 'active',
      isActive: summary.isActive,
      daysUntilExpiry: summary.daysUntilExpiry,
      usage: summary.usage,
      limits: summary.limits
    };
  } catch (error) {
    console.error('Error getting subscription info:', error);
    return null;
  }
};

module.exports = {
  requireFeature,
  requireActiveSubscription,
  checkUsageLimits,
  checkSpecificLimit,
  getSubscriptionInfo
}; 