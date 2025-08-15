const express = require('express');
const adminSubscriptionRoutes = require('./src/routes/admin.subscription.routes');

// Create a test app
const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = {
    id: 'test-admin-id',
    role: 'system_admin',
    schoolId: 'test-school-id'
  };
  next();
});

// Use the admin subscription routes
app.use('/admin', adminSubscriptionRoutes);

// Test the subscriptions endpoint
app.get('/test', async (req, res) => {
  try {
    console.log('Testing admin subscription route...');
    
    // Mock the request
    const mockReq = {
      user: { role: 'system_admin' },
      method: 'GET',
      url: '/admin/subscriptions'
    };
    
    const mockRes = {
      json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
      },
      status: (code) => ({
        json: (data) => {
          console.log(`Status ${code}:`, JSON.stringify(data, null, 2));
        }
      })
    };
    
    // Find the route handler
    const route = adminSubscriptionRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/subscriptions'
    );
    
    if (route) {
      console.log('Route found, executing...');
      await route.handle(mockReq, mockRes, () => {});
    } else {
      console.log('Route not found');
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
  console.log(`Visit http://localhost:${process.env.PORT || 3001}/test to run the test`);
}); 