const { School, SubscriptionPlan } = require('../models');

// Check if school's subscription is active
const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const schoolId = req.user?.schoolId;
    if (!schoolId || !req.user) return next();
    
    // Only allow true system admins (no schoolId) to bypass
    if (req.user.role === 'system_admin' && !req.user.schoolId) return next();

    const school = await School.findByPk(schoolId);
    if (!school) return res.status(404).json({ error: 'School not found' });

    // Check if school trial is not activated (no expiry date set)
    if (school.subscriptionPlan === 'free' && !school.subscriptionExpiresAt) {
      // Only allow access to activation and profile routes - NO dashboard access
      const allowedInactivePaths = [
        '/analytics/school/activate-trial',
        // Allow starting the free trial from the pricing page flow
        '/subscription/create-checkout-session',
        '/users/profile/me',
        '/auth/logout'
      ];
      
      const isAllowed = allowedInactivePaths.some(path => req.path.includes(path));
      
      if (!isAllowed) {
        return res.status(403).json({
          error: 'Trial not activated',
          message: 'Please activate your free trial to access the system.',
          schoolInactive: true,
          trialNotActivated: true,
          redirectTo: '/subscription/pricing'
        });
      }
    }

    // Check if subscription is expired
    if (school.subscriptionStatus === 'expired') {
      return res.status(403).json({
        error: 'Subscription expired',
        message: 'Your subscription has expired. Please renew to continue using the system.',
        subscriptionExpired: true,
        redirectTo: '/subscription/pricing'
      });
    }

    // Check if in grace period
    if (school.subscriptionStatus === 'grace_period') {
      const daysLeft = Math.ceil((new Date(school.subscriptionExpiresAt) - new Date()) / (1000 * 60 * 60 * 24));
      req.subscriptionWarning = {
        type: 'grace_period',
        message: `Your subscription expires in ${daysLeft} days. Please renew to avoid service interruption.`,
        daysLeft
      };
    }

    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    next();
  }
};

// Allow only subscription-related routes for expired accounts
const allowSubscriptionRoutes = (req, res, next) => {
  // Skip for true system admins (no schoolId) and auth routes
  if (!req.user || req.path.startsWith('/auth')) {
    return next();
  }
  
  // Only allow true system admins (no schoolId) to bypass
  if (req.user.role === 'system_admin' && !req.user.schoolId) {
    return next();
  }
  
  const allowedPaths = [
    '/subscription/pricing',
    '/subscription/manage',
    '/auth/logout',
    '/users/profile/me'
  ];
  
  if (allowedPaths.some(path => req.path.includes(path))) {
    return next();
  }
  
  return checkSubscriptionStatus(req, res, next);
};

module.exports = {
  checkSubscriptionStatus,
  allowSubscriptionRoutes
};