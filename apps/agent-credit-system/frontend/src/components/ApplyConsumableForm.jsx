import React, { useState } from 'react';
import UserSearchDialog from './UserSearchDialog';

const ApplyConsumableForm = ({ open, onClose, consumable, onApply }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const resetForm = () => {
    setSelectedUser(null);
    setDescription('');
    setError(null);
  };

  // Reset form when dialog opens or consumable changes
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, consumable]);

  const validateForm = () => {
    if (!selectedUser) {
      setError('Please select a user');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onApply({
        userId: selectedUser.id,
        consumableId: consumable.id,
        description
      });
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setError(null);
  };

  if (!open || !consumable) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Apply Consumable to User</h3>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consumable</label>
              <div className="bg-gray-50 border border-gray-300 rounded-md px-3 py-2">
                <div className="text-sm font-medium">{consumable.name}</div>
                <div className="text-sm text-gray-500">{consumable.cost} credits</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              {selectedUser ? (
                <div className="flex justify-between items-center border border-gray-300 rounded-md px-3 py-2">
                  <div>
                    <div className="text-sm font-medium">{selectedUser.name}</div>
                    <div className="text-xs text-gray-500">{selectedUser.email}</div>
                    <div className="text-xs text-gray-500">{selectedUser.mobile}</div>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-700">{selectedUser.credit} credits</span>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => setIsSearchDialogOpen(true)}
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchDialogOpen(true)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Select User
                </button>
              )}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this transaction (optional)"
              />
            </div>

            {selectedUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="text-sm text-blue-700 flex justify-between items-center">
                  <span>User's credit after applying:</span>
                  <span className="font-bold">
                    {(parseFloat(selectedUser.credit) - parseFloat(consumable.cost)).toFixed(2)} credits
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedUser}
            className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !selectedUser
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Apply
          </button>
        </div>
      </div>

      <UserSearchDialog
        open={isSearchDialogOpen}
        onClose={() => setIsSearchDialogOpen(false)}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default ApplyConsumableForm;
