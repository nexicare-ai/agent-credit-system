import React from 'react';
import { ClinicStatus, ClinicStatusColor } from '../../constants/ClinicStatus';

/**
 * A reusable modal component for updating clinic status
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Object} props.clinic - The clinic object
 * @param {string} props.selectedStatus - The currently selected status
 * @param {Function} props.onStatusSelect - Function to call when a status is selected
 * @param {Function} props.onConfirm - Function to call when the update is confirmed
 * @param {Function} props.onCancel - Function to call when the update is cancelled
 */
const StatusModal = ({
  show,
  clinic,
  selectedStatus,
  onStatusSelect,
  onConfirm,
  onCancel
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Update Clinic Status</h3>
        <p className="mb-4 text-gray-600">
          Select the new status for <span className="font-medium">{clinic?.name}</span>:
        </p>

        <div className="space-y-3 mb-6">
        <div
            className={`p-3 border rounded cursor-pointer flex items-center ${selectedStatus === ClinicStatus.inactive ? 'border-red-500 bg-red-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onStatusSelect(ClinicStatus.inactive)}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${ClinicStatusColor[ClinicStatus.inactive].replace('text-red-800', 'bg-red-600')}`}></div>
            <div>
              <div className="font-medium">Inactive</div>
              <div className="text-sm text-gray-500">Clinic is inactive and not available</div>
            </div>
          </div>

          <div
            className={`p-3 border rounded cursor-pointer flex items-center ${selectedStatus === ClinicStatus.reviewing ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onStatusSelect(ClinicStatus.reviewing)}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${ClinicStatusColor[ClinicStatus.reviewing].replace('text-purple-800', 'bg-purple-600')}`}></div>
            <div>
              <div className="font-medium">Reviewing</div>
              <div className="text-sm text-gray-500">Clinic is under review</div>
            </div>
          </div>


          <div
            className={`p-3 border rounded cursor-pointer flex items-center ${selectedStatus === ClinicStatus.setup ? 'border-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onStatusSelect(ClinicStatus.setup)}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${ClinicStatusColor[ClinicStatus.setup].replace('text-yellow-800', 'bg-yellow-600')}`}></div>
            <div>
              <div className="font-medium">Setup</div>
              <div className="text-sm text-gray-500">Clinic is in initial setup phase</div>
            </div>
          </div>

          <div
            className={`p-3 border rounded cursor-pointer flex items-center ${selectedStatus === ClinicStatus.ready ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onStatusSelect(ClinicStatus.ready)}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${ClinicStatusColor[ClinicStatus.ready].replace('text-blue-800', 'bg-blue-600')}`}></div>
            <div>
              <div className="font-medium">Ready</div>
              <div className="text-sm text-gray-500">Clinic is ready but not yet published</div>
            </div>
          </div>

          <div
            className={`p-3 border rounded cursor-pointer flex items-center ${selectedStatus === ClinicStatus.published ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
              }`}
            onClick={() => onStatusSelect(ClinicStatus.published)}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${ClinicStatusColor[ClinicStatus.published].replace('text-green-800', 'bg-green-600')}`}></div>
            <div>
              <div className="font-medium">Published</div>
              <div className="text-sm text-gray-500">Clinic is active and published</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!selectedStatus}
            className={`px-4 py-2 rounded text-white ${!selectedStatus ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
