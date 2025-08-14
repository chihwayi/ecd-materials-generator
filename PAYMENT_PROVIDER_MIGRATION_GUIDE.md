# Payment Provider Migration Guide
## From Stripe to Paynow (or any other provider)

This guide shows how to migrate from Stripe to Paynow or any other payment provider with minimal code changes.

## 📋 Overview
- **Files to modify**: 4 files
- **Estimated time**: 2-4 hours
- **Business logic changes**: None
- **Database changes**: None

## 🔄 Step-by-Step Migration

### Step 1: Install Paynow SDK
```bash
cd server
npm install paynow
```

### Step 2: Update Environment Variables
**File**: `.env`
```env
# Remove Stripe variables
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Add Paynow variables
PAYNOW_INTEGRATION_ID=your_integration_id
PAYNOW_INTEGRATION_KEY=your_integration_key
PAYNOW_RETURN_URL=http://localhost:3000/payment-success
PAYNOW_RESULT_URL=http://localhost:5000/api/v1/paynow/webhook
```

### Step 3: Update Payment Configuration
**File**: `/server/src/config/payment.config.js`
```javascript
module.exports = {
  // Replace Stripe config
  paynow: {
    integrationId: process.env.PAYNOW_INTEGRATION_ID,
    integrationKey: process.env.PAYNOW_INTEGRATION_KEY,
    returnUrl: process.env.PAYNOW_RETURN_URL,
    resultUrl: process.env.PAYNOW_RESULT_URL,
    currency: 'USD' // or 'ZWL' for Zimbabwe Dollar
  },
  errorMessages: {
    paymentFailed: 'Payment failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    invalidAmount: 'Invalid payment amount.',
    paymentDeclined: 'Payment was declined. Please try a different payment method.'
  }
};
```

### Step 4: Create Paynow Service
**File**: `/server/src/services/paynow.service.js` (NEW FILE)
```javascript
const { Paynow } = require('paynow');
const paymentConfig = require('../config/payment.config');

class PaynowService {
  constructor() {
    this.paynow = new Paynow(
      paymentConfig.paynow.integrationId,
      paymentConfig.paynow.integrationKey
    );
    
    this.paynow.setReturnUrl(paymentConfig.paynow.returnUrl);
    this.paynow.setResultUrl(paymentConfig.paynow.resultUrl);
  }

  async createPayment(paymentData) {
    try {
      const { amount, reference, email, schoolName } = paymentData;
      
      const payment = this.paynow.createPayment(reference, email);
      payment.add('Subscription', amount);
      
      const response = await this.paynow.send(payment);
      
      if (response.success) {
        return {
          success: true,
          redirectUrl: response.redirectUrl,
          pollUrl: response.pollUrl,
          reference: reference
        };
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Paynow payment creation error:', error);
      throw error;
    }
  }

  async verifyPayment(pollUrl) {
    try {
      const status = await this.paynow.pollTransaction(pollUrl);
      return {
        paid: status.paid,
        status: status.status,
        reference: status.reference
      };
    } catch (error) {
      console.error('Paynow verification error:', error);
      throw error;
    }
  }
}

module.exports = new PaynowService();
```

