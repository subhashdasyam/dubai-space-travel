/**
 * Utility functions for date operations
 */

// Format date as YYYY-MM-DD (ISO format for API)
export const formatDateISO = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toISOString().split('T')[0];
  };
  
  // Format date for display (e.g., "Monday, January 1, 2025")
  export const formatDateDisplay = (date, options = {}) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const defaultOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };
  
  // Format date short (e.g., "Jan 1, 2025")
  export const formatDateShort = (date) => {
    return formatDateDisplay(date, { 
      weekday: undefined, 
      month: 'short'
    });
  };
  
  // Calculate days between two dates
  export const daysBetween = (start, end) => {
    if (!start || !end) return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Calculate days from now to a given date
  export const daysFromNow = (date) => {
    if (!date) return 0;
    
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Check if a date is in the past
  export const isPastDate = (date) => {
    if (!date) return false;
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return d < today;
  };
  
  // Check if a date is between two other dates
  export const isDateInRange = (date, startDate, endDate) => {
    if (!date || !startDate || !endDate) return false;
    
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(d.getTime()) || isNaN(start.getTime()) || isNaN(end.getTime())) {
      return false;
    }
    
    return d >= start && d <= end;
  };
  
  // Get today's date as YYYY-MM-DD
  export const getTodayISO = () => {
    return formatDateISO(new Date());
  };
  
  // Add days to a date and return as YYYY-MM-DD
  export const addDaysISO = (date, days) => {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    d.setDate(d.getDate() + days);
    return formatDateISO(d);
  };