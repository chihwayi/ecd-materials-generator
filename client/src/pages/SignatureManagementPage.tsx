import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import SignaturePad from '../components/common/SignaturePad.tsx';
import api from '../services/api';
import { RootState } from '../store';

interface Signature {
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

const SignatureManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentSignature, setCurrentSignature] = useState<Signature | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  useEffect(() => {
    fetchCurrentSignature();
  }, []);

  const fetchCurrentSignature = async () => {
    try {
      const response = await api.get('/signatures/my-signature');
      if (response.data.success) {
        setCurrentSignature(response.data.signature);
      }
    } catch (error) {
      console.error('Failed to fetch signature:', error);
      // Not showing error toast as it's expected for new users
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSignature = async (signatureData: string) => {
    setSaving(true);
    try {
      const signatureType = user?.role === 'school_admin' ? 'principal' : 'teacher';
      const response = await api.post('/signatures/upload', {
        signatureData,
        signatureType
      });

      if (response.data.success) {
        toast.success('Signature saved successfully!');
        setShowSignaturePad(false);
        await fetchCurrentSignature();
      }
    } catch (error: any) {
      console.error('Failed to save signature:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save signature';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSignature = async () => {
    if (!currentSignature) return;

    if (!window.confirm('Are you sure you want to delete your signature?')) {
      return;
    }

    try {
      await api.delete(`/signatures/${currentSignature.id}`);
      toast.success('Signature deleted successfully!');
      setCurrentSignature(null);
    } catch (error: any) {
      console.error('Failed to delete signature:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete signature';
      toast.error(errorMessage);
    }
  };

  const getSignatureTitle = () => {
    if (user?.role === 'school_admin') {
      return '👨‍💼 Principal Signature';
    }
    return '👨‍🏫 Teacher Signature';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                ✍️ Digital Signature Management
              </h1>
              <p className="text-blue-100 text-lg">
                Create and manage your digital signatures for official documents
              </p>
            </div>
            <div className="text-6xl opacity-20">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Signature Configuration</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Current Signature Display */}
            {currentSignature && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  ✅ Current Active {getSignatureTitle()}
                </h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={currentSignature.signatureData}
                    alt="Current Signature"
                    className="h-16 border border-gray-300 rounded bg-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {currentSignature.user.firstName} {currentSignature.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {currentSignature.signatureType} • Created {new Date(currentSignature.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSignaturePad(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ✏️ Update Signature
                  </button>
                  <button
                    onClick={handleDeleteSignature}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🗑️ Delete Signature
                  </button>
                </div>
              </div>
            )}

            {/* Signature Type Display */}
            {!currentSignature && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  {getSignatureTitle()}
                </h3>
                
                <p className="text-gray-600">
                  Create your digital signature for official documents and progress reports.
                </p>
              </div>
            )}

            {/* Signature Pad */}
            {showSignaturePad && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  ✍️ Draw Your Signature
                </h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {getSignatureTitle()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Use your mouse or touch screen to draw your signature below
                  </p>
                </div>
                
                <SignaturePad
                  onSave={handleSaveSignature}
                  onClear={() => setShowSignaturePad(false)}
                  width={500}
                  height={200}
                  penColor="#000000"
                  backgroundColor="#ffffff"
                  className="mx-auto"
                />
                
                {saving && (
                  <div className="mt-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Saving signature...</p>
                  </div>
                )}
              </div>
            )}

            {/* Create New Signature Button */}
            {!currentSignature && !showSignaturePad && (
              <div className="text-center">
                <button
                  onClick={() => setShowSignaturePad(true)}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  ✍️ Create New Signature
                </button>
              </div>
            )}

            {/* Information Section */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                ℹ️ Signature Information
              </h3>
              
              <div className="space-y-3 text-sm text-yellow-700">
                <p>• Your signature will be used on progress reports and official documents</p>
                <p>• Only one active signature per type is allowed</p>
                <p>• You can update your signature at any time</p>
                <p>• Signatures are securely stored and encrypted</p>
                <p>• Different signature types have different permissions and uses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureManagementPage; 