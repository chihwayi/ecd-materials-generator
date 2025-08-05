const { Sequelize } = require('sequelize');
const config = require('./src/config/config.js');

const sequelize = new Sequelize(config.development);

async function checkAndCreateTables() {
  try {
    console.log('Checking subscription tables...');
    
    // Check if Subscription table exists
    const subscriptionExists = await sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Subscription')",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('Subscription table exists:', subscriptionExists[0].exists);
    
    if (!subscriptionExists[0].exists) {
      console.log('Creating Subscription table...');
      
      await sequelize.query(`
        CREATE TABLE "Subscription" (
          "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          "school_id" UUID NOT NULL REFERENCES "Schools"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "plan_id" VARCHAR(255) NOT NULL,
          "plan_name" VARCHAR(255) NOT NULL DEFAULT 'free',
          "status" VARCHAR(255) NOT NULL DEFAULT 'active',
          "stripe_customer_id" VARCHAR(255),
          "stripe_subscription_id" VARCHAR(255),
          "current_period_start" TIMESTAMP WITH TIME ZONE,
          "current_period_end" TIMESTAMP WITH TIME ZONE,
          "trial_start" TIMESTAMP WITH TIME ZONE,
          "trial_end" TIMESTAMP WITH TIME ZONE,
          "cancel_at_period_end" BOOLEAN DEFAULT false,
          "cancelled_at" TIMESTAMP WITH TIME ZONE,
          "metadata" JSONB,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `);
      
      console.log('Subscription table created successfully');
    }
    
    // Check if SubscriptionPayment table exists
    const paymentExists = await sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'SubscriptionPayment')",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    console.log('SubscriptionPayment table exists:', paymentExists[0].exists);
    
    if (!paymentExists[0].exists) {
      console.log('Creating SubscriptionPayment table...');
      
      await sequelize.query(`
        CREATE TABLE "SubscriptionPayment" (
          "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          "subscription_id" UUID NOT NULL REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "school_id" UUID NOT NULL REFERENCES "Schools"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "stripe_payment_intent_id" VARCHAR(255),
          "stripe_invoice_id" VARCHAR(255),
          "amount" DECIMAL(10,2) NOT NULL,
          "currency" VARCHAR(255) DEFAULT 'usd',
          "status" VARCHAR(255) NOT NULL DEFAULT 'pending',
          "payment_method" VARCHAR(255),
          "description" VARCHAR(255),
          "period_start" TIMESTAMP WITH TIME ZONE,
          "period_end" TIMESTAMP WITH TIME ZONE,
          "metadata" JSONB,
          "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `);
      
      console.log('SubscriptionPayment table created successfully');
    }
    
    // Create indexes
    console.log('Creating indexes...');
    
    try {
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_school_id" ON "Subscription" ("school_id")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_stripe_subscription_id" ON "Subscription" ("stripe_subscription_id")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_status" ON "Subscription" ("status")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_payment_subscription_id" ON "SubscriptionPayment" ("subscription_id")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_payment_school_id" ON "SubscriptionPayment" ("school_id")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_payment_stripe_payment_intent_id" ON "SubscriptionPayment" ("stripe_payment_intent_id")');
      await sequelize.query('CREATE INDEX IF NOT EXISTS "subscription_payment_status" ON "SubscriptionPayment" ("status")');
      
      console.log('Indexes created successfully');
    } catch (error) {
      console.log('Some indexes already exist:', error.message);
    }
    
    console.log('All subscription tables and indexes are ready!');
    
  } catch (error) {
    console.error('Error checking/creating tables:', error);
  } finally {
    await sequelize.close();
  }
}

checkAndCreateTables(); 