const sequelize = require('../config/database.config');
const { logger } = require('./logger');

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Database connection established successfully');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('📊 Database synchronized');
    }
  } catch (error) {
    logger.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
};

const closeDatabaseConnection = async () => {
  try {
    await sequelize.close();
    logger.info('🔒 Database connection closed');
  } catch (error) {
    logger.error('❌ Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  connectDatabase,
  closeDatabaseConnection
};