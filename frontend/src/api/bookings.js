import api from './index';

// Create a new booking
export const createBooking = async (bookingData) => {
  return api.post('/bookings', bookingData);
};

// Get user's bookings with optional status filter
export const getUserBookings = async (status = null) => {
  const params = {};
  if (status) {
    params.status = status;
  }
  
  return api.get('/bookings', { params });
};

// Get booking details by ID
export const getBookingById = async (bookingId) => {
  return api.get(`/bookings/${bookingId}`);
};

// Update booking
export const updateBooking = async (bookingId, bookingData) => {
  return api.put(`/bookings/${bookingId}`, bookingData);
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  return api.delete(`/bookings/${bookingId}`);
};

// Get booking invoice
export const getBookingInvoice = async (bookingId) => {
  return api.get(`/bookings/${bookingId}/invoice`);
};