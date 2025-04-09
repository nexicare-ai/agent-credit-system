import React, { useState } from 'react';

/**
 * A modal component for updating clinic ID
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Object} props.clinic - The clinic object
 * @param {Function} props.onConfirm - Function to call when the update is confirmed
 * @param {Function} props.onCancel - Function to call when the update is cancelled
 */
const IdUpdateModal = ({
  show,
  clinic,
  onConfirm,
  onCancel
}) => {
  const [newId, setNewId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setNewId(e.target.value);
    setError('');
  };

  const handleSubmit = async () => {
    // Validate input
    if (!newId.trim()) {
      setError('Please enter a new ID');
      return;
    }

    // Check if ID is different
    if (newId.trim() === clinic.id) {
      setError('New ID must be different from the current ID');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(newId.trim());
      setNewId('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update clinic ID');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewId('');
    setError('');
    onCancel();
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Update Clinic ID</h3>
        <p className="mb-4 text-gray-600">
          Enter a new ID for <span className="font-medium">{clinic?.name}</span>:
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current ID
          </label>
          <input
            type="text"
            value={clinic?.id || ''}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New ID
          </label>
          <input
            type="text"
            value={newId}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
            placeholder="Enter new clinic ID"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !newId.trim()}
            className={`px-4 py-2 rounded text-white ${
              isSubmitting || !newId.trim() ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update ID'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdUpdateModal;
