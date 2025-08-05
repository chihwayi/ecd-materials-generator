const { FinancialReport, FeePayment, StudentFee, FeeStructure, Student, User, School } = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

// Generate comprehensive financial analytics
const generateFinancialAnalytics = async (schoolId, startDate, endDate) => {
  try {
    console.log('Generating analytics for school:', schoolId, 'from', startDate, 'to', endDate);
    
    // Get all fee payments in the date range
    const payments = await FeePayment.findAll({
      include: [
        {
          model: StudentFee,
          as: 'studentFee',
          include: [
            {
              model: Student,
              as: 'student',
              where: { schoolId }
            },
            {
              model: FeeStructure,
              as: 'feeStructure'
            }
          ]
        },
        {
          model: User,
          as: 'recordedByUser',
          attributes: ['firstName', 'lastName']
        }
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        schoolId: schoolId
      },
      order: [['createdAt', 'ASC']]
    });

    console.log('Found payments:', payments.length);

    // Get outstanding fees
    const outstandingFees = await StudentFee.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          where: { schoolId }
        },
        {
          model: FeeStructure,
          as: 'feeStructure'
        }
      ],
      where: {
        isActive: true
      }
    });

    console.log('Found outstanding fees:', outstandingFees.length);

    // Calculate revenue metrics
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const totalPayments = payments.length;
    const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    // Calculate outstanding amounts
    const totalOutstanding = outstandingFees.reduce((sum, fee) => {
      const paidAmount = fee.payments?.reduce((paid, payment) => paid + parseFloat(payment.amount), 0) || 0;
      return sum + (parseFloat(fee.amount) - paidAmount);
    }, 0);

    // If no data, return default structure
    if (totalPayments === 0 && outstandingFees.length === 0) {
      console.log('No financial data found, returning default structure');
      return {
        summary: {
          totalRevenue: 0,
          totalPayments: 0,
          averagePayment: 0,
          totalOutstanding: 0,
          recentRevenue: 0,
          paymentSuccessRate: 0
        },
        breakdowns: {
          monthlyRevenue: {},
          paymentMethods: {},
          feeStructureBreakdown: {},
          studentPaymentStats: {}
        },
        trends: {
          recentPayments: 0,
          recentRevenue: 0,
          averageDailyRevenue: 0
        },
        outstanding: {
          totalOutstanding: 0,
          outstandingStudents: 0,
          averageOutstandingPerStudent: 0
        }
      };
    }

    // Monthly revenue breakdown
    const monthlyRevenue = {};
    payments.forEach(payment => {
      const month = payment.createdAt.toISOString().slice(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(payment.amount);
    });

    // Payment method breakdown
    const paymentMethods = {};
    payments.forEach(payment => {
      const method = payment.paymentMethod || 'Unknown';
      paymentMethods[method] = (paymentMethods[method] || 0) + parseFloat(payment.amount);
    });

    // Fee structure breakdown
    const feeStructureBreakdown = {};
    payments.forEach(payment => {
      const structureName = payment.studentFee?.feeStructure?.name || 'Unknown';
      feeStructureBreakdown[structureName] = (feeStructureBreakdown[structureName] || 0) + parseFloat(payment.amount);
    });

    // Recent payment trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = payments.filter(payment => payment.createdAt >= thirtyDaysAgo);
    const recentRevenue = recentPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    // Student payment statistics
    const studentPaymentStats = {};
    payments.forEach(payment => {
      const studentName = `${payment.studentFee?.student?.firstName} ${payment.studentFee?.student?.lastName}`;
      if (!studentPaymentStats[studentName]) {
        studentPaymentStats[studentName] = {
          totalPaid: 0,
          paymentCount: 0,
          lastPayment: null
        };
      }
      studentPaymentStats[studentName].totalPaid += parseFloat(payment.amount);
      studentPaymentStats[studentName].paymentCount += 1;
      if (!studentPaymentStats[studentName].lastPayment || payment.createdAt > studentPaymentStats[studentName].lastPayment) {
        studentPaymentStats[studentName].lastPayment = payment.createdAt;
      }
    });

    console.log('Analytics calculation complete:', {
      totalPayments,
      totalRevenue,
      totalOutstanding,
      outstandingFeesCount: outstandingFees.length
    });

    return {
      summary: {
        totalRevenue,
        totalPayments,
        averagePayment,
        totalOutstanding,
        recentRevenue,
        paymentSuccessRate: totalPayments > 0 ? 100 : 0
      },
      breakdowns: {
        monthlyRevenue,
        paymentMethods,
        feeStructureBreakdown,
        studentPaymentStats
      },
      trends: {
        recentPayments: recentPayments.length,
        recentRevenue,
        averageDailyRevenue: recentPayments.length > 0 ? recentRevenue / 30 : 0
      },
      outstanding: {
        totalOutstanding,
        outstandingStudents: outstandingFees.length,
        averageOutstandingPerStudent: outstandingFees.length > 0 ? totalOutstanding / outstandingFees.length : 0
      }
    };
  } catch (error) {
    console.error('Error generating financial analytics:', error);
    throw error;
  }
};

