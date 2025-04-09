import api from './api';

const API_URL = `/api/agents/users`;

export const fetchAgentUsers = async (skip = 0, limit = 10, search = '') => {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent users:', error);
    throw error;
  }
};

export const fetchAgentUserByMobile = async (mobile) => {
  try {
    const response = await api.get(`${API_URL}/${mobile}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent user with mobile ${mobile}:`, error);
    throw error;
  }
};

export const fetchAgentUserById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent user with id ${id}:`, error);
    throw error;
  }
};

export const createAgentUser = async (userData) => {
  try {
    const response = await api.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating agent user:', error);
    throw error;
  }
};

export const updateAgentUser = async (mobile, userData) => {
  try {
    const response = await api.put(`${API_URL}/${mobile}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating agent user with mobile ${mobile}:`, error);
    throw error;
  }
};

export const deleteAgentUser = async (mobile) => {
  try {
    await api.delete(`${API_URL}/${mobile}`);
    return true;
  } catch (error) {
    console.error(`Error deleting agent user with mobile ${mobile}:`, error);
    throw error;
  }
};

// Credit management functions
export const updateAgentCredit = async (mobile, amount, eventType, description) => {
  try {
    const response = await api.post(`${API_URL}/${mobile}/credit`, {
      amount,
      event_type: eventType || 'agent_credit',
      description
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating credit for agent with mobile ${mobile}:`, error);
    throw error;
  }
};

export const fetchAgentCreditHistory = async (mobile, skip = 0, limit = 10) => {
  try {
    const response = await api.get(`${API_URL}/${mobile}/credit/history?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching credit history for agent with mobile ${mobile}:`, error);
    throw error;
  }
};
