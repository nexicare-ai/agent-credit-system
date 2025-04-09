import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clinicService } from '../services/api';
import { ClinicStatus, ClinicStatusColor } from '../constants/ClinicStatus';
import StatusModal from '../components/ClinicDetail/StatusModal';
import IdUpdateModal from '../components/ClinicDetail/IdUpdateModal';
import PhoneNumberInput from '../components/PhoneNumberInput';
import DocumentsSection from '../components/ClinicDetail/DocumentsSection';
import ApiTestSection from '../components/ClinicDetail/ApiTestSection';
import VoiceAssetManager from '../components/VoiceAssetManager';
import BlockConfigSection from '../components/ClinicDetail/BlockConfigSection';
import SpecialNoticesSection from '../components/ClinicDetail/SpecialNoticesSection';

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

const ClinicDetail = () => {
  const { clinicId } = useParams();
  const navigate = useNavigate();

  // Field descriptions for tooltips
  const fieldDescriptions = {
    id: "Unique identifier for the clinic. Used in API calls and database references.",
    name: "The name of the clinic as it appears to users and administrators.",
    conciergeNumber: "The phone number used for the clinic's concierge service. This is the main contact point for patients.",
    clinicNumber: "The WhatsApp number associated with the clinic for direct communication.",
    description: "A detailed description of the clinic, its services, and other relevant information.",
    created: "The date and time when this clinic configuration was created in the system.",
    remark: "Additional notes or comments about the clinic that are relevant for administrators.",
    voiceGreeting: "The message that will be played or spoken when a patient calls the clinic's concierge number.",
    voiceSuccess: "The message that will be played or spoken when a patient's request is successfully processed.",
    voiceFailure: "The message that will be played or spoken when a patient's request cannot be processed.",
    voiceLanguage: "The language code used for text-to-speech conversion of voice messages.",
    voiceName: "The name of the voice used for text-to-speech conversion.",
    wabaNumber: "WhatsApp Business API number used for sending messages to patients.",
    wabaTemplate: "The ID of the WhatsApp message template used for structured messages.",
    wabaTemplateVariables: "Variables to be inserted into the WhatsApp message template. Should be in JSON format with key-value pairs.",
    conciergeVersion: "The version of the concierge service being used for this clinic.",
    flowiseId: "The ID of the Flowise chatflow used for this clinic's conversational AI.",
    summarizePrompt: "Instructions used to guide the AI when summarizing patient conversations.",
    extractDocuments: "Automatically extract and process documents from the clinic's data sources. This may include patient records, medical documents, and other relevant information.",
    specialNotices: "Special notices that are displayed to patients during specific time periods. These can be used for holiday hours, service disruptions, or other important announcements."
  };

  const [clinic, setClinic] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClinic, setEditedClinic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [documentsTableExists, setDocumentsTableExists] = useState(true);
  const [documentsTableError, setDocumentsTableError] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    phone_number: '',
    role: 'default',
    country_code: '+852', // Default country code
    description: '',
    type: 'whatsapp' // Default type
  });
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [showAddSubscriptionForm, setShowAddSubscriptionForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showIdUpdateModal, setShowIdUpdateModal] = useState(false);

  // Common country codes
  const countryCodes = [
    { code: '+852', name: 'Hong Kong (+852)' },
    { code: '+86', name: 'China (+86)' },
    { code: '+1', name: 'USA/Canada (+1)' },
    { code: '+44', name: 'UK (+44)' },
    { code: '+65', name: 'Singapore (+65)' },
    { code: '+81', name: 'Japan (+81)' },
    { code: '+82', name: 'South Korea (+82)' },
    { code: '+61', name: 'Australia (+61)' },
    { code: '+91', name: 'India (+91)' },
    { code: '+60', name: 'Malaysia (+60)' },
    { code: '+66', name: 'Thailand (+66)' },
    { code: '+63', name: 'Philippines (+63)' }
  ];

  // Add state for phone number fields when editing
  const [phoneFields, setPhoneFields] = useState({
    contact_number: { countryCode: '+852', phoneNumber: '' },
    clinic_whatsapp_number: { countryCode: '+852', phoneNumber: '' },
    waba_number: { countryCode: '+852', phoneNumber: '' }
  });

  // Helper function to split phone number into country code and number
  const splitPhoneNumber = (fullNumber) => {
    if (!fullNumber) return { countryCode: '+852', phoneNumber: '' };

    for (const code of countryCodes) {
      if (fullNumber.startsWith(code.code)) {
        return {
          countryCode: code.code,
          phoneNumber: fullNumber.substring(code.code.length)
        };
      }
    }
    return { countryCode: '+852', phoneNumber: fullNumber };
  };

  // Check if the documents table exists
  useEffect(() => {
    const checkDocumentsTable = async () => {
      try {
        const result = await clinicService.checkDocumentsTable();
        setDocumentsTableExists(result.exists);
        if (!result.exists) {
          setDocumentsTableError(result.error);
          console.error('Documents table does not exist:', result.error);
        }
      } catch (err) {
        console.error('Error checking documents table:', err);
        setDocumentsTableExists(false);
      }
    };

    checkDocumentsTable();
  }, []);

  useEffect(() => {
    const fetchClinicDetail = async () => {
      try {
        setLoading(true);
        const data = await clinicService.getClinicById(clinicId);
        setClinic(data.clinic);

        // Only fetch documents if the table exists
        if (documentsTableExists) {
          try {
            const docsData = await clinicService.getClinicDocuments(clinicId);
            setDocuments(docsData.documents || []);
          } catch (docErr) {
            console.error(`Error fetching documents for clinic ${clinicId}:`, docErr);
            // Don't fail the whole page load if documents can't be fetched
            setDocuments([]);
          }
        }

        // Fetch subscriptions
        try {
          const subsData = await clinicService.getClinicSubscriptions(clinicId);
          setSubscriptions(subsData.subscriptions || []);
        } catch (subsErr) {
          console.error(`Error fetching subscriptions for clinic ${clinicId}:`, subsErr);
          setSubscriptions([]);
        }
      } catch (err) {
        console.error(`Error fetching clinic ${clinicId}:`, err);
        setError('Failed to load clinic details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetail();
  }, [clinicId, documentsTableExists]);

  const handleUpdateStatus = () => {
    // Open the status selection modal
    setShowStatusModal(true);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusConfirm = async () => {
    if (!selectedStatus) return;

    try {
      setLoading(true);
      const data = await clinicService.updateClinicStatus(clinicId, selectedStatus);
      setClinic(data.clinic);
      setSuccessMessage(`Clinic status updated to ${selectedStatus} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Close the modal and reset selected status
      setShowStatusModal(false);
      setSelectedStatus(null);
    } catch (err) {
      console.error(`Error updating clinic ${clinicId} status:`, err);
      setError('Failed to update clinic status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusCancel = () => {
    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  const handleUpdateId = () => {
    // Open the ID update modal
    setShowIdUpdateModal(true);
  };

  const handleIdUpdateConfirm = async (newId) => {
    try {
      setLoading(true);
      const data = await clinicService.updateClinicId(clinicId, newId);

      // Show success message
      setSuccessMessage(`Clinic ID updated successfully to ${newId}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Close the modal
      setShowIdUpdateModal(false);

      // Redirect to the new clinic detail page
      navigate(`/clinics/${newId}`);
    } catch (err) {
      console.error(`Error updating clinic ${clinicId} ID:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleIdUpdateCancel = () => {
    setShowIdUpdateModal(false);
  };

  const handleEditClick = () => {
    const contactNumberParts = splitPhoneNumber(clinic.contact_number || '');
    const clinicNumberParts = splitPhoneNumber(clinic.clinic_whatsapp_number || '');
    const wabaNumberParts = splitPhoneNumber(clinic.waba_number || '');

    setPhoneFields({
      contact_number: contactNumberParts,
      clinic_whatsapp_number: clinicNumberParts,
      waba_number: wabaNumberParts
    });

    // Ensure settings is properly initialized
    const settings = clinic.settings || {};

    setEditedClinic({
      ...clinic,
      remark: clinic.remark || '',
      // Ensure waba_template_variables is properly initialized
      waba_template_variables: clinic.waba_template_variables || {},
      // Ensure settings is properly initialized
      settings: {
        voice_mail_enabled: settings.voice_mail_enabled || false,
        appointment: {
          booking_lead_time_in_hours: settings.appointment?.booking_lead_time_in_hours || 2
        }
      }
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedClinic(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClinic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Validate JSON before saving
      if (editedClinic.waba_template_variables_error) {
        setError('Please fix the invalid JSON in WABA Template Variables before saving.');
        return;
      }

      // Ensure template variables is a proper object
      let templateVariables = editedClinic.waba_template_variables;
      if (typeof templateVariables === 'string') {
        try {
          templateVariables = templateVariables.trim() ? JSON.parse(templateVariables) : {};
        } catch (err) {
          setError('Invalid JSON format in WABA Template Variables.');
          return;
        }
      }

      setIsSaving(true);

      // Ensure settings are properly structured
      const settings = {
        voice_mail_enabled: editedClinic.settings?.voice_mail_enabled || false,
        appointment: {
          booking_lead_time_in_hours: editedClinic.settings?.appointment?.booking_lead_time_in_hours || 2
        }
      };

      // Combine country codes and phone numbers
      const updatedClinic = {
        ...editedClinic,
        contact_number: phoneFields.contact_number.countryCode + phoneFields.contact_number.phoneNumber,
        clinic_whatsapp_number: phoneFields.clinic_whatsapp_number.countryCode + phoneFields.clinic_whatsapp_number.phoneNumber,
        waba_number: phoneFields.waba_number.countryCode + phoneFields.waba_number.phoneNumber,
        waba_template_variables: templateVariables,
        settings: settings
      };

      const data = await clinicService.updateClinic(clinicId, updatedClinic);
      setClinic(data.clinic);
      setIsEditing(false);
      setSuccessMessage('Clinic configuration updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error updating clinic ${clinicId}:`, err);
      setError('Failed to update clinic configuration. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    // Basic validation for phone number format (without country code)
    // Accepts digits only
    const phoneRegex = /^\d{5,15}$/;

    if (!phoneNumber) {
      return 'Phone number is required';
    }

    if (!phoneRegex.test(phoneNumber)) {
      return 'Invalid format. Use digits only for the phone number.';
    }

    return '';
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return 'Email address is required';
    }

    if (!emailRegex.test(email)) {
      return 'Invalid email format. Please enter a valid email address.';
    }

    return '';
  };

  const handleNewSubscriptionChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      // When switching between email and whatsapp, reset relevant fields
      setPhoneNumberError('');
      setNewSubscription(prev => ({
        ...prev,
        phone_number: '',
        [name]: value
      }));
    } else if (name === 'phone_number') {
      // Clear previous error
      setPhoneNumberError('');

      if (newSubscription.type === 'whatsapp') {
        // Only allow digits for phone number
        const sanitizedValue = value.replace(/\D/g, '');
        setNewSubscription(prev => ({
          ...prev,
          [name]: sanitizedValue
        }));
      } else {
        // For email type, allow full email input
        setNewSubscription(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setNewSubscription(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSubscription = async () => {
    // Validate based on subscription type
    let error = '';
    if (newSubscription.type === 'whatsapp') {
      error = validatePhoneNumber(newSubscription.phone_number);
    } else if (newSubscription.type === 'email') {
      error = validateEmail(newSubscription.phone_number);
    }

    if (error) {
      setPhoneNumberError(error);
      return;
    }

    try {
      setIsSaving(true);
      let contactValue = newSubscription.phone_number;

      // Only prepend country code for whatsapp type
      if (newSubscription.type === 'whatsapp') {
        contactValue = newSubscription.country_code + newSubscription.phone_number;
      }

      const data = await clinicService.addClinicSubscription(clinicId, {
        phone_number: contactValue,
        role: newSubscription.role,
        description: newSubscription.description,
        type: newSubscription.type
      });

      setSubscriptions(prev => [...prev, data.subscription]);
      setNewSubscription({
        phone_number: '',
        role: 'default',
        country_code: '+852', // Reset to default
        description: '',
        type: 'whatsapp' // Reset to default
      });
      setSuccessMessage('Subscription added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error adding subscription to clinic ${clinicId}:`, err);
      setError('Failed to add subscription. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubscription = (subscription) => {
    // For whatsapp type, extract country code and phone number
    // For email type, just use the value directly
    if (subscription.type === 'whatsapp') {
      const { countryCode, phoneNumber } = splitPhoneNumber(subscription.phone_number);
      setEditingSubscription({
        ...subscription,
        country_code: countryCode,
        phone_number: phoneNumber,
        // Make sure type has a default value if not present
        type: subscription.type || 'whatsapp',
        // Description can be null
        description: subscription.description || ''
      });
    } else {
      // For email type, no need to split
      setEditingSubscription({
        ...subscription,
        country_code: '+852', // Default, not used for email
        phone_number: subscription.phone_number,
        // Make sure type has a default value if not present
        type: subscription.type || 'email',
        // Description can be null
        description: subscription.description || ''
      });
    }
  };

  const handleEditSubscriptionChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      // When switching between email and whatsapp, reset phone_number field
      setEditingSubscription(prev => ({
        ...prev,
        phone_number: '',
        [name]: value
      }));
    } else if (name === 'phone_number') {
      if (editingSubscription.type === 'whatsapp') {
        // Only allow digits for phone number
        const sanitizedValue = value.replace(/\D/g, '');
        setEditingSubscription(prev => ({
          ...prev,
          [name]: sanitizedValue
        }));
      } else {
        // For email type, allow full email input
        setEditingSubscription(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setEditingSubscription(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateSubscription = async () => {
    // Validate based on subscription type
    let error = '';
    if (editingSubscription.type === 'whatsapp') {
      error = validatePhoneNumber(editingSubscription.phone_number);
    } else if (editingSubscription.type === 'email') {
      error = validateEmail(editingSubscription.phone_number);
    }

    if (error) {
      setError(error);
      return;
    }

    try {
      setIsSaving(true);
      let contactValue = editingSubscription.phone_number;

      // Only prepend country code for whatsapp type
      if (editingSubscription.type === 'whatsapp') {
        contactValue = editingSubscription.country_code + editingSubscription.phone_number;
      }

      const data = await clinicService.updateClinicSubscription(
        clinicId,
        editingSubscription.id,
        {
          phone_number: contactValue,
          role: editingSubscription.role,
          is_active: editingSubscription.is_active,
          description: editingSubscription.description,
          type: editingSubscription.type
        }
      );
      setSubscriptions(prev =>
        prev.map(sub => sub.id === editingSubscription.id ? data.subscription : sub)
      );
      setEditingSubscription(null);
      setSuccessMessage('Subscription updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error updating subscription for clinic ${clinicId}:`, err);
      setError('Failed to update subscription. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSubscriptionStatus = async (subscriptionId, currentStatus) => {
    try {
      setIsSaving(true);
      const data = await clinicService.updateClinicSubscription(
        clinicId,
        subscriptionId,
        { is_active: !currentStatus }
      );
      setSubscriptions(prev =>
        prev.map(sub => sub.id === subscriptionId ? data.subscription : sub)
      );
      setSuccessMessage('Subscription status updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error toggling subscription status for clinic ${clinicId}:`, err);
      setError('Failed to update subscription status. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      setIsSaving(true);
      await clinicService.deleteClinicSubscription(clinicId, subscriptionId);
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
      setSuccessMessage('Subscription deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error deleting subscription for clinic ${clinicId}:`, err);
      setError('Failed to delete subscription. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExtractDocuments = async () => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to extract documents for this clinic? This process may take some time.')) {
      return;
    }

    try {
      setIsExtracting(true);
      setError(null);
      const result = await clinicService.extractDocuments(clinicId);

      // Refresh documents list after extraction
      const docsData = await clinicService.getClinicDocuments(clinicId);
      setDocuments(docsData.documents || []);

      setSuccessMessage('Documents extracted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error extracting documents for clinic ${clinicId}:`, err);
      setError('Failed to extract documents. Please try again later.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddDocument = async (newDocument) => {
    try {
      setIsSaving(true);
      const data = await clinicService.addClinicDocument(clinicId, newDocument);
      setDocuments(prev => [...prev, data.document]);
      setSuccessMessage('Document added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error adding document to clinic ${clinicId}:`, err);
      setError('Failed to add document. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateDocument = async (editingDocument) => {
    try {
      setIsSaving(true);
      const data = await clinicService.updateClinicDocument(
        clinicId,
        editingDocument.id,
        {
          name: editingDocument.name,
          document: editingDocument.document
        }
      );
      setDocuments(prev =>
        prev.map(doc => doc.id === editingDocument.id ? data.document : doc)
      );
      setSuccessMessage('Document updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error updating document for clinic ${clinicId}:`, err);
      setError('Failed to update document. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setIsSaving(true);
      await clinicService.deleteClinicDocument(clinicId, documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setSuccessMessage('Document deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Error deleting document for clinic ${clinicId}:`, err);
      setError('Failed to delete document. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Loading clinic details...</p>
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

  if (!clinic) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Clinic not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Breadcrumb navigation */}
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-500">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link to="/clinics" className="hover:text-blue-500">Clinics</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{clinic.name}</span>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            <Link
              to="/clinics"
              className="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center justify-center mr-4"
              title="Back to Clinics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold">{clinic.name}</h2>
            {clinic.status && (
              <span className={`ml-3 px-3 py-1 text-sm rounded-full ${ClinicStatusColor[clinic.status] || 'bg-gray-100 text-gray-800'}`}>
                {clinic.status}
              </span>
            )}
            <button
              onClick={handleUpdateStatus}
              className={`ml-3 px-2 py-0.5 rounded hover:opacity-90 transition-colors duration-200 flex items-center text-xs text-white bg-blue-600`}
              title="Update Status"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update Status
            </button>
          </div>
          <div className="flex space-x-3">
            {/* Icon buttons in the top bar */}
            <Link
              to={`/clinics/${clinic.id}/conversations`}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors duration-200"
              title="View Conversations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Conversations</span>
            </Link>
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2 transition-colors duration-200"
                title="Edit Configuration"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSaveChanges}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors duration-200"
                title="Save Configuration"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save</span>
              </button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-4 ${activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-2 px-4 ${activeTab === 'config'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('blockconfig')}
              className={`py-2 px-4 ${activeTab === 'blockconfig'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Block Configuration
            </button>
            <button
              onClick={() => setActiveTab('specialnotices')}
              className={`py-2 px-4 ${activeTab === 'specialnotices'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Special Notices
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-4 ${activeTab === 'documents'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('apitest')}
              className={`py-2 px-4 ${activeTab === 'apitest'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              API Test
            </button>
          </nav>
        </div>

        <div className="space-y-8">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedClinic.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <PhoneNumberInput
                    label="Concierge Number"
                    countryCode={phoneFields.contact_number.countryCode}
                    phoneNumber={phoneFields.contact_number.phoneNumber}
                    onCountryCodeChange={(code) => setPhoneFields(prev => ({
                      ...prev,
                      contact_number: { ...prev.contact_number, countryCode: code }
                    }))}
                    onPhoneNumberChange={(number) => setPhoneFields(prev => ({
                      ...prev,
                      contact_number: { ...prev.contact_number, phoneNumber: number }
                    }))}
                  />

                  <PhoneNumberInput
                    label="Clinic Number"
                    countryCode={phoneFields.clinic_whatsapp_number.countryCode}
                    phoneNumber={phoneFields.clinic_whatsapp_number.phoneNumber}
                    onCountryCodeChange={(code) => setPhoneFields(prev => ({
                      ...prev,
                      clinic_whatsapp_number: { ...prev.clinic_whatsapp_number, countryCode: code }
                    }))}
                    onPhoneNumberChange={(number) => setPhoneFields(prev => ({
                      ...prev,
                      clinic_whatsapp_number: { ...prev.clinic_whatsapp_number, phoneNumber: number }
                    }))}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editedClinic.description || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remark
                    </label>
                    <textarea
                      name="remark"
                      value={editedClinic.remark || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="flex items-center">
                    <span className="font-medium w-32 mr-4">ID:</span>
                    <span>{clinic.id}</span>
                    <button
                      onClick={handleUpdateId}
                      className="ml-4 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      title="Update Clinic ID"
                    >
                      Edit ID
                    </button>
                    <Tooltip text={fieldDescriptions.id} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32 mr-4">Name:</span>
                    <span>{clinic.name}</span>
                    <Tooltip text={fieldDescriptions.name} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32 mr-4">Concierge Number:</span>
                    <span>
                      {clinic.contact_number &&
                        `${clinic.contact_number.slice(0, 4)}-${clinic.contact_number.slice(4, 8)} ${clinic.contact_number.slice(8)}`}
                    </span>
                    <Tooltip text={fieldDescriptions.conciergeNumber} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32 mr-4">Clinic Number:</span>
                    <span>
                      {clinic.clinic_whatsapp_number &&
                        `${clinic.clinic_whatsapp_number.slice(0, 4)}-${clinic.clinic_whatsapp_number.slice(4, 8)} ${clinic.clinic_whatsapp_number.slice(8)}`}
                    </span>
                    <Tooltip text={fieldDescriptions.clinicNumber} />
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-32 mr-4">Description:</span>
                    <span>{clinic.description || 'No description'}</span>
                    <Tooltip text={fieldDescriptions.description} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32 mr-4">Created:</span>
                    <span>{new Date(clinic.created_at).toLocaleString()}</span>
                    <Tooltip text={fieldDescriptions.created} />
                  </p>
                  {clinic.remark && (
                    <div className="mb-3 flex items-start">
                      <strong className="mr-2">Remark:</strong>
                      <span>{clinic.remark}</span>
                      <Tooltip text={fieldDescriptions.remark} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Configuration Tab */}
          {activeTab === 'config' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Configuration</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Greeting Message
                      <Tooltip text={fieldDescriptions.voiceGreeting} />
                    </label>
                    <textarea
                      name="voice_greeting_message"
                      value={editedClinic.voice_greeting_message || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Success Message
                      <Tooltip text={fieldDescriptions.voiceSuccess} />
                    </label>
                    <textarea
                      name="voice_success_message"
                      value={editedClinic.voice_success_message || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Failure Message
                      <Tooltip text={fieldDescriptions.voiceFailure} />
                    </label>
                    <textarea
                      name="voice_failure_message"
                      value={editedClinic.voice_failure_message || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Language
                      <Tooltip text={fieldDescriptions.voiceLanguage} />
                    </label>
                    <input
                      type="text"
                      name="voice_language"
                      value={editedClinic.voice_language || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Name
                      <Tooltip text={fieldDescriptions.voiceName} />
                    </label>
                    <input
                      type="text"
                      name="voice_name"
                      value={editedClinic.voice_name || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center h-5">
                        <input
                          id="should_greet_with_recording"
                          name="should_greet_with_recording"
                          type="checkbox"
                          checked={editedClinic.should_greet_with_recording || false}
                          onChange={(e) => {
                            setEditedClinic(prev => ({
                              ...prev,
                              should_greet_with_recording: e.target.checked
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="should_greet_with_recording" className="font-medium text-gray-700">
                          Use voice recording instead of text-to-speech
                        </label>
                        <p className="text-gray-500">
                          When enabled, the system will use a pre-recorded greeting instead of generating one with text-to-speech.
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 space-x-2 mt-2">
                      <VoiceAssetManager
                        assetType="greeting_voice"
                        clinicId={clinicId}
                      />
                    </div>
                  </div>
                  <PhoneNumberInput
                    label="WABA Number"
                    countryCode={phoneFields.waba_number.countryCode}
                    phoneNumber={phoneFields.waba_number.phoneNumber}
                    onCountryCodeChange={(code) => setPhoneFields(prev => ({
                      ...prev,
                      waba_number: { ...prev.waba_number, countryCode: code }
                    }))}
                    onPhoneNumberChange={(number) => setPhoneFields(prev => ({
                      ...prev,
                      waba_number: { ...prev.waba_number, phoneNumber: number }
                    }))}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WABA Template ID
                      <Tooltip text={fieldDescriptions.wabaTemplate} />
                    </label>
                    <input
                      type="text"
                      name="waba_template_id"
                      value={editedClinic.waba_template_id || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WABA Template Variables
                      <Tooltip text={fieldDescriptions.wabaTemplateVariables} />
                    </label>
                    <textarea
                      name="waba_template_variables"
                      value={typeof editedClinic.waba_template_variables === 'object'
                        ? JSON.stringify(editedClinic.waba_template_variables, null, 2)
                        : editedClinic.waba_template_variables || '{}'}
                      onChange={(e) => {
                        let isValidJson = true;
                        try {
                          // Try to parse as JSON
                          const jsonValue = e.target.value.trim() ? JSON.parse(e.target.value) : {};
                          setEditedClinic(prev => ({
                            ...prev,
                            waba_template_variables: jsonValue,
                            waba_template_variables_error: null
                          }));
                        } catch (err) {
                          isValidJson = false;
                          // If not valid JSON, store as string
                          setEditedClinic(prev => ({
                            ...prev,
                            waba_template_variables: e.target.value,
                            waba_template_variables_error: 'Invalid JSON format'
                          }));
                        }
                      }}
                      className={`w-full p-2 border rounded font-mono text-sm ${editedClinic.waba_template_variables_error ? 'border-red-500' : 'border-gray-300'
                        }`}
                      rows="5"
                      placeholder="{}"
                    />
                    {editedClinic.waba_template_variables_error && (
                      <p className="mt-1 text-xs text-red-500">
                        {editedClinic.waba_template_variables_error}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter template variables in JSON format, e.g. {"\"name\": \"value\""} or {"\"var1\": \"value1\", \"var2\": \"value2\""}.
                      Make sure to use double quotes for keys and values.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Concierge Version
                      <Tooltip text={fieldDescriptions.conciergeVersion} />
                    </label>
                    <input
                      type="text"
                      name="concierge_version"
                      value={editedClinic.concierge_version || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Flowise Chatflow ID
                      <Tooltip text={fieldDescriptions.flowiseId} />
                    </label>
                    <input
                      type="text"
                      name="flowise_chatflow_id"
                      value={editedClinic.flowise_chatflow_id || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Summarize Instruction Prompt
                      <Tooltip text={fieldDescriptions.summarizePrompt} />
                    </label>
                    <textarea
                      name="summarize_instruction_prompt"
                      value={editedClinic.summarize_instruction_prompt || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Advanced Settings Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold mb-4">Advanced Settings</h4>

                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id="voice_mail_enabled"
                          name="voice_mail_enabled"
                          type="checkbox"
                          checked={editedClinic.settings?.voice_mail_enabled || false}
                          onChange={(e) => {
                            setEditedClinic(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings || {},
                                voice_mail_enabled: e.target.checked
                              }
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="voice_mail_enabled" className="font-medium text-gray-700">
                          Enable Voice Mail
                        </label>
                        <Tooltip text="When enabled, the system will allow patients to leave voice messages if they cannot be assisted immediately." />
                        <p className="text-gray-500">
                          When enabled, the system will allow patients to leave voice messages if they cannot be assisted immediately.
                        </p>
                      </div>
                    </div>

                    {editedClinic.settings?.voice_mail_enabled && (
                      <div className="flex space-x-4 mb-4">
                        <VoiceAssetManager
                          assetType="voice_mail_voice"
                          clinicId={clinicId}
                          checkButtonText="Check Voice Mail Asset"
                          uploadButtonText="Upload Asset"
                          assetFoundText="Voice mail recording found"
                          assetNotFoundText="Voice mail recording not found"
                        />
                        <VoiceAssetManager
                          assetType="voice_mail_anonymous_voice"
                          clinicId={clinicId}
                          checkButtonText="Check Anonymous Voice Mail Asset"
                          uploadButtonText="Upload Asset"
                          assetFoundText="Voice mail recording found"
                          assetNotFoundText="Voice mail recording not found"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appointment Booking Lead Time (hours)
                        <Tooltip text="The minimum number of hours in advance that a patient must book an appointment." />
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        name="booking_lead_time"
                        value={editedClinic.settings?.appointment?.booking_lead_time_in_hours || 2}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10) || 2;
                          setEditedClinic(prev => ({
                            ...prev,
                            settings: {
                              ...prev.settings || {},
                              appointment: {
                                ...(prev.settings?.appointment || {}),
                                booking_lead_time_in_hours: value
                              }
                            }
                          }));
                        }}
                        className="w-full p-2 border rounded"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        The minimum number of hours in advance that a patient must book an appointment.
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <p className="flex items-start">
                    <span className="font-medium w-32 mr-4">Voice Greeting:</span>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${clinic.should_greet_with_recording
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {clinic.should_greet_with_recording ? 'Recording' : 'Text-to-Speech'}
                          </span>
                          <span>{clinic.voice_greeting_message || 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                    <Tooltip text={fieldDescriptions.voiceGreeting} />
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-32">Voice Success:</span>
                    <span>{clinic.voice_success_message || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.voiceSuccess} />
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-32">Voice Failure:</span>
                    <span>{clinic.voice_failure_message || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.voiceFailure} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Voice Language:</span>
                    <span>{clinic.voice_language || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.voiceLanguage} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Voice Name:</span>
                    <span>{clinic.voice_name || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.voiceName} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">WABA Number:</span>
                    <span>{clinic.waba_number || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.wabaNumber} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">WABA Template:</span>
                    <span>{clinic.waba_template_id || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.wabaTemplate} />
                  </p>
                  <p className="flex items-start">
                    <span className="font-medium w-32">WABA Variables:</span>
                    <span className="font-mono text-sm bg-gray-50 p-2 rounded max-w-xl overflow-auto whitespace-pre">
                      {clinic.waba_template_variables ?
                        typeof clinic.waba_template_variables === 'object'
                          ? JSON.stringify(clinic.waba_template_variables, null, 2)
                          : clinic.waba_template_variables
                        : 'Not set'}
                    </span>
                    <Tooltip text={fieldDescriptions.wabaTemplateVariables} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Concierge Ver:</span>
                    <span>{clinic.concierge_version || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.conciergeVersion} />
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-32">Flowise ID:</span>
                    <span>{clinic.flowise_chatflow_id || 'Not set'}</span>
                    <Tooltip text={fieldDescriptions.flowiseId} />
                  </p>

                  {/* Advanced Settings in View Mode */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold mb-4">Advanced Settings</h4>

                    <p className="flex items-center">
                      <span className="font-medium w-32">Voice Mail:</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${clinic.settings?.voice_mail_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {clinic.settings?.voice_mail_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <Tooltip text="When enabled, the system will allow patients to leave voice messages if they cannot be assisted immediately." />
                    </p>

                    <p className="flex items-center mt-2">
                      <span className="font-medium w-32">Booking Lead Time:</span>
                      <span>{clinic.settings?.appointment?.booking_lead_time_in_hours || 2} hours</span>
                      <Tooltip text="The minimum number of hours in advance that a patient must book an appointment." />
                    </p>
                  </div>
                </div>
              )}

              {/* Subscriptions Section */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Assistant Subscriptions</h3>

                <div className="mb-6 p-4 border rounded bg-white">
                  {/* Header with Add Button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Manage Assistant Subscriptions</h3>
                    <button
                      onClick={() => setShowAddSubscriptionForm(!showAddSubscriptionForm)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    >
                      {showAddSubscriptionForm ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Hide Form
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add New Subscription
                        </>
                      )}
                    </button>
                  </div>

                  {/* Add New Subscription Form - Only shown when showAddSubscriptionForm is true */}
                  {showAddSubscriptionForm && (
                    <div className="mb-6 p-4 border rounded bg-white">
                      <h4 className="text-md font-medium mb-3">Add New Subscription</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            name="type"
                            value={newSubscription.type}
                            onChange={handleNewSubscriptionChange}
                            className="w-full p-2 border rounded"
                          >
                            <option value="whatsapp">WhatsApp</option>
                            <option value="email">Email</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {newSubscription.type === 'whatsapp' ? 'Phone Number' : 'Email Address'}
                          </label>
                          {newSubscription.type === 'whatsapp' ? (
                            <div className="flex space-x-2">
                              <div className="w-1/3">
                                <select
                                  name="country_code"
                                  value={newSubscription.country_code}
                                  onChange={handleNewSubscriptionChange}
                                  className="w-full p-2 border rounded"
                                >
                                  {countryCodes.map((code) => (
                                    <option key={code.code} value={code.code}>
                                      {code.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="w-2/3">
                                <input
                                  type="text"
                                  name="phone_number"
                                  value={newSubscription.phone_number}
                                  onChange={handleNewSubscriptionChange}
                                  className={`w-full p-2 border rounded ${phoneNumberError ? 'border-red-500' : ''}`}
                                  placeholder="Enter phone number (digits only)"
                                />
                              </div>
                            </div>
                          ) : (
                            <input
                              type="email"
                              name="phone_number"
                              value={newSubscription.phone_number}
                              onChange={handleNewSubscriptionChange}
                              className={`w-full p-2 border rounded ${phoneNumberError ? 'border-red-500' : ''}`}
                              placeholder="Enter email address"
                            />
                          )}
                          {phoneNumberError && (
                            <p className="mt-1 text-sm text-red-600">{phoneNumberError}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            {newSubscription.type === 'whatsapp'
                              ? 'Enter the phone number without spaces or special characters'
                              : 'Enter a valid email address'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            name="role"
                            value={newSubscription.role}
                            onChange={handleNewSubscriptionChange}
                            className="w-full p-2 border rounded"
                          >
                            <option value="default">Default</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                          </label>
                          <input
                            type="text"
                            name="description"
                            value={newSubscription.description}
                            onChange={handleNewSubscriptionChange}
                            className="w-full p-2 border rounded"
                            placeholder="Enter a description for this subscription"
                          />
                        </div>
                        <button
                          onClick={handleAddSubscription}
                          disabled={isSaving || !newSubscription.phone_number}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                          {isSaving ? 'Adding...' : 'Add Subscription'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subscription List */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Existing Subscriptions</h4>

                    {subscriptions.length === 0 ? (
                      <p className="text-gray-500">No subscriptions found for this clinic.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-2 px-4 border text-left">Contact</th>
                              <th className="py-2 px-4 border text-left">Type</th>
                              <th className="py-2 px-4 border text-left">Role</th>
                              <th className="py-2 px-4 border text-left">Description</th>
                              <th className="py-2 px-4 border text-left">Status</th>
                              <th className="py-2 px-4 border text-left">Created</th>
                              <th className="py-2 px-4 border text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscriptions.map((subscription) => (
                              <tr key={subscription.id} className="border-t">
                                {editingSubscription && editingSubscription.id === subscription.id ? (
                                  <>
                                    <td className="py-2 px-4 border">
                                      {editingSubscription.type === 'whatsapp' ? (
                                        <div className="flex space-x-2">
                                          <div className="w-2/5">
                                            <select
                                              name="country_code"
                                              value={editingSubscription.country_code}
                                              onChange={handleEditSubscriptionChange}
                                              className="w-full p-1 border rounded text-sm"
                                            >
                                              {countryCodes.map((code) => (
                                                <option key={code.code} value={code.code}>
                                                  {code.name}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="w-3/5">
                                            <input
                                              type="text"
                                              name="phone_number"
                                              value={editingSubscription.phone_number}
                                              onChange={handleEditSubscriptionChange}
                                              className="w-full p-1 border rounded"
                                              placeholder="Enter phone number (digits only)"
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <input
                                          type="email"
                                          name="phone_number"
                                          value={editingSubscription.phone_number}
                                          onChange={handleEditSubscriptionChange}
                                          className="w-full p-1 border rounded"
                                          placeholder="Enter email address"
                                        />
                                      )}
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <select
                                        name="type"
                                        value={editingSubscription.type}
                                        onChange={handleEditSubscriptionChange}
                                        className="w-full p-1 border rounded"
                                      >
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="email">Email</option>
                                      </select>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <select
                                        name="role"
                                        value={editingSubscription.role}
                                        onChange={handleEditSubscriptionChange}
                                        className="w-full p-1 border rounded"
                                      >
                                        <option value="default">Default</option>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                      </select>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <input
                                        type="text"
                                        name="description"
                                        value={editingSubscription.description || ''}
                                        onChange={handleEditSubscriptionChange}
                                        className="w-full p-1 border rounded"
                                        placeholder="Enter description"
                                      />
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <select
                                        name="is_active"
                                        value={editingSubscription.is_active}
                                        onChange={handleEditSubscriptionChange}
                                        className="w-full p-1 border rounded"
                                      >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                      </select>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      {new Date(subscription.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={handleUpdateSubscription}
                                          disabled={isSaving}
                                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                                        >
                                          {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                          onClick={() => setEditingSubscription(null)}
                                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="py-2 px-4 border">
                                      <div className="flex items-center">
                                        {subscription.type === 'whatsapp' ? (
                                          (() => {
                                            const { countryCode, phoneNumber } = splitPhoneNumber(subscription.phone_number);
                                            return (
                                              <>
                                                <span className="font-medium mr-1">{countryCode}</span>
                                                <span>{phoneNumber}</span>
                                              </>
                                            );
                                          })()
                                        ) : (
                                          <span className="text-blue-600">{subscription.phone_number}</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <span className="capitalize">
                                        {subscription.type || (subscription.phone_number && subscription.phone_number.includes('@') ? 'email' : 'whatsapp')}
                                      </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <span className="capitalize">{subscription.role}</span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <span>{subscription.description || '-'}</span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${subscription.is_active
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                          }`}
                                      >
                                        {subscription.is_active ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-4 border">
                                      {new Date(subscription.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEditSubscription(subscription)}
                                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSubscription(subscription.id)}
                                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Block Configuration Tab */}
          {activeTab === 'blockconfig' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <BlockConfigSection clinicId={clinicId} />
            </div>
          )}

          {/* Special Notices Tab */}
          {activeTab === 'specialnotices' && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <SpecialNoticesSection clinicId={clinicId} />
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <DocumentsSection
              clinic={clinic}
              documents={documents}
              documentsTableExists={documentsTableExists}
              documentsTableError={documentsTableError}
              onAddDocument={handleAddDocument}
              onUpdateDocument={handleUpdateDocument}
              onDeleteDocument={handleDeleteDocument}
              onExtractDocuments={handleExtractDocuments}
              isSaving={isSaving}
              isExtracting={isExtracting}
              fieldDescriptions={fieldDescriptions}
            />
          )}

          {/* API Test Tab */}
          {activeTab === 'apitest' && (
            <ApiTestSection clinic={clinic} />
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {clinic && (
        <StatusModal
          show={showStatusModal}
          clinic={clinic}
          selectedStatus={selectedStatus}
          onStatusSelect={handleStatusSelect}
          onConfirm={handleStatusConfirm}
          onCancel={handleStatusCancel}
        />
      )}

      {/* ID Update Modal */}
      {clinic && (
        <IdUpdateModal
          show={showIdUpdateModal}
          clinic={clinic}
          onConfirm={handleIdUpdateConfirm}
          onCancel={handleIdUpdateCancel}
        />
      )}
    </>
  );
};

export default ClinicDetail;
