const express = require('express');
const router = express.Router();
const paymentConfig = require('../config/payment.config');
const stripe = require('stripe')(paymentConfig.stripe.secretKey);
const { authenticateToken } = require('../middleware/auth.middleware');
const { School, SubscriptionPlan } = require('../models');
const { updateSchoolLimits } = require('../utils/subscription.limits');

// Check subscription status
router.get('/subscription-status', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    if (!schoolId) {
      return res.status(400).json({ error: 'School ID required' });
    }

    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const isOnTrial = school.subscriptionPlan === 'free' && school.subscriptionExpiresAt;
    const canUpgrade = isOnTrial || school.subscriptionStatus === 'active';
    
    res.json({
      currentPlan: school.subscriptionPlan,
      status: school.subscriptionStatus,
      expiresAt: school.subscriptionExpiresAt,
      isOnTrial,
      canUpgrade
    });
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// Create payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID required' });
    }

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID required' });
    }

    const [school, plan] = await Promise.all([
      School.findByPk(schoolId),
      SubscriptionPlan.findOne({ where: { planId } })
    ]);

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Validate plan price
    if (plan.price <= 0) {
      return res.status(400).json({ error: 'Invalid plan price' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(plan.price * 100), // Convert to cents
      currency: paymentConfig.stripe.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        schoolId,
        planId,
        schoolName: school.name,
        planName: plan.name,
        amount: plan.price.toString(),
        currency: plan.currency
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: plan.price,
      currency: plan.currency,
      planName: plan.name
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: paymentConfig.errorMessages.cardDeclined,
        details: error.message 
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: paymentConfig.errorMessages.invalidCard,
        details: error.message 
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: paymentConfig.errorMessages.networkError,
        details: error.message 
      });
    }
    
    res.status(500).json({ error: paymentConfig.errorMessages.paymentFailed });
  }
});

// Test webhook endpoint (for debugging - remove in production)
router.post('/webhook-test', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🧪 Test webhook received!');
  console.log('📦 Body type:', typeof req.body);
  console.log('📦 Body length:', req.body?.length);
  
  let event;
  
  try {
    if (Buffer.isBuffer(req.body)) {
      console.log('📝 Body is Buffer, parsing JSON...');
      event = JSON.parse(req.body.toString());
    } else if (typeof req.body === 'string') {
      console.log('📝 Body is string, parsing JSON...');
      event = JSON.parse(req.body);
    } else {
      console.log('📝 Body is already parsed object');
      event = req.body;
    }
    
    console.log('✅ Parsed event type:', event.type);
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('💰 Payment intent ID:', paymentIntent.id);
      console.log('📋 Metadata:', paymentIntent.metadata);
      
      // Process the payment here
      const { schoolId, planId, planName, amount, currency } = paymentIntent.metadata;
      console.log(`💰 Processing payment for school ${schoolId}, plan ${planName}`);
      
      // Import models
      const { School, SubscriptionPlan, SubscriptionPayment } = require('../models');
      
      const [school, plan] = await Promise.all([
        School.findByPk(schoolId),
        SubscriptionPlan.findOne({ where: { planId } })
      ]);

      console.log('🏫 School found:', !!school);
      console.log('📋 Plan found:', !!plan);

      if (school && plan) {
        // Calculate expiry date
        const expiryDate = new Date();
        if (plan.interval === 'month') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (plan.interval === 'year') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        console.log('📅 New expiry date:', expiryDate);

        // Update school subscription
        await school.update({
          subscriptionPlan: planId,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: expiryDate
        });

        console.log('✅ School subscription updated');

        // Record payment
        await SubscriptionPayment.create({
          schoolId,
          planId,
          amount: parseFloat(amount),
          currency,
          stripePaymentIntentId: paymentIntent.id,
          status: 'completed'
        });

        console.log(`✅ Payment recorded: $${amount} ${currency}`);
      }
    }
    
    res.json({ received: true, eventType: event.type });
  } catch (error) {
    console.error('❌ Test webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint - must use raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🔔 Webhook received!');
  console.log('📝 Headers:', req.headers);
  console.log('📦 Body length:', req.body.length);
  
  const webhookSecret = paymentConfig.stripe.webhookSecret;
  
  if (!webhookSecret) {
    console.error('❌ Webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const sig = req.headers['stripe-signature'];
  console.log('🔑 Signature header:', sig ? 'Present' : 'Missing');

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('✅ Webhook signature verified successfully');
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  console.log('✅ Received webhook event:', event.type);
  console.log('📊 Event data:', JSON.stringify(event.data, null, 2));

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { schoolId, planId, planName, amount, currency } = paymentIntent.metadata;

      console.log(`💰 Processing successful payment for school ${schoolId}, plan ${planName}`);
      console.log('📋 Payment metadata:', paymentIntent.metadata);

      const [school, plan] = await Promise.all([
        School.findByPk(schoolId),
        SubscriptionPlan.findOne({ where: { planId } })
      ]);

      console.log('🏫 School found:', !!school);
      console.log('📋 Plan found:', !!plan);

      if (!school || !plan) {
        console.error('❌ School or plan not found:', { schoolId, planId });
        return res.status(404).json({ error: 'School or plan not found' });
      }

      // Calculate expiry date
      const expiryDate = new Date();
      if (plan.interval === 'month') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (plan.interval === 'year') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      console.log('📅 New expiry date:', expiryDate);

      // Update school subscription
      await school.update({
        subscriptionPlan: planId,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: expiryDate
      });

      console.log('✅ School subscription updated');

      // Update limits based on new plan
      await updateSchoolLimits(school, planId);

      // Record payment
      const { SubscriptionPayment } = require('../models');
      await SubscriptionPayment.create({
        schoolId,
        planId,
        amount: parseFloat(amount),
        currency,
        stripePaymentIntentId: paymentIntent.id,
        status: 'completed'
      });

      console.log(`✅ Subscription ${plan.interval === 'month' ? 'monthly' : 'yearly'} activated for school ${schoolId} with plan ${planName}`);
      console.log(`💰 Payment recorded: $${amount} ${currency}`);

    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.error('❌ Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Test endpoint to manually update subscription (for development only)
router.post('/test-update-subscription', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID required' });
    }

    const [school, plan] = await Promise.all([
      School.findByPk(schoolId),
      SubscriptionPlan.findOne({ where: { planId } })
    ]);

    if (!school || !plan) {
      return res.status(404).json({ error: 'School or plan not found' });
    }

    // Calculate expiry date
    const expiryDate = new Date();
    if (plan.interval === 'month') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (plan.interval === 'year') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update school subscription
    await school.update({
      subscriptionPlan: planId,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiryDate
    });

    // Update limits based on new plan
    await updateSchoolLimits(school, planId);

    console.log(`✅ Test: Subscription updated for school ${schoolId} with plan ${planId}`);

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        planId,
        status: 'active',
        expiresAt: expiryDate
      }
    });
  } catch (error) {
    console.error('Test subscription update error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

module.exports = router;