import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService, { SubscriptionPlan } from '../services/subscription.service.ts';
import { toast } from 'react-hot-toast';

const SubscriptionPricingPage: React.FC = () => {
  const [plans, setPlans] = useState<{ monthly: Record<string, SubscriptionPlan>; annual: Record<string, SubscriptionPlan> } | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getCurrentSubscription().catch(() => null)
      ]);
      
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setProcessing(planId);
      
      const successUrl = `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/subscription/pricing`;
      
      const session = await subscriptionService.createCheckoutSession(planId, successUrl, cancelUrl);
      
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start subscription process');
      setProcessing(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await subscriptionService.getBillingPortalUrl();
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting billing portal URL:', error);
      toast.error('Failed to open billing portal');
    }
  };

  const getFeatureIcon = (enabled: boolean) => {
    return enabled ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  const getFeatureClass = (enabled: boolean) => {
    return enabled ? 'text-gray-900' : 'text-gray-400';
  };

  const formatPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: plan.currency.toUpperCase(),
      minimumFractionDigits: 2
    });
    
    const price = formatter.format(plan.price);
    return plan.interval === 'month' ? `${price}/month` : `${price}/year`;
  };

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.subscription?.planName === planId;
  };

  const getPlanBadge = (planId: string) => {
    if (isCurrentPlan(planId)) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Current Plan
        </span>
      );
    }
    return null;
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-100 to-gray-200';
      case 'basic':
        return 'from-blue-50 to-blue-100';
      case 'premium':
        return 'from-purple-50 to-purple-100';
      case 'enterprise':
        return 'from-indigo-50 to-indigo-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getPlanBorder = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'border-gray-200';
      case 'basic':
        return 'border-blue-200';
      case 'premium':
        return 'border-purple-200';
      case 'enterprise':
        return 'border-indigo-200';
      default:
        return 'border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  const currentPlans = plans?.[billingCycle] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start with our free trial and upgrade as your school grows. 
            All plans include core features with different capacity limits.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {Object.entries(currentPlans).map(([planId, plan]) => (
            <div
              key={planId}
              className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                isCurrentPlan(planId) 
                  ? 'border-blue-500 ring-4 ring-blue-100' 
                  : getPlanBorder(planId)
              } overflow-hidden`}
            >
              {/* Popular Badge */}
              {planId === 'premium' && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-bold">
                  ⭐ Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className={`p-8 ${planId === 'premium' ? 'pt-12' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {subscriptionService.getPlanDescription(plan)}
                    </p>
                  </div>
                  {getPlanBadge(planId)}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : formatPrice(plan).split('/')[0]}
                    </span>
                    {plan.price !== 0 && (
                      <span className="text-xl text-gray-500 ml-2">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.trialDays > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {plan.trialDays}-day free trial
                      </span>
                    </div>
                  )}
                </div>

                {/* Usage Limits */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Usage Limits</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">👥 Students</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.features.maxStudents === -1 ? 'Unlimited' : plan.features.maxStudents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">👨‍🏫 Teachers</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.features.maxTeachers === -1 ? 'Unlimited' : plan.features.maxTeachers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">📚 Classes</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {plan.features.maxClasses === -1 ? 'Unlimited' : plan.features.maxClasses}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                  <div className="space-y-3">
                    <div className={`flex items-center ${getFeatureClass(plan.features.materials)}`}>
                      {getFeatureIcon(plan.features.materials)}
                      <span className="ml-3 text-sm font-medium">Materials Library</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.templates)}`}>
                      {getFeatureIcon(plan.features.templates)}
                      <span className="ml-3 text-sm font-medium">Learning Templates</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.assignments)}`}>
                      {getFeatureIcon(plan.features.assignments)}
                      <span className="ml-3 text-sm font-medium">Assignment Management</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.basicAnalytics)}`}>
                      {getFeatureIcon(plan.features.basicAnalytics)}
                      <span className="ml-3 text-sm font-medium">Basic Analytics</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.financeModule)}`}>
                      {getFeatureIcon(plan.features.financeModule)}
                      <span className="ml-3 text-sm font-medium">Finance Module</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.advancedAnalytics)}`}>
                      {getFeatureIcon(plan.features.advancedAnalytics)}
                      <span className="ml-3 text-sm font-medium">Advanced Analytics</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.prioritySupport)}`}>
                      {getFeatureIcon(plan.features.prioritySupport)}
                      <span className="ml-3 text-sm font-medium">Priority Support</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.customBranding)}`}>
                      {getFeatureIcon(plan.features.customBranding)}
                      <span className="ml-3 text-sm font-medium">Custom Branding</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.apiAccess)}`}>
                      {getFeatureIcon(plan.features.apiAccess)}
                      <span className="ml-3 text-sm font-medium">API Access</span>
                    </div>
                    <div className={`flex items-center ${getFeatureClass(plan.features.whiteLabeling)}`}>
                      {getFeatureIcon(plan.features.whiteLabeling)}
                      <span className="ml-3 text-sm font-medium">White Labeling</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  {isCurrentPlan(planId) ? (
                    <button
                      onClick={handleManageBilling}
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md"
                    >
                      Manage Billing
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(planId)}
                      disabled={processing === planId}
                      className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.price === 0 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {processing === planId ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        plan.price === 0 ? 'Start Free Trial' : 'Subscribe Now'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Current Subscription</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Plan</p>
                <p className="text-xl font-bold text-blue-900">{currentSubscription.subscription?.planName || 'Free'}</p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4">
                <p className="text-sm text-green-600 font-medium mb-1">Status</p>
                <p className="text-xl font-bold text-green-900 capitalize">{currentSubscription.subscription?.status || 'Active'}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4">
                <p className="text-sm text-purple-600 font-medium mb-1">Next Billing</p>
                <p className="text-xl font-bold text-purple-900">
                  {currentSubscription.subscription?.currentPeriodEnd 
                    ? new Date(currentSubscription.subscription.currentPeriodEnd).toLocaleDateString()
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600">Everything you need to know about our subscription plans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Can I change plans anytime?</h4>
              <p className="text-gray-600 leading-relaxed">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated accordingly.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">What happens after the trial?</h4>
              <p className="text-gray-600 leading-relaxed">After your 30-day free trial, you'll need to choose a paid plan to continue using the platform. No charges during trial.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Is there a setup fee?</h4>
              <p className="text-gray-600 leading-relaxed">No, there are no setup fees or hidden charges. You only pay for the plan you choose, with transparent pricing.</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Can I cancel anytime?</h4>
              <p className="text-gray-600 leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPricingPage; 