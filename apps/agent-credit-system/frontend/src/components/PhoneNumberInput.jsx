import React from 'react';

// Common country codes
const countryCodes = [
  { code: '+852', name: 'Hong Kong (+852)' },
  { code: '+86', name: 'China (+86)' },
  { code: '+1', name: 'USA/Canada (+1)' },
  { code: '+44', name: 'UK (+44)' },
  { code: '+65', name: 'Singapore (+65)' },
  { code: '+81', name: 'Japan (+81)' },
  { code: '+82', name: 'South Korea (+82)' },
  { code: '+61', name: 'Australia (+61)' },
  { code: '+91', name: 'India (+91)' },
  { code: '+60', name: 'Malaysia (+60)' },
  { code: '+66', name: 'Thailand (+66)' },
  { code: '+63', name: 'Philippines (+63)' }
];

const PhoneNumberInput = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  error,
  label = "Phone Number",
  disabled = false
}) => {
  // Handle country code change
  const handleCountryCodeChange = (e) => {
    onCountryCodeChange(e.target.value);
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    // Only allow digits for phone number
    const sanitizedValue = e.target.value.replace(/\D/g, '');
    onPhoneNumberChange(sanitizedValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex space-x-2">
        <div className="w-1/3">
          <select
            value={countryCode}
            onChange={handleCountryCodeChange}
            className="w-full p-2 border rounded"
            disabled={disabled}
          >
            {countryCodes.map((code) => (
              <option key={code.code} value={code.code}>
                {code.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-2/3">
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={`w-full p-2 border rounded ${error ? 'border-red-500' : ''}`}
            placeholder="Enter phone number (digits only)"
            disabled={disabled}
          />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Enter the phone number without spaces or special characters
      </p>
    </div>
  );
};

export default PhoneNumberInput;
