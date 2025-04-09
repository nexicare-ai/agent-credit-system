import React, { useState, useEffect } from 'react';
import { fetchEvents, fetchEventTypes } from '../services/eventsService';
import { fetchAgentUserById } from '../services/agentUserService';
import { authService } from '../services/api';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [userCache, setUserCache] = useState({});
  const [createdByUserCache, setCreatedByUserCache] = useState({});

  useEffect(() => {
    loadEvents();
    loadEventTypes();
  }, [page, rowsPerPage, eventTypeFilter]);

  const loadEventTypes = async () => {
    try {
      const types = await fetchEventTypes();
      setEventTypes(types);
    } catch (error) {
      console.error('Failed to load event types:', error);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents(page * rowsPerPage, rowsPerPage, eventTypeFilter);
      setEvents(data.events);
      setTotalEvents(data.total);

      // Preload user information for events
      const targetIds = [...new Set(data.events.map(event => event.target_id))];
      await Promise.all(targetIds.map(loadUserInfo));

      // Preload created_by user information
      const createdByIds = [...new Set(data.events
        .filter(event => event.created_by)
        .map(event => event.created_by))];
      await Promise.all(createdByIds.map(loadCreatedByUserInfo));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInfo = async (userId) => {
    // Skip if already in cache
    if (userCache[userId]) return;

    try {
      const user = await fetchAgentUserById(userId);
      setUserCache(prev => ({
        ...prev,
        [userId]: user
      }));
    } catch (error) {
      console.error(`Failed to load user info for ${userId}:`, error);
      // Cache failed lookup to avoid repeated requests
      setUserCache(prev => ({
        ...prev,
        [userId]: { name: 'Unknown', mobile: 'N/A' }
      }));
    }
  };

  const loadCreatedByUserInfo = async (userId) => {
    // Skip if already in cache
    if (createdByUserCache[userId]) return;

    try {
      // Admin users are loaded by username instead of ID
      const user = await authService.getCurrentUser();
      setCreatedByUserCache(prev => ({
        ...prev,
        [userId]: { username: userId }  // Store the username directly
      }));
    } catch (error) {
      console.error(`Failed to load created_by user info for ${userId}:`, error);
      // Cache failed lookup to avoid repeated requests
      setCreatedByUserCache(prev => ({
        ...prev,
        [userId]: { username: userId }
      }));
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    setEventTypeFilter(e.target.value);
    setPage(0);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setEventTypeFilter('');
    setPage(0);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getEventTypeLabel = (type) => {
    const eventTypes = {
      'agent_credit': 'Credit Event',
      'agent-created': 'Agent Created',
      'agent-updated': 'Agent Updated',
      'agent-deleted': 'Agent Deleted',
    };

    return eventTypes[type] || type;
  };

  const getEventTypeBadgeClass = (type) => {
    const classes = {
      'agent_credit': 'bg-green-100 text-green-800',
      'agent-created': 'bg-blue-100 text-blue-800',
      'agent-updated': 'bg-yellow-100 text-yellow-800',
      'agent-deleted': 'bg-red-100 text-red-800',
    };

    return classes[type] || 'bg-gray-100 text-gray-800';
  };

  // Format event data as a pretty-printed JSON string
  const formatEventData = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return JSON.stringify(data);
    }
  };

  // Get user information for display
  const getUserInfo = (targetId) => {
    const user = userCache[targetId];
    if (!user) return { display: targetId.substring(0, 8) + '...', info: 'Loading...' };

    return {
      display: user.name || 'Unknown',
      info: user.mobile || 'N/A'
    };
  };

  // Get created_by user information for display
  const getCreatedByUserInfo = (userId) => {
    if (!userId) return 'System';
    return userId; // Display username directly
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalEvents / rowsPerPage);
  const showingFrom = totalEvents === 0 ? 0 : page * rowsPerPage + 1;
  const showingTo = Math.min(totalEvents, (page + 1) * rowsPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">System Events</h1>
        <button
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleToggleFilters}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="eventTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                id="eventTypeFilter"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={eventTypeFilter}
                onChange={handleFilterChange}
              >
                <option value="">All Events</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{getEventTypeLabel(type)}</option>
                ))}
              </select>
            </div>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

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
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((event) => {
                    const userInfo = getUserInfo(event.target_id);
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(event.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeBadgeClass(event.event_type)}`}>
                            {getEventTypeLabel(event.event_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{userInfo.display}</div>
                          <div className="text-xs text-gray-400">{userInfo.info}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {event.created_by_username ?
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                              {getCreatedByUserInfo(event.created_by_username)}
                            </span> :
                            <span className="text-gray-400">System</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                              {formatEventData(event.event_data)}
                              {event.description && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <strong>Description:</strong> {event.description}
                                </div>
                              )}
                            </pre>
                          </details>
                        </td>
                      </tr>
                    );
                  })
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
  );
};

export default EventsList;
