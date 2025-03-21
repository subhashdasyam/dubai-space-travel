import api from './index';

// Get all accommodations with optional filters
export const getAccommodations = async (filters = {}) => {
  return api.get('/accommodations', { params: filters });
};

// Get accommodation by ID
export const getAccommodationById = async (accommodationId) => {
  return api.get(`/accommodations/${accommodationId}`);
};

// Get accommodations by destination
export const getAccommodationsByDestination = async (destinationId) => {
  return api.get('/accommodations', { params: { destination_id: destinationId } });
};

// Check accommodation availability
export const checkAccommodationAvailability = async (accommodationId, startDate, endDate) => {
  return api.get(`/accommodations/${accommodationId}/availability`, {
    params: { start_date: startDate, end_date: endDate }
  });
};

// Get accommodation reviews
export const getAccommodationReviews = async (accommodationId, limit = 10, offset = 0) => {
  return api.get(`/accommodations/${accommodationId}/reviews`, {
    params: { limit, offset }
  });
};