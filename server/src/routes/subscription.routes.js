const express = require('express');
const router = express.Router();
const subscriptionService = require('../services/subscription.service');
const stripeService = require('../services/stripe.service');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const SubscriptionPlan = require('../models/SubscriptionPlan');

// Get available plans
router.get('/plans', async (req, res) => {
  try {
    const dbPlans = await SubscriptionPlan.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    });
    
    const monthly = {};
    const annual = {};
    
    dbPlans.forEach(plan => {
      const planData = {
        id: plan.planId,
        name: plan.name,
        price: parseFloat(plan.price),
        currency: plan.currency,
        interval: plan.interval,
        trialDays: plan.trialDays,
        features: {
          maxStudents: plan.maxStudents,
          maxTeachers: plan.maxTeachers,
          maxClasses: plan.maxClasses,
          materials: plan.materials,
          templates: plan.templates,
          assignments: plan.assignments,
          basicAnalytics: plan.basicAnalytics,
          financeModule: plan.financeModule,
          advancedAnalytics: plan.advancedAnalytics,
          prioritySupport: plan.prioritySupport,
          customBranding: plan.customBranding,
          apiAccess: plan.apiAccess,
          whiteLabeling: plan.whiteLabeling
        },
        limits: {
          storageGB: plan.storageGB,
          monthlyExports: plan.monthlyExports,
          customTemplates: plan.customTemplates
        }
      };
      
      if (plan.interval === 'month') {
        monthly[plan.planId] = planData;
      } else {
        annual[plan.planId] = planData;
      }
    });
    
    res.json({
      success: true,
      plans: { monthly, annual }
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get school's current subscription
router.get('/current', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const summary = await subscriptionService.getSubscriptionSummary(req.user.schoolId);
    
    res.json({
      success: true,
      subscription: summary
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create checkout session for new subscription
router.post('/create-checkout-session', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const { planId, successUrl, cancelUrl } = req.body;
    
    if (!planId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get plan from database
    const dbPlan = await SubscriptionPlan.findOne({ where: { planId, isActive: true } });
    if (!dbPlan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Check if it's a free trial
    if (dbPlan.price === 0) {
      // For free trial, just update the school's subscription
      const { School } = require('../models');
      const school = await School.findByPk(req.user.schoolId);
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }

      // Set free trial
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + (dbPlan.trialDays || 30));
      
      await school.update({
        subscriptionPlan: planId,
        subscriptionStatus: 'trial',
        subscriptionExpiresAt: trialEndDate
      });

      return res.json({
        success: true,
        message: 'Free trial activated',
        url: successUrl.replace('{CHECKOUT_SESSION_ID}', 'free_trial')
      });
    }

    // For paid plans, create Stripe checkout session (mock for now)
    res.json({
      success: true,
      sessionId: 'mock_session_id',
      url: successUrl.replace('{CHECKOUT_SESSION_ID}', 'mock_session_id')
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Handle subscription webhook from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripeService.verifyWebhookSignature(req.body, sig, endpointSecret);
    await stripeService.handleWebhook(event);
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;
    
    const subscription = await subscriptionService.cancelSubscription(
      req.user.schoolId,
      cancelAtPeriodEnd
    );

    res.json({
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current period'
        : 'Subscription cancelled immediately',
      subscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Reactivate subscription
router.post('/reactivate', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const subscription = await subscriptionService.reactivateSubscription(req.user.schoolId);

    res.json({
      success: true,
      message: 'Subscription reactivated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// Change subscription plan
router.post('/change-plan', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const { newPlanId } = req.body;
    
    if (!newPlanId) {
      return res.status(400).json({ error: 'New plan ID is required' });
    }

    const subscription = await subscriptionService.changePlan(req.user.schoolId, newPlanId);

    res.json({
      success: true,
      message: 'Plan changed successfully',
      subscription
    });
  } catch (error) {
    console.error('Error changing plan:', error);
    res.status(500).json({ error: 'Failed to change plan' });
  }
});

// Get billing portal URL
router.get('/billing-portal', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const { returnUrl } = req.query;
    
    const { url } = await subscriptionService.getBillingPortalUrl(
      req.user.schoolId,
      returnUrl || `${req.protocol}://${req.get('host')}/subscription/manage`
    );

    res.json({
      success: true,
      url
    });
  } catch (error) {
    console.error('Error getting billing portal URL:', error);
    res.status(500).json({ error: 'Failed to get billing portal URL' });
  }
});

// Get payment history
router.get('/payments', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const payments = await subscriptionService.getPaymentHistory(req.user.schoolId);

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Check feature access
router.get('/check-feature/:feature', authenticateToken, async (req, res) => {
  try {
    const { feature } = req.params;
    const access = await subscriptionService.canAccessFeature(req.user.schoolId, feature);

    res.json({
      success: true,
      access
    });
  } catch (error) {
    console.error('Error checking feature access:', error);
    res.status(500).json({ error: 'Failed to check feature access' });
  }
});

// Get usage statistics
router.get('/usage', authenticateToken, requireRole(['school_admin', 'system_admin']), async (req, res) => {
  try {
    const usage = await subscriptionService.getSchoolUsage(req.user.schoolId);
    const subscription = await subscriptionService.getSchoolSubscription(req.user.schoolId);
    
    let limits = {};
    if (subscription) {
      const plan = subscriptionPlans[subscription.planName] || annualPlans[subscription.planName];
      if (plan) {
        limits = plan.limits;
      }
    }

    res.json({
      success: true,
      usage,
      limits,
      subscription
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

// Create subscription (for testing/admin use)
router.post('/create', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { schoolId, planId } = req.body;
    
    if (!schoolId || !planId) {
      return res.status(400).json({ error: 'School ID and Plan ID are required' });
    }

    const subscription = await subscriptionService.createSubscription(schoolId, planId);

    res.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

module.exports = router; 