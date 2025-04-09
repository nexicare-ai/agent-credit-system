import React, { useState, useEffect } from 'react';
import AgentUserForm from './AgentUserForm';
import CreditForm from './CreditForm';
import CreditHistory from './CreditHistory';
import { fetchAgentUsers, createAgentUser, updateAgentUser,
  deleteAgentUser, updateAgentCredit } from '../services/agentUserService';

const AgentUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Form dialogs state
  const [openForm, setOpenForm] = useState(false);
  const [openCreditForm, setOpenCreditForm] = useState(false);
  const [openCreditHistory, setOpenCreditHistory] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete dialog state
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAgentUsers(page * rowsPerPage, rowsPerPage, searchTerm);
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setIsSearching(true);
    loadUsers();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
    setIsSearching(true);
    // Use setTimeout to ensure searchTerm is cleared before loadUsers is called
    setTimeout(() => loadUsers(), 0);
  };

  // User form handlers
  const handleOpenCreateForm = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleOpenEditForm = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
  };

  // Credit form handlers
  const handleOpenCreditForm = (user) => {
    setSelectedUser(user);
    setOpenCreditForm(true);
  };

  const handleCloseCreditForm = () => {
    setOpenCreditForm(false);
  };

  // Credit history handlers
  const handleOpenCreditHistory = (user) => {
    setSelectedUser(user);
    setOpenCreditHistory(true);
  };

  const handleCloseCreditHistory = () => {
    setOpenCreditHistory(false);
  };

  // Delete dialog handlers
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDelete(false);
    setUserToDelete(null);
  };

  // Form submission handlers
  const handleSubmitUserForm = async (data, updatedFields) => {
    try {
      if (selectedUser) {
        // Update existing user
        await updateAgentUser(selectedUser.mobile, updatedFields);
        showNotification('Agent updated successfully', 'success');
      } else {
        // Create new user
        await createAgentUser(data);
        showNotification('Agent created successfully', 'success');
      }
      handleCloseForm();
      loadUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An error occurred';
      showNotification(errorMessage, 'error');
    }
  };

  const handleSubmitCreditForm = async (amount, eventType, description) => {
    if (!selectedUser) return;

    try {
      await updateAgentCredit(selectedUser.mobile, amount, eventType, description);
      showNotification('Credit updated successfully', 'success');
      handleCloseCreditForm();
      loadUsers(); // Reload to get updated credit balance
    } catch (error) {
      showNotification('Failed to update credit', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteAgentUser(userToDelete.mobile);
      showNotification('Agent deleted successfully', 'success');
      handleCloseDeleteDialog();
      loadUsers();
    } catch (error) {
      showNotification('Failed to delete agent', 'error');
    }
  };

  // Notification handler
  const showNotification = (message, type = 'success') => {
    setNotification({
      open: true,
      message,
      type,
    });

    // Auto close notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({
        ...prev,
        open: false
      }));
    }, 5000);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const formatCredit = (credit) => {
    return parseFloat(credit).toFixed(2);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalUsers / rowsPerPage);
  const showingFrom = totalUsers === 0 ? 0 : page * rowsPerPage + 1;
  const showingTo = Math.min(totalUsers, (page + 1) * rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <button
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleOpenCreateForm}
        >
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Agent
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by mobile, name, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search result indicator */}
      {searchTerm && !loading && !isSearching && (
        <div className="mb-4 text-sm text-gray-600 flex items-center">
          <span>
            {totalUsers === 0
              ? 'No results found for '
              : `Found ${totalUsers} result${totalUsers !== 1 ? 's' : ''} for `}
            <span className="font-semibold">{searchTerm}</span>
          </span>
          {totalUsers > 0 && (
            <button
              onClick={handleClearSearch}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {loading || isSearching ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow border-b border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Balance</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No agents found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id || user.mobile}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {user.id ? user.id.substring(0, 8) + '...' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        <span className={parseFloat(user.credit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCredit(user.credit)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEditForm(user)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Agent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleOpenCreditForm(user)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Manage Credit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleOpenCreditHistory(user)}
                            className="text-green-600 hover:text-green-900"
                            title="View Credit History"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleOpenDeleteDialog(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Agent"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of <span className="font-medium">{totalUsers}</span> results
            </div>

            <div className="flex items-center space-x-2">
              <div>
                <label className="mr-2 text-sm text-gray-600">Rows per page:</label>
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handleChangePage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                    page === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <button
                  onClick={() => handleChangePage(Math.min(page + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                    page >= totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Create/Edit User Form Dialog */}
      <AgentUserForm
        open={openForm}
        onClose={handleCloseForm}
        user={selectedUser}
        onSubmit={handleSubmitUserForm}
      />

      {/* Credit Management Dialog */}
      {openCreditForm && (
        <CreditForm
          mobile={selectedUser?.mobile}
          onClose={handleCloseCreditForm}
          onSubmit={handleSubmitCreditForm}
        />
      )}

      {/* Credit History Dialog */}
      {openCreditHistory && (
        <CreditHistory
          mobile={selectedUser?.mobile}
          onClose={handleCloseCreditHistory}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {openDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the agent <span className="font-semibold">{userToDelete?.name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleCloseDeleteDialog}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.open && (
        <div className={`fixed bottom-4 right-4 rounded-md shadow-lg p-4 text-white ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button
              onClick={handleCloseNotification}
              className="ml-4 text-white focus:outline-none"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentUserList;
