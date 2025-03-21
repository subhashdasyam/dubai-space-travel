import React, { createContext, useState, useCallback, useEffect } from 'react';
import { login, register, getCurrentUser, updateUserPreferences } from '../api/auth';

// Create auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Authentication check failed:', err);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      setError('Session expired. Please login again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login user
  const loginUser = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: userData } = await login(credentials);
      
      // Save token and set user
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const registerUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { token, user: newUser } = await register(userData);
      
      // Save token and set user
      localStorage.setItem('token', token);
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = await updateUserPreferences(preferences);
      
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Updating preferences failed:', err);
      setError(err.message || 'Failed to update preferences. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  // Provide auth context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    updatePreferences,
    checkAuth,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};