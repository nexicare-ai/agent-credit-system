import React, { createContext, useState, useContext, useCallback } from 'react';
import { clinicService } from '../services/api';

// Create the context
const ClinicContext = createContext();

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

// Provider component
export const ClinicProvider = ({ children }) => {
  // State
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
  const [newDocument, setNewDocument] = useState({ name: '', document: '' });
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentsTableExists, setDocumentsTableExists] = useState(true);
  const [documentsTableError, setDocumentsTableError] = useState(null);
  const [newSubscription, setNewSubscription] = useState({ 
    phone_number: '', 
    role: 'default',
    country_code: '+852' // Default country code
  });
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [showAddSubscriptionForm, setShowAddSubscriptionForm] = useState(false);
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);

  // Helper functions for phone number formatting
  const getCountryCodeFromNumber = useCallback((fullNumber) => {
    for (const code of countryCodes) {
      if (fullNumber.startsWith(code.code)) {
        return code.code;
      }
    }
    return '+852'; // Default to Hong Kong
  }, []);

  const formatPhoneNumberWithoutCountryCode = useCallback((fullNumber) => {
    const countryCode = getCountryCodeFromNumber(fullNumber);
    return fullNumber.substring(countryCode.length);
  }, [getCountryCodeFromNumber]);

  // Check if documents table exists
  const checkDocumentsTable = useCallback(async () => {
    try {
      const response = await clinicService.checkDocumentsTable();
      setDocumentsTableExists(response.exists);
      if (!response.exists) {
        setDocumentsTableError(response.error);
      }
    } catch (error) {
      console.error('Error checking documents table:', error);
      setDocumentsTableExists(false);
      setDocumentsTableError('Failed to check documents table status');
    }
  }, []);

  const fetchClinicDetail = useCallback(async (clinicId) => {
    setLoading(true);
    try {
      const clinicData = await clinicService.getClinicById(clinicId);
      setClinic(clinicData);
      setEditedClinic({ ...clinicData });
      
      // Fetch documents if table exists
      if (documentsTableExists) {
        try {
          const docsData = await clinicService.getDocumentsByClinicId(clinicId);
          setDocuments(docsData);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
      
      // Fetch subscriptions
      try {
        const subsData = await clinicService.getSubscriptionsByClinicId(clinicId);
        setSubscriptions(subsData);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load clinic details');
      setLoading(false);
      console.error(err);
    }
  }, [documentsTableExists]);

  const handleToggleStatus = useCallback(async (clinicId) => {
    setIsSaving(true);
    try {
      const updatedClinic = await clinicService.updateClinic(clinicId, {
        is_active: !clinic.is_active
      });
      setClinic(updatedClinic);
      setEditedClinic({ ...updatedClinic });
      setSuccessMessage(`Clinic ${updatedClinic.is_active ? 'activated' : 'deactivated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error toggling clinic status:', error);
      setError('Failed to update clinic status');
    } finally {
      setIsSaving(false);
    }
  }, [clinic]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setEditedClinic({ ...clinic });
  }, [clinic]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedClinic({ ...clinic });
  }, [clinic]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedClinic(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSaveChanges = useCallback(async (clinicId) => {
    setIsSaving(true);
    try {
      const updatedClinic = await clinicService.updateClinic(clinicId, editedClinic);
      setClinic(updatedClinic);
      setIsEditing(false);
      setSuccessMessage('Clinic updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating clinic:', error);
      setError('Failed to update clinic');
    } finally {
      setIsSaving(false);
    }
  }, [editedClinic]);

  const handleNewDocumentChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleAddDocument = useCallback(async (clinicId) => {
    if (!newDocument.name || !newDocument.document) return;
    
    setIsSaving(true);
    try {
      const documentData = {
        ...newDocument,
        clinic_id: clinicId
      };
      
      const addedDocument = await clinicService.addDocument(documentData);
      setDocuments(prev => [...prev, addedDocument]);
      setNewDocument({ name: '', document: '' });
      setShowAddDocumentForm(false);
      setSuccessMessage('Document added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding document:', error);
      setError('Failed to add document');
    } finally {
      setIsSaving(false);
    }
  }, [newDocument]);

  const handleEditDocument = useCallback((document) => {
    setEditingDocument({ ...document });
  }, []);

  const handleEditDocumentChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditingDocument(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleUpdateDocument = useCallback(async () => {
    if (!editingDocument.name || !editingDocument.document) return;
    
    setIsSaving(true);
    try {
      const updatedDocument = await clinicService.updateDocument(
        editingDocument.id,
        {
          name: editingDocument.name,
          document: editingDocument.document
        }
      );
      
      setDocuments(prev => 
        prev.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
      );
      
      setEditingDocument(null);
      setSuccessMessage('Document updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Failed to update document');
    } finally {
      setIsSaving(false);
    }
  }, [editingDocument]);

  const handleDeleteDocument = useCallback(async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    setIsSaving(true);
    try {
      await clinicService.deleteDocument(documentId);
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setSuccessMessage('Document deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('Failed to delete document');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber) => {
    // Basic validation - only digits allowed
    if (!/^\d+$/.test(phoneNumber)) {
      setPhoneNumberError('Phone number should contain only digits');
      return false;
    }
    
    // Check if phone number already exists
    const fullNumber = newSubscription.country_code + phoneNumber;
    const exists = subscriptions.some(sub => sub.phone_number === fullNumber);
    
    if (exists) {
      setPhoneNumberError('This phone number is already subscribed');
      return false;
    }
    
    setPhoneNumberError('');
    return true;
  }, [newSubscription.country_code, subscriptions]);

  const handleNewSubscriptionChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
      // Only update if the value contains only digits or is empty
      if (/^\d*$/.test(value)) {
        setNewSubscription(prev => ({
          ...prev,
          [name]: value
        }));
        
        // Validate as user types, but only if there's a value
        if (value) {
          validatePhoneNumber(value);
        } else {
          setPhoneNumberError('');
        }
      }
    } else {
      setNewSubscription(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, [validatePhoneNumber]);

  const handleAddSubscription = useCallback(async (clinicId) => {
    if (!newSubscription.phone_number) return;
    
    // Validate phone number before submitting
    if (!validatePhoneNumber(newSubscription.phone_number)) {
      return;
    }
    
    setIsSaving(true);
    try {
      const subscriptionData = {
        phone_number: newSubscription.country_code + newSubscription.phone_number,
        role: newSubscription.role,
        clinic_id: clinicId
      };
      
      const addedSubscription = await clinicService.addSubscription(subscriptionData);
      setSubscriptions(prev => [...prev, addedSubscription]);
      setNewSubscription({ 
        phone_number: '', 
        role: 'default',
        country_code: '+852'
      });
      setShowAddSubscriptionForm(false);
      setSuccessMessage('Subscription added successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding subscription:', error);
      setError('Failed to add subscription');
    } finally {
      setIsSaving(false);
    }
  }, [newSubscription, validatePhoneNumber]);

  const handleEditSubscription = useCallback((subscription) => {
    // Extract country code and phone number
    const countryCode = getCountryCodeFromNumber(subscription.phone_number);
    const phoneNumber = subscription.phone_number.substring(countryCode.length);
    
    setEditingSubscription({
      ...subscription,
      country_code: countryCode,
      phone_number: phoneNumber
    });
  }, [getCountryCodeFromNumber]);

  const handleEditSubscriptionChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'phone_number') {
      // Only update if the value contains only digits or is empty
      if (/^\d*$/.test(value)) {
        setEditingSubscription(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'is_active') {
      // Convert string to boolean for is_active
      setEditingSubscription(prev => ({
        ...prev,
        [name]: value === 'true'
      }));
    } else {
      setEditingSubscription(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleUpdateSubscription = useCallback(async () => {
    if (!editingSubscription.phone_number) return;
    
    setIsSaving(true);
    try {
      const subscriptionData = {
        phone_number: editingSubscription.country_code + editingSubscription.phone_number,
        role: editingSubscription.role,
        is_active: editingSubscription.is_active
      };
      
      const updatedSubscription = await clinicService.updateSubscription(
        editingSubscription.id,
        subscriptionData
      );
      
      setSubscriptions(prev => 
        prev.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub)
      );
      
      setEditingSubscription(null);
      setSuccessMessage('Subscription updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription');
    } finally {
      setIsSaving(false);
    }
  }, [editingSubscription]);

  const handleToggleSubscriptionStatus = useCallback(async (subscriptionId, currentStatus) => {
    setIsSaving(true);
    try {
      const updatedSubscription = await clinicService.updateSubscription(
        subscriptionId,
        { is_active: !currentStatus }
      );
      
      setSubscriptions(prev => 
        prev.map(sub => sub.id === updatedSubscription.id ? updatedSubscription : sub)
      );
      
      setSuccessMessage(`Subscription ${updatedSubscription.is_active ? 'activated' : 'deactivated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error toggling subscription status:', error);
      setError('Failed to update subscription status');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleDeleteSubscription = useCallback(async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }
    
    setIsSaving(true);
    try {
      await clinicService.deleteSubscription(subscriptionId);
      
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
      setSuccessMessage('Subscription deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setError('Failed to delete subscription');
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Combine all values and functions to be provided
  const value = {
    // State
    clinic,
    documents,
    subscriptions,
    loading,
    error,
    isEditing,
    editedClinic,
    isSaving,
    successMessage,
    activeTab,
    newDocument,
    editingDocument,
    documentsTableExists,
    documentsTableError,
    newSubscription,
    editingSubscription,
    phoneNumberError,
    showAddSubscriptionForm,
    showAddDocumentForm,
    countryCodes,
    
    // Setters
    setActiveTab,
    setShowAddSubscriptionForm,
    setShowAddDocumentForm,
    
    // Functions
    checkDocumentsTable,
    fetchClinicDetail,
    handleToggleStatus,
    handleEditClick,
    handleCancelEdit,
    handleInputChange,
    handleSaveChanges,
    handleNewDocumentChange,
    handleAddDocument,
    handleEditDocument,
    handleEditDocumentChange,
    handleUpdateDocument,
    handleDeleteDocument,
    validatePhoneNumber,
    handleNewSubscriptionChange,
    handleAddSubscription,
    handleEditSubscription,
    handleEditSubscriptionChange,
    handleUpdateSubscription,
    handleToggleSubscriptionStatus,
    handleDeleteSubscription,
    getCountryCodeFromNumber,
    formatPhoneNumberWithoutCountryCode
  };

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
};

// Custom hook to use the clinic context
export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

export default ClinicContext; 