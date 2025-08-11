import api from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  trialDays: number;
  features: {
    maxStudents: number;
    maxTeachers: number;
    maxClasses: number;
    materials: boolean;
    templates: boolean;
    assignments: boolean;
    basicAnalytics: boolean;
    financeModule: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    whiteLabeling: boolean;
  };
  limits: {
    storageGB: number;
    monthlyExports: number;
    customTemplates: number;
  };
}

export interface SubscriptionSummary {
  subscription: any;
  usage: {
    students: number;
    teachers: number;
    classes: number;
    materials: number;
    assignments: number;
    storage: number;
    exports: number;
    templates: number;
  };
  limits: any;
  isActive: boolean;
  daysUntilExpiry: number | null;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface FeatureAccess {
  allowed: boolean;
  reason?: string;
}

class SubscriptionService {
  // Get available subscription plans
  async getPlans(): Promise<{ monthly: Record<string, SubscriptionPlan>; annual: Record<string, SubscriptionPlan> }> {
    const response = await api.get('/subscription/plans');
    return response.data.plans;
  }

  // Get current subscription
  async getCurrentSubscription(): Promise<SubscriptionSummary> {
    const response = await api.get('/subscription/current');
    return response.data.subscription || response.data;
  }

  // Create checkout session
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    const response = await api.post('/subscription/create-checkout-session', {
      planId,
      successUrl,
      cancelUrl
    });
    return response.data;
  }

  // Cancel subscription
  async cancelSubscription(cancelAtPeriodEnd: boolean = true): Promise<{ message: string; subscription: any }> {
    const response = await api.post('/subscription/cancel', { cancelAtPeriodEnd });
    return response.data;
  }

  // Reactivate subscription
  async reactivateSubscription(): Promise<{ message: string; subscription: any }> {
    const response = await api.post('/subscription/reactivate');
    return response.data;
  }

  // Change plan
  async changePlan(planId: string): Promise<{ message: string; subscription: any }> {
    const response = await api.post('/subscription/change-plan', { planId });
    return response.data;
  }

  // Get billing portal URL
  async getBillingPortalUrl(returnUrl?: string): Promise<{ url: string }> {
    const params = returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '';
    const response = await api.get(`/subscription/billing-portal${params}`);
    return response.data;
  }

  // Get payment history
  async getPaymentHistory(): Promise<any[]> {
    const response = await api.get('/subscription/payments');
    return response.data.payments;
  }

  // Check feature access
  async checkFeatureAccess(feature: string): Promise<FeatureAccess> {
    const response = await api.get(`/subscription/check-feature/${feature}`);
    return response.data.access;
  }

  // Get usage statistics
  async getUsage(): Promise<{ usage: any; limits: any }> {
    const response = await api.get('/subscription/usage');
    return response.data;
  }

  // Check if feature is enabled (client-side check)
  isFeatureEnabled(plan: SubscriptionPlan, feature: string): boolean {
    return plan.features[feature as keyof typeof plan.features] || false;
  }

  // Check if usage is within limits
  isWithinLimits(usage: any, limits: any, metric: string): boolean {
    const current = usage[metric] || 0;
    const limit = limits[metric]?.limit;
    
    if (limit === 'unlimited' || limit === -1) {
      return true;
    }
    
    return current < limit;
  }

  // Format plan price
  formatPrice(plan: SubscriptionPlan): string {
    if (plan.price === 0) {
      return 'Free';
    }
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: plan.currency.toUpperCase(),
      minimumFractionDigits: 2
    });
    
    return formatter.format(plan.price);
  }

  // Get plan description
  getPlanDescription(plan: SubscriptionPlan): string {
    const features = [];
    
    if (plan.features.materials) features.push('Materials Library');
    if (plan.features.templates) features.push('Learning Templates');
    if (plan.features.assignments) features.push('Assignment Management');
    if (plan.features.basicAnalytics) features.push('Basic Analytics');
    if (plan.features.financeModule) features.push('Finance Module');
    if (plan.features.advancedAnalytics) features.push('Advanced Analytics');
    if (plan.features.prioritySupport) features.push('Priority Support');
    if (plan.features.customBranding) features.push('Custom Branding');
    if (plan.features.apiAccess) features.push('API Access');
    if (plan.features.whiteLabeling) features.push('White Labeling');
    
    return features.join(', ');
  }

  // Get usage percentage
  getUsagePercentage(usage: any, limits: any, metric: string): number {
    const current = usage[metric] || 0;
    const limit = limits[metric]?.limit;
    
    if (limit === 'unlimited' || limit === -1) {
      return 0;
    }
    
    return Math.min(Math.round((current / limit) * 100), 100);
  }

  // Get plan recommendations based on usage
  getPlanRecommendations(usage: any, currentPlan: SubscriptionPlan): string[] {
    const recommendations = [];
    
    // Check if approaching limits
    const metrics = ['students', 'teachers', 'classes'];
    metrics.forEach(metric => {
      const percentage = this.getUsagePercentage(usage, { [metric]: { limit: currentPlan.limits[metric] } }, metric);
      if (percentage > 80) {
        recommendations.push(`Consider upgrading: ${percentage}% of ${metric} limit used`);
      }
    });
    
    // Check if using premium features
    if (usage.materials > 100 && !currentPlan.features.advancedAnalytics) {
      recommendations.push('Upgrade for advanced analytics and insights');
    }
    
    if (usage.assignments > 50 && !currentPlan.features.prioritySupport) {
      recommendations.push('Upgrade for priority support and faster response times');
    }
    
    return recommendations;
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService; 