const { Subscription, SubscriptionPayment, School, User, Student, Class } = require('../models');
const stripeService = require('./stripe.service');
const { subscriptionPlans, annualPlans, isFeatureEnabled, getPlanLimit, isUnlimited } = require('../config/subscription.config');

class SubscriptionService {
  // Create a new subscription
  async createSubscription(schoolId, planId, stripeCustomerId = null) {
    try {
      const plan = subscriptionPlans[planId] || annualPlans[planId];
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      // Create Stripe customer if not provided
      let customerId = stripeCustomerId;
      if (!customerId) {
        const school = await School.findByPk(schoolId);
        const customer = await stripeService.createCustomer(school);
        customerId = customer.id;
      }

      // Create Stripe subscription
      const stripeSubscription = await stripeService.createSubscription(
        customerId,
        plan.id,
        plan.trialDays
      );

      // Create local subscription record
      const subscription = await Subscription.create({
        schoolId,
        planId: plan.id,
        planName: planId,
        status: 'active',
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
        trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get subscription for a school
  async getSchoolSubscription(schoolId) {
    try {
      const subscription = await Subscription.findOne({
        where: { schoolId },
        order: [['createdAt', 'DESC']]
      });
      return subscription;
    } catch (error) {
      console.error('Error getting school subscription:', error);
      throw error;
    }
  }

  // Check if a feature is enabled for a school
  async isFeatureEnabled(schoolId, feature) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription || subscription.status !== 'active') {
        return false;
      }

      const plan = subscriptionPlans[subscription.planName] || annualPlans[subscription.planName];
      return plan?.features[feature] || false;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  // Check if school is within usage limits
  async checkUsageLimits(schoolId) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription || subscription.status !== 'active') {
        return { allowed: false, reason: 'No active subscription' };
      }

      const plan = subscriptionPlans[subscription.planName] || annualPlans[subscription.planName];
      if (!plan) {
        return { allowed: false, reason: 'Invalid plan' };
      }

      // Get current usage
      const usage = await this.getSchoolUsage(schoolId);
      const limits = {};

      // Check each limit
      for (const [key, limit] of Object.entries(plan.limits)) {
        if (isUnlimited(limit)) {
          limits[key] = { current: usage[key], limit: 'unlimited', allowed: true };
        } else {
          const current = usage[key] || 0;
          limits[key] = {
            current,
            limit,
            allowed: current < limit,
            percentage: Math.round((current / limit) * 100)
          };
        }
      }

      return { allowed: true, limits, usage };
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return { allowed: false, reason: 'Error checking limits' };
    }
  }

  // Get current usage for a school
  async getSchoolUsage(schoolId) {
    try {
      const [
        studentCount,
        teacherCount,
        classCount,
        materialCount,
        assignmentCount
      ] = await Promise.all([
        Student.count({ where: { schoolId } }),
        User.count({ where: { schoolId, role: 'teacher' } }),
        Class.count({ where: { schoolId } }),
        // Add material and assignment counts when those models are available
        Promise.resolve(0),
        Promise.resolve(0)
      ]);

      return {
        students: studentCount,
        teachers: teacherCount,
        classes: classCount,
        materials: materialCount,
        assignments: assignmentCount,
        storage: 0, // TODO: Implement storage tracking
        exports: 0, // TODO: Implement export tracking
        templates: 0 // TODO: Implement template tracking
      };
    } catch (error) {
      console.error('Error getting school usage:', error);
      return {};
    }
  }

  // Update subscription status from Stripe webhook
  async updateSubscriptionFromWebhook(stripeSubscription) {
    try {
      const subscription = await Subscription.findOne({
        where: { stripeSubscriptionId: stripeSubscription.id }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      await subscription.update({
        status: stripeSubscription.status,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
      });

      return subscription;
    } catch (error) {
      console.error('Error updating subscription from webhook:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(schoolId, cancelAtPeriodEnd = true) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Cancel in Stripe
      await stripeService.cancelSubscription(subscription.stripeSubscriptionId, cancelAtPeriodEnd);

      // Update local record
      await subscription.update({
        status: cancelAtPeriodEnd ? 'active' : 'cancelled',
        cancelAtPeriodEnd,
        cancelledAt: cancelAtPeriodEnd ? null : new Date()
      });

      return subscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(schoolId) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription) {
        throw new Error('No subscription found');
      }

      // Reactivate in Stripe
      await stripeService.reactivateSubscription(subscription.stripeSubscriptionId);

      // Update local record
      await subscription.update({
        status: 'active',
        cancelAtPeriodEnd: false,
        cancelledAt: null
      });

      return subscription;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Upgrade/downgrade subscription
  async changePlan(schoolId, newPlanId) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      const newPlan = subscriptionPlans[newPlanId] || annualPlans[newPlanId];
      if (!newPlan) {
        throw new Error('Invalid plan ID');
      }

      // Update in Stripe
      const updatedStripeSubscription = await stripeService.updateSubscription(
        subscription.stripeSubscriptionId,
        newPlan.id
      );

      // Update local record
      await subscription.update({
        planId: newPlan.id,
        planName: newPlanId,
        currentPeriodStart: new Date(updatedStripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(updatedStripeSubscription.current_period_end * 1000)
      });

      return subscription;
    } catch (error) {
      console.error('Error changing plan:', error);
      throw error;
    }
  }

  // Get billing portal URL
  async getBillingPortalUrl(schoolId, returnUrl) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      if (!subscription || !subscription.stripeCustomerId) {
        throw new Error('No active subscription found');
      }

      const session = await stripeService.createPortalSession(
        subscription.stripeCustomerId,
        returnUrl
      );

      return session.url;
    } catch (error) {
      console.error('Error getting billing portal URL:', error);
      throw error;
    }
  }

  // Record payment
  async recordPayment(subscriptionId, paymentData) {
    try {
      const payment = await SubscriptionPayment.create({
        subscriptionId,
        schoolId: paymentData.schoolId,
        stripePaymentIntentId: paymentData.paymentIntentId,
        stripeInvoiceId: paymentData.invoiceId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        status: paymentData.status || 'succeeded',
        paymentMethod: paymentData.paymentMethod,
        description: paymentData.description,
        periodStart: paymentData.periodStart,
        periodEnd: paymentData.periodEnd,
        metadata: paymentData.metadata
      });

      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(schoolId) {
    try {
      const payments = await SubscriptionPayment.findAll({
        where: { schoolId },
        order: [['createdAt', 'DESC']]
      });

      return payments;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  // Check if school can access a specific feature
  async canAccessFeature(schoolId, feature) {
    try {
      // Check if feature is enabled for the plan
      const hasFeature = await this.isFeatureEnabled(schoolId, feature);
      if (!hasFeature) {
        return { allowed: false, reason: 'Feature not included in plan' };
      }

      // Check usage limits if applicable
      const usageCheck = await this.checkUsageLimits(schoolId);
      if (!usageCheck.allowed) {
        return { allowed: false, reason: usageCheck.reason };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking feature access:', error);
      return { allowed: false, reason: 'Error checking access' };
    }
  }

  // Get subscription status summary
  async getSubscriptionSummary(schoolId) {
    try {
      const subscription = await this.getSchoolSubscription(schoolId);
      const usage = await this.getSchoolUsage(schoolId);
      const limits = await this.checkUsageLimits(schoolId);

      return {
        subscription,
        usage,
        limits,
        isActive: subscription?.status === 'active',
        daysUntilExpiry: subscription?.currentPeriodEnd 
          ? Math.ceil((new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))
          : null
      };
    } catch (error) {
      console.error('Error getting subscription summary:', error);
      throw error;
    }
  }
}

module.exports = new SubscriptionService(); 