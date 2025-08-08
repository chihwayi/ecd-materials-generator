const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const subscriptionService = require('../services/subscription.service');
const { Subscription, School, User, Student, Class } = require('../models');

// Get all subscriptions for system admin monitoring
router.get('/subscriptions', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    console.log('Fetching admin subscriptions...');
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.log('Admin subscriptions query timed out');
      res.status(504).json({ error: 'Request timeout' });
    }, 10000); // 10 second timeout

    const subscriptions = await Subscription.findAll({
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    clearTimeout(timeout);
    console.log(`Found ${subscriptions.length} subscriptions`);

    // Get usage data for each subscription
    const subscriptionsWithUsage = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const usage = await subscriptionService.getSchoolUsage(sub.schoolId);
          return {
            id: sub.id,
            schoolId: sub.schoolId,
            schoolName: sub.school?.name || 'Unknown School',
            planName: sub.planName,
            status: sub.status,
            currentPeriodStart: sub.currentPeriodStart,
            currentPeriodEnd: sub.currentPeriodEnd,
            trialEnd: sub.trialEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            amount: getPlanAmount(sub.planName),
            usage
          };
        } catch (error) {
          console.error(`Error getting usage for subscription ${sub.id}:`, error);
          return {
            id: sub.id,
            schoolId: sub.schoolId,
            schoolName: sub.school?.name || 'Unknown School',
            planName: sub.planName,
            status: sub.status,
            currentPeriodStart: sub.currentPeriodStart,
            currentPeriodEnd: sub.currentPeriodEnd,
            trialEnd: sub.trialEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            amount: getPlanAmount(sub.planName),
            usage: {}
          };
        }
      })
    );

    // Calculate statistics
    const stats = await calculateSubscriptionStats();

    res.json({
      success: true,
      subscriptions: subscriptionsWithUsage,
      stats
    });
  } catch (error) {
    console.error('Error fetching admin subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscription data' });
  }
});

// Get subscription statistics
router.get('/subscription-stats', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const stats = await calculateSubscriptionStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching subscription stats:', error);
    res.status(500).json({ error: 'Failed to fetch subscription statistics' });
  }
});

// Get subscription details for a specific school
router.get('/subscriptions/:schoolId', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    const subscription = await Subscription.findOne({
      where: { schoolId },
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name', 'email', 'phoneNumber', 'address']
        }
      ]
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const usage = await subscriptionService.getSchoolUsage(schoolId);
    const paymentHistory = await subscriptionService.getPaymentHistory(schoolId);

    res.json({
      success: true,
      subscription: {
        ...subscription.toJSON(),
        usage,
        paymentHistory
      }
    });
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Update subscription (admin override)
router.put('/subscriptions/:subscriptionId', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status, planName, currentPeriodEnd } = req.body;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (planName) updateData.planName = planName;
    if (currentPeriodEnd) updateData.currentPeriodEnd = currentPeriodEnd;

    await subscription.update(updateData);

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Get revenue analytics
router.get('/revenue-analytics', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get all active subscriptions
    const activeSubscriptions = await Subscription.findAll({
      where: { status: 'active' },
      include: [
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name']
        }
      ]
    });

    // Calculate revenue by plan
    const revenueByPlan = {};
    let totalMonthlyRevenue = 0;

    activeSubscriptions.forEach(sub => {
      const amount = getPlanAmount(sub.planName);
      if (!revenueByPlan[sub.planName]) {
        revenueByPlan[sub.planName] = 0;
      }
      revenueByPlan[sub.planName] += amount;
      totalMonthlyRevenue += amount;
    });

    // Calculate annual revenue
    const annualRevenue = totalMonthlyRevenue * 12;

    res.json({
      success: true,
      analytics: {
        totalMonthlyRevenue,
        annualRevenue,
        revenueByPlan,
        activeSubscriptions: activeSubscriptions.length
      }
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

// Get churn analytics
router.get('/churn-analytics', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cancelledSubscriptions = await Subscription.findAll({
      where: {
        status: 'cancelled',
        cancelledAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });

    const totalSubscriptions = await Subscription.count({
      where: {
        createdAt: {
          [require('sequelize').Op.lte]: thirtyDaysAgo
        }
      }
    });

    const churnRate = totalSubscriptions > 0 ? (cancelledSubscriptions.length / totalSubscriptions) * 100 : 0;

    res.json({
      success: true,
      analytics: {
        churnRate: churnRate.toFixed(2),
        cancelledThisMonth: cancelledSubscriptions.length,
        totalSubscriptions
      }
    });
  } catch (error) {
    console.error('Error fetching churn analytics:', error);
    res.status(500).json({ error: 'Failed to fetch churn analytics' });
  }
});

// Helper function to get plan amount
function getPlanAmount(planName) {
  const planAmounts = {
    'free': 0,
    'basic': 29.99,
    'premium': 79.99,
    'enterprise': 199.99
  };
  return planAmounts[planName] || 0;
}

// Helper function to calculate subscription statistics
async function calculateSubscriptionStats() {
  try {
    const [
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      cancelledSubscriptions,
      allSubscriptions
    ] = await Promise.all([
      Subscription.count(),
      Subscription.count({ where: { status: 'active' } }),
      Subscription.count({ 
        where: { 
          status: 'active',
          trialEnd: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      }),
      Subscription.count({ where: { status: 'cancelled' } }),
      Subscription.findAll({ attributes: ['planName'] })
    ]);

    // Calculate plan distribution
    const planDistribution = {};
    allSubscriptions.forEach(sub => {
      planDistribution[sub.planName] = (planDistribution[sub.planName] || 0) + 1;
    });

    // Calculate monthly revenue
    const activeSubs = await Subscription.findAll({
      where: { status: 'active' },
      attributes: ['planName']
    });

    const monthlyRevenue = activeSubs.reduce((total, sub) => {
      return total + getPlanAmount(sub.planName);
    }, 0);

    return {
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      cancelledSubscriptions,
      totalRevenue: monthlyRevenue * 12, // Annual revenue
      monthlyRevenue,
      planDistribution
    };
  } catch (error) {
    console.error('Error calculating subscription stats:', error);
    return {
      totalSubscriptions: 0,
      activeSubscriptions: 0,
      trialSubscriptions: 0,
      cancelledSubscriptions: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      planDistribution: {}
    };
  }
}

module.exports = router; 