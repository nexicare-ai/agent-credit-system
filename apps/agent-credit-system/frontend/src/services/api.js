import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Determine the API base URL dynamically
const getBaseUrl = () => {
  // If environment variable is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Otherwise, derive it from the current host
  const { protocol, hostname, port } = window.location;

  // If we're running on localhost with a specific port for frontend
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For local development, the backend is typically running on port 8020
    return 'http://localhost:8100';
  }

  // For production, use the same origin since the FastAPI backend serves the frontend
  // The backend handles API routes with the /api prefix
  return window.location.origin;
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('token');

      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API functions for authentication
export const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/api/auth/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    if (!userId) return null;
    try {
      const response = await api.get(`/api/auth/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user with ID ${userId}:`, error);
      return { username: userId.substring(0, 8), id: userId };
    }
  },
};

// API functions for clinics
export const clinicService = {
  // Get all clinics with pagination and search
  getClinics: async (page = 1, search = '', status = 'all') => {
    try {
      const response = await api.get(`/api/clinics`, {
        params: {
          page,
          search: search || undefined,
          status: status !== 'all' ? status : undefined
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  },

  // Create a new clinic
  createClinic: async (clinicData) => {
    try {
      const response = await api.post('/api/clinics', clinicData);
      return response.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  },

  // Get clinic details
  getClinicDetails: async (clinicId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Alias for getClinicDetails for backward compatibility
  getClinicById: async (clinicId) => {
    return clinicService.getClinicDetails(clinicId);
  },

  // Update clinic configuration
  updateClinic: async (clinicId, clinicData) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}`, clinicData);
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Update clinic status
  updateClinicStatus: async (clinicId, status) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic ${clinicId} status:`, error);
      throw error;
    }
  },

  // Update clinic ID
  updateClinicId: async (clinicId, newId) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/update-id`, { new_id: newId });
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic ${clinicId} ID:`, error);
      throw error;
    }
  },

  // Toggle clinic status (for backward compatibility)
  toggleClinicStatus: async (clinicId) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling clinic ${clinicId} status:`, error);
      throw error;
    }
  },

  // Get clinic documents
  getClinicDocuments: async (clinicId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for clinic ${clinicId}:`, error);
      // Return empty documents array on error to prevent UI crashes
      return { documents: [] };
    }
  },

  // Add a document to a clinic
  addClinicDocument: async (clinicId, documentData) => {
    try {
      const response = await api.post(`/api/clinics/${clinicId}/documents`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Error adding document to clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Update a clinic document
  updateClinicDocument: async (clinicId, documentId, documentData) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating document ${documentId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Delete a clinic document
  deleteClinicDocument: async (clinicId, documentId) => {
    try {
      const response = await api.delete(`/api/clinics/${clinicId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${documentId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Get conversations for a clinic
  getClinicConversations: async (clinicId, page = 1, perPage = 5, search = '') => {
    try {
      const response = await api.get(`/api/conversations/clinic/${clinicId}`, {
        params: { page, per_page: perPage, search: search || undefined },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversations for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Get conversation details
  getConversationDetails: async (clinicId, conversationId) => {
    try {
      const response = await api.get(`/api/conversations/clinic/${clinicId}/detail/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Alias for getConversationDetails for backward compatibility
  getConversationDetail: async (clinicId, conversationId) => {
    return clinicService.getConversationDetails(clinicId, conversationId);
  },

  // Get messages for a conversation
  getConversationMessages: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Check if the documents table exists
  checkDocumentsTable: async () => {
    try {
      const response = await api.get(`/api/clinics/check-documents-table`);
      return response.data;
    } catch (error) {
      console.error('Error checking documents table:', error);
      return { exists: false, error: error.message };
    }
  },

  // Get clinic subscriptions
  getClinicSubscriptions: async (clinicId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/subscriptions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscriptions for clinic ${clinicId}:`, error);
      // Return empty subscriptions array on error to prevent UI crashes
      return { subscriptions: [] };
    }
  },

  // Add a subscription to a clinic
  addClinicSubscription: async (clinicId, subscriptionData) => {
    try {
      const response = await api.post(`/api/clinics/${clinicId}/subscriptions`, subscriptionData);
      return response.data;
    } catch (error) {
      console.error(`Error adding subscription to clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Update a clinic subscription
  updateClinicSubscription: async (clinicId, subscriptionId, subscriptionData) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/subscriptions/${subscriptionId}`, subscriptionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription ${subscriptionId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Delete a clinic subscription
  deleteClinicSubscription: async (clinicId, subscriptionId) => {
    try {
      const response = await api.delete(`/api/clinics/${clinicId}/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting subscription ${subscriptionId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  checkVoiceAsset: async (clinicId, assetType) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/asset/${assetType}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking voice asset for clinic ${clinicId}:`, error);
      return {
        exists: false,
        error: error.message
      };
    }
  },

  uploadVoiceAsset: async (clinicId, assetType, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/clinics/${clinicId}/asset/${assetType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading voice asset for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Check if greeting voice asset exists
  checkGreetingVoiceAsset: async (clinicId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/asset/greeting_voice`);
      return response.data;
    } catch (error) {
      console.error(`Error checking greeting voice asset for clinic ${clinicId}:`, error);
      return {
        exists: false,
        error: error.message
      };
    }
  },

  // Upload greeting voice asset
  uploadGreetingVoiceAsset: async (clinicId, file) => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/clinics/${clinicId}/asset/greeting_voice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading greeting voice asset for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  checkVoiceMailGreetingAsset: async (clinicId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/asset/voice_mail_voice`);
      return response.data;
    } catch (error) {
      console.error(`Error checking voice mail greeting asset for clinic ${clinicId}:`, error);
      return {
        exists: false,
        error: error.message
      };
    }
  },

  uploadVoiceMailGreetingAsset: async (clinicId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/api/clinics/${clinicId}/asset/voice_mail_voice`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading voice mail greeting asset for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Extract documents for a clinic
  extractDocuments: async (clinicId) => {
    try {
      const response = await api.post(`/api/clinics/${clinicId}/extract-documents`);
      return response.data;
    } catch (error) {
      console.error(`Error extracting documents for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Notify clinic by human through conversation
  notifyClinicByHuman: async (conversationId, message) => {
    try {
      const response = await api.post(`/api/conversations/${conversationId}/notify_clinic_by_human`, { message_body: message });
      return response.data;
    } catch (error) {
      console.error(`Error notifying clinic for conversation ${conversationId}:`, error);
      throw error;
    }
  },

  // Get appointments for a conversation
  getConversationAppointments: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/appointments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for conversation ${conversationId}:`, error);
      // Return empty appointments array on error to prevent UI crashes
      return { appointments: [] };
    }
  },

  // Get conversation events
  getConversationEvents: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation events:', error);
      throw error;
    }
  },

  // Get block configuration for a clinic
  getClinicBlockConfig: async (clinicId, futureOnly = false) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/block-config`, {
        params: { future_only: futureOnly }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching block config for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Apply 2025 holidays to clinic block configuration
  applyHolidays: async (clinicId, doctorId = null) => {
    try {
      const response = await api.post(`/api/clinics/${clinicId}/block-config/apply-holidays`, {
        doctor_id: doctorId
      });
      return response.data;
    } catch (error) {
      console.error(`Error applying holidays to clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Add a new block to clinic configuration
  addClinicBlock: async (clinicId, blockData) => {
    try {
      const timezoneOffset = new Date().getTimezoneOffset() / 60;
      if (blockData.block_from) {
        blockData.block_from = dayjs(blockData.block_from).subtract(timezoneOffset, 'hours').utc().format();
      }
      if (blockData.block_until) {
        blockData.block_until = dayjs(blockData.block_until).subtract(timezoneOffset, 'hours').utc().format();
      }
      // Ensure dates are in UTC format without changing the time
      const sanitizedBlockData = {
        ...blockData,
      };
      const response = await api.post(`/api/clinics/${clinicId}/block-config/blocks`, sanitizedBlockData);
      return response.data;
    } catch (error) {
      console.error(`Error adding block to clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Update an existing block in clinic configuration
  updateClinicBlock: async (clinicId, blockId, blockData) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/block-config/blocks/${blockId}`, blockData);
      return response.data;
    } catch (error) {
      console.error(`Error updating block ${blockId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Delete a block from clinic configuration
  deleteClinicBlock: async (clinicId, blockId) => {
    try {
      const response = await api.delete(`/api/clinics/${clinicId}/block-config/blocks/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting block ${blockId} from clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Get a specific block from clinic configuration
  getClinicBlock: async (clinicId, blockId) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/block-config/blocks/${blockId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching block ${blockId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Get special notices for a clinic
  getClinicSpecialNotices: async (clinicId, futureOnly = false) => {
    try {
      const response = await api.get(`/api/clinics/${clinicId}/special-notices`, {
        params: { future_only: futureOnly }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching special notices for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Add a new special notice
  addClinicSpecialNotice: async (clinicId, noticeData) => {
    try {
      const response = await api.post(`/api/clinics/${clinicId}/special-notices`, noticeData);
      return response.data;
    } catch (error) {
      console.error(`Error adding special notice to clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Update an existing special notice
  updateClinicSpecialNotice: async (clinicId, noticeId, noticeData) => {
    try {
      const response = await api.put(`/api/clinics/${clinicId}/special-notices/${noticeId}`, noticeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating special notice ${noticeId} for clinic ${clinicId}:`, error);
      throw error;
    }
  },

  // Delete a special notice
  deleteClinicSpecialNotice: async (clinicId, noticeId) => {
    try {
      const response = await api.delete(`/api/clinics/${clinicId}/special-notices/${noticeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting special notice ${noticeId} from clinic ${clinicId}:`, error);
      throw error;
    }
  },
};

// API functions for testing
export const testingService = {
  // Test agent API
  testAgentPrediction: async (requestData) => {
    try {
      const response = await api.post('/api/testing/agent/prediction', requestData);
      return response.data;
    } catch (error) {
      console.error('Error testing agent prediction:', error);
      // Return a structured error response to maintain consistent format
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to test agent prediction'
      };
    }
  },

  // Save test conversation
  saveConversation: async (clinicId, sessionId, name, chatHistory) => {
    try {
      const response = await api.post('/api/testing/conversations/save', {
        clinic_id: clinicId,
        session_id: sessionId,
        name,
        chat_history: chatHistory
      });
      return response.data;
    } catch (error) {
      console.error('Error saving test conversation:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to save conversation'
      };
    }
  },

  // Get saved conversations
  getSavedConversations: async (clinicId) => {
    try {
      const response = await api.get(`/api/testing/conversations?clinic_id=${clinicId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting saved conversations:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || 'Failed to get saved conversations'
      };
    }
  },
};

// API functions for analytics
export const analyticsService = {
  // Get analytics events summary
  getEventsSummary: async (days = 7, clinicId = null) => {
    try {
      const params = { days };
      if (clinicId) {
        params.reference_id = clinicId;
      }

      const response = await api.get('/api/analytics/events/summary', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  },

  // Get events by type
  getEventsByType: async (eventType, clinicId = null, limit = 100) => {
    try {
      const params = { limit };
      if (clinicId) {
        params.reference_id = clinicId;
      }

      const response = await api.get(`/api/analytics/events/by-type/${eventType}`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching events of type ${eventType}:`, error);
      throw error;
    }
  }
};

// API functions for consumables
export const consumableService = {
  // Get all consumables with pagination
  getConsumables: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/api/consumables', {
        params: {
          skip: (page - 1) * limit,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching consumables:', error);
      throw error;
    }
  },

  // Create a new consumable
  createConsumable: async (consumableData) => {
    try {
      const response = await api.post('/api/consumables', consumableData);
      return response.data;
    } catch (error) {
      console.error('Error creating consumable:', error);
      throw error;
    }
  },

  // Get a specific consumable
  getConsumable: async (consumableId) => {
    try {
      const response = await api.get(`/api/consumables/${consumableId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching consumable ${consumableId}:`, error);
      throw error;
    }
  },

  // Update a consumable
  updateConsumable: async (consumableId, consumableData) => {
    try {
      const response = await api.put(`/api/consumables/${consumableId}`, consumableData);
      return response.data;
    } catch (error) {
      console.error(`Error updating consumable ${consumableId}:`, error);
      throw error;
    }
  },

  // Delete a consumable
  deleteConsumable: async (consumableId) => {
    try {
      await api.delete(`/api/consumables/${consumableId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting consumable ${consumableId}:`, error);
      throw error;
    }
  },

  // Apply a consumable to a user (update user's credit)
  applyConsumable: async (consumableId, userId, description = '') => {
    try {
      const response = await api.post(`/api/consumables/${consumableId}/apply`, {
        user_id: userId,
        description
      });
      return response.data;
    } catch (error) {
      console.error(`Error applying consumable ${consumableId} to user ${userId}:`, error);
      throw error;
    }
  }
};

// API functions for purchasables
export const purchasableService = {
  // Get all purchasables with pagination
  getPurchasables: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/api/purchasables', {
        params: {
          skip: (page - 1) * limit,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching purchasables:', error);
      throw error;
    }
  },

  // Create a new purchasable
  createPurchasable: async (purchasableData) => {
    try {
      const response = await api.post('/api/purchasables', purchasableData);
      return response.data;
    } catch (error) {
      console.error('Error creating purchasable:', error);
      throw error;
    }
  },

  // Get a specific purchasable
  getPurchasable: async (purchasableId) => {
    try {
      const response = await api.get(`/api/purchasables/${purchasableId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching purchasable ${purchasableId}:`, error);
      throw error;
    }
  },

  // Update a purchasable
  updatePurchasable: async (purchasableId, purchasableData) => {
    try {
      const response = await api.put(`/api/purchasables/${purchasableId}`, purchasableData);
      return response.data;
    } catch (error) {
      console.error(`Error updating purchasable ${purchasableId}:`, error);
      throw error;
    }
  },

  // Delete a purchasable
  deletePurchasable: async (purchasableId) => {
    try {
      await api.delete(`/api/purchasables/${purchasableId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting purchasable ${purchasableId}:`, error);
      throw error;
    }
  },

  // Apply a purchasable to a user (add to user's credit)
  applyPurchasable: async (purchasableId, userId, description = '') => {
    try {
      const response = await api.post(`/api/purchasables/${purchasableId}/apply`, {
        user_id: userId,
        description
      });
      return response.data;
    } catch (error) {
      console.error(`Error applying purchasable ${purchasableId} to user ${userId}:`, error);
      throw error;
    }
  }
};

// API functions for agent users
export const agentUserService = {
  // Search for agent users
  searchAgentUsers: async (search = '', page = 1, limit = 10) => {
    try {
      const response = await api.get('/api/agents/users', {
        params: {
          search,
          skip: (page - 1) * limit,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching agent users:', error);
      throw error;
    }
  },

  // Get an agent user by ID
  getAgentUserById: async (userId) => {
    try {
      const response = await api.get(`/api/agents/users/id/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching agent user ${userId}:`, error);
      throw error;
    }
  },

  // Update an agent user's credit
  updateAgentCredit: async (mobile, amount, description = '') => {
    try {
      const response = await api.post(`/api/agents/users/${mobile}/credit`, {
        amount,
        description,
        event_type: 'agent_credit'
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating credit for user with mobile ${mobile}:`, error);
      throw error;
    }
  }
};

export default api;
