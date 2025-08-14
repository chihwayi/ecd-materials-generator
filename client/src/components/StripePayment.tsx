import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const stripePromise = loadStripe('pk_test_51RsKkTRdY10hCeJR6g8Ah54KWnrWPtOlRkaWsxeQT8mKxkQpc4fs0kfbm1iXC4aTFiiqToVzkdxSlrOSn4MB9QAT005xB6OjS8');

interface PaymentFormProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ planId, planName, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting payment process for plan:', planId);
      
      // Create payment intent
      console.log('📡 Creating payment intent...');
      const { data } = await api.post('/stripe/create-payment-intent', { planId });
      console.log('✅ Payment intent created:', data);
      
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment
      console.log('💳 Confirming payment with Stripe...');
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      console.log('🎯 Payment result:', { paymentError, paymentIntent });

      if (paymentError) {
        console.error('❌ Payment failed:', paymentError);
        setError(paymentError.message || 'Payment failed. Please try again.');
        toast.error(paymentError.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('✅ Payment successful! Payment intent:', paymentIntent);
        
        // Update subscription in database
        try {
          console.log('🔄 Updating subscription in database...');
          await api.post('/stripe/test-update-subscription', { planId });
          console.log('✅ Subscription updated successfully');
        } catch (updateError: any) {
          console.error('❌ Failed to update subscription:', updateError);
          // Don't fail the payment, just log the error
        }
        
        toast.success('Payment successful! Your subscription is now active.');
        onSuccess();
      } else {
        console.log('⚠️ Payment status:', paymentIntent?.status);
        setError(`Payment status: ${paymentIntent?.status}. Please try again.`);
        toast.error('Payment processing failed. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      const errorMessage = error.response?.data?.error || 'Payment failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setError(null);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-blue-900 text-lg">{planName}</h3>
            <p className="text-blue-700 text-sm">Monthly subscription</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{formatPrice(amount)}</div>
            <div className="text-blue-600 text-sm">per month</div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Details Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Card Details
            </label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#374151',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    '::placeholder': { 
                      color: '#9CA3AF',
                      fontWeight: '400'
                    },
                    ':-webkit-autofill': {
                      color: '#374151',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                    iconColor: '#EF4444',
                  },
                },
                hidePostalCode: true,
              }}
              onChange={handleCardChange}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-700">
                <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
                We use Stripe to process payments and never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || !cardComplete || loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Pay ${formatPrice(amount)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface StripePaymentProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default StripePayment;