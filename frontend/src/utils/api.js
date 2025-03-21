/**
 * Utility functions for API operations
 */

// Format API error messages for display
export const formatApiError = (error) => {
    if (!error) return 'An unknown error occurred';
    
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  };
  
  // Check if response is successful (2xx status code)
  export const isSuccessResponse = (response) => {
    return response && response.status >= 200 && response.status < 300;
  };
  
  // Extract data from response based on API format
  export const extractResponseData = (response) => {
    if (!response) return null;
    
    // Some APIs return data directly, others nest it under 'data'
    return response.data || response;
  };
  
  // Transform request data for FormData (for file uploads or form submissions)
  export const transformToFormData = (data) => {
    if (!data || typeof data !== 'object') return data;
    
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    return formData;
  };
  
  // Serialize params for URL query strings with proper encoding
  export const serializeParams = (params) => {
    if (!params || typeof params !== 'object') return '';
    
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  };