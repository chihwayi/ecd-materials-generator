import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '../../components/admin/DataTable.tsx';
import Modal from '../../components/admin/Modal.tsx';
import { adminService, adminUtils } from '../../services/admin.service';

interface School {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  subscriptionPlan: 'free' | 'school' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'suspended';
  maxTeachers: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    users: number;
  };
}

interface CreateSchoolRequest {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  subscriptionPlan: 'free' | 'school' | 'premium';
  maxTeachers: number;
  maxStudents: number;
}

interface UpdateSchoolRequest extends Partial<CreateSchoolRequest> {}

interface SchoolFilters {
  search?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  isActive?: boolean;
}

const SchoolManagementPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState<SchoolFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState<CreateSchoolRequest>({
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    subscriptionPlan: 'free',
    maxTeachers: 5,
    maxStudents: 100
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
      const response = await adminService.getAllSchools(pagination.current, pagination.pageSize);
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
      await adminService.createSchool(formData);
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
      const updateData: UpdateSchoolRequest = { ...formData };
      await adminService.updateSchool(selectedSchool.id, updateData);
      toast.success('School updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update school');
    }
  };

  const handleDeleteSchool = async (school: School) => {
    if (!window.confirm(`Are you sure you want to delete ${school.name}?`)) {
      return;
    }

    try {
      await adminService.deleteSchool(school.id);
      toast.success('School deleted successfully');
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete school');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedSchools.length} schools?`)) {
      return;
    }

    try {
      await Promise.all(selectedSchools.map(id => adminService.deleteSchool(id)));
      toast.success(`Successfully deleted ${selectedSchools.length} schools`);
      setSelectedSchools([]);
      setShowBulkActions(false);
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete schools');
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    try {
      await Promise.all(selectedSchools.map(id => adminService.updateSchool(id, { isActive })));
      toast.success(`Successfully ${isActive ? 'activated' : 'deactivated'} ${selectedSchools.length} schools`);
      setSelectedSchools([]);
      setShowBulkActions(false);
      fetchSchools();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update schools');
    }
  };

  const handleExportSchools = async () => {
    try {
      const blob = await adminService.exportSchools('csv');
      const filename = `schools_export_${new Date().toISOString().split('T')[0]}.csv`;
      adminUtils.downloadFile(blob, filename);
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
      maxStudents: 100
    });
    setSelectedSchool(null);
  };

  const openEditModal = (school: School) => {
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address || '',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      subscriptionPlan: school.subscriptionPlan,
      maxTeachers: school.maxTeachers,
      maxStudents: school.maxStudents
    });
    setIsEditModalOpen(true);
  };

  const columns: Column<School>[] = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedSchools.length === schools.length && schools.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (_, school) => (
        <input
          type="checkbox"
          checked={selectedSchools.includes(school.id)}
          onChange={(e) => handleSelectSchool(school.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    {
      key: 'name',
      title: 'School',
      sortable: true,
      render: (_, school) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{school.name}</div>
          <div className="text-sm text-gray-500">{school.contactEmail}</div>
          <div className="text-sm text-gray-400">{school.address}</div>
        </div>
      )
    },
    {
      key: 'users',
      title: 'Users',
      render: (_, school) => (
        <div className="text-sm text-gray-900">
          {school._count?.users || 0} users
        </div>
      )
    },
    {
      key: 'subscriptionPlan',
      title: 'Subscription',
      sortable: true,
      render: (plan) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          plan === 'premium' ? 'bg-purple-100 text-purple-800' :
          plan === 'school' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {plan.toUpperCase()}
        </span>
      )
    },
    {
      key: 'limits',
      title: 'Limits',
      render: (_, school) => (
        <div className="text-xs text-gray-600">
          <div>Teachers: {school.maxTeachers}</div>
          <div>Students: {school.maxStudents}</div>
        </div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (isActive) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, school) => (
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
          <option value="school">School</option>
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
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600">Manage all schools in the system</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportSchools}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export Schools
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add School
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedSchools.length} school{selectedSchools.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200"
              >
                Deactivate
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setSelectedSchools([]);
                  setShowBulkActions(false);
                }}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search schools..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
            <select
              value={filters.subscriptionPlan || ''}
              onChange={(e) => setFilters({ ...filters, subscriptionPlan: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Plans</option>
              <option value="free">Free</option>
              <option value="school">School</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.isActive?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value ? e.target.value === 'true' : undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={schools}
          columns={columns}
          loading={loading}
          pagination={{
            current: pagination.current,
            total: pagination.total,
            pageSize: pagination.pageSize,
            onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize })
          }}
        />
      </div>

      {/* Create School Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New School"
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
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

      {/* Edit School Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit School"
        size="lg"
        footer={
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
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