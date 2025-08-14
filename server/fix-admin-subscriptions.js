// Quick fix script to test the corrected logic
const express = require('express');
const { School, User, Student, Class, SubscriptionPayment } = require('./src/models');

async function testAdminSubscriptions() {
  try {
    // Get all schools with their subscription data
    const schools = await School.findAll();
    
    // Get users, students, and classes separately
    const allUsers = await User.findAll({ attributes: ['id', 'role', 'schoolId'] });
    const allStudents = await Student.findAll({ attributes: ['id', 'schoolId'] });
    const allClasses = await Class.findAll({ attributes: ['id', 'schoolId'] });
    
    // Group by school
    const usersBySchool = {};
    const studentsBySchool = {};
    const classesBySchool = {};
    
    allUsers.forEach(user => {
      if (!usersBySchool[user.schoolId]) usersBySchool[user.schoolId] = [];
      usersBySchool[user.schoolId].push(user);
    });
    
    allStudents.forEach(student => {
      if (!studentsBySchool[student.schoolId]) studentsBySchool[student.schoolId] = [];
      studentsBySchool[student.schoolId].push(student);
    });
    
    allClasses.forEach(cls => {
      if (!classesBySchool[cls.schoolId]) classesBySchool[cls.schoolId] = [];
      classesBySchool[cls.schoolId].push(cls);
    });

    // Get all payments for revenue calculation
    const payments = await SubscriptionPayment.findAll({
      where: { status: 'completed' },
      order: [['createdAt', 'DESC']]
    });

    // Process subscription data
    const subscriptions = [];
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let activeCount = 0;
    let trialCount = 0;
    let expiredCount = 0;
    const planDistribution = {};
    const now = new Date();

    for (const school of schools) {
      const schoolUsers = usersBySchool[school.id] || [];
      const schoolStudents = studentsBySchool[school.id] || [];
      const schoolClasses = classesBySchool[school.id] || [];
      
      const teachers = schoolUsers.filter(u => ['teacher', 'school_admin'].includes(u.role)).length;
      const students = schoolStudents.length;
      const classes = schoolClasses.length;
      
      // Get plan amount
      const planAmounts = {
        'free': 0,
        'starter': 15.99,
        'basic': 49.99,
        'professional': 99.99,
        'enterprise': 129.99
      };
      
      const planAmount = planAmounts[school.subscriptionPlan] || 0;
      const isExpired = school.subscriptionStatus === 'expired' || (school.subscriptionExpiresAt && new Date(school.subscriptionExpiresAt) <= now);
      const isTrial = school.subscriptionPlan === 'free' && !isExpired;
      const isActive = school.subscriptionPlan !== 'free' && school.subscriptionStatus === 'active' && !isExpired;
      
      console.log(`${school.name}: plan=${school.subscriptionPlan}, status=${school.subscriptionStatus}, expired=${isExpired}, trial=${isTrial}, active=${isActive}`);
      
      // Count statistics
      if (isActive) activeCount++;
      if (isTrial) trialCount++;
      if (isExpired) expiredCount++;
      
      // Plan distribution
      const planName = school.subscriptionPlan === 'free' ? 'Free Trial' : 
                      school.subscriptionPlan === 'starter' ? 'Starter Plan' :
                      school.subscriptionPlan === 'basic' ? 'Basic Plan' :
                      school.subscriptionPlan === 'professional' ? 'Professional Plan' :
                      school.subscriptionPlan === 'enterprise' ? 'Enterprise Plan' :
                      school.subscriptionPlan;
      planDistribution[planName] = (planDistribution[planName] || 0) + 1;
      
      // Revenue calculation (only for active paid subscriptions)
      if (isActive && planAmount > 0) {
        monthlyRevenue += planAmount;
      }
      
      subscriptions.push({
        id: school.id,
        schoolId: school.id,
        schoolName: school.name,
        planName: school.subscriptionPlan,
        status: isExpired ? 'expired' : isTrial ? 'trial' : 'active',
        currentPeriodStart: school.createdAt,
        currentPeriodEnd: school.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount: planAmount,
        usage: {
          teachers,
          students,
          classes
        }
      });
    }

    // Calculate total revenue from all completed payments
    totalRevenue = payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    // Additional financial metrics
    const avgRevenuePerSchool = activeCount > 0 ? monthlyRevenue / activeCount : 0;
    const conversionRate = schools.length > 0 ? (activeCount / schools.length) * 100 : 0;
    
    // Recent payments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = payments.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
    const recentRevenue = recentPayments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const stats = {
      totalSubscriptions: schools.length,
      activeSubscriptions: activeCount,
      trialSubscriptions: trialCount,
      expiredSubscriptions: expiredCount,
      cancelledSubscriptions: 0,
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      annualProjectedRevenue: parseFloat((monthlyRevenue * 12).toFixed(2)),
      avgRevenuePerSchool: parseFloat(avgRevenuePerSchool.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      recentRevenue: parseFloat(recentRevenue.toFixed(2)),
      totalPayments: payments.length,
      planDistribution
    };

    console.log('\n=== RESULTS ===');
    console.log('Subscriptions:', subscriptions.map(s => ({name: s.schoolName, status: s.status, amount: s.amount})));
    console.log('Stats:', stats);

  } catch (error) {
    console.error('Error:', error);
  }
}

testAdminSubscriptions();