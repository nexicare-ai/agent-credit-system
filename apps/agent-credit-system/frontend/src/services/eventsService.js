import api from './api';

const API_URL = `/api/system/events`;

export const fetchEvents = async (skip = 0, limit = 10, eventType = null) => {
  try {
    let url = `${API_URL}?skip=${skip}&limit=${limit}`;
    if (eventType) {
      url += `&event_type=${eventType}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (eventId) => {
  try {
    const response = await api.get(`${API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${eventId}:`, error);
    throw error;
  }
};

export const fetchEventTypes = async () => {
  try {
    // This is a helper function that fetches all events and extracts unique event types
    // In a real application, you might have a dedicated API endpoint for this
    const response = await api.get(`${API_URL}?limit=100`);
    const events = response.data.events || [];
    const eventTypes = [...new Set(events.map(event => event.event_type))];
    return eventTypes;
  } catch (error) {
    console.error('Error fetching event types:', error);
    return ['agent_credit']; // Provide a default in case of error
  }
};
