const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const materialRoutes = require('./routes/materials.routes');
const templateRoutes = require('./routes/templates.routes');
const assignmentRoutes = require('./routes/assignments');
const analyticsRoutes = require('./routes/analytics.routes');
const adminRoutes = require('./routes/admin.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const studentsRoutes = require('./routes/students');
const communicationRoutes = require('./routes/communication');
const feeRoutes = require('./routes/fees');
const financeRoutes = require('./routes/finance');
const signatureRoutes = require('./routes/signatures.routes');
const financialReportsRoutes = require('./routes/financialReports.routes');
const receiptsRoutes = require('./routes/receipts.routes');
const studentServicePreferencesRoutes = require('./routes/studentServicePreferences.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const adminSubscriptionRoutes = require('./routes/admin.subscription.routes');
const adminPlansRoutes = require('./routes/admin.plans.routes');

// Import middleware
const { authMiddleware, authenticateToken } = require('./middleware/auth.middleware');
const { allowSubscriptionRoutes } = require('./middleware/subscription.middleware');
const { logger } = require('./utils/logger');
const { connectDatabase } = require('./utils/database');

// Global maintenance mode state (shared with admin routes)
const maintenanceFile = path.join(__dirname, '../maintenance.json');

// Load maintenance mode from file
let maintenanceMode = false;
try {
  if (fs.existsSync(maintenanceFile)) {
    const data = fs.readFileSync(maintenanceFile, 'utf8');
    const config = JSON.parse(data);
    maintenanceMode = config.enabled || false;
    console.log(`Maintenance mode loaded: ${maintenanceMode}`);
  }
} catch (error) {
  console.log('Failed to load maintenance mode, defaulting to false');
  maintenanceMode = false;
}

// Save maintenance mode to file
const saveMaintenanceMode = (enabled) => {
  try {
    const config = { enabled, timestamp: new Date().toISOString() };
    fs.writeFileSync(maintenanceFile, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to save maintenance mode:', error);
  }
};

// Maintenance mode middleware
const checkMaintenanceMode = (req, res, next) => {
  // Skip maintenance check for admin routes, analytics, and health check
  if (req.path.startsWith('/api/v1/admin') || 
      req.path.startsWith('/api/v1/analytics') || 
      req.path === '/api/v1/health' || 
      req.path === '/api/v1/auth') {
    return next();
  }
  
  // Re-read maintenance mode from file for current state
  let currentMaintenanceMode = false;
  try {
    if (fs.existsSync(maintenanceFile)) {
      const data = fs.readFileSync(maintenanceFile, 'utf8');
      const config = JSON.parse(data);
      currentMaintenanceMode = config.enabled || false;
    }
  } catch (error) {
    currentMaintenanceMode = false;
  }
  
  if (currentMaintenanceMode) {
    // Check if user is system admin
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        if (decoded.role === 'system_admin') {
          return next();
        }
      } catch (error) {
        console.log('Token verification failed:', error.message);
      }
    }
    
    return res.status(503).json({ 
      message: 'System is currently under maintenance. Please try again later.',
      maintenanceMode: true 
    });
  }
  next();
};

// Export maintenance mode functions for admin routes
module.exports.getMaintenanceMode = () => maintenanceMode;
module.exports.setMaintenanceMode = (mode) => { 
  maintenanceMode = mode;
  saveMaintenanceMode(mode);
};

// Import models to initialize associations
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware - exclude webhook route for raw body access
app.use((req, res, next) => {
  if (req.path === '/api/v1/stripe/webhook') {
    // Skip JSON parsing for webhook route to preserve raw body
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.path === '/api/v1/stripe/webhook') {
    // Skip URL encoding parsing for webhook route
    return next();
  }
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Compression middleware
app.use(compression());

// Static file serving for uploads

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const brandingDir = path.join(uploadsDir, 'branding');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(brandingDir)) {
  fs.mkdirSync(brandingDir, { recursive: true });
}

console.log('Uploads directory:', uploadsDir);
console.log('Branding directory:', brandingDir);
console.log('Uploads exists:', fs.existsSync(uploadsDir));
console.log('Branding exists:', fs.existsSync(brandingDir));

// Static file serving for uploads

// Custom middleware to set CORS headers for static file responses (especially images)
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  // Allow images to be loaded cross-origin
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use('/uploads', express.static(uploadsDir));

// Image serving endpoint
app.get('/api/v1/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, 'branding', filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Test endpoint to verify uploads directory
app.get('/api/v1/test-uploads', (req, res) => {
  res.json({
    uploadsDir: uploadsDir,
    brandingDir: brandingDir,
    uploadsExists: fs.existsSync(uploadsDir),
    brandingExists: fs.existsSync(brandingDir),
    brandingFiles: fs.existsSync(brandingDir) ? fs.readdirSync(brandingDir) : []
  });
});

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  });
});

// Apply maintenance mode check to non-admin API routes
app.use('/api/v1', (req, res, next) => {
  // Skip maintenance check for admin and analytics routes
  if (req.path.startsWith('/admin') || req.path.startsWith('/analytics')) {
    return next();
  }
  checkMaintenanceMode(req, res, next);
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/students', studentsRoutes);
app.use('/api/v1/teacher', require('./routes/teacher'));
app.use('/api/v1/dashboard', require('./routes/teacher-dashboard'));
app.use('/api/v1/school-admin', require('./routes/school-admin'));
app.use('/api/v1/classes', require('./routes/classes'));
app.use('/api/v1/password-recovery', require('./routes/password-recovery'));
app.use('/api/v1/parent', require('./routes/parent'));
app.use('/api/v1/school', require('./routes/school-settings'));
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/marketplace', require('./routes/marketplace'));
app.use('/api/v1/communication', communicationRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/signatures', signatureRoutes);
app.use('/api/v1/financial-reports', financialReportsRoutes);
app.use('/api/v1/receipts', receiptsRoutes);
app.use('/api/v1/student-service-preferences', studentServicePreferencesRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/admin', adminSubscriptionRoutes);
app.use('/api/v1/admin/plans', adminPlansRoutes);
app.use('/api/v1/stripe', require('./routes/stripe.routes'));
app.use('/api/v1/finance-config', require('./routes/finance-config.routes'));
app.use('/api/v1/simple-finance', require('./routes/simple-finance.routes'));
app.use('/api/v1/school-admin-finance', require('./routes/school-admin-finance.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
