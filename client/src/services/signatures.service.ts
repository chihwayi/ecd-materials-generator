import api from './api';

export interface Signature {
  id: string;
  signatureData: string;
  signatureType: 'teacher' | 'principal' | 'admin';
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface SignatureUploadData {
  signatureData: string;
  signatureType: 'teacher' | 'principal' | 'admin';
}

class SignatureService {
  // Get current user's signature
  async getMySignature(): Promise<Signature | null> {
    try {
      const response = await api.get('/signatures/my-signature');
      return response.data.success ? response.data.signature : null;
    } catch (error) {
      console.error('Failed to fetch signature:', error);
      return null;
    }
  }

  // Get specific user's signature (for admins)
  async getUserSignature(userId: string): Promise<Signature | null> {
    try {
      const response = await api.get(`/signatures/user/${userId}`);
      return response.data.success ? response.data.signature : null;
    } catch (error) {
      console.error('Failed to fetch user signature:', error);
      return null;
    }
  }

  // Get school signatures (for admins)
  async getSchoolSignatures(schoolId: string): Promise<Signature[]> {
    try {
      const response = await api.get(`/signatures/school/${schoolId}`);
      return response.data.success ? response.data.signatures : [];
    } catch (error) {
      console.error('Failed to fetch school signatures:', error);
      return [];
    }
  }

  // Upload/Update signature
  async uploadSignature(data: SignatureUploadData): Promise<{ success: boolean; message: string; signature?: any }> {
    try {
      const response = await api.post('/signatures/upload', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to upload signature:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload signature'
      };
    }
  }

  // Delete signature
  async deleteSignature(signatureId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/signatures/${signatureId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete signature:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete signature'
      };
    }
  }

  // Get signature for progress reports
  async getSignatureForReports(userId: string, signatureType: string = 'teacher'): Promise<{ signatureData: string; user: any } | null> {
    try {
      const response = await api.get(`/signatures/report/${userId}/${signatureType}`);
      return response.data.success ? response.data.signature : null;
    } catch (error) {
      console.error('Failed to fetch signature for reports:', error);
      return null;
    }
  }
}

export default new SignatureService(); 