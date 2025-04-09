import React, { useState, useEffect } from 'react';
import PhoneNumberInput from './PhoneNumberInput';

const AgentUserForm = ({ open, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    credit: 0,
    countryCode: '+852', // Default country code
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // Extract country code and phone number from mobile if available
      let countryCode = '+852'; // Default
      let phoneNumber = '';

      if (user.mobile) {
        // Check if mobile starts with a + sign (has country code)
        if (user.mobile.startsWith('+')) {
          // Find the first occurrence of a country code from our list
          const codes = ['+852', '+86', '+1', '+44', '+65', '+81', '+82', '+61', '+91', '+60', '+66', '+63'];
          const foundCode = codes.find(code => user.mobile.startsWith(code));

          if (foundCode) {
            countryCode = foundCode;
            phoneNumber = user.mobile.substring(foundCode.length);
          } else {
            phoneNumber = user.mobile;
          }
        } else {
          phoneNumber = user.mobile;
        }
      }

      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: phoneNumber,
        countryCode: countryCode,
        credit: user.credit || 0,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        countryCode: '+852',
        credit: 0,
      });
    }
    setErrors({});
  }, [user, open]);

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

  const handlePhoneNumberChange = (value) => {
    setFormData(prev => ({
      ...prev,
      mobile: value
    }));
    // Clear error when phone is edited
    if (errors.mobile) {
      setErrors(prev => ({
        ...prev,
        mobile: null
      }));
    }
  };

  const handleCountryCodeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      countryCode: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    }

    if (formData.credit < 0) {
      newErrors.credit = 'Credit must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Combine country code and mobile for submission
      const fullMobile = `${formData.countryCode}${formData.mobile}`;
      const dataToSubmit = {
        ...formData,
        mobile: fullMobile
      };

      // If editing, only send fields that have changed
      if (user) {
        const updatedFields = {};
        if (formData.name !== user.name) updatedFields.name = formData.name;
        if (formData.email !== user.email) updatedFields.email = formData.email;
        // Mobile number can't be updated in edit mode

        onSubmit(dataToSubmit, updatedFields);
      } else {
        onSubmit(dataToSubmit);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{user ? 'Edit Agent User' : 'Create Agent User'}</h3>
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
                disabled={user && !user.name}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <PhoneNumberInput
                countryCode={formData.countryCode}
                phoneNumber={formData.mobile}
                onCountryCodeChange={handleCountryCodeChange}
                onPhoneNumberChange={handlePhoneNumberChange}
                error={errors.mobile}
                disabled={!!user}
              />
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Credit</label>
                <input
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.credit ? 'border-red-500' : 'border-gray-300'}`}
                  name="credit"
                  type="number"
                  step="0.01"
                  value={formData.credit}
                  onChange={handleChange}
                />
                {errors.credit && <p className="mt-1 text-sm text-red-600">{errors.credit}</p>}
                {!errors.credit && <p className="mt-1 text-xs text-gray-500">Initial credit balance for the agent</p>}
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {user ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentUserForm;
