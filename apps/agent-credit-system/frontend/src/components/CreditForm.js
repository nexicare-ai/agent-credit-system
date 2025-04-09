import React, { useState } from 'react';

const CreditForm = ({ mobile, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    // Clear any previous error message
    setErrorMsg('');
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the amount field
    if (!amount || isNaN(parseFloat(amount))) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    const numAmount = parseFloat(amount);

    // Attempt to submit the form
    onSubmit(numAmount, 'agent_credit', description);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Update Credit</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="amount"
                id="amount"
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${errorMsg ? 'border-red-300' : ''}`}
                placeholder="0.00"
                aria-describedby="amount-currency"
                value={amount}
                onChange={handleAmountChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm" id="amount-currency">
                  pts
                </span>
              </div>
            </div>
            {errorMsg && (
              <p className="mt-2 text-sm text-red-600" id="amount-error">
                {errorMsg}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Use negative values to deduct credit.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Reason for credit adjustment"
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Credit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditForm;
