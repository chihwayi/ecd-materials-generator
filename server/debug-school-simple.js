const { User, School } = require('./src/models');

async function debugSchool() {
  try {
    // Find the user
    const user = await User.findOne({ where: { email: 'ichihwayi@gmail.com' } });
    console.log('User:', {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      schoolId: user?.schoolId
    });
    
    if (user?.schoolId) {
      const school = await School.findByPk(user.schoolId);
      console.log('School:', {
        id: school?.id,
        name: school?.name,
        subscriptionPlan: school?.subscriptionPlan,
        subscriptionExpiresAt: school?.subscriptionExpiresAt,
        contactEmail: school?.contactEmail
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
  process.exit(0);
}

debugSchool();