import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService, { SubscriptionPlan } from '../services/subscription.service.ts';
import { toast } from 'react-hot-toast';

interface PlanModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  processing: string | null;
  isCurrentPlan: boolean;
}

const PlanModal: React.FC<PlanModalProps> = ({ plan, isOpen, onClose, onSubscribe, processing, isCurrentPlan }) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{plan.name} - Full Features</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📊 Usage Limits</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-semibold">{plan.features.maxStudents === -1 ? 'Unlimited' : plan.features.maxStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teachers:</span>
                  <span className="font-semibold">{plan.features.maxTeachers === -1 ? 'Unlimited' : plan.features.maxTeachers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Classes:</span>
                  <span className="font-semibold">{plan.features.maxClasses === -1 ? 'Unlimited' : plan.features.maxClasses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-semibold">{plan.limits.storageGB}GB</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">✨ Features</h3>
              <div className="space-y-2">
                {Object.entries({
                  'Materials Library': plan.features.materials,
                  'Learning Templates': plan.features.templates,
                  'Assignment Management': plan.features.assignments,
                  'Basic Analytics': plan.features.basicAnalytics,
                  'Finance Module': plan.features.financeModule,
                  'Advanced Analytics': plan.features.advancedAnalytics,
                  'Priority Support': plan.features.prioritySupport,
                  'Custom Branding': plan.features.customBranding,
                  'API Access': plan.features.apiAccess,
                  'White Labeling': plan.features.whiteLabeling
                }).map(([feature, enabled]) => (
                  <div key={feature} className={`flex items-center ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="mr-2">{enabled ? '✅' : '❌'}</span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {!isCurrentPlan && (
              <button
                onClick={() => onSubscribe(plan.id)}
                disabled={processing === plan.id}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {processing === plan.id ? 'Processing...' : 'Subscribe Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPricingPage: React.FC = () => {
  const [plans, setPlans] = useState<{ monthly: Record<string, SubscriptionPlan>; annual: Record<string, SubscriptionPlan> } | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
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

        {/* Plans Grid - Compact Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.entries(currentPlans).map(([planId, plan]) => {
            const planIcon = planId.includes('free') ? '🆓' : planId.includes('basic') ? '🚀' : planId.includes('premium') ? '⭐' : '👑';
            const planColor = planId.includes('free') ? 'gray' : planId.includes('basic') ? 'blue' : planId.includes('premium') ? 'purple' : 'indigo';
            
            return (
              <div key={planId} className={`bg-white rounded-xl shadow-lg border-2 hover:shadow-xl transition-all duration-300 ${
                isCurrentPlan(planId) ? `border-${planColor}-500 ring-2 ring-${planColor}-100` : `border-${planColor}-200 hover:border-${planColor}-300`
              }`}>
                <div className="p-4">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-${planColor}-100 flex items-center justify-center text-xl`}>
                      {planIcon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                    <div className="text-2xl font-black text-gray-900 mt-1">
                      {plan.price === 0 ? 'FREE' : formatPrice(plan)}
                    </div>
                    {isCurrentPlan(planId) && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mt-2">
                        Current Plan
                      </span>
                    )}
                  </div>
                  
                  {/* Usage Limits */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">📊 Usage Limits</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">👥 Students:</span>
                        <span className="font-semibold">{plan.features.maxStudents === -1 ? '∞' : plan.features.maxStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">👨🏫 Teachers:</span>
                        <span className="font-semibold">{plan.features.maxTeachers === -1 ? '∞' : plan.features.maxTeachers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">📚 Classes:</span>
                        <span className="font-semibold">{plan.features.maxClasses === -1 ? '∞' : plan.features.maxClasses}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📋 View All Features
                    </button>
                    
                    {isCurrentPlan(planId) ? (
                      <button
                        onClick={handleManageBilling}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        ⚙️ Manage Billing
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(planId)}
                        disabled={processing === planId}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                          plan.price === 0 ? 'bg-green-600 hover:bg-green-700' :
                          planColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                          planColor === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {processing === planId ? '⏳ Processing...' : plan.price === 0 ? '🎆 Start Trial' : '🚀 Subscribe'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <PlanModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSubscribe={handleSubscribe}
          processing={processing}
          isCurrentPlan={selectedPlan ? isCurrentPlan(selectedPlan.id) : false}
        />
      </div>
    </div>
  );
};

export default SubscriptionPricingPage;