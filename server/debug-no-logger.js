require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecd_db',
  process.env.DB_USER || 'ecd_user', 
  process.env.DB_PASSWORD || 'ecd_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM('teacher', 'school_admin', 'parent', 'system_admin', 'finance'), allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  schoolId: { type: DataTypes.UUID, field: 'school_id' }
});

const School = sequelize.define('School', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  contactEmail: { type: DataTypes.STRING },
  subscriptionPlan: { type: DataTypes.ENUM('free', 'basic', 'premium'), defaultValue: 'free' },
  subscriptionExpiresAt: { type: DataTypes.DATE, field: 'subscription_expires_at' }
});

async function debug() {
  try {
    const user = await User.findOne({ where: { email: 'ichihwayi@gmail.com' } });
    console.log('User:', user ? {
      id: user.id,
      email: user.email, 
      role: user.role,
      schoolId: user.schoolId
    } : 'Not found');
    
    if (user?.schoolId) {
      const school = await School.findByPk(user.schoolId);
      console.log('School:', school ? {
        id: school.id,
        name: school.name,
        subscriptionPlan: school.subscriptionPlan,
        subscriptionExpiresAt: school.subscriptionExpiresAt,
        contactEmail: school.contactEmail
      } : 'Not found');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

debug();