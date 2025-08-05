import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '../../components/admin/DataTable.tsx';
import Modal from '../../components/admin/Modal.tsx';
import { schoolService } from '../../services/admin.service.ts';
import { School, CreateSchoolRequest, UpdateSchoolRequest, SchoolFilters, PaginatedResponse } from '../../types/user.types';

interface SchoolWithBranding extends School {
  // Branding fields
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customFont?: string;
  schoolMotto?: string;
  customHeaderText?: string;
  brandingEnabled?: boolean;
}

interface CreateSchoolRequestWithBranding extends CreateSchoolRequest {
  // Branding fields
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customFont?: string;
  schoolMotto?: string;
  customHeaderText?: string;
  brandingEnabled?: boolean;
}

const SchoolManagementPage: React.FC = () => {
  const [schools, setSchools] = useState<SchoolWithBranding[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState<SchoolFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolWithBranding | null>(null);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState<CreateSchoolRequestWithBranding>({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    subscriptionPlan: 'free',
    maxTeachers: 5,
    maxStudents: 100,
    primaryColor: '#2563eb',
    secondaryColor: '#1d4ed8',
    accentColor: '#fbbf24',
    customFont: 'Inter',
    schoolMotto: '',
    customHeaderText: '',
    brandingEnabled: true
  });

  useEffect(() => {
    fetchSchools();
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    setShowBulkActions(selectedSchools.length > 0);
  }, [selectedSchools]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<SchoolWithBranding> = await schoolService.getSchools({
        page: pagination.current,
        limit: pagination.pageSize,
        filters
      });
      setSchools(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      toast.error('Failed to fetch schools');
      console.error('Fetch schools error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = async () => {
    try {
      await schoolService.createSchool(formData);
      toast.success('School created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create school');
    }
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchool) return;
    
    try {
      await schoolService.updateSchool(selectedSchool.id, formData);
      toast.success('School updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update school');
    }
  };

  const handleDeleteSchool = async (school: SchoolWithBranding) => {
    if (!confirm(`Are you sure you want to delete ${school.name}?`)) return;
    
    try {
      await schoolService.deleteSchool(school.id);
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete school');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedSchools.length} schools?`)) return;
    
    try {
      await Promise.all(selectedSchools.map(id => schoolService.deleteSchool(id)));
      toast.success('Schools deleted successfully');
      setSelectedSchools([]);
      fetchSchools();
    } catch (error: any) {
      toast.error('Failed to delete schools');
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    try {
      await Promise.all(selectedSchools.map(id => schoolService.updateSchool(id, { isActive })));
      toast.success(`Schools ${isActive ? 'activated' : 'deactivated'} successfully`);
      setSelectedSchools([]);
      fetchSchools();
    } catch (error: any) {
      toast.error('Failed to update school status');
    }
  };

  const handleExportSchools = async () => {
    try {
      // Implementation for export functionality
      toast.success('Schools exported successfully');
    } catch (error: any) {
      toast.error('Failed to export schools');
    }
  };

  const handleSelectSchool = (schoolId: string, selected: boolean) => {
    if (selected) {
      setSelectedSchools(prev => [...prev, schoolId]);
    } else {
      setSelectedSchools(prev => prev.filter(id => id !== schoolId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedSchools(schools.map(school => school.id));
    } else {
      setSelectedSchools([]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      contactEmail: '',
      contactPhone: '',
      subscriptionPlan: 'free',
      maxTeachers: 5,
      maxStudents: 100,
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
      accentColor: '#fbbf24',
      customFont: 'Inter',
      schoolMotto: '',
      customHeaderText: '',
      brandingEnabled: true
    });
  };

  const openEditModal = (school: SchoolWithBranding) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address || '',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      subscriptionPlan: school.subscriptionPlan,
      maxTeachers: school.maxTeachers,
      maxStudents: school.maxStudents,
      primaryColor: school.primaryColor || '#2563eb',
      secondaryColor: school.secondaryColor || '#1d4ed8',
      accentColor: school.accentColor || '#fbbf24',
      customFont: school.customFont || 'Inter',
      schoolMotto: school.schoolMotto || '',
      customHeaderText: school.customHeaderText || '',
      brandingEnabled: school.brandingEnabled !== false
    });
    setIsEditModalOpen(true);
  };

  const columns: Column[] = [
    {
      key: 'name',
      title: 'School Name',
      render: (value, school) => (
        <div className="flex items-center space-x-3">
          {school.logoUrl && (
            <img 
              src={school.logoUrl} 
              alt="School Logo" 
              className="w-8 h-8 object-contain rounded"
            />
          )}
          <span className="font-medium">{school.name}</span>
        </div>
      )
    },
    {
      key: 'contactEmail',
      title: 'Contact Email',
      render: (value, school) => school.contactEmail || '-'
    },
    {
      key: 'subscriptionPlan',
      title: 'Plan',
      render: (value, school) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          school.subscriptionPlan === 'premium' ? 'bg-purple-100 text-purple-800' :
          school.subscriptionPlan === 'basic' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {school.subscriptionPlan}
        </span>
      )
    },
    {
      key: 'subscriptionStatus',
      title: 'Status',
      render: (value, school) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          school.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
          school.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {school.subscriptionStatus}
        </span>
      )
    },
    {
      key: 'brandingEnabled',
      title: 'Branding',
      render: (value, school) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          school.brandingEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {school.brandingEnabled ? 'Enabled' : 'Disabled'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, school) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(school);
            }}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSchool(school);
            }}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const renderSchoolForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">School Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
        <select
          value={formData.subscriptionPlan}
          onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Teachers</label>
          <input
            type="number"
            min="1"
            value={formData.maxTeachers}
            onChange={(e) => setFormData({ ...formData, maxTeachers: parseInt(e.target.value) || 5 })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Students</label>
          <input
            type="number"
            min="1"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 100 })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Branding Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Branding Settings</h3>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.brandingEnabled}
              onChange={(e) => setFormData({ ...formData, brandingEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-800">Enable custom branding</span>
              <p className="text-xs text-gray-600 mt-1">Allow this school to customize their colors, logo, and branding</p>
            </div>
          </label>
        </div>

        {formData.brandingEnabled && (
          <div className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-4">🎨 Branding Configuration</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Primary Color</label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      title="Click to pick primary color"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg border-2 border-white shadow-inner pointer-events-none"
                      style={{ backgroundColor: formData.primaryColor }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-white"
                      placeholder="#2563eb"
                    />
                    <p className="text-xs text-gray-500 mt-1">Main brand color</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Secondary Color</label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      title="Click to pick secondary color"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg border-2 border-white shadow-inner pointer-events-none"
                      style={{ backgroundColor: formData.secondaryColor }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-white"
                      placeholder="#1d4ed8"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supporting color</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Accent Color</label>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      title="Click to pick accent color"
                    />
                    <div 
                      className="absolute inset-0 rounded-lg border-2 border-white shadow-inner pointer-events-none"
                      style={{ backgroundColor: formData.accentColor }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono bg-white"
                      placeholder="#fbbf24"
                    />
                    <p className="text-xs text-gray-500 mt-1">Highlight color</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Color Preview:</p>
              <div className="flex space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: formData.primaryColor }}
                  title="Primary Color"
                ></div>
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: formData.secondaryColor }}
                  title="Secondary Color"
                ></div>
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: formData.accentColor }}
                  title="Accent Color"
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Custom Header Text</label>
                <input
                  type="text"
                  value={formData.customHeaderText}
                  onChange={(e) => setFormData({ ...formData, customHeaderText: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="School Name"
                />
                <p className="text-xs text-gray-500">Displayed in the header</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">School Motto</label>
                <input
                  type="text"
                  value={formData.schoolMotto}
                  onChange={(e) => setFormData({ ...formData, schoolMotto: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Excellence in Education"
                />
                <p className="text-xs text-gray-500">Shown below the header text</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Custom Font</label>
              <select
                value={formData.customFont}
                onChange={(e) => setFormData({ ...formData, customFont: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Inter">Inter (Default)</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
              </select>
              <p className="text-xs text-gray-500">Font family for the header text</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add School
        </button>
      </div>

      {showBulkActions && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedSchools.length} school(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={schools}
        loading={loading}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New School"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSchool}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create School
            </button>
          </div>
        }
      >
        {renderSchoolForm()}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit School"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSchool}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update School
            </button>
          </div>
        }
      >
        {renderSchoolForm()}
      </Modal>
    </div>
  );
};

export default SchoolManagementPage;