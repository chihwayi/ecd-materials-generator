const { School } = require('../models');
const { Op } = require('sequelize');

class SubscriptionService {
  // Check and update subscription statuses
  static async checkExpiredSubscriptions() {
    try {
      const now = new Date();
      const gracePeriodDays = 7; // 7-day grace period
      const gracePeriodEnd = new Date(now.getTime() + (gracePeriodDays * 24 * 60 * 60 * 1000));

      // Find schools with expired subscriptions
      const expiredSchools = await School.findAll({
        where: {
          subscriptionExpiresAt: { [Op.lt]: now },
          subscriptionStatus: { [Op.in]: ['active', 'grace_period'] }
        }
      });

      // Update to expired status
      for (const school of expiredSchools) {
        await school.update({ subscriptionStatus: 'expired' });
      }

      // Find schools entering grace period (expires within 7 days)
      const gracePeriodSchools = await School.findAll({
        where: {
          subscriptionExpiresAt: { [Op.between]: [now, gracePeriodEnd] },
          subscriptionStatus: 'active'
        }
      });

      // Update to grace period
      for (const school of gracePeriodSchools) {
        await school.update({ subscriptionStatus: 'grace_period' });
      }

      return {
        expired: expiredSchools.length,
        gracePeriod: gracePeriodSchools.length
      };
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      return { expired: 0, gracePeriod: 0 };
    }
  }

  // Get subscription warnings for a school
  static async getSubscriptionWarnings(schoolId) {
    try {
      const school = await School.findByPk(schoolId);
      if (!school) return null;

      const now = new Date();
      const warnings = [];

      if (school.subscriptionStatus === 'expired') {
        warnings.push({
          type: 'expired',
          severity: 'critical',
          message: 'Your subscription has expired. Renew now to restore access.',
          action: 'Renew Subscription'
        });
      } else if (school.subscriptionStatus === 'grace_period') {
        const daysLeft = Math.ceil((new Date(school.subscriptionExpiresAt) - now) / (1000 * 60 * 60 * 24));
        warnings.push({
          type: 'grace_period',
          severity: 'high',
          message: `Your subscription expires in ${daysLeft} days. Renew to avoid service interruption.`,
          daysLeft,
          action: 'Renew Now'
        });
      } else if (school.subscriptionStatus === 'payment_failed') {
        warnings.push({
          type: 'payment_failed',
          severity: 'high',
          message: 'Payment failed. Please update your payment method.',
          failureCount: school.paymentFailureCount,
          action: 'Update Payment'
        });
      } else if (school.subscriptionExpiresAt) {
        const daysUntilExpiry = Math.ceil((new Date(school.subscriptionExpiresAt) - now) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 14 && daysUntilExpiry > 7) {
          warnings.push({
            type: 'expiring_soon',
            severity: 'medium',
            message: `Your subscription expires in ${daysUntilExpiry} days.`,
            daysLeft: daysUntilExpiry,
            action: 'Renew Subscription'
          });
        }
      }

      return warnings;
    } catch (error) {
      console.error('Error getting subscription warnings:', error);
      return [];
    }
  }

  // Get subscription summary for a school
  static async getSubscriptionSummary(schoolId) {
    try {
      const school = await School.findByPk(schoolId);
      if (!school) {
        return {
          planName: 'free',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        };
      }

      return {
        planName: school.subscriptionPlan || 'free',
        status: school.subscriptionStatus || 'active',
        currentPeriodStart: school.createdAt,
        currentPeriodEnd: school.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: school.subscriptionStatus === 'cancelled'
      };
    } catch (error) {
      console.error('Error getting subscription summary:', error);
      return {
        planName: 'free',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      };
    }
  }
}

module.exports = SubscriptionService;