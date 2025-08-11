import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const SchoolSettingsPage = () => {
  const [settings, setSettings] = useState({
    defaultParentPassword: '',
    schoolName: '',
    contactEmail: '',
    contactPhone: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    accentColor: '#fbbf24',
    customFont: 'Inter',
    schoolMotto: '',
    customHeaderText: '',
    brandingEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [currentLogo, setCurrentLogo] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [currentFavicon, setCurrentFavicon] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [settingsResponse, brandingResponse] = await Promise.all([
        api.get('/school/settings'),
        api.get('/school/branding')
      ]);
      
      const combinedSettings = {
        ...settingsResponse.data.settings,
        ...brandingResponse.data.branding,
        schoolName: settingsResponse.data.settings.name || settingsResponse.data.settings.schoolName || ''
      };
      
      setSettings(combinedSettings);
      setCurrentLogo(brandingResponse.data.branding.logoUrl || '');
      setCurrentFavicon(brandingResponse.data.branding.faviconUrl || '');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to fetch school settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/school/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      
      let errorMessage = 'Failed to save settings';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details.join(', ');
      }
      
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await api.post('/school/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCurrentLogo(response.data.logoUrl);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload logo:', error);
      toast.error('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFavicon(true);
    const formData = new FormData();
    formData.append('favicon', file);

    try {
      const response = await api.post('/school/upload-favicon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCurrentFavicon(response.data.faviconUrl);
      toast.success('Favicon uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      toast.error('Failed to upload favicon. Please try again.');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleColorChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                ⚙️ School Settings & Branding
              </h1>
              <p className="text-purple-100 text-lg">
                Customize your school's appearance and settings
              </p>
            </div>
            <div className="text-6xl opacity-20">🎨</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 rounded-t-xl border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">⚙️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configuration Panel</h2>
                <p className="text-sm text-gray-600">Customize your school settings and branding</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Basic Settings */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white">📋</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                  <p className="text-sm text-gray-600">Essential school details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => setSettings(prev => ({ ...prev, schoolName: e.target.value }))}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Parent Password
                  </label>
                  <input
                    type="password"
                    value={settings.defaultParentPassword}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultParentPassword: e.target.value }))}
                    className="input-field"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
            </div>

            {/* Branding Settings */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl text-white">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Branding & Customization</h3>
                  <p className="text-sm text-gray-600">Customize your school's visual identity</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.brandingEnabled}
                    onChange={(e) => setSettings(prev => ({ ...prev, brandingEnabled: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable custom branding</span>
                </label>
              </div>

              {settings.brandingEnabled && (
                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School Logo
                    </label>
                    <div className="flex items-center space-x-4">
      {currentLogo && !logoError ? (
        <img
          src={currentLogo.startsWith('/uploads/') ? `http://localhost:5000${currentLogo}` : currentLogo}
          alt="School Logo"
          className="w-16 h-16 object-contain border border-gray-200 rounded"
          onError={() => setLogoError(true)}
        />
      ) : (
        <img
          src="/default-logo.png"
          alt="Default Logo"
          className="w-16 h-16 object-contain border border-gray-200 rounded opacity-50"
        />
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
          id="logo-upload"
          disabled={uploadingLogo}
        />
        <label
          htmlFor="logo-upload"
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
        </label>
        <p className="text-xs text-gray-500 mt-1">Recommended: 300x300px, PNG/JPG</p>
      </div>
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon
                    </label>
                    <div className="flex items-center space-x-4">
                      {currentFavicon && (
                        <img 
                          src={currentFavicon.startsWith('/uploads/') ? `http://localhost:5000${currentFavicon}` : currentFavicon} 
                          alt="Favicon" 
                          className="w-8 h-8 object-contain border border-gray-200 rounded"
                        />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFaviconUpload}
                          className="hidden"
                          id="favicon-upload"
                          disabled={uploadingFavicon}
                        />
                        <label
                          htmlFor="favicon-upload"
                          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${uploadingFavicon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px, ICO/PNG</p>
                      </div>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="input-field flex-1"
                          placeholder="#2563eb"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="input-field flex-1"
                          placeholder="#1d4ed8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => handleColorChange('accentColor', e.target.value)}
                          className="input-field flex-1"
                          placeholder="#fbbf24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Custom Text */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Header Text
                      </label>
                      <input
                        type="text"
                        value={settings.customHeaderText}
                        onChange={(e) => setSettings(prev => ({ ...prev, customHeaderText: e.target.value }))}
                        className="input-field"
                        placeholder="Your School Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Motto
                      </label>
                      <input
                        type="text"
                        value={settings.schoolMotto}
                        onChange={(e) => setSettings(prev => ({ ...prev, schoolMotto: e.target.value }))}
                        className="input-field"
                        placeholder="Excellence in Education"
                      />
                    </div>
                  </div>

                  {/* Custom Font */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Font
                    </label>
                    <select
                      value={settings.customFont}
                      onChange={(e) => setSettings(prev => ({ ...prev, customFont: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Inter">Inter (Default)</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? '💾 Saving...' : '💾 Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSettingsPage;