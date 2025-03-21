/**
 * Utility functions for authentication and authorization
 */

// Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Set JWT token in localStorage
  export const setToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
  };
  
  // Remove JWT token from localStorage
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Check if token exists (user is logged in)
  export const isLoggedIn = () => {
    return !!getToken();
  };
  
  // Parse JWT token payload (without verification)
  export const parseToken = (token = getToken()) => {
    if (!token) return null;
    
    try {
      // Get the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };
  
  // Check if token is expired
  export const isTokenExpired = (token = getToken()) => {
    if (!token) return true;
    
    const payload = parseToken(token);
    if (!payload || !payload.exp) return true;
    
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate <= new Date();
  };
  
  // Basic password validation
  export const validatePassword = (password) => {
    if (!password) return false;
    
    // At least 8 characters, one uppercase, one lowercase, one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  
  // Email validation
  export const validateEmail = (email) => {
    if (!email) return false;
    
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };