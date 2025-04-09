import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clinicService } from '../services/api';
import SearchBar from '../components/SearchBar';
import ClinicList from '../components/ClinicList';
import Pagination from '../components/Pagination';
import PhoneNumberInput from '../components/PhoneNumberInput';
import { ClinicStatus, ClinicStatusColor } from '../constants/ClinicStatus';

// Tooltip component for field descriptions
const Tooltip = ({ text }) => {
  return (
    <div className="group relative inline-block ml-2">
      <div className="cursor-help text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
        {text}
        <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
    </div>
  );
};

const Clinics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1', 10),
    totalPages: 1,
  });
  const search = searchParams.get('search') || '';

  // Add effect to watch URL page changes
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    setPagination(prev => ({ ...prev, page }));
  }, [searchParams]);

  // Field descriptions for tooltips
  const fieldDescriptions = {
    clinicName: "The name of the clinic as it appears to users and administrators.",
    contactNumber: "The phone number used for the clinic's concierge service. This is the main contact point for patients.",
    description: "A detailed description of the clinic, its services, and other relevant information.",
    status: "The current operational status of the clinic. Can be Setup (initial configuration), Reviewing (under review), Ready (configured but not live), Published (live and available), or Inactive (not available).",
    statusFilter: "Filter clinics by their operational status. Select multiple statuses to see clinics in any of those states.",
    addNewClinic: "Create a new clinic configuration with basic information. Additional settings can be configured after creation."
  };

  // Status filter state
  const statusParam = searchParams.get('status') || '';
  const [selectedStatuses, setSelectedStatuses] = useState(
    statusParam ? statusParam.split(',') : [ClinicStatus.setup, ClinicStatus.reviewing, ClinicStatus.ready, ClinicStatus.published]
  );
  const initialStatusSetRef = useRef(false);

  // State for the create clinic modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: '',
    country_code: '+852',
    phone_number: '',
    description: '',
    is_active: false,
    status: ClinicStatus.setup,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Status options for the filter
  const statusOptions = [
    { value: ClinicStatus.inactive, label: 'Inactive' },
    { value: ClinicStatus.reviewing, label: 'Reviewing' },
    { value: ClinicStatus.setup, label: 'Setup' },
    { value: ClinicStatus.ready, label: 'Ready' },
    { value: ClinicStatus.published, label: 'Published' }
  ];

  // Set initial status filter if none is specified
  useEffect(() => {
    if (!initialStatusSetRef.current && !searchParams.has('status')) {
      initialStatusSetRef.current = true;
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('status', `${ClinicStatus.setup},${ClinicStatus.reviewing},${ClinicStatus.ready},${ClinicStatus.published}`);
        return newParams;
      });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        const data = await clinicService.getClinics(currentPage, search, selectedStatuses.join(','));
        setClinics(data.clinics.items || []);
        setPagination({
          page: data.clinics.page,
          totalPages: data.clinics.pages,
        });
      } catch (err) {
        console.error('Error fetching clinics:', err);
        setError('Failed to load clinics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [searchParams, search, selectedStatuses]);

  const handleSearch = (searchTerm) => {
    setSearchParams({
      page: '1',
      ...(searchTerm ? { search: searchTerm } : {}),
      status: selectedStatuses.join(',')
    });
  };

  const handlePageChange = (page) => {
    setSearchParams({
      page: page.toString(),
      ...(search ? { search } : {}),
      status: selectedStatuses.join(',')
    });
  };

  const handleStatusFilterChange = (status) => {
    let newSelectedStatuses;

    if (selectedStatuses.includes(status)) {
      // Remove status if already selected
      newSelectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      // Add status if not already selected
      newSelectedStatuses = [...selectedStatuses, status];
    }

    // Ensure at least one status is selected
    if (newSelectedStatuses.length === 0) {
      newSelectedStatuses = [ClinicStatus.inactive]; // Default to inactive if nothing selected
    }

    setSelectedStatuses(newSelectedStatuses);
    setSearchParams({
      page: '1',
      ...(search ? { search } : {}),
      status: newSelectedStatuses.join(',')
    });
  };

  // Handle input changes for the new clinic form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewClinic(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle country code change
  const handleCountryCodeChange = (value) => {
    setNewClinic(prev => ({
      ...prev,
      country_code: value
    }));
  };

  // Handle phone number change
  const handlePhoneNumberChange = (value) => {
    setNewClinic(prev => ({
      ...prev,
      phone_number: value
    }));
  };

  // Handle form submission for creating a new clinic
  const handleCreateClinic = async (e) => {
    e.preventDefault();

    // Validate form
    if (!newClinic.name || !newClinic.phone_number) {
      setFormError('Name and Phone Number are required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Combine country code and phone number
      const clinic_whatsapp_number = newClinic.country_code + newClinic.phone_number;

      // Call the API to create a new clinic
      await clinicService.createClinic({
        name: newClinic.name,
        contact_number: "+852",
        clinic_whatsapp_number: clinic_whatsapp_number,
        description: newClinic.description,
        status: newClinic.status,
        is_active: newClinic.status !== ClinicStatus.inactive ? 1 : 0 // Set is_active based on status for backward compatibility
      });

      // Reset form and close modal
      setNewClinic({
        name: '',
        country_code: '+852',
        phone_number: '',
        description: '',
        is_active: false,
        status: ClinicStatus.ready,
      });
      setIsModalOpen(false);

      // Refresh the clinics list
      const data = await clinicService.getClinics(pagination.page, search, selectedStatuses.join(','));
      setClinics(data.clinics.items || []);
      setPagination({
        page: data.clinics.page,
        totalPages: data.clinics.pages,
      });

    } catch (err) {
      console.error('Error creating clinic:', err);
      setFormError('Failed to create clinic. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Loading clinics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Clinic Configurations</h2>
        <div className="flex items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add New Clinic
          </button>
          <Tooltip text={fieldDescriptions.addNewClinic} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex-grow">
          <SearchBar initialSearch={search} onSearch={handleSearch} />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 mr-3">
            Status Filter:
            <Tooltip text={fieldDescriptions.statusFilter} />
          </span>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusFilterChange(option.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatuses.includes(option.value)
                    ? ClinicStatusColor[option.value]
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ClinicList clinics={clinics} />
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        search={search}
      />

      {/* Create Clinic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Clinic</h3>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateClinic}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Clinic Name *
                  <Tooltip text={fieldDescriptions.clinicName} />
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newClinic.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="block text-gray-700 text-sm font-bold" htmlFor="phone_number">
                    Clinic Number *
                  </label>
                  <Tooltip text={fieldDescriptions.contactNumber} />
                </div>
                <PhoneNumberInput
                  label=""
                  countryCode={newClinic.country_code}
                  phoneNumber={newClinic.phone_number}
                  onCountryCodeChange={handleCountryCodeChange}
                  onPhoneNumberChange={handlePhoneNumberChange}
                  error={formError && !newClinic.phone_number ? "Phone number is required" : ""}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                  <Tooltip text={fieldDescriptions.description} />
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newClinic.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                  <Tooltip text={fieldDescriptions.status} />
                </label>
                <select
                  id="status"
                  name="status"
                  value={newClinic.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {Object.values(ClinicStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Clinic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clinics;
