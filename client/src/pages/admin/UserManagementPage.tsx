import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User } from '../../types/user.types';
import { adminService, adminUtils } from '../../services/admin.service.ts';
import UserManagement from '../../components/admin/UserManagement.tsx';
import Modal from '../../components/admin/Modal.tsx';
import PasswordResetModal from '../../components/admin/PasswordResetModal.tsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.tsx';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<any[]>([]); // Changed to any[] as School type is removed
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [filters, setFilters] = useState<{
    search?: string;
    role?: string;
    isActive?: boolean | string;
    schoolId?: string;
  }>({}); // Define proper filter types
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'teacher',
    phoneNumber: '',
    language: 'en',
    schoolId: ''
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
      setSchools(response.data || response.schools || []);
    } catch (error) {
      console.error('Fetch schools error:', error);
      // Set fallback data if API fails
      setSchools([]);
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
      const updateData = { ...formData };
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
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.deleteUser(selectedUser.id);
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await adminService.bulkDeleteUsers(selectedUsers);
      toast.success(`Successfully deleted ${selectedUsers.length} users`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      setIsBulkDeleteModalOpen(false);
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
      setSelectedUsers(users?.map(user => user.id) || []);
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
      schoolId: ''
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
      schoolId: user.schoolId || ''
    });
    setIsEditModalOpen(true);
  };

  const openPasswordResetModal = (user: User) => {
    setSelectedUserForReset(user);
    setIsPasswordResetModalOpen(true);
  };

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedUsers.length === (users?.length || 0) && (users?.length || 0) > 0}
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
          {role?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
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
          {plan?.toUpperCase() || 'FREE'}
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
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">👤</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <p className="text-sm text-gray-600">Basic user details and contact information</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">🔐</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Account Credentials</h3>
            <p className="text-sm text-gray-600">Login credentials and security settings</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="user@example.com"
              required
            />
          </div>
          {!selectedUser && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                placeholder="Enter secure password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters recommended</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              placeholder="+263 xxx xxx xxx"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">⚙️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Role & Permissions</h3>
            <p className="text-sm text-gray-600">User role and system access level</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="school_admin">🏫 School Admin</option>
              <option value="system_admin">⚡ System Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            >
              <option value="en">🇬🇧 English</option>
              <option value="sn">🇿🇼 Shona</option>
              <option value="nd">🇿🇼 Ndebele</option>
            </select>
          </div>
        </div>
      </div>



      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">🏢</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">School Assignment</h3>
            <p className="text-sm text-gray-600">Associate user with a school (optional for system admins)</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">School Assignment</label>
          <select
            value={formData.schoolId ?? ''}
            onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
          >
            <option value="">🏢 No School (System User)</option>
            {schools?.map(school => (
              <option key={school.id} value={school.id}>🏫 {school.name}</option>
            )) || []}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            💡 System admins don't need school assignment. School admins must be assigned to a school. Teachers are created by school admins.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">👥 User Management</h1>
              <p className="text-slate-100 text-lg">Manage all users across the system</p>
            </div>
            <div className="text-6xl opacity-20">⚙️</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Users</p>
                <p className="text-3xl font-bold text-blue-900">{pagination.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Active Users</p>
                <p className="text-3xl font-bold text-green-900">
                  {users?.filter(u => u.isActive).length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Teachers</p>
                <p className="text-3xl font-bold text-purple-900">
                  {users?.filter(u => u.role === 'teacher').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">👨‍🏫</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Schools</p>
                <p className="text-3xl font-bold text-orange-900">{schools?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl text-white">🏫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
            >
              <span className="text-2xl mr-2">➕</span>
              <span className="font-semibold">Create User</span>
            </button>
            
            {showBulkActions && (
              <>
                <button
                  onClick={() => handleBulkStatusUpdate(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  ✅ Activate Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(false)}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  ❌ Deactivate Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                >
                  🗑️ Delete Selected
                </button>
              </>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleExportUsers}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              📊 Export Users
            </button>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">🔍</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Filter & Search Users</h3>
            <p className="text-sm text-gray-600">Find users by role, status, school, or search terms</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🔍 Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">👥 User Role</label>
            <select
              value={filters.role || ''}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">🌍 All Roles</option>
              <option value="teacher">👨🏫 Teacher</option>
              <option value="school_admin">🏫 School Admin</option>
              <option value="parent">👨‍👩‍👧‍👦 Parent</option>
              <option value="system_admin">⚡ System Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🟢 Account Status</label>
            <select
              value={filters.isActive?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value ? e.target.value === 'true' : undefined })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">🌍 All Status</option>
              <option value="true">✅ Active</option>
              <option value="false">❌ Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">🏫 School Filter</label>
            <select
              value={filters.schoolId || ''}
              onChange={(e) => setFilters({ ...filters, schoolId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">🌍 All Schools</option>
              {schools?.map(school => (
                <option key={school.id} value={school.id}>🏫 {school.name}</option>
              )) || []}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 rounded-t-xl border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Users Directory</h2>
              <p className="text-sm text-gray-600">Manage all system users and their permissions</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <UserManagement 
            users={users} 
            loading={loading} 
            onRefresh={fetchUsers}
            onEdit={openEditModal}
            onPasswordReset={openPasswordResetModal}
            onDelete={handleDeleteUser}
          />
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title={
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New User
              </h2>
              <p className="text-sm text-gray-600">Add a new user to the system</p>
            </div>
          </div>
        }
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

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDeleteUser}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
      />

      <ConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        title="Delete Multiple Users"
        message={`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
      />
      </div>
    </div>
  );
};

export default UserManagementPage;