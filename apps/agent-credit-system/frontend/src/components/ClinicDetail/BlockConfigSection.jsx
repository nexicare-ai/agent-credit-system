import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { clinicService } from '../../services/api';

const BlockConfigSection = ({ clinicId }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [futureOnly, setFutureOnly] = useState(true);
  const [applyingHolidays, setApplyingHolidays] = useState(false);
  const reasonInputRef = useRef(null);

  // Initialize with default values - date is today, from time is 00:00, to time is 23:59
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 0, 0);

  const [newBlock, setNewBlock] = useState({
    from_date: today,
    to_date: today,
    from_time: startOfDay,
    to_time: endOfDay,
    reason: '',
    doctor_id: null
  });

  useEffect(() => {
    fetchBlockConfig();
  }, [clinicId, futureOnly]);

  useEffect(() => {
    // Set focus on the reason input when the form is displayed
    if ((isEditing || isEditingExisting) && reasonInputRef.current) {
      reasonInputRef.current.focus();
    }
  }, [isEditing, isEditingExisting]);

  const fetchBlockConfig = async () => {
    try {
      setLoading(true);
      const response = await clinicService.getClinicBlockConfig(clinicId, futureOnly);
      setBlocks(response.blocks || []);
    } catch (err) {
      console.error('Error fetching block config:', err);
      setError('Failed to load block configuration');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlock(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleFutureOnly = () => {
    setFutureOnly(!futureOnly);
  };

  const handleApplyHolidays = async () => {
    if (!window.confirm("Are you sure you want to apply all 2025 holidays? This will add 17 holiday blocks to your schedule.")) {
      return;
    }

    try {
      setApplyingHolidays(true);
      setError(null);

      const doctorId = null; // Apply to all doctors by default
      const response = await clinicService.applyHolidays(clinicId, doctorId);

      // Refresh the block list
      await fetchBlockConfig();

      // Show success message
      setSuccessMessage(`${response.message}`);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error applying holidays:', err);
      setError(err.response?.data?.detail || 'Failed to apply holidays. Please try again.');
    } finally {
      setApplyingHolidays(false);
    }
  };

  // Combine date and time into datetime for API submission and convert to UTC
  const combineDateTime = (date, time) => {
    const result = new Date(date);
    const timeDate = new Date(time);
    result.setHours(
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds(),
      timeDate.getMilliseconds()
    );
    // Convert to UTC string and create new Date to strip timezone
    return new Date(result.toISOString());
  };

  const handleAddBlock = async () => {
    try {
      setLoading(true);
      setError(null);

      // Combine date and time values and convert to UTC
      const blockFrom = combineDateTime(newBlock.from_date, newBlock.from_time);
      const blockUntil = combineDateTime(newBlock.to_date, newBlock.to_time);

      // Check if time range is valid
      if (blockFrom >= blockUntil) {
        setError('Start date/time must be before end date/time');
        setLoading(false);
        return;
      }

      // Format dates to ISO strings
      const formattedBlock = {
        block_from: blockFrom.toISOString(),
        block_until: blockUntil.toISOString(),
        reason: newBlock.reason,
        doctor_id: newBlock.doctor_id === '' ? null :
                  newBlock.doctor_id === null ? null :
                  parseInt(newBlock.doctor_id)
      };

      let response;
      if (isEditingExisting) {
        response = await clinicService.updateClinicBlock(clinicId, newBlock.id, formattedBlock);
        setSuccessMessage('Block updated successfully');
      } else {
        response = await clinicService.addClinicBlock(clinicId, formattedBlock);
        setSuccessMessage('Block added successfully');
      }

      await fetchBlockConfig();
      setIsEditing(false);
      setIsEditingExisting(false);

      // Reset form with default values
      const resetToday = new Date();
      const resetStartOfDay = new Date(resetToday);
      resetStartOfDay.setHours(0, 0, 0, 0);
      const resetEndOfDay = new Date(resetToday);
      resetEndOfDay.setHours(23, 59, 0, 0);

      setNewBlock({
        from_date: resetToday,
        to_date: resetToday,
        from_time: resetStartOfDay,
        to_time: resetEndOfDay,
        reason: '',
        doctor_id: null
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error managing block:', err);
      setError(err.response?.data?.detail || 'Failed to manage block. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlock = (block) => {
    // Convert ISO date strings to Date objects
    const fromDateTime = new Date(block.block_from);
    const toDateTime = new Date(block.block_until);

    setNewBlock({
      id: block.id,
      from_date: fromDateTime,
      to_date: toDateTime,
      from_time: fromDateTime,
      to_time: toDateTime,
      reason: block.reason,
      doctor_id: block.doctor_id
    });

    setIsEditingExisting(true);
    setIsEditing(true);
  };

  const handleDeleteBlock = async (blockId) => {
    if (!window.confirm('Are you sure you want to delete this block?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await clinicService.deleteClinicBlock(clinicId, blockId);

      // Refresh the block list after successful deletion
      await fetchBlockConfig();

      // Show success message
      setSuccessMessage('Block deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting block:', err);
      setError(err.response?.data?.detail || 'Failed to delete block. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsEditingExisting(false);

    // Reset form with default values
    const resetToday = new Date();
    const resetStartOfDay = new Date(resetToday);
    resetStartOfDay.setHours(0, 0, 0, 0);
    const resetEndOfDay = new Date(resetToday);
    resetEndOfDay.setHours(23, 59, 0, 0);

    setNewBlock({
      from_date: resetToday,
      to_date: resetToday,
      from_time: resetStartOfDay,
      to_time: resetEndOfDay,
      reason: '',
      doctor_id: null
    });
  };

  if (loading && blocks.length === 0) {
    return <div className="p-4">Loading block configuration...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Block Schedule Configuration</h3>
        <div className="flex space-x-2">
          {!isEditing && (
            <>
              <button
                onClick={handleApplyHolidays}
                disabled={applyingHolidays}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-yellow-300"
              >
                {applyingHolidays ? 'Applying...' : 'Apply 2025 Holidays'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Block
              </button>
            </>
          )}
        </div>
      </div>

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
          <h4 className="font-medium mb-4">{isEditingExisting ? 'Edit Block' : 'Add New Block'}</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input
                type="text"
                name="reason"
                value={newBlock.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter reason for blocking"
                ref={reasonInputRef}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor ID (optional)</label>
              <input
                type="number"
                name="doctor_id"
                value={newBlock.doctor_id === null ? '' : newBlock.doctor_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Leave blank to block for all doctors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to block for all doctors
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <DatePicker
                selected={newBlock.from_date}
                onChange={(date) => setNewBlock(prev => ({ ...prev, from_date: date }))}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <DatePicker
                selected={newBlock.to_date}
                onChange={(date) => setNewBlock(prev => ({ ...prev, to_date: date }))}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">From Time</label>
                <DatePicker
                  selected={newBlock.from_time}
                  onChange={(time) => setNewBlock(prev => ({ ...prev, from_time: time }))}
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
                  selected={newBlock.to_time}
                  onChange={(time) => setNewBlock(prev => ({ ...prev, to_time: time }))}
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

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBlock}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading || !newBlock.reason || !newBlock.from_date || !newBlock.to_date || !newBlock.from_time || !newBlock.to_time}
              >
                {loading ? 'Saving...' : isEditingExisting ? 'Update Block' : 'Add Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Existing Blocks</h4>
          <div className="flex items-center">
            <label htmlFor="future-only-toggle" className="mr-2 text-sm text-gray-600">
              Show future blocks only
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
        {blocks.length === 0 ? (
          <p className="text-gray-500">No blocks configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blocks.map((block) => {
                  const fromDate = new Date(block.block_from);
                  const toDate = new Date(block.block_until);

                  // Format date and time into a single string for each
                  const formattedFrom = fromDate.toLocaleDateString() + ' ' +
                    fromDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const formattedTo = toDate.toLocaleDateString() + ' ' +
                    toDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={block.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{block.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedFrom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {block.doctor_id ? `Doctor ${block.doctor_id}` : 'All Doctors'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditBlock(block)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
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

export default BlockConfigSection;
