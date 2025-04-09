import React, { useState, useEffect } from 'react';
import { purchasableService } from '../services/api';
import PurchasableForm from '../components/PurchasableForm';
import ApplyPurchasableForm from '../components/ApplyPurchasableForm';
import { format } from 'date-fns';

const Purchasables = () => {
  const [purchasables, setPurchasables] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [selectedPurchasable, setSelectedPurchasable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchPurchasables = async () => {
    try {
      setLoading(true);
      const response = await purchasableService.getPurchasables(currentPage, pageSize);
      setPurchasables(response.purchasables);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch purchasables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasables();
  }, [currentPage, pageSize]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreate = async (data) => {
    try {
      await purchasableService.createPurchasable(data);
      setIsFormOpen(false);
      fetchPurchasables();
      setSuccessMessage('Purchasable created successfully');
    } catch (err) {
      console.error('Failed to create purchasable:', err);
      setError('Failed to create purchasable');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await purchasableService.updatePurchasable(selectedPurchasable.id, data);
      setIsFormOpen(false);
      setSelectedPurchasable(null);
      fetchPurchasables();
      setSuccessMessage('Purchasable updated successfully');
    } catch (err) {
      console.error('Failed to update purchasable:', err);
      setError('Failed to update purchasable');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchasable?')) {
      try {
        await purchasableService.deletePurchasable(id);
        fetchPurchasables();
        setSuccessMessage('Purchasable deleted successfully');
      } catch (err) {
        console.error('Failed to delete purchasable:', err);
        setError('Failed to delete purchasable');
      }
    }
  };

  const handleEdit = (purchasable) => {
    setSelectedPurchasable(purchasable);
    setIsFormOpen(true);
  };

  const handleApply = (purchasable) => {
    setSelectedPurchasable(purchasable);
    setIsApplyFormOpen(true);
  };

  const handleApplySubmit = async (data) => {
    try {
      await purchasableService.applyPurchasable(data.purchasableId, data.userId, data.description);
      setIsApplyFormOpen(false);
      setSelectedPurchasable(null);
      setSuccessMessage('Purchasable applied successfully');
    } catch (err) {
      console.error('Failed to apply purchasable:', err);
      setError('Failed to apply purchasable');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchasables</h1>
        <button
          onClick={() => {
            setSelectedPurchasable(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Purchasable
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchasables.map((purchasable) => (
                  <tr key={purchasable.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{purchasable.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchasable.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">+{purchasable.credit_amount} credits</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(purchasable.created_at), 'PPpp')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApply(purchasable)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleEdit(purchasable)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(purchasable.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing {purchasables.length} of {total} items
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <PurchasableForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedPurchasable(null);
        }}
        purchasable={selectedPurchasable}
        onSubmit={selectedPurchasable ? handleUpdate : handleCreate}
      />

      <ApplyPurchasableForm
        open={isApplyFormOpen}
        onClose={() => {
          setIsApplyFormOpen(false);
          setSelectedPurchasable(null);
        }}
        purchasable={selectedPurchasable}
        onApply={handleApplySubmit}
      />
    </div>
  );
};

export default Purchasables;