// Generate specific report types
const generateReport = async (req, res) => {
  try {
    console.log('--- GENERATE REPORT REQUEST BODY ---');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const { reportType, startDate, endDate, reportName } = req.body;
    const schoolId = req.user?.schoolId;
    const userId = req.user?.id;

    console.log('Generating report:', { reportType, startDate, endDate, schoolId, userId });

    if (!schoolId || !userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Generate analytics data with error handling
    let analytics;
    try {
      analytics = await generateFinancialAnalytics(schoolId, new Date(startDate), new Date(endDate));
    } catch (analyticsError) {
      console.error('Analytics generation failed:', analyticsError);
      // Return empty analytics structure
      analytics = {
        summary: { totalRevenue: 0, totalPayments: 0, averagePayment: 0, totalOutstanding: 0, recentRevenue: 0, paymentSuccessRate: 0 },
        breakdowns: { monthlyRevenue: {}, paymentMethods: {}, feeStructureBreakdown: {}, studentPaymentStats: {} },
        trends: { recentPayments: 0, recentRevenue: 0, averageDailyRevenue: 0 },
        outstanding: { totalOutstanding: 0, outstandingStudents: 0, averageOutstandingPerStudent: 0 }
      };
    }
    
    console.log('Analytics generated:', {
      totalPayments: analytics.summary.totalPayments,
      totalRevenue: analytics.summary.totalRevenue
    });

    // Prepare report data based on type
    let reportData = {};
    let exportData = {};

    switch (reportType) {
      case 'revenue':
        reportData = {
          totalRevenue: analytics.summary.totalRevenue,
          monthlyBreakdown: analytics.breakdowns.monthlyRevenue,
          paymentMethods: analytics.breakdowns.paymentMethods,
          feeStructureBreakdown: analytics.breakdowns.feeStructureBreakdown,
          trends: analytics.trends
        };
        exportData = {
          headers: ['Month', 'Revenue', 'Payment Count'],
          data: Object.entries(analytics.breakdowns.monthlyRevenue).map(([month, revenue]) => [month, revenue, analytics.summary.totalPayments])
        };
        break;

      case 'expenses':
        // For now, we'll focus on fee collection as "expenses" are typically school costs
        reportData = {
          outstandingFees: analytics.outstanding,
          collectionRate: analytics.summary.paymentSuccessRate,
          averagePayment: analytics.summary.averagePayment
        };
        break;

      case 'payment_trends':
        reportData = {
          trends: analytics.trends,
          monthlyRevenue: analytics.breakdowns.monthlyRevenue,
          paymentMethods: analytics.breakdowns.paymentMethods,
          recentActivity: analytics.summary.recentRevenue
        };
        break;

      case 'fee_collection':
        reportData = {
          totalCollected: analytics.summary.totalRevenue,
          outstandingAmount: analytics.outstanding.totalOutstanding,
          collectionRate: (analytics.summary.totalRevenue / (analytics.summary.totalRevenue + analytics.outstanding.totalOutstanding)) * 100,
          studentBreakdown: analytics.breakdowns.studentPaymentStats
        };
        break;

      case 'outstanding_fees':
        reportData = {
          totalOutstanding: analytics.outstanding.totalOutstanding,
          outstandingStudents: analytics.outstanding.outstandingStudents,
          averageOutstanding: analytics.outstanding.averageOutstandingPerStudent,
          studentDetails: analytics.breakdowns.studentPaymentStats
        };
        break;

      case 'monthly_summary':
        reportData = {
          month: new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          revenue: analytics.summary.totalRevenue,
          payments: analytics.summary.totalPayments,
          outstanding: analytics.outstanding.totalOutstanding,
          trends: analytics.trends
        };
        break;

      case 'quarterly_summary':
        reportData = {
          quarter: `Q${Math.ceil((new Date(startDate).getMonth() + 1) / 3)} ${new Date(startDate).getFullYear()}`,
          revenue: analytics.summary.totalRevenue,
          payments: analytics.summary.totalPayments,
          outstanding: analytics.outstanding.totalOutstanding,
          monthlyBreakdown: analytics.breakdowns.monthlyRevenue
        };
        break;

      case 'yearly_summary':
        reportData = {
          year: new Date(startDate).getFullYear(),
          revenue: analytics.summary.totalRevenue,
          payments: analytics.summary.totalPayments,
          outstanding: analytics.outstanding.totalOutstanding,
          monthlyBreakdown: analytics.breakdowns.monthlyRevenue,
          trends: analytics.trends
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Save report to database with error handling
    let report;
    try {
      report = await FinancialReport.create({
        schoolId,
        reportType,
        reportName: reportName || `${reportType.replace('_', ' ')} Report`,
        dateRange: { startDate, endDate },
        reportData,
        exportData,
        generatedBy: userId,
        isActive: true
      });
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      // Return report without saving to database
      return res.json({
        success: true,
        message: 'Report generated successfully (not saved to database)',
        report: {
          id: 'temp-' + Date.now(),
          reportType,
          reportName: reportName || `${reportType.replace('_', ' ')} Report`,
          dateRange: { startDate, endDate },
          reportData,
          createdAt: new Date()
        }
      });
    }

    res.json({
      success: true,
      message: 'Report generated successfully',
      report: {
        id: report.id,
        reportType: report.reportType,
        reportName: report.reportName,
        dateRange: report.dateRange,
        reportData: report.reportData,
        createdAt: report.createdAt
      }
    });
  } catch (error) {
    console.error('--- ERROR GENERATING REPORT ---');
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    console.error('User:', req.user);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message,
      stack: error.stack
    });
  }
};

// Get all reports for a school
const getSchoolReports = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const reports = await FinancialReport.findAll({
      where: {
        schoolId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'generatedByUser',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      reports: reports.map(report => ({
        id: report.id,
        reportType: report.reportType,
        reportName: report.reportName,
        dateRange: report.dateRange,
        createdAt: report.createdAt,
        generatedBy: report.generatedByUser
      }))
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

// Get specific report
const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await FinancialReport.findOne({
      where: {
        id: reportId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'generatedByUser',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report: {
        id: report.id,
        reportType: report.reportType,
        reportName: report.reportName,
        dateRange: report.dateRange,
        reportData: report.reportData,
        exportData: report.exportData,
        createdAt: report.createdAt,
        generatedBy: report.generatedByUser
      }
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await FinancialReport.findOne({
      where: {
        id: reportId,
        isActive: true
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.update({ isActive: false });

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

// Export report to PDF/Excel
const exportReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format = 'pdf' } = req.query;

    const report = await FinancialReport.findOne({
      where: {
        id: reportId,
        isActive: true
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // For now, return the export data
    // In a real implementation, you would generate PDF/Excel files
    res.json({
      success: true,
      message: `${format.toUpperCase()} export ready`,
      exportData: report.exportData,
      reportName: report.reportName
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};

module.exports = {
  generateReport,
  getSchoolReports,
  getReport,
  deleteReport,
  exportReport,
  generateFinancialAnalytics
}; 