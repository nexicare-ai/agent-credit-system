import React, { useState, useEffect } from 'react';

const ConsumableForm = ({ open, onClose, consumable, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    meta_data: {}
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (consumable) {
      setFormData({
        name: consumable.name || '',
        cost: consumable.cost || '',
        meta_data: consumable.meta_data || {}
      });
    } else {
      setFormData({
        name: '',
        cost: '',
        meta_data: {}
      });
    }
    setErrors({});
  }, [consumable, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    } else if (isNaN(formData.cost) || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Cost must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert cost to decimal
      const dataToSubmit = {
        ...formData,
        cost: parseFloat(formData.cost)
      };

      onSubmit(dataToSubmit);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{consumable ? 'Edit Consumable' : 'Create Consumable'}</h3>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter consumable name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.cost ? 'border-red-500' : 'border-gray-300'}`}
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Enter cost"
              />
              {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
              {!errors.cost && <p className="mt-1 text-xs text-gray-500">Cost in credits</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Data (JSON)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                name="meta_data"
                value={JSON.stringify(formData.meta_data, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      meta_data: parsed
                    }));
                  } catch (error) {
                    // Keep the invalid JSON as is
                    setFormData(prev => ({
                      ...prev,
                      meta_data: e.target.value
                    }));
                  }
                }}
                rows="4"
                placeholder="Enter meta data in JSON format"
              />
              <p className="mt-1 text-xs text-gray-500">Additional information about the consumable</p>
            </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {consumable ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsumableForm;
