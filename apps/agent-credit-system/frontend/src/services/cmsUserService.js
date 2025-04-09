import api from './api';

const API_URL = `/api/cms/users`;

export const fetchCMSUsers = async (skip = 0, limit = 10) => {
  try {
    const response = await api.get(`${API_URL}?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CMS users:', error);
    throw error;
  }
};

export const fetchCMSUserByMobile = async (mobile) => {
  try {
    const response = await api.get(`${API_URL}/${mobile}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CMS user with mobile ${mobile}:`, error);
    throw error;
  }
};

export const createCMSUser = async (userData) => {
  try {
    const response = await api.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating CMS user:', error);
    throw error;
  }
};

export const updateCMSUser = async (mobile, userData) => {
  try {
    const response = await api.put(`${API_URL}/${mobile}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating CMS user with mobile ${mobile}:`, error);
    throw error;
  }
};

export const deleteCMSUser = async (mobile) => {
  try {
    await api.delete(`${API_URL}/${mobile}`);
    return true;
  } catch (error) {
    console.error(`Error deleting CMS user with mobile ${mobile}:`, error);
    throw error;
  }
};
