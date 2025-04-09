import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { clinicService } from '../../services/api';

const SpecialNoticesSection = ({ clinicId }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [futureOnly, setFutureOnly] = useState(true);
  const contentInputRef = useRef(null);

  // Initialize with default values
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Default time values - start from now, end in 24 hours
  const now = new Date();
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);

  const [newNotice, setNewNotice] = useState({
    from_date: today,
    to_date: tomorrow,
    from_time: now,
    to_time: nextDay,
    content: '',
    voice_language: 'yue-HK',
    voice_name: 'Google.yue-HK-Standard-C',
    is_active: true
  });

  useEffect(() => {
    fetchSpecialNotices();
  }, [clinicId, futureOnly]);

  useEffect(() => {
    // Set focus on the content input when the form is displayed
    if ((isEditing || isEditingExisting) && contentInputRef.current) {
      contentInputRef.current.focus();
    }
  }, [isEditing, isEditingExisting]);

  const fetchSpecialNotices = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getClinicSpecialNotices(clinicId, futureOnly);
      setNotices(response.notices || []);
    } catch (err) {
      console.error('Error fetching special notices:', err);
      setError('Failed to load special notices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleFutureOnly = () => {
    setFutureOnly(!futureOnly);
  };

  const handleIsActiveChange = (e) => {
    setNewNotice(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  // Combine date and time into datetime for API submission
  const combineDateTime = (date, time) => {
    const result = new Date(date);
    const timeDate = new Date(time);
    result.setHours(
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds(),
      timeDate.getMilliseconds()
    );
    // Return ISO string
    return result.toISOString();
  };

  const handleSaveNotice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Combine date and time values
      const fromDateTime = combineDateTime(newNotice.from_date, newNotice.from_time);
      const toDateTime = combineDateTime(newNotice.to_date, newNotice.to_time);

      // Check if time range is valid
      if (new Date(fromDateTime) >= new Date(toDateTime)) {
        setError('Start date/time must be before end date/time');
        setLoading(false);
        return;
      }

      // Format notice for API
      const formattedNotice = {
        from_datetime: fromDateTime,
        to_datetime: toDateTime,
        content: newNotice.content,
        voice_language: newNotice.voice_language,
        voice_name: newNotice.voice_name,
        is_active: newNotice.is_active
      };

      let response;
      if (isEditingExisting) {
        response = await clinicService.updateClinicSpecialNotice(clinicId, newNotice.id, formattedNotice);
        setSuccessMessage('Special notice updated successfully');
      } else {
        response = await clinicService.addClinicSpecialNotice(clinicId, formattedNotice);
        setSuccessMessage('Special notice added successfully');
      }

      await fetchSpecialNotices();
      setIsEditing(false);
      setIsEditingExisting(false);

      // Reset form with default values
      const resetToday = new Date();
      const resetTomorrow = new Date(resetToday);
      resetTomorrow.setDate(resetTomorrow.getDate() + 1);

      setNewNotice({
        from_date: resetToday,
        to_date: resetTomorrow,
        from_time: resetToday,
        to_time: resetTomorrow,
        content: '',
        voice_language: 'yue-HK',
        voice_name: 'Google.yue-HK-Standard-C',
        is_active: true
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving special notice:', err);
      setError(err.response?.data?.detail || 'Failed to save special notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotice = (notice) => {
    // Convert ISO date strings to Date objects
    const fromDateTime = new Date(notice.from_datetime);
    const toDateTime = new Date(notice.to_datetime);

    setNewNotice({
      id: notice.id,
      from_date: fromDateTime,
      to_date: toDateTime,
      from_time: fromDateTime,
      to_time: toDateTime,
      content: notice.content,
      voice_language: notice.voice_language || 'yue-HK',
      voice_name: notice.voice_name || 'Google.yue-HK-Standard-C',
      is_active: notice.is_active
    });

    setIsEditingExisting(true);
    setIsEditing(true);
  };

  const handleDeleteNotice = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this special notice?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await clinicService.deleteClinicSpecialNotice(clinicId, noticeId);

      // Refresh the notice list after successful deletion
      await fetchSpecialNotices();

      // Show success message
      setSuccessMessage('Special notice deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting special notice:', err);
      setError(err.response?.data?.detail || 'Failed to delete special notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsEditingExisting(false);

    // Reset form with default values
    const resetToday = new Date();
    const resetTomorrow = new Date(resetToday);
    resetTomorrow.setDate(resetTomorrow.getDate() + 1);

    setNewNotice({
      from_date: resetToday,
      to_date: resetTomorrow,
      from_time: resetToday,
      to_time: resetTomorrow,
      content: '',
      voice_language: 'yue-HK',
      voice_name: 'Google.yue-HK-Standard-C',
      is_active: true
    });
  };

  if (loading && notices.length === 0) {
    return <div className="p-4">Loading special notices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Special Notices Configuration</h3>
        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Notice
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Special notices are shown to customers during the specified time periods. These notices are displayed during voice calls and as a prefix in WhatsApp messages.
      </p>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isEditing && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-medium mb-4">{isEditingExisting ? 'Edit Special Notice' : 'Add New Special Notice'}</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notice Content</label>
              <textarea
                name="content"
                value={newNotice.content}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter notice content (e.g., Holiday hours, special arrangements, etc.)"
                rows={3}
                ref={contentInputRef}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be announced during phone calls and sent as a prefix in WhatsApp messages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Voice Language</label>
                <input
                  type="text"
                  name="voice_language"
                  value={newNotice.voice_language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., yue-HK"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Language code for text-to-speech (e.g., yue-HK for Cantonese, en-US for English)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Voice Name</label>
                <input
                  type="text"
                  name="voice_name"
                  value={newNotice.voice_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Google.yue-HK-Standard-C"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Voice identifier for text-to-speech
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From Date</label>
                <DatePicker
                  selected={newNotice.from_date}
                  onChange={(date) => setNewNotice(prev => ({ ...prev, from_date: date }))}
                  dateFormat="yyyy-MM-dd"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">To Date</label>
                <DatePicker
                  selected={newNotice.to_date}
                  onChange={(date) => setNewNotice(prev => ({ ...prev, to_date: date }))}
                  dateFormat="yyyy-MM-dd"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From Time</label>
                <DatePicker
                  selected={newNotice.from_time}
                  onChange={(time) => setNewNotice(prev => ({ ...prev, from_time: time }))}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">To Time</label>
                <DatePicker
                  selected={newNotice.to_time}
                  onChange={(time) => setNewNotice(prev => ({ ...prev, to_time: time }))}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="flex items-center h-5 mt-1">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={newNotice.is_active}
                  onChange={handleIsActiveChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-2">
                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">Active</label>
                <p className="text-xs text-gray-500">
                  If checked, this notice will be active during the specified time period.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotice}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading || !newNotice.content || !newNotice.from_date || !newNotice.to_date || !newNotice.from_time || !newNotice.to_time}
              >
                {loading ? 'Saving...' : isEditingExisting ? 'Update Notice' : 'Add Notice'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Existing Special Notices</h4>
          <div className="flex items-center">
            <label htmlFor="future-only-toggle" className="mr-2 text-sm text-gray-600">
              Show future notices only
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                id="future-only-toggle"
                type="checkbox"
                checked={futureOnly}
                onChange={handleToggleFutureOnly}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="future-only-toggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                  futureOnly ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
        </div>
        {notices.length === 0 ? (
          <p className="text-gray-500">No special notices configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.map((notice) => {
                  const fromDate = new Date(notice.from_datetime);
                  const toDate = new Date(notice.to_datetime);

                  // Format date and time into a single string for each
                  const formattedFrom = fromDate.toLocaleDateString() + ' ' +
                    fromDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const formattedTo = toDate.toLocaleDateString() + ' ' +
                    toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  const isActive = notice.is_active;
                  const isCurrentlyActive = isActive &&
                    fromDate <= new Date() &&
                    toDate >= new Date();

                  return (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="max-w-md truncate">{notice.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedFrom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isCurrentlyActive ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active Now
                          </span>
                        ) : isActive ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Scheduled
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditNotice(notice)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-label {
          transition: background-color 0.2s ease;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.2s ease;
          border-color: #e5e7eb;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default SpecialNoticesSection;
