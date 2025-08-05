import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import receiptsService, { Receipt } from '../services/receipts.service.ts';
import { RootState } from '../store';

const ReceiptsManagementPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReceipts, setTotalReceipts] = useState(0);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [printing, setPrinting] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchReceipts();
  }, [currentPage, searchTerm]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const response = await receiptsService.getSchoolReceipts(currentPage, 20, searchTerm);
      setReceipts(response.receipts);
      setTotalPages(response.totalPages);
      setTotalReceipts(response.total);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      toast.error('Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReceipts();
  };

  const handlePrintReceipt = async (receipt: Receipt) => {
    try {
      setPrinting(receipt.id);
      await receiptsService.printReceipt(receipt.id);
      await receiptsService.markAsPrinted(receipt.id);
      toast.success('Receipt printed successfully');
      fetchReceipts(); // Refresh to update printed status
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast.error('Failed to print receipt');
    } finally {
      setPrinting(null);
    }
  };

  const handleDownloadReceipt = async (receipt: Receipt) => {
    try {
      setDownloading(receipt.id);
      await receiptsService.downloadReceipt(receipt.id, receipt.receiptNumber);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
  };

  const getPaymentMethodLabel = (method: string) => {
    return method.replace('_', ' ').toUpperCase();
  };

  const getStatusBadge = (receipt: Receipt) => {
    if (receipt.isPrinted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✅ Printed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        📄 Pending
      </span>
    );
  };

  if (user?.role !== 'finance') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🖨️ Receipts Management</h1>
          <p className="text-gray-600">Manage and print payment receipts for students</p>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalReceipts}</div>
                <div className="text-sm text-gray-500">Total Receipts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {receipts.filter(r => r.isPrinted).length}
                </div>
                <div className="text-sm text-gray-500">Printed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {receipts.filter(r => !r.isPrinted).length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search by receipt number, student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                🔍 Search
              </button>
            </form>
          </div>
        </div>

        {/* Receipts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading receipts...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
              <p className="text-gray-600">Receipts will appear here when payments are made.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receipts.map((receipt) => (
                      <tr key={receipt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {receipt.receiptNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(receipt.paymentDate)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {receipt.feeStructureName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {receipt.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {receipt.className || 'N/A'}
                            </div>
                            {receipt.parentName && (
                              <div className="text-sm text-gray-500">
                                Parent: {receipt.parentName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatAmount(receipt.amount)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getPaymentMethodLabel(receipt.paymentMethod)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {receipt.academicYear}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(receipt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewReceipt(receipt)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => handlePrintReceipt(receipt)}
                              disabled={printing === receipt.id}
                              className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                            >
                              {printing === receipt.id ? '🔄 Printing...' : '🖨️ Print'}
                            </button>
                            <button
                              onClick={() => handleDownloadReceipt(receipt)}
                              disabled={downloading === receipt.id}
                              className="text-purple-600 hover:text-purple-900 text-sm font-medium disabled:opacity-50"
                            >
                              {downloading === receipt.id ? '⬇️ Downloading...' : '⬇️ Download'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Receipt Detail Modal */}
        {showReceiptModal && selectedReceipt && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Receipt Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Receipt Number:</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.receiptNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Student:</label>
                    <p className="text-sm text-gray-900">{selectedReceipt.studentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount:</label>
                    <p className="text-sm text-gray-900">{formatAmount(selectedReceipt.amount)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Method:</label>
                    <p className="text-sm text-gray-900">{getPaymentMethodLabel(selectedReceipt.paymentMethod)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date:</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedReceipt.paymentDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <div className="mt-1">{getStatusBadge(selectedReceipt)}</div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handlePrintReceipt(selectedReceipt);
                      setShowReceiptModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Print Receipt
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

export default ReceiptsManagementPage; 