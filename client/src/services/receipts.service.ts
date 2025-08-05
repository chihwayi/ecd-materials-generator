import api from './api';

export interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  schoolId: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  academicYear: string;
  term?: string;
  month?: string;
  feeStructureName: string;
  studentName: string;
  parentName?: string;
  className?: string;
  recordedBy: string;
  recordedByName: string;
  notes?: string;
  isPrinted: boolean;
  printedAt?: string;
  printedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReceiptData {
  paymentId: string;
}

class ReceiptsService {
  // Create receipt from payment
  async createReceipt(data: CreateReceiptData): Promise<{ success: boolean; message: string; receipt: Receipt }> {
    const response = await api.post('/receipts/create', data);
    return response.data;
  }

  // Get receipt by ID
  async getReceipt(receiptId: string): Promise<{ success: boolean; receipt: Receipt }> {
    const response = await api.get(`/receipts/${receiptId}`);
    return response.data;
  }

  // Get all receipts for school
  async getSchoolReceipts(page = 1, limit = 20, search?: string): Promise<{
    success: boolean;
    receipts: Receipt[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/receipts/school/all?${params.toString()}`);
    return response.data;
  }

  // Generate PDF receipt
  async generatePDFReceipt(receiptId: string): Promise<Blob> {
    const response = await api.get(`/receipts/${receiptId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Mark receipt as printed
  async markAsPrinted(receiptId: string): Promise<{ success: boolean; message: string; receipt: Receipt }> {
    const response = await api.put(`/receipts/${receiptId}/print`);
    return response.data;
  }

  // Download PDF receipt
  async downloadReceipt(receiptId: string, receiptNumber: string): Promise<void> {
    const blob = await this.generatePDFReceipt(receiptId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${receiptNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Print receipt
  async printReceipt(receiptId: string): Promise<void> {
    try {
      // Method 1: Try PDF printing first
      const blob = await this.generatePDFReceipt(receiptId);
      const url = window.URL.createObjectURL(blob);
      
      // Try opening in new window first
      const printWindow = window.open(url, '_blank', 'width=800,height=600');
      
      if (printWindow) {
        printWindow.onload = () => {
          // Wait longer for the PDF to fully load
          setTimeout(() => {
            try {
              printWindow.focus(); // Focus the window
              printWindow.print();
              // Keep window open longer to ensure print dialog completes
              setTimeout(() => {
                printWindow.close();
                window.URL.revokeObjectURL(url);
              }, 5000);
            } catch (printError) {
              console.error('Print error:', printError);
              printWindow.close();
              window.URL.revokeObjectURL(url);
            }
          }, 1000);
        };
      } else {
        // Method 2: Fallback to iframe method
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
              setTimeout(() => {
                document.body.removeChild(iframe);
                window.URL.revokeObjectURL(url);
              }, 5000);
            } catch (printError) {
              console.error('Print error:', printError);
              document.body.removeChild(iframe);
              window.URL.revokeObjectURL(url);
            }
          }, 1000);
        };
      }
    } catch (error) {
      console.error('Error printing receipt:', error);
      // Method 3: Fallback to direct printing if PDF fails
      await this.printReceiptDirect(receiptId);
    }
  }

  // Direct print method (fallback)
  async printReceiptDirect(receiptId: string): Promise<void> {
    try {
      const receipt = await this.getReceipt(receiptId);
      if (!receipt.success) {
        throw new Error('Failed to get receipt data');
      }

      // Create print-friendly HTML
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt ${receipt.receipt.receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 20px; font-weight: bold; }
            @media print { 
              body { margin: 0; }
              .receipt { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>PAYMENT RECEIPT</h2>
              <p>Receipt #: ${receipt.receipt.receiptNumber}</p>
              <p>Date: ${new Date(receipt.receipt.paymentDate).toLocaleDateString()}</p>
            </div>
            <div class="row">
              <span>Student:</span>
              <span>${receipt.receipt.studentName}</span>
            </div>
            <div class="row">
              <span>Amount:</span>
              <span>$${receipt.receipt.amount.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Payment Method:</span>
              <span>${receipt.receipt.paymentMethod}</span>
            </div>
            <div class="row">
              <span>Fee Structure:</span>
              <span>${receipt.receipt.feeStructureName}</span>
            </div>
            <div class="row">
              <span>Recorded By:</span>
              <span>${receipt.receipt.recordedByName}</span>
            </div>
            ${receipt.receipt.notes ? `<div class="row"><span>Notes:</span><span>${receipt.receipt.notes}</span></div>` : ''}
            <div class="total">
              <div class="row">
                <span>TOTAL PAID:</span>
                <span>$${receipt.receipt.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <script>
            // Auto-print when page loads
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.close();
                }, 3000);
              }, 1000);
            };
          </script>
        </body>
        </html>
      `;

      // Create a new window with the receipt content
      const printWindow = window.open('', '_blank', 'width=600,height=800');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Fallback if script doesn't work
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
            setTimeout(() => {
              printWindow.close();
            }, 5000);
          } catch (printError) {
            console.error('Print error:', printError);
            printWindow.close();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error in direct printing:', error);
      throw error;
    }
  }

  // Test print function
  async testPrint(): Promise<void> {
    const testContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Print</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .test { border: 2px solid #000; padding: 20px; max-width: 400px; text-align: center; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="test">
          <h2>TEST PRINT</h2>
          <p>This is a test print to verify printing works.</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Time: ${new Date().toLocaleTimeString()}</p>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.close();
              }, 3000);
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(testContent);
      printWindow.document.close();
      
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 5000);
        } catch (printError) {
          console.error('Test print error:', printError);
          printWindow.close();
        }
      }, 2000);
    }
  }
}

const receiptsService = new ReceiptsService();
export default receiptsService; 