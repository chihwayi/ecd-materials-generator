const { School } = require('../models');
const { updateSchoolLimits } = require('../utils/subscription.limits');

const activateTrialPlan = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    
    if (!schoolId) {
      return res.status(400).json({ message: 'School ID not found' });
    }
    
    const school = await School.findByPk(schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    // Only allow activation if school trial is not activated yet
    if (school.subscriptionExpiresAt) {
      return res.status(400).json({ message: 'Trial already activated or school has active subscription' });
    }
    
    // Activate free trial
    const trialExpiryDate = new Date();
    trialExpiryDate.setDate(trialExpiryDate.getDate() + 30); // 30 days trial
    
    await school.update({
      subscriptionPlan: 'free',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: trialExpiryDate
    });
    
    // Update limits based on plan
    await updateSchoolLimits(school, 'free_trial');
    
    res.json({
      message: 'Free trial activated successfully',
      plan: 'free',
      expiresAt: trialExpiryDate,
      daysRemaining: 30
    });
  } catch (error) {
    console.error('Activate trial plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  activateTrialPlan
};