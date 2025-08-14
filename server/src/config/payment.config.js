const paymentConfig = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here',
    currency: 'usd',
    paymentMethods: ['card'],
    billingAddressCollection: 'required',
    allowPromotionCodes: true,
    supportedEvents: ['payment_intent.succeeded', 'payment_intent.payment_failed']
  },
  
  // Payment processing settings
  payment: {
    autoConfirm: true,
    captureMethod: 'automatic',
    setupFutureUsage: 'off_session',
    saveDefaultPaymentMethod: true,
  },
  
  // Subscription settings
  subscription: {
    trialDays: 30,
    prorationBehavior: 'create_prorations',
    paymentBehavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  },
  
  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ],
  
  // Error messages
  errorMessages: {
    paymentFailed: 'Payment failed. Please check your card details and try again.',
    insufficientFunds: 'Insufficient funds. Please use a different payment method.',
    cardDeclined: 'Your card was declined. Please try a different card.',
    expiredCard: 'Your card has expired. Please use a different card.',
    invalidCard: 'Invalid card details. Please check and try again.',
    networkError: 'Network error. Please check your connection and try again.',
  },
  
  // Success messages
  successMessages: {
    paymentSuccessful: 'Payment successful! Your subscription is now active.',
    subscriptionActivated: 'Subscription activated successfully!',
    trialActivated: 'Free trial activated successfully!',
  },
};

module.exports = paymentConfig;
