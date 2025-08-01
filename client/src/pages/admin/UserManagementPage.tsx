import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DataTable, { Column } from '../../components/admin/DataTable.tsx';
import Modal from '../../components/admin/Modal.tsx';
import PasswordResetModal from '../../components/admin/PasswordResetModal.tsx';
import { adminService, adminUtils } from '../../services/admin.service';
import { User, School, CreateUserRequest, UpdateUserRequest, UserFilters } from '../../types/user.types';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState<UserFilters>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'teacher',
    phoneNumber: '',
    language: 'en',
    schoolId: '',
    subscriptionPlan: 'free'
  });

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(pagination.current, pagination.pageSize, filters);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await adminService.getAllSchools(1, 100);
      setSchools(response.data);
    } catch (error) {
      console.error('Fetch schools error:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await adminService.createUser(formData);
      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updateData: UpdateUserRequest = { ...formData };
      delete (updateData as any).password; // Don't update password unless specifically provided
      
      await adminService.updateUser(selectedUser.id, updateData);
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    try {
      await adminService.deleteUser(user.id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      return;
    }

    try {
      await adminService.bulkDeleteUsers(selectedUsers);
      toast.success(`Successfully deleted ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete users');
    }
  };

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    try {
      await adminService.bulkUpdateUsers(selectedUsers, { isActive });
      toast.success(`Successfully ${isActive ? 'activated' : 'deactivated'} ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update users');
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await adminService.exportUsers('csv');
      const filename = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      adminUtils.downloadFile(blob, filename);
      toast.success('Users exported successfully');
    } catch (error: any) {
      toast.error('Failed to export users');
    }
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'school_admin',
      phoneNumber: '',
      language: 'en',
      schoolId: '',
      subscriptionPlan: 'free'
    });
    setSelectedUser(null);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber || '',
      language: user.language,
      schoolId: user.schoolId || '',
      subscriptionPlan: user.subscriptionPlan
    });
    setIsEditModalOpen(true);
  };

  const openPasswordResetModal = (user: User) => {
    setSelectedUserForReset(user);
    setIsPasswordResetModalOpen(true);
  };

  const columns: Column<User>[] = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedUsers.length === users.length && users.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (_, user) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={(e) => handleSelectUser(user.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    {
      key: 'firstName',
      title: 'Name',
      sortable: true,
      render: (_, user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      sortable: true,
      render: (role) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          role === 'system_admin' ? 'bg-red-100 text-red-800' :
          role === 'school_admin' ? 'bg-blue-100 text-blue-800' :
          role === 'teacher' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {role.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'school',
      title: 'School',
      render: (_, user) => user.School?.name || 'No School'
    },
    {
      key: 'subscriptionPlan',
      title: 'Subscription',
      sortable: true,
      render: (plan) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          plan === 'premium' ? 'bg-purple-100 text-purple-800' :
          plan === 'school' ? 'bg-blue-100 text-blue-800' :
          plan === 'teacher' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {plan.toUpperCase()}
        </span>
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
      render: (_, user) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(user);
            }}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openPasswordResetModal(user);
            }}
            className="text-orange-600 hover:text-orange-900 text-sm font-medium"
          >
            Reset Password
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user);
            }}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const renderUserForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {!selectedUser && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="school_admin">School Admin</option>
            <option value="system_admin">System Admin</option>
            <option value="delegated_admin">Delegated Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en">English</option>
            <option value="sn">Shona</option>
            <option value="nd">Ndebele</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">School</label>
          <select
            value={formData.schoolId || ''}
            onChange={(e) => setFormData({ ...formData, schoolId: e.target.value || null })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No School</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
          <select
            value={formData.subscriptionPlan}
            onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value as any })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="free">Free</option>
            <option value="teacher">Teacher</option>
            <option value="school">School</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all system users</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportUsers}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export Users
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
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
                  setSelectedUsers([]);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={filters.role || ''}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="teacher">Teacher</option>
              <option value="school_admin">School Admin</option>
              <option value="parent">Parent</option>
              <option value="system_admin">System Admin</option>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <select
              value={filters.schoolId || ''}
              onChange={(e) => setFilters({ ...filters, schoolId: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataTable
          data={users}
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

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New User"
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
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        }
      >
        {renderUserForm()}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit User"
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
              onClick={handleUpdateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update User
            </button>
          </div>
        }
      >
        {renderUserForm()}
      </Modal>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={isPasswordResetModalOpen}
        onClose={() => {
          setIsPasswordResetModalOpen(false);
          setSelectedUserForReset(null);
        }}
        selectedUser={selectedUserForReset}
      />
    </div>
  );
};

export default UserManagementPage;