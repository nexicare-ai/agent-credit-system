import React, { useState, useEffect } from 'react';
import { fetchAgentCreditHistory } from '../services/agentUserService';

const CreditHistory = ({ mobile, onClose }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (mobile) {
      loadCreditHistory();
    }
  }, [mobile, page, rowsPerPage]);

  const loadCreditHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchAgentCreditHistory(mobile, page * rowsPerPage, rowsPerPage);
      setEvents(data.events);
      setTotalEvents(data.total);
    } catch (error) {
      console.error('Failed to load credit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAmount = (amount) => {
    const value = parseFloat(amount);
    return value >= 0
      ? <span className="text-green-600">+{value.toFixed(2)}</span>
      : <span className="text-red-600">{value.toFixed(2)}</span>;
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalEvents / rowsPerPage);
  const showingFrom = totalEvents === 0 ? 0 : page * rowsPerPage + 1;
  const showingTo = Math.min(totalEvents, (page + 1) * rowsPerPage);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Credit History</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow border-b border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No credit events found
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(event.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          {formatAmount(event.event_data.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {parseFloat(event.event_data.previous_balance).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {parseFloat(event.event_data.new_balance).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {event.description || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of <span className="font-medium">{totalEvents}</span> results
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <label className="mr-2 text-sm text-gray-600">Rows per page:</label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                  >
                    {[5, 10, 25, 50].map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handleChangePage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                      page === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleChangePage(Math.min(page + 1, totalPages - 1))}
                    disabled={page >= totalPages - 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                      page >= totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreditHistory;