### Step 5: Update Payment Routes
**File**: `/server/src/routes/stripe.routes.js` → **Rename to**: `/server/src/routes/paynow.routes.js`
```javascript
const express = require('express');
const router = express.Router();
const paymentConfig = require('../config/payment.config');
const paynowService = require('../services/paynow.service');
const { authenticateToken } = require('../middleware/auth.middleware');
const { School, SubscriptionPlan, SubscriptionPayment } = require('../models');

// Create payment
router.post('/create-payment', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const schoolId = req.user.schoolId;

    const [school, plan] = await Promise.all([
      School.findByPk(schoolId),
      SubscriptionPlan.findOne({ where: { planId } })
    ]);

    if (!school || !plan) {
      return res.status(404).json({ error: 'School or plan not found' });
    }

    const reference = `school_${schoolId}_${planId}_${Date.now()}`;
    
    const paymentResponse = await paynowService.createPayment({
      amount: plan.price,
      reference,
      email: school.contactEmail,
      schoolName: school.name
    });

    // Store payment reference for webhook verification
    await SubscriptionPayment.create({
      schoolId,
      planId,
      amount: plan.price,
      currency: plan.currency,
      paynowReference: reference,
      status: 'pending'
    });

    res.json({
      success: true,
      redirectUrl: paymentResponse.redirectUrl,
      reference
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: paymentConfig.errorMessages.paymentFailed });
  }
});

// Webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Parse Paynow webhook data
    const { reference, status, amount } = req.body;
    
    if (status === 'Paid') {
      // Find the payment record
      const payment = await SubscriptionPayment.findOne({
        where: { paynowReference: reference }
      });

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      const [school, plan] = await Promise.all([
        School.findByPk(payment.schoolId),
        SubscriptionPlan.findOne({ where: { planId: payment.planId } })
      ]);

      if (school && plan) {
        // Calculate expiry date
        const expiryDate = new Date();
        if (plan.interval === 'month') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else if (plan.interval === 'year') {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        // Update school subscription
        await school.update({
          subscriptionPlan: payment.planId,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: expiryDate
        });

        // Update payment status
        await payment.update({ status: 'completed' });

        console.log(`✅ Subscription activated for school ${payment.schoolId} with plan ${payment.planId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual subscription update (for development/testing)
router.post('/test-update-subscription', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;
    const schoolId = req.user.schoolId;

    const [school, plan] = await Promise.all([
      School.findByPk(schoolId),
      SubscriptionPlan.findOne({ where: { planId } })
    ]);

    if (!school || !plan) {
      return res.status(404).json({ error: 'School or plan not found' });
    }

    const expiryDate = new Date();
    if (plan.interval === 'month') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (plan.interval === 'year') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    await school.update({
      subscriptionPlan: planId,
      subscriptionStatus: 'active',
      subscriptionExpiresAt: expiryDate
    });

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        planId,
        status: 'active',
        expiresAt: expiryDate
      }
    });
  } catch (error) {
    console.error('Test subscription update error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

module.exports = router;
```

### Step 6: Update Frontend Payment Component
**File**: `/client/src/components/StripePayment.tsx` → **Rename to**: `/client/src/components/PaynowPayment.tsx`
```typescript
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface PaynowPaymentProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaynowPayment: React.FC<PaynowPaymentProps> = ({ 
  planId, 
  planName, 
  amount, 
  onSuccess, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      console.log('🔄 Starting payment process for plan:', planId);
      
      // Create payment with Paynow
      const { data } = await api.post('/paynow/create-payment', { planId });
      console.log('✅ Payment created, redirecting to Paynow...');
      
      // Redirect to Paynow payment page
      window.location.href = data.redirectUrl;
      
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      const errorMessage = error.response?.data?.error || 'Payment failed. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
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

      {/* Payment Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-gray-700">
              <strong>Secure Payment:</strong> You'll be redirected to Paynow to complete your payment securely. 
              Your payment information is encrypted and secure.
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
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Redirecting...</span>
            </div>
          ) : (
            `Pay ${formatPrice(amount)} with Paynow`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaynowPayment;
```

### Step 7: Update Subscription Page Import
**File**: `/client/src/pages/SubscriptionPricingPage.tsx`
```typescript
// Change import
// import StripePayment from '../components/StripePayment.tsx';
import PaynowPayment from '../components/PaynowPayment.tsx';

// Update component usage in JSX (around line 400+)
<PaynowPayment
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
```

### Step 8: Update Route Registration
**File**: `/server/src/app.js` or main server file
```javascript
// Replace
// app.use('/api/v1/stripe', require('./routes/stripe.routes'));

// With
app.use('/api/v1/paynow', require('./routes/paynow.routes'));
```

### Step 9: Create Payment Success Page
**File**: `/client/src/pages/PaymentSuccessPage.tsx` (NEW FILE)
```typescript
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (reference) {
      toast.success('Payment successful! Your subscription is now active.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } else {
      navigate('/subscription');
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your subscription has been activated.</p>
        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
```

### Step 10: Update Database Model (Optional)
**File**: `/server/src/models/SubscriptionPayment.js`
```javascript
// Add Paynow-specific fields
paynowReference: {
  type: DataTypes.STRING,
  allowNull: true
},
paynowPollUrl: {
  type: DataTypes.STRING,
  allowNull: true
}
```

## 🧪 Testing the Migration

1. **Test payment creation**:
```bash
curl -X POST http://localhost:5000/api/v1/paynow/create-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId": "starter"}'
```

2. **Test webhook** (simulate Paynow callback):
```bash
curl -X POST http://localhost:5000/api/v1/paynow/webhook \
  -H "Content-Type: application/json" \
  -d '{"reference": "school_123_starter_456", "status": "Paid", "amount": "15.99"}'
```

## 📝 Migration Checklist

- [ ] Install Paynow SDK
- [ ] Update environment variables
- [ ] Create payment configuration
- [ ] Create Paynow service
- [ ] Update payment routes
- [ ] Update frontend payment component
- [ ] Update subscription page import
- [ ] Update route registration
- [ ] Create payment success page
- [ ] Test payment flow
- [ ] Test webhook handling
- [ ] Update database models (if needed)

## 🔄 Rollback Plan

If you need to rollback to Stripe:
1. Restore original environment variables
2. Restore original route imports
3. Restore original payment component
4. No database changes needed

## 📞 Support

For Paynow integration help:
- Paynow Documentation: https://developers.paynow.co.zw/
- Paynow Support: support@paynow.co.zw

---
**Note**: This guide assumes Paynow integration. For other providers (EcoCash, OneMoney, etc.), follow the same pattern but replace Paynow-specific code with your provider's API calls.