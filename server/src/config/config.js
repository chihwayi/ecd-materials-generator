require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgresql://ecd_user:ecd_password@localhost:5432/ecd_db',
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://ecd_user:ecd_password@localhost:5432/ecd_test_db',
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};