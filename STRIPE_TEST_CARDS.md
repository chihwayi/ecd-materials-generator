# Stripe Test Card Numbers

## Successful Payment Cards

### Visa
- **4242424242424242** - Visa (US)
- **4000000000000002** - Visa (US) - Charge succeeds and funds will be added directly to your available balance
- **4000000000009995** - Visa (US) - Charge succeeds with a risk_level of elevated
- **4000000000009987** - Visa (US) - Charge succeeds with a risk_level of highest

### Mastercard
- **5555555555554444** - Mastercard (US)
- **5200828282828210** - Mastercard (US)
- **5105105105105100** - Mastercard (US)

### American Express
- **378282246310005** - American Express (US)
- **371449635398431** - American Express (US)

### Discover
- **6011111111111117** - Discover (US)
- **6011000990139424** - Discover (US)

### Diners Club
- **30569309025904** - Diners Club (US)
- **38520000023237** - Diners Club (US)

### JCB
- **3530111333300000** - JCB (US)
- **3566002020360505** - JCB (US)

## International Cards

### UK
- **4000000000000002** - Visa (UK)
- **4000008260000000** - Visa (UK)

### Canada
- **4000001240000000** - Visa (Canada)

### Australia
- **4000000360000006** - Visa (Australia)

### Brazil
- **4000000760000002** - Visa (Brazil)

### Mexico
- **4000004840000008** - Visa (Mexico)

## Declined Payment Cards

### Generic Declines
- **4000000000000002** - Generic decline
- **4000000000000069** - Expired card decline
- **4000000000000127** - Incorrect CVC decline
- **4000000000000119** - Processing error decline

### Specific Decline Reasons
- **4000000000000002** - Card declined (generic)
- **4000000000000069** - Card expired
- **4000000000000127** - Incorrect CVC
- **4000000000000119** - Processing error
- **4000000000000101** - Card declined (insufficient funds)
- **4000000000000036** - Card declined (lost card)
- **4000000000000020** - Card declined (stolen card)
- **4000000000000028** - Card declined (pickup card)
- **4000000000000044** - Card declined (restricted card)
- **4000000000000093** - Card declined (security violation)
- **4000000000000010** - Card declined (call issuer)
- **4000000000000004** - Card declined (do not honor)

## 3D Secure Authentication

### Authentication Required
- **4000002500003155** - Visa - Authentication required
- **4000002760003184** - Visa - Authentication required (frictionless)
- **4000008400001629** - Visa - Authentication required (challenge)

### Authentication Failed
- **4000008400001280** - Visa - Authentication fails

## Special Test Cases

### Disputes and Chargebacks
- **4000000000000259** - Visa - Charge succeeds but will receive a chargeback
- **4000000000001976** - Visa - Charge succeeds but will receive a fraudulent chargeback
- **4000000000005423** - Visa - Charge succeeds but will receive an inquiry

### Refunds
- **4000000000005126** - Visa - Charge succeeds but refund will fail

## Test Details

### CVV/CVC
- Use any 3-digit CVC (4 digits for American Express)
- Common test values: **123**, **456**, **789**

### Expiry Date
- Use any future date
- Format: **MM/YY**
- Common test values: **12/25**, **01/26**, **06/27**

### ZIP/Postal Code
- Use any valid postal code
- US: **12345**, **90210**, **10001**
- UK: **SW1A 1AA**, **M1 1AA**
- Canada: **K1A 0A6**, **M5V 3A8**

## Usage Notes

1. **Amount Testing**: All cards work with any amount in test mode
2. **Currency**: Test with different currencies by changing the payment intent currency
3. **Webhooks**: Use Stripe CLI to test webhooks locally: `stripe listen --forward-to localhost:5000/api/v1/stripe/webhook`
4. **3D Secure**: Some cards require additional authentication steps
5. **International**: Use international cards to test different country-specific behaviors

## Webhook Testing

To test webhooks locally:
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:5000/api/v1/stripe/webhook

# This will give you a webhook signing secret starting with whsec_
# Add this to your .env file as STRIPE_WEBHOOK_SECRET
```