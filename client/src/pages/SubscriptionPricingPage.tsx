import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService, { SubscriptionPlan } from '../services/subscription.service.ts';
import { analyticsService } from '../services/admin.service.ts';
import { toast } from 'react-hot-toast';
import StripePayment from '../components/StripePayment.tsx';

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
  const [trialActivated, setTrialActivated] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
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
      
      console.log('Fetched subscription data:', subscriptionData);
      
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
      
      // Check if trial is already activated by checking subscription status and plan
      if (subscriptionData) {
        // Check if trial has been used from the backend trialUsed field
        const subscription = subscriptionData.subscription || subscriptionData;
        const hasUsedTrial = subscription.trialUsed === true;
        
        // Check if subscription is expired
        const isExpired = subscription.status === 'expired' || 
                         (subscriptionData.isActive === false && subscription.status !== 'trial');
        
        console.log('Trial detection:', {
          status: subscription.status,
          planName: subscription.planName,
          hasUsedTrial,
          isExpired,
          subscription: subscriptionData
        });
        
        if (hasUsedTrial) {
          setTrialActivated(true);
        }
        
        if (isExpired) {
          setSubscriptionExpired(true);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free_trial') {
      // Handle free trial activation
      try {
        setProcessing(planId);
        await analyticsService.activateTrialPlan();
        toast.success('Free trial activated successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error activating trial:', error);
        toast.error('Failed to activate trial');
      } finally {
        setProcessing(null);
      }
    } else {
      // Handle paid subscription with Stripe
      const plan = currentPlans[planId];
      if (plan) {
        setSelectedPlan({ ...plan, id: planId });
        setShowPayment(true);
      }
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
  };

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
            {trialActivated 
              ? 'Choose a plan that fits your school\'s needs. All plans include core features with different capacity limits.'
              : 'Start with our free trial and upgrade as your school grows. All plans include core features with different capacity limits.'
            }
          </p>
        </div>

        {/* Subscription Expired Notice */}
        {subscriptionExpired && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ Subscription Expired
                </h3>
                <p className="text-red-700 mb-3">
                  <strong>Your school's subscription has expired.</strong> All premium features have been disabled. 
                  Please select a new plan below to restore access to all features and continue using the system.
                </p>
                <div className="bg-red-100 border border-red-300 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    <strong>What happens now?</strong> Teachers and parents will be notified that the subscription has expired. 
                    Only school administrators can manage subscriptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trial Not Available Notice */}
        {trialActivated && !subscriptionExpired && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Free trial already used:</strong> Your school has already activated the free trial. Choose a paid plan to continue using all features.
                </p>
              </div>
            </div>
          </div>
        )}

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
          {Object.entries(currentPlans).filter(([planId, plan]) => {
            // Hide free trial if:
            // 1. It's a free plan (price === 0)
            // 2. AND either:
            //    - Currently on trial (status === 'trial')
            //    - Trial has been used before (trialUsed === true)
            //    - Trial activated state is true
            if (plan.price === 0) {
              const subscription = currentSubscription?.subscription || currentSubscription;
              const isCurrentlyOnTrial = subscription?.status === 'trial' || subscription?.planName === 'free';
              const hasUsedTrial = subscription?.trialUsed === true || trialActivated;
              
              console.log('Filtering free trial plan:', planId, {
                price: plan.price,
                currentStatus: subscription?.status,
                planName: subscription?.planName,
                trialUsed: subscription?.trialUsed,
                trialActivated,
                isCurrentlyOnTrial,
                hasUsedTrial,
                shouldHide: isCurrentlyOnTrial || hasUsedTrial
              });
              
              // Hide if currently on trial OR trial has been used
              if (isCurrentlyOnTrial || hasUsedTrial) {
                return false;
              }
            }
            return true;
          }).map(([planId, plan]) => {
              const planIcon = planId.includes('free') ? '🆓' : planId.includes('starter') ? '👑' : planId.includes('basic') ? '🚀' : planId.includes('professional') ? '⭐' : '👑';
  const planColor = planId.includes('free') ? 'gray' : planId.includes('starter') ? 'purple' : planId.includes('basic') ? 'blue' : planId.includes('professional') ? 'indigo' : 'purple';
            
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
                        disabled={processing === planId || (plan.price === 0 && trialActivated)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                          (plan.price === 0 && trialActivated) ? 'bg-gray-400 text-white cursor-not-allowed' :
                          plan.price === 0 ? 'bg-green-600 hover:bg-green-700 text-white' :
                          planColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                          planColor === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' :
                          'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {processing === planId ? '⏳ Processing...' : 
                         plan.price === 0 && trialActivated ? '✅ Trial Used' :
                         plan.price === 0 ? '🎆 Start Trial' : '🚀 Subscribe'}
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
          isOpen={!!selectedPlan && !showPayment}
          onClose={() => setSelectedPlan(null)}
          onSubscribe={handleSubscribe}
          processing={processing}
          isCurrentPlan={selectedPlan ? isCurrentPlan(selectedPlan.id) : false}
        />
        
        {/* Stripe Payment Modal */}
        {showPayment && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
                      <p className="text-sm text-gray-600">Secure payment powered by Stripe</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPayment(false)} 
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="px-6 py-6">
                <StripePayment
                  planId={selectedPlan.id}
                  planName={selectedPlan.name}
                  amount={selectedPlan.price}
                  onSuccess={() => {
                    setShowPayment(false);
                    toast.success('Subscription activated successfully!');
                    navigate('/dashboard');
                  }}
                  onCancel={() => setShowPayment(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPricingPage;