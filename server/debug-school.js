const { User, School } = require('./src/models');

async function debugSchool() {
  try {
    // Find the user
    const user = await User.findOne({ 
      where: { email: 'ichihwayi@gmail.com' },
      include: [{ model: School, attributes: ['id', 'name', 'subscriptionPlan', 'subscriptionExpiresAt', 'subscriptionStatus'] }]
    });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('User Details:');
    console.log({
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
      isActive: user.isActive
    });
    
    if (user.schoolId) {
      const school = await School.findByPk(user.schoolId);
      console.log('\nSchool Details:');
      console.log({
        id: school.id,
        name: school.name,
        subscriptionPlan: school.subscriptionPlan,
        subscriptionStatus: school.subscriptionStatus,
        subscriptionExpiresAt: school.subscriptionExpiresAt,
        createdAt: school.createdAt
      });
    } else {
      console.log('\nNo school associated with user');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

debugSchool();