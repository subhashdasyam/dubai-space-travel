import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculatePackagePrice } from '../api/packages';

// Create booking context
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Booking state
  const [bookingData, setBookingData] = useState({
    destination: null,
    accommodation: null,
    package: null,
    departureDate: null,
    returnDate: null,
    travelers: 1,
    specialRequests: '',
    totalPrice: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update pricing whenever relevant booking details change
  useEffect(() => {
    const updatePrice = async () => {
      if (bookingData.destination && bookingData.package && bookingData.departureDate && bookingData.returnDate) {
        try {
          setIsLoading(true);
          
          // Calculate duration in days
          const departure = new Date(bookingData.departureDate);
          const returnDate = new Date(bookingData.returnDate);
          const durationDays = Math.ceil((returnDate - departure) / (1000 * 60 * 60 * 24));
          
          if (durationDays <= 0) {
            setError('Return date must be after departure date');
            return;
          }
          
          // Calculate price
          const priceData = await calculatePackagePrice({
            packageId: bookingData.package.id,
            destinationId: bookingData.destination.id,
            duration: durationDays
          });
          
          // Add accommodation cost if selected
          let totalPrice = priceData.final_price;
          if (bookingData.accommodation) {
            totalPrice += bookingData.accommodation.price_per_night * durationDays * bookingData.travelers;
          }
          
          setBookingData(prev => ({
            ...prev,
            totalPrice
          }));
          
          setError(null);
        } catch (err) {
          console.error('Error calculating price:', err);
          setError('Could not calculate price. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    updatePrice();
  }, [
    bookingData.destination,
    bookingData.accommodation,
    bookingData.package,
    bookingData.departureDate,
    bookingData.returnDate,
    bookingData.travelers
  ]);

  // Update booking details
  const updateBooking = (data) => {
    setBookingData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Reset booking
  const resetBooking = () => {
    setBookingData({
      destination: null,
      accommodation: null,
      package: null,
      departureDate: null,
      returnDate: null,
      travelers: 1,
      specialRequests: '',
      totalPrice: 0
    });
  };

  // Start booking process with a destination
  const startBooking = (destination) => {
    resetBooking();
    updateBooking({ destination });
    navigate('/booking');
  };

  // Check if booking is complete with all required fields
  const isBookingComplete = () => {
    return (
      bookingData.destination &&
      bookingData.accommodation &&
      bookingData.package &&
      bookingData.departureDate &&
      bookingData.returnDate &&
      bookingData.travelers > 0
    );
  };

  // Provide booking context value
  const contextValue = {
    bookingData,
    isLoading,
    error,
    updateBooking,
    resetBooking,
    startBooking,
    isBookingComplete
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};