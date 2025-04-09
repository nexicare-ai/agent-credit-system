import React, { useState, useEffect } from 'react';

const PurchasableForm = ({ open, onClose, purchasable, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    credit_amount: '',
    meta_data: {}
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (purchasable) {
      setFormData({
        name: purchasable.name || '',
        price: purchasable.price || '',
        credit_amount: purchasable.credit_amount || '',
        meta_data: purchasable.meta_data || {}
      });
    } else {
      setFormData({
        name: '',
        price: '',
        credit_amount: '',
        meta_data: {}
      });
    }
    setErrors({});
  }, [purchasable, open]);

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

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.credit_amount) {
      newErrors.credit_amount = 'Credit amount is required';
    } else if (isNaN(formData.credit_amount) || parseFloat(formData.credit_amount) <= 0) {
      newErrors.credit_amount = 'Credit amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Convert numeric values to decimals
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        credit_amount: parseFloat(formData.credit_amount)
      };

      onSubmit(dataToSubmit);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{purchasable ? 'Edit Purchasable' : 'Create Purchasable'}</h3>
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
                placeholder="Enter purchasable name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              {!errors.price && <p className="mt-1 text-xs text-gray-500">Price in currency</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Amount</label>
              <input
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.credit_amount ? 'border-red-500' : 'border-gray-300'}`}
                name="credit_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.credit_amount}
                onChange={handleChange}
                placeholder="Enter credit amount"
              />
              {errors.credit_amount && <p className="mt-1 text-sm text-red-600">{errors.credit_amount}</p>}
              {!errors.credit_amount && <p className="mt-1 text-xs text-gray-500">Amount of credits to add</p>}
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
              <p className="mt-1 text-xs text-gray-500">Additional information about the purchasable</p>
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
            {purchasable ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasableForm;
