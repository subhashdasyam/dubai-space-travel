import api from './index';

// Get AI travel recommendations
export const getTravelRecommendations = async (userPreferences, destinationId = null) => {
  const data = {
    user_preferences: userPreferences
  };
  
  if (destinationId) {
    data.destination_id = destinationId;
  }
  
  return api.post('/ai/recommendations', data);
};

// Get AI-generated packing list
export const getPackingList = async (destinationId, duration, userPreferences = null) => {
  const data = {
    destination_id: destinationId,
    duration: duration
  };
  
  if (userPreferences) {
    data.user_preferences = userPreferences;
  }
  
  return api.post('/ai/packing-list', data);
};

// Ask a space travel question
export const askQuestion = async (question) => {
  return api.post('/ai/ask', { question });
};

// Get AI-generated trip planner
export const getTripPlanner = async (tripData) => {
  return api.post('/ai/trip-planner', tripData);
};