import React, { useState, useEffect } from 'react';
import {
  fetchCMSUsers,
  createCMSUser,
  updateCMSUser,
  deleteCMSUser
} from '../services/cmsUserService';
import { CMS_USER_COLUMNS, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../constants/cmsUsers';
import CMSUserForm from './CMSUserForm';

const CMSUserList = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Form state
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState(null);

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
      const data = await fetchCMSUsers(page * rowsPerPage, rowsPerPage);
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleOpenCreateForm = () => {
    setFormData(null);
    setOpenForm(true);
  };

  const handleOpenEditForm = (user) => {
    setFormData(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDelete(false);
    setUserToDelete(null);
  };

  const handleSubmitForm = async (data, updatedFields) => {
    try {
      if (formData) {
        // Update existing user
        await updateCMSUser(formData.mobile, updatedFields);
        showNotification('User updated successfully', 'success');
      } else {
        // Create new user
        await createCMSUser(data);
        showNotification('User created successfully', 'success');
      }
      loadUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'An error occurred';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteCMSUser(userToDelete.mobile);
      showNotification('User deleted successfully', 'success');
      loadUsers();
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    } finally {
      handleCloseDeleteDialog();
    }
  };

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

  const formatCellValue = (column, value) => {
    return column.format ? column.format(value) : value;
  };

  // Calculate pagination details
  const totalPages = Math.ceil(totalUsers / rowsPerPage);
  const showingFrom = totalUsers === 0 ? 0 : page * rowsPerPage + 1;
  const showingTo = Math.min(totalUsers, (page + 1) * rowsPerPage);

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handleChangePage(Math.max(0, page - 1))}
        disabled={page === 0}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
          page === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        } bg-white border border-gray-300 rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        Previous
      </button>
    );

    // Page numbers
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 0; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handleChangePage(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
              page === i
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // Show selected pages with ellipsis
      const visiblePages = [0, totalPages - 1]; // First and last pages always visible

      // Add current page and its neighbors
      if (page > 0) visiblePages.push(page - 1);
      visiblePages.push(page);
      if (page < totalPages - 1) visiblePages.push(page + 1);

      // Sort and remove duplicates
      const uniqueVisiblePages = [...new Set(visiblePages)].sort((a, b) => a - b);

      let lastRenderedPage = null;
      for (const p of uniqueVisiblePages) {
        // Add ellipsis if pages are skipped
        if (lastRenderedPage !== null && p > lastRenderedPage + 1) {
          buttons.push(
            <span key={`ellipsis-${p}`} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
              ...
            </span>
          );
        }

        buttons.push(
          <button
            key={p}
            onClick={() => handleChangePage(p)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
              page === p
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p + 1}
          </button>
        );

        lastRenderedPage = p;
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handleChangePage(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
          page >= totalPages - 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50'
        } bg-white border border-gray-300 rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        Next
      </button>
    );

    return buttons;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">CMS Users</h2>
        <button
          onClick={handleOpenCreateForm}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add User
        </button>
      </div>

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {CMS_USER_COLUMNS.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.align === 'center' ? 'text-center' : ''}`}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={CMS_USER_COLUMNS.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={CMS_USER_COLUMNS.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.mobile} className="hover:bg-gray-50">
                  {CMS_USER_COLUMNS.map((column) => {
                    if (column.id === 'actions') {
                      return (
                        <td key={column.id} className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleOpenEditForm(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      );
                    }
                    const value = user[column.id];
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCellValue(column, value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handleChangePage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page === 0 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handleChangePage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              page >= totalPages - 1 ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of{' '}
              <span className="font-medium">{totalUsers}</span> results
            </p>
          </div>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">Show</span>
              <select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="mr-2 rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="mr-4 text-sm text-gray-700">per page</span>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {renderPaginationButtons()}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      <CMSUserForm
        open={openForm}
        handleClose={handleCloseForm}
        initialData={formData}
        onSubmit={handleSubmitForm}
      />

      {/* Delete Confirmation Dialog */}
      {openDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={handleCloseDeleteDialog}></div>
          <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete user {userToDelete?.name} ({userToDelete?.mobile})?
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={handleCloseDeleteDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.open && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <div className={`p-4 rounded-md shadow-lg ${
            notification.type === 'success' ? 'bg-green-50 border border-green-400' : 'bg-red-50 border border-red-400'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className={`ml-3 text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
              <button
                onClick={handleCloseNotification}
                className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-md p-1.5 focus:outline-none"
              >
                <svg className={`h-4 w-4 ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSUserList;
