const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const subscriptionService = require('../services/subscription.service');
const { Subscription, School, User, Student, Class } = require('../models');

// Get all subscriptions for system admin monitoring
router.get('/subscriptions', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    // Get all schools
    const schools = await School.findAll();
    
    // Get users, students, and classes separately
    const allUsers = await User.findAll({ attributes: ['id', 'role', 'schoolId'] });
    const allStudents = await Student.findAll({ attributes: ['id', 'schoolId'] });
    const allClasses = await Class.findAll({ attributes: ['id', 'schoolId'] });
    
    // Group by school
    const usersBySchool = {};
    const studentsBySchool = {};
    const classesBySchool = {};
    
    allUsers.forEach(user => {
      if (!usersBySchool[user.schoolId]) usersBySchool[user.schoolId] = [];
      usersBySchool[user.schoolId].push(user);
    });
    
    allStudents.forEach(student => {
      if (!studentsBySchool[student.schoolId]) studentsBySchool[student.schoolId] = [];
      studentsBySchool[student.schoolId].push(student);
    });
    
    allClasses.forEach(cls => {
      if (!classesBySchool[cls.schoolId]) classesBySchool[cls.schoolId] = [];
      classesBySchool[cls.schoolId].push(cls);
    });

    // Process subscription data
    const subscriptions = [];
    let monthlyRevenue = 0;
    let activeCount = 0;
    let trialCount = 0;
    let expiredCount = 0;
    const planDistribution = {};
    const now = new Date();

    for (const school of schools) {
      const schoolUsers = usersBySchool[school.id] || [];
      const schoolStudents = studentsBySchool[school.id] || [];
      const schoolClasses = classesBySchool[school.id] || [];
      
      const teachers = schoolUsers.filter(u => ['teacher', 'school_admin'].includes(u.role)).length;
      const students = schoolStudents.length;
      const classes = schoolClasses.length;
      
      // Get plan amount
      const planAmounts = {
        'free': 0,
        'starter': 15.99,
        'basic': 49.99,
        'professional': 99.99,
        'enterprise': 129.99
      };
      
      const planAmount = planAmounts[school.subscriptionPlan] || 0;
      const isExpired = school.subscriptionStatus === 'expired' || (school.subscriptionExpiresAt && new Date(school.subscriptionExpiresAt) <= now);
      const isTrial = school.subscriptionPlan === 'free' && !isExpired;
      const isActive = school.subscriptionPlan !== 'free' && school.subscriptionStatus === 'active' && !isExpired;
      
      // Count statistics
      if (isActive) activeCount++;
      if (isTrial) trialCount++;
      if (isExpired) expiredCount++;
      
      // Plan distribution
      const planName = school.subscriptionPlan === 'free' ? 'Free Trial' : 
                      school.subscriptionPlan === 'starter' ? 'Starter Plan' :
                      school.subscriptionPlan === 'basic' ? 'Basic Plan' :
                      school.subscriptionPlan === 'professional' ? 'Professional Plan' :
                      school.subscriptionPlan === 'enterprise' ? 'Enterprise Plan' :
                      school.subscriptionPlan;
      planDistribution[planName] = (planDistribution[planName] || 0) + 1;
      
      // Revenue calculation (only for active paid subscriptions)
      if (isActive && planAmount > 0) {
        monthlyRevenue += planAmount;
      }
      
      subscriptions.push({
        id: school.id,
        schoolId: school.id,
        schoolName: school.name,
        planName: school.subscriptionPlan,
        status: isExpired ? 'expired' : isTrial ? 'trial' : 'active',
        currentPeriodStart: school.createdAt,
        currentPeriodEnd: school.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: planAmount,
        usage: {
          teachers,
          students,
          classes
        }
      });
    }

    // Calculate financial metrics
    const totalRevenue = monthlyRevenue; // Since we only have current active subscriptions
    const annualProjectedRevenue = monthlyRevenue * 12;
    const avgRevenuePerSchool = activeCount > 0 ? monthlyRevenue / activeCount : 0;
    const conversionRate = schools.length > 0 ? (activeCount / schools.length) * 100 : 0;
    const recentRevenue = monthlyRevenue; // Assume recent revenue is current MRR

    const stats = {
      totalSubscriptions: schools.length,
      activeSubscriptions: activeCount,
      trialSubscriptions: trialCount,
      expiredSubscriptions: expiredCount,
      cancelledSubscriptions: 0,
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      annualProjectedRevenue: parseFloat(annualProjectedRevenue.toFixed(2)),
      avgRevenuePerSchool: parseFloat(avgRevenuePerSchool.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      recentRevenue: parseFloat(recentRevenue.toFixed(2)),
      totalPayments: activeCount, // Use active subscriptions as payment count
      planDistribution
    };

    res.json({
      success: true,
      subscriptions,
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

// Get comprehensive financial dashboard
router.get('/financial-dashboard', authenticateToken, requireRole(['system_admin']), async (req, res) => {
  try {
    const { SubscriptionPayment } = require('../models');
    const { Op } = require('sequelize');
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    // Get all payments
    const allPayments = await SubscriptionPayment.findAll({
      where: { status: 'completed' },
      order: [['createdAt', 'DESC']]
    });
    
    // Get schools with active subscriptions
    const activeSchools = await School.findAll({
      where: {
        subscriptionStatus: 'active',
        subscriptionExpiresAt: { [Op.gt]: now }
      }
    });
    
    // Monthly revenue calculations
    const thisMonthPayments = allPayments.filter(p => new Date(p.createdAt) >= startOfMonth);
    const lastMonthPayments = allPayments.filter(p => 
      new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) <= endOfLastMonth
    );
    const yearToDatePayments = allPayments.filter(p => new Date(p.createdAt) >= startOfYear);
    
    const thisMonthRevenue = thisMonthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const yearToDateRevenue = yearToDatePayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalRevenue = allPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    // Monthly recurring revenue (MRR)
    const planAmounts = {
      'starter': 15.99,
      'basic': 49.99,
      'professional': 99.99,
      'enterprise': 129.99
    };
    
    const mrr = activeSchools.reduce((sum, school) => {
      return sum + (planAmounts[school.subscriptionPlan] || 0);
    }, 0);
    
    // Revenue by plan
    const revenueByPlan = {};
    const subscriptionsByPlan = {};
    
    activeSchools.forEach(school => {
      const plan = school.subscriptionPlan;
      const amount = planAmounts[plan] || 0;
      
      revenueByPlan[plan] = (revenueByPlan[plan] || 0) + amount;
      subscriptionsByPlan[plan] = (subscriptionsByPlan[plan] || 0) + 1;
    });
    
    // Growth metrics
    const revenueGrowth = lastMonthRevenue > 0 ? 
      ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
    
    // Average revenue per user (ARPU)
    const arpu = activeSchools.length > 0 ? mrr / activeSchools.length : 0;
    
    // Customer lifetime value (simplified)
    const avgSubscriptionLength = 12; // months
    const clv = arpu * avgSubscriptionLength;
    
    // Payment success rate
    const totalPaymentAttempts = await SubscriptionPayment.count();
    const successfulPayments = allPayments.length;
    const paymentSuccessRate = totalPaymentAttempts > 0 ? 
      (successfulPayments / totalPaymentAttempts * 100) : 100;
    
    // Revenue forecast (next 12 months based on current MRR)
    const forecastedAnnualRevenue = mrr * 12;
    
    // Top performing plans
    const topPlans = Object.entries(revenueByPlan)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([plan, revenue]) => ({
        plan,
        revenue,
        subscribers: subscriptionsByPlan[plan] || 0
      }));
    
    // Recent payment trends (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayPayments = allPayments.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= dayStart && paymentDate < dayEnd;
      });
      
      const dayRevenue = dayPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      last7Days.push({
        date: dayStart.toISOString().split('T')[0],
        revenue: dayRevenue,
        transactions: dayPayments.length
      });
    }
    
    res.json({
      success: true,
      dashboard: {
        // Core metrics
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        yearToDateRevenue,
        monthlyRecurringRevenue: mrr,
        forecastedAnnualRevenue,
        
        // Growth metrics
        revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
        averageRevenuePerUser: parseFloat(arpu.toFixed(2)),
        customerLifetimeValue: parseFloat(clv.toFixed(2)),
        paymentSuccessRate: parseFloat(paymentSuccessRate.toFixed(2)),
        
        // Plan performance
        revenueByPlan,
        subscriptionsByPlan,
        topPerformingPlans: topPlans,
        
        // Trends
        last7DaysTrend: last7Days,
        
        // Summary stats
        totalTransactions: allPayments.length,
        activeSubscriptions: activeSchools.length,
        averageTransactionValue: allPayments.length > 0 ? 
          parseFloat((totalRevenue / allPayments.length).toFixed(2)) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch financial dashboard data' });
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