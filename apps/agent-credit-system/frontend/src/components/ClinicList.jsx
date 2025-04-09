import React from 'react';
import { Link } from 'react-router-dom';
import { ClinicStatus, ClinicStatusColor } from '../constants/ClinicStatus';

// Tooltip component for field descriptions
const Tooltip = ({ text }) => {
  return (
    <div className="group relative inline-block ml-1">
      <div className="cursor-help text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div style={{ textTransform: 'none' }} className="absolute z-10 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
        {text}
        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
    </div>
  );
};

const ClinicList = ({ clinics }) => {
  if (!clinics || clinics.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No clinics found.</p>
      </div>
    );
  }

  // Field descriptions for tooltips
  const columnDescriptions = {
    name: "The name of the clinic as it appears to users and administrators.",
    id: "Unique identifier for the clinic. Used in API calls and database references.",
    conciergeNumber: "The phone number used for the clinic's concierge service. This is the main contact point for patients.",
    clinicNumber: "The WhatsApp number associated with the clinic for direct communication.",
    status: "The current operational status of the clinic. Can be Ready (configured but not live), Published (live and available), or Inactive (not available).",
    actions: "Available actions for this clinic, such as viewing details or conversations."
  };

  // Helper function to get status display and styling
  const getStatusDisplay = (clinic) => {
    // Check if using the new status field
    if (clinic.status) {
      const status = clinic.status.toLowerCase();
      // Use the constants from ClinicStatus.jsx
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
        className: ClinicStatusColor[status] || ClinicStatusColor.active // Default to active if not found
      };
    }
    // Fallback to legacy is_active field
    else {
      return {
        label: clinic.is_active ? 'Active' : 'Deactivated',
        className: clinic.is_active ? ClinicStatusColor.published : ClinicStatusColor.inactive
      };
    }
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              Name
              <Tooltip text={columnDescriptions.name} />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              ID
              <Tooltip text={columnDescriptions.id} />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              Concierge Number
              <Tooltip text={columnDescriptions.conciergeNumber} />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              Clinic Number
              <Tooltip text={columnDescriptions.clinicNumber} />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center">
              Status
              <Tooltip text={columnDescriptions.status} />
            </div>
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="flex items-center justify-center">
              Actions
              <Tooltip text={columnDescriptions.actions} />
            </div>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {clinics.map((clinic) => {
          const statusDisplay = getStatusDisplay(clinic);

          return (
            <tr
              key={clinic.id}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link to={`/clinics/${clinic.id}`} className="hover:underline">
                  {clinic.name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clinic.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clinic.contact_number &&
                  `${clinic.contact_number.slice(0, 4)}-${clinic.contact_number.slice(4, 8)} ${clinic.contact_number.slice(8)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {clinic.clinic_whatsapp_number &&
                  `${clinic.clinic_whatsapp_number.slice(0, 4)}-${clinic.clinic_whatsapp_number.slice(4, 8)} ${clinic.clinic_whatsapp_number.slice(8)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.className}`}>
                  {statusDisplay.label}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex justify-center space-x-4">
                  <Link
                    to={`/clinics/${clinic.id}`}
                    className="w-10 h-10 flex items-center justify-center bg-[#075e54] text-white rounded-full hover:bg-[#054c44] transition-colors"
                    title="Clinic Info"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </Link>
                  <Link
                    to={`/clinics/${clinic.id}/conversations`}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Conversations"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ClinicList;
