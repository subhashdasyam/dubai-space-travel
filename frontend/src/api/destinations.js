import api from './index';

// Get all destinations
export const getDestinations = async () => {
  return api.get('/destinations');
};

// Get destination by ID
export const getDestinationById = async (destinationId) => {
  return api.get(`/destinations/${destinationId}`);
};

// Get popular times for a destination
export const getDestinationPopularTimes = async (destinationId) => {
  return api.get(`/destinations/${destinationId}/popular-times`);
};