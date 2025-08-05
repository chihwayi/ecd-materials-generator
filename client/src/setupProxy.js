const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy uploads directory to backend (must come before API proxy)
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      logLevel: 'debug',
    })
  );

  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
}; 