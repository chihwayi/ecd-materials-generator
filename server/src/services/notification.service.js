const { SystemNotification } = require('../models');

class NotificationService {
  static async createNotification(type, title, message, data = null, targetRole = 'system_admin') {
    try {
      return await SystemNotification.create({
        type,
        title,
        message,
        data,
        targetRole
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  static async getNotifications(role = 'system_admin', limit = 50) {
    try {
      return await SystemNotification.findAll({
        where: {
          targetRole: ['all', role]
        },
        order: [['createdAt', 'DESC']],
        limit
      });
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  static async markAsRead(id) {
    try {
      await SystemNotification.update(
        { isRead: true },
        { where: { id } }
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  // System event notifications
  static async notifyPaymentFailed(schoolName, amount) {
    await this.createNotification(
      'error',
      'Payment Failed',
      `Payment of $${amount} failed for ${schoolName}`,
      { schoolName, amount }
    );
  }

  static async notifySubscriptionExpiring(schoolName, daysLeft) {
    await this.createNotification(
      'warning',
      'Subscription Expiring',
      `${schoolName} subscription expires in ${daysLeft} days`,
      { schoolName, daysLeft }
    );
  }

  static async notifyPlanLimitReached(schoolName, limitType) {
    await this.createNotification(
      'warning',
      'Plan Limit Reached',
      `${schoolName} has reached their ${limitType} limit`,
      { schoolName, limitType }
    );
  }
}

module.exports = NotificationService;