const express = require('express');
const router = express.Router();
const subscriptionService = require('../services/subscription.service');
const stripeService = require('../services/stripe.service');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { subscriptionPlans, annualPlans } = require('../config/subscription.config');

// Get available plans
router.get('/plans', async (req, res) => {
  try {
    const plans = {
      monthly: subscriptionPlans,
      annual: annualPlans
    };
    
    res.json({
      success: true,
      plans
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

    const plan = subscriptionPlans[planId] || annualPlans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }

    // Get or create Stripe customer
    let customerId = null;
    const existingSubscription = await subscriptionService.getSchoolSubscription(req.user.schoolId);
    if (existingSubscription?.stripeCustomerId) {
      customerId = existingSubscription.stripeCustomerId;
    } else {
      const school = await require('../models').School.findByPk(req.user.schoolId);
      const customer = await stripeService.createCustomer(school);
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customerId,
      plan.id,
      successUrl,
      cancelUrl,
      plan.trialDays
    );

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
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