import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import financialReportsService, { FinancialReport, GenerateReportData } from '../services/financialReports.service.ts';
import { RootState } from '../store';

const FinancialReportsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [formData, setFormData] = useState<GenerateReportData>({
    reportType: 'revenue',
    startDate: '',
    endDate: '',
    reportName: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const schoolReports = await financialReportsService.getSchoolReports(user?.schoolId || '');
      setReports(schoolReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    setGenerating(true);
    try {
      const result = await financialReportsService.generateReport(formData);
      if (result.success) {
        toast.success('Report generated successfully!');
        setShowGenerateForm(false);
        setFormData({
          reportType: 'revenue',
          startDate: '',
          endDate: '',
          reportName: ''
        });
        await fetchReports();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const result = await financialReportsService.deleteReport(reportId);
      if (result.success) {
        toast.success('Report deleted successfully!');
        await fetchReports();
        if (selectedReport?.id === reportId) {
          setSelectedReport(null);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast.error('Failed to delete report');
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'excel') => {
    try {
      const result = await financialReportsService.exportReport(reportId, format);
      if (result.success) {
        toast.success(`${format.toUpperCase()} export ready!`);
        // In a real implementation, you would download the file
        console.log('Export data:', result.exportData);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      toast.error('Failed to export report');
    }
  };

  const handleDateRangePreset = (preset: any) => {
    setFormData(prev => ({
      ...prev,
      startDate: preset.startDate,
      endDate: preset.endDate
    }));
  };

  const renderReportData = (report: FinancialReport) => {
    const data = report.reportData;
    
    switch (report.reportType) {
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800">💰 Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600">${data.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800">📊 Total Payments</h3>
                <p className="text-2xl font-bold text-blue-600">{data.totalPayments || 0}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800">📈 Average Payment</h3>
                <p className="text-2xl font-bold text-purple-600">${data.averagePayment?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            
            {data.monthlyBreakdown && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Monthly Revenue Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(data.monthlyBreakdown).map(([month, revenue]) => (
                    <div key={month} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{month}</span>
                      <span className="text-green-600 font-semibold">${(revenue as number).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'outstanding_fees':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800">⚠️ Total Outstanding</h3>
                <p className="text-2xl font-bold text-red-600">${data.totalOutstanding?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-800">👥 Outstanding Students</h3>
                <p className="text-2xl font-bold text-orange-600">{data.outstandingStudents || 0}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800">📊 Average Outstanding</h3>
                <p className="text-2xl font-bold text-yellow-600">${data.averageOutstanding?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        );

      case 'fee_collection':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800">💰 Total Collected</h3>
                <p className="text-2xl font-bold text-green-600">${data.totalCollected?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800">📊 Collection Rate</h3>
                <p className="text-2xl font-bold text-blue-600">{data.collectionRate?.toFixed(1) || '0'}%</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Report Data</h3>
            <pre className="text-sm text-gray-600 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                📊 Financial Reports & Analytics
              </h1>
              <p className="text-green-100 text-lg">
                Comprehensive financial insights and detailed reports for your school
              </p>
            </div>
            <div className="text-6xl opacity-20">💹</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Reports</h2>
                  <button
                    onClick={() => setShowGenerateForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ➕ New Report
                  </button>
                </div>
              </div>

              <div className="p-6">
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-600">No reports generated yet</p>
                    <button
                      onClick={() => setShowGenerateForm(true)}
                      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Generate First Report
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedReport?.id === report.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.reportName}</h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {report.reportType.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(report.dateRange.startDate).toLocaleDateString()} - {new Date(report.dateRange.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportReport(report.id, 'pdf');
                              }}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              PDF
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReport(report.id);
                              }}
                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedReport.reportName}</h2>
                      <p className="text-sm text-gray-600">
                        Generated by {selectedReport.generatedBy.firstName} {selectedReport.generatedBy.lastName} on{' '}
                        {new Date(selectedReport.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExportReport(selectedReport.id, 'pdf')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        📄 Export PDF
                      </button>
                      <button
                        onClick={() => handleExportReport(selectedReport.id, 'excel')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        📊 Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {renderReportData(selectedReport)}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Report</h3>
                <p className="text-gray-600">Choose a report from the list to view detailed analytics</p>
              </div>
            )}
          </div>
        </div>

        {/* Generate Report Modal */}
        {showGenerateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate New Report</h2>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Report Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {financialReportsService.getReportTypes().map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Date Ranges</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {financialReportsService.getDateRangePresets().map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handleDateRangePreset(preset)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Report Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.reportName}
                    onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
                    placeholder="Enter a custom name for this report"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowGenerateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className={`px-6 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
                      generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                  >
                    {generating ? '🔄 Generating...' : '📊 Generate Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReportsPage; 