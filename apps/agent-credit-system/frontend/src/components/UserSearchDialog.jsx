import React, { useState, useEffect } from 'react';
import { agentUserService } from '../services/api';

const UserSearchDialog = ({ open, onClose, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search for users when the search term changes
  useEffect(() => {
    if (!open) return;

    if (searchTerm.length < 2) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await agentUserService.searchAgentUsers(searchTerm);
        setUsers(response.users || []);
      } catch (err) {
        setError('Failed to search users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const delaySearch = setTimeout(searchUsers, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, open]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    onSelectUser(user);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Select User</h3>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search for user</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, email or mobile"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            ) : users.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="py-3 px-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.mobile}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{user.credit} credits</div>
                  </li>
                ))}
              </ul>
            ) : searchTerm.length >= 2 ? (
              <div className="py-3 px-2 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <div className="py-3 px-2 text-center text-gray-500">
                Type at least 2 characters to search
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSearchDialog;
