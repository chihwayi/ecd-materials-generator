const { School, SubscriptionPlan } = require('../models');

// Check if school's subscription is active
const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const schoolId = req.user?.schoolId;
    console.log('🔍 Subscription middleware - User:', req.user?.email, 'SchoolId:', schoolId, 'Path:', req.path);
    
    if (!schoolId || !req.user) {
      console.log('⚠️ No schoolId or user, skipping subscription check');
      return next();
    }
    
    // Only allow true system admins (no schoolId) to bypass
    if (req.user.role === 'system_admin' && !req.user.schoolId) {
      console.log('✅ System admin, bypassing subscription check');
      return next();
    }

    const school = await School.findByPk(schoolId);
    if (!school) {
      console.log('❌ School not found');
      return res.status(404).json({ error: 'School not found' });
    }

    console.log('🏫 School subscription status:', {
      plan: school.subscriptionPlan,
      status: school.subscriptionStatus,
      expiresAt: school.subscriptionExpiresAt
    });

    // Check if school trial is not activated (no expiry date set)
    if (school.subscriptionPlan === 'free' && !school.subscriptionExpiresAt) {
      console.log('🚫 Trial not activated, checking allowed paths');
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
        console.log('🚫 Blocking access - trial not activated');
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
      console.log('🚫 Subscription expired, blocking access');
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
      console.log('⚠️ Grace period warning:', daysLeft, 'days left');
    }

    console.log('✅ Subscription check passed');
    next();
  } catch (error) {
    console.error('❌ Subscription check error:', error);
    next();
  }
};

// Allow only subscription-related routes for expired accounts
const allowSubscriptionRoutes = (req, res, next) => {
  console.log('🎯 allowSubscriptionRoutes called for path:', req.path, 'User:', req.user?.email);
  
  // Skip for auth routes
  if (req.path.startsWith('/auth')) {
    console.log('⏭️ Skipping subscription check - auth route');
    return next();
  }
  
  // Skip if user is not authenticated yet (authentication middleware hasn't run)
  if (!req.user) {
    console.log('⏭️ Skipping subscription check - user not authenticated yet');
    return next();
  }
  
  // Only allow true system admins (no schoolId) to bypass
  if (req.user.role === 'system_admin' && !req.user.schoolId) {
    console.log('⏭️ Skipping subscription check - system admin');
    return next();
  }
  
  const allowedPaths = [
    '/subscription/pricing',
    '/subscription/manage',
    '/auth/logout',
    '/users/profile/me'
  ];
  
  if (allowedPaths.some(path => req.path.includes(path))) {
    console.log('⏭️ Skipping subscription check - allowed path');
    return next();
  }
  
  console.log('🔍 Calling checkSubscriptionStatus');
  return checkSubscriptionStatus(req, res, next);
};

module.exports = {
  checkSubscriptionStatus,
  allowSubscriptionRoutes
};