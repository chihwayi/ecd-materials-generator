const { SubscriptionPlan } = require('../models');

const updateSchoolLimits = async (school, planId) => {
  const plan = await SubscriptionPlan.findOne({ where: { planId } });
  
  if (plan) {
    await school.update({
      maxTeachers: plan.maxTeachers,
      maxStudents: plan.maxStudents
    });
  }
};

module.exports = {
  updateSchoolLimits
};