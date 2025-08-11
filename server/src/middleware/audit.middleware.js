const { AuditLog } = require('../models');

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after successful response
      if (res.statusCode < 400) {
        AuditLog.create({
          userId: req.user?.id,
          action,
          resource,
          resourceId: req.params.id || req.body.id,
          details: {
            method: req.method,
            url: req.originalUrl,
            body: req.method !== 'GET' ? req.body : undefined,
            statusCode: res.statusCode
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }).catch(err => console.error('Audit log error:', err));
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = { auditLog };