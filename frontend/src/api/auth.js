import api from './index';

// Login user
export const login = async (credentials) => {
  const formData = new FormData();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);
  
  const response = await api.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Get user data after successful login
  const userData = await getCurrentUser();
  
  return {
    token: response.access_token,
    user: userData
  };
};

// Register new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  // Login after successful registration
  return login({
    email: userData.email,
    password: userData.password
  });
};

// Get current user data
export const getCurrentUser = async () => {
  return api.get('/auth/me');
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  return api.put('/auth/preferences', preferences);
};