import React, { useState } from "react";
import { Search, Filter, Edit, Trash2, Plus, Crown, ToggleLeft, ToggleRight, X, Save, Calendar } from "lucide-react";
import apiService from "../../services/api";
import { useAuth } from "../../auth/AuthContext";

export default function UsersModule({ 
  users, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onUserCreate, 
  onUserUpdate, 
  onUserDelete, 
  onRefresh 
}) {
  const { refreshUserData } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleName: "user",
    status: "active",
    isProMember: false,
    proMembershipDuration: 30
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleName: "user",
      status: "active",
      isProMember: false,
      proMembershipDuration: 30
    });
    setEditingUser(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Leave empty for security
      roleName: user.role?.roleName || user.roleName || 'user',
      status: user.status || 'active',
      isProMember: user.isProMember || false,
      proMembershipDuration: 30
    });
    setShowAddForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const submitData = { ...formData };
      
      // Remove password if empty (for edits)
      if (!submitData.password) {
        delete submitData.password;
      }

      if (editingUser) {
        // Update existing user
        await onUserUpdate(editingUser._id || editingUser.id, submitData);
      } else {
        // Create new user
        if (!submitData.password) {
          throw new Error('Password is required for new users');
        }
        await onUserCreate(submitData);
      }

      resetForm();
    } catch (error) {
      setFormError(error.message || 'Failed to save user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleProMember = async (userId, currentStatus) => {
    try {
      await apiService.updateProMemberStatus(userId, { 
        isProMember: !currentStatus,
        membershipDuration: currentStatus ? 0 : 30
      });
      if (onRefresh) {
        onRefresh();
      }
      // Refresh user data in case the admin is updating their own pro status
      refreshUserData();
    } catch (error) {
      console.error('Error updating pro member status:', error);
    }
  };

  const confirmDelete = (user) => {
    setDeleteConfirm(user);
  };

  const handleDelete = async () => {
    if (deleteConfirm && onUserDelete) {
      await onUserDelete(deleteConfirm._id || deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false;
    
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const name = user.name || fullName;
    const email = user.email || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pro Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-r from-gray-800 to-black rounded-full flex items-center justify-center text-white font-bold">
                        {((user.name || `${user.firstName || ''} ${user.lastName || ''}`).trim().charAt(0)) || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${(user.role?.roleName || user.role) === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        (user.role?.roleName || user.role) === 'instructor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {user.role?.roleName || user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleProMember(user._id || user.id, user.isProMember)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.isProMember 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        {user.isProMember ? 'Pro' : 'Free'}
                        {user.isProMember ? 
                          <ToggleRight className="w-4 h-4 ml-1" /> : 
                          <ToggleLeft className="w-4 h-4 ml-1" />
                        }
                      </button>
                      {user.isProMember && user.proMembershipExpiry && (
                        <div className="ml-2 text-xs text-gray-500">
                          Expires: {new Date(user.proMembershipExpiry).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                    >
                      <Edit className="h-4 w-4 inline mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => confirmDelete(user)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave empty to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  required={!editingUser}
                />
              </div>

              {/* Role and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="roleName"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <option value="user">User</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Pro Member Settings */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    name="isProMember"
                    checked={formData.isProMember}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-yellow-500" />
                    Grant Pro Membership
                  </label>
                </div>

                {formData.isProMember && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membership Duration (days)
                    </label>
                    <select
                      name="proMembershipDuration"
                      value={formData.proMembershipDuration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                      <option value={7}>7 days</option>
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={365}>365 days</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center"
                  disabled={formLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {formLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}