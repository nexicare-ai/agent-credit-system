import React, { useState, useEffect } from 'react';
import { consumableService } from '../services/api';
import ConsumableForm from '../components/ConsumableForm';
import { format } from 'date-fns';

const Consumables = () => {
  const [consumables, setConsumables] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedConsumable, setSelectedConsumable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConsumables = async () => {
    try {
      setLoading(true);
      const response = await consumableService.getConsumables(currentPage, pageSize);
      setConsumables(response.consumables);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError('Failed to fetch consumables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumables();
  }, [currentPage, pageSize]);

  const handleCreate = async (data) => {
    try {
      await consumableService.createConsumable(data);
      setIsFormOpen(false);
      fetchConsumables();
    } catch (err) {
      console.error('Failed to create consumable:', err);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await consumableService.updateConsumable(selectedConsumable.id, data);
      setIsFormOpen(false);
      setSelectedConsumable(null);
      fetchConsumables();
    } catch (err) {
      console.error('Failed to update consumable:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consumable?')) {
      try {
        await consumableService.deleteConsumable(id);
        fetchConsumables();
      } catch (err) {
        console.error('Failed to delete consumable:', err);
      }
    }
  };

  const handleEdit = (consumable) => {
    setSelectedConsumable(consumable);
    setIsFormOpen(true);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consumables</h1>
        <button
          onClick={() => {
            setSelectedConsumable(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Consumable
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
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
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consumables.map((consumable) => (
                  <tr key={consumable.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consumable.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consumable.cost} credits</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(consumable.created_at), 'PPpp')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(consumable.updated_at), 'PPpp')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(consumable)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(consumable.id)}
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
                Showing {consumables.length} of {total} items
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

      <ConsumableForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedConsumable(null);
        }}
        consumable={selectedConsumable}
        onSubmit={selectedConsumable ? handleUpdate : handleCreate}
      />
    </div>
  );
};

export default Consumables;
