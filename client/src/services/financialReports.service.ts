import api from './api';

export interface FinancialReport {
  id: string;
  reportType: 'revenue' | 'expenses' | 'payment_trends' | 'fee_collection' | 'outstanding_fees' | 'monthly_summary' | 'quarterly_summary' | 'yearly_summary';
  reportName: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  reportData: any;
  exportData?: any;
  createdAt: string;
  generatedBy: {
    firstName: string;
    lastName: string;
  };
}

export interface GenerateReportData {
  reportType: 'revenue' | 'expenses' | 'payment_trends' | 'fee_collection' | 'outstanding_fees' | 'monthly_summary' | 'quarterly_summary' | 'yearly_summary';
  startDate: string;
  endDate: string;
  reportName?: string;
}

class FinancialReportsService {
  // Generate new financial report
  async generateReport(data: GenerateReportData): Promise<{ success: boolean; message: string; report?: FinancialReport }> {
    try {
      const response = await api.post('/financial-reports/generate', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to generate report:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate report'
      };
    }
  }

  // Get all reports for a school
  async getSchoolReports(schoolId: string): Promise<FinancialReport[]> {
    try {
      const response = await api.get(`/financial-reports/school/${schoolId}`);
      return response.data.success ? response.data.reports : [];
    } catch (error) {
      console.error('Failed to fetch school reports:', error);
      return [];
    }
  }

  // Get specific report
  async getReport(reportId: string): Promise<FinancialReport | null> {
    try {
      const response = await api.get(`/financial-reports/${reportId}`);
      return response.data.success ? response.data.report : null;
    } catch (error) {
      console.error('Failed to fetch report:', error);
      return null;
    }
  }

  // Delete report
  async deleteReport(reportId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/financial-reports/${reportId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete report'
      };
    }
  }

  // Export report
  async exportReport(reportId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<{ success: boolean; message: string; exportData?: any; reportName?: string }> {
    try {
      const response = await api.get(`/financial-reports/${reportId}/export?format=${format}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to export report:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to export report'
      };
    }
  }

  // Get report types for dropdown
  getReportTypes() {
    return [
      { value: 'revenue', label: '💰 Revenue Report', description: 'Total revenue and payment breakdowns' },
      { value: 'expenses', label: '💸 Expenses Report', description: 'Fee collection and outstanding amounts' },
      { value: 'payment_trends', label: '📈 Payment Trends', description: 'Payment patterns and trends over time' },
      { value: 'fee_collection', label: '📊 Fee Collection', description: 'Detailed fee collection analysis' },
      { value: 'outstanding_fees', label: '⚠️ Outstanding Fees', description: 'Students with pending payments' },
      { value: 'monthly_summary', label: '📅 Monthly Summary', description: 'Monthly financial overview' },
      { value: 'quarterly_summary', label: '📊 Quarterly Summary', description: 'Quarterly financial analysis' },
      { value: 'yearly_summary', label: '📈 Yearly Summary', description: 'Annual financial performance' }
    ];
  }

  // Get date range presets
  getDateRangePresets() {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const currentYear = new Date(now.getFullYear(), 0, 1);

    return [
      {
        label: 'This Month',
        value: 'this_month',
        startDate: currentMonth.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      },
      {
        label: 'Last Month',
        value: 'last_month',
        startDate: lastMonth.toISOString().split('T')[0],
        endDate: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
      },
      {
        label: 'This Quarter',
        value: 'this_quarter',
        startDate: currentQuarter.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      },
      {
        label: 'This Year',
        value: 'this_year',
        startDate: currentYear.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      },
      {
        label: 'Last 30 Days',
        value: 'last_30_days',
        startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      },
      {
        label: 'Last 90 Days',
        value: 'last_90_days',
        startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      }
    ];
  }
}

export default new FinancialReportsService(); 