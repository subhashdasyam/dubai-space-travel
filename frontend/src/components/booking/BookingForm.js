import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookings';
import { useAuth } from '../../hooks/useAuth';
import { useBooking } from '../../hooks/useBooking';
import DatePicker from './DatePicker';
import SeatSelection from './SeatSelection';

const BookingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingData, updateBooking, resetBooking } = useBooking();
  
  const [travelers, setTravelers] = useState(bookingData.travelers || 1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [specialRequests, setSpecialRequests] = useState(bookingData.specialRequests || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  
  // Update booking data when form fields change
  useEffect(() => {
    updateBooking({
      travelers,
      specialRequests,
      selectedSeats
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelers, specialRequests, selectedSeats]);
  
  // Validate the booking form
  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.destination) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!bookingData.accommodation) {
      newErrors.accommodation = 'Accommodation is required';
    }
    
    if (!bookingData.package) {
      newErrors.package = 'Travel package is required';
    }
    
    if (!bookingData.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }
    
    if (!bookingData.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }
    
    if (bookingData.departureDate && bookingData.returnDate) {
      const departureDate = new Date(bookingData.departureDate);
      const returnDate = new Date(bookingData.returnDate);
      
      if (returnDate <= departureDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }
    
    if (!travelers || travelers < 1) {
      newErrors.travelers = 'At least 1 traveler is required';
    }
    
    if (bookingData.accommodation && travelers > bookingData.accommodation.capacity) {
      newErrors.travelers = `Maximum ${bookingData.accommodation.capacity} travelers allowed for this accommodation`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle date change
  const handleDateChange = (departureDate, returnDate) => {
    updateBooking({
      departureDate,
      returnDate
    });
  };
  
  // Handle travelers input change
  const handleTravelersChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    setTravelers(value);
  };
  
  // Handle special requests input change
  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
  };
  
  // Handle seat selection
  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create booking data for API
      const newBookingData = {
        user_id: user.id,
        destination_id: bookingData.destination.id,
        accommodation_id: bookingData.accommodation.id,
        package_id: bookingData.package.id,
        departure_date: bookingData.departureDate,
        return_date: bookingData.returnDate,
        travelers: travelers,
        special_requests: specialRequests,
        selected_seats: selectedSeats,
        total_price: bookingData.totalPrice
      };
      
      // Create booking
      const createdBooking = await createBooking(newBookingData);
      
      // Reset booking data
      resetBooking();
      
      // Navigate to dashboard with success message
      navigate('/dashboard', { 
        state: { 
          bookingSuccess: true,
          bookingId: createdBooking.id
        } 
      });
      
    } catch (err) {
      console.error('Error submitting booking:', err);
      setErrors({
        submit: 'Failed to create booking. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate booking summary
  const getBookingSummary = () => {
    if (!bookingData.destination || !bookingData.accommodation || !bookingData.package) {
      return null;
    }
    
    // Calculate duration in days if dates are selected
    let duration = 0;
    if (bookingData.departureDate && bookingData.returnDate) {
      const departureDate = new Date(bookingData.departureDate);
      const returnDate = new Date(bookingData.returnDate);
      duration = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
    }
    
    return {
      destination: bookingData.destination.name,
      accommodation: bookingData.accommodation.name,
      package: bookingData.package.name,
      packageClass: bookingData.package.class_type,
      departureDate: bookingData.departureDate ? new Date(bookingData.departureDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Not selected',
      returnDate: bookingData.returnDate ? new Date(bookingData.returnDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Not selected',
      duration: duration > 0 ? `${duration} days` : 'Not determined',
      travelers: travelers,
      packagePrice: bookingData.package.price * travelers,
      accommodationPrice: bookingData.accommodation.price_per_night * duration * travelers,
      totalPrice: bookingData.totalPrice
    };
  };
  
  const summary = getBookingSummary();
  
  return (
    <div className="booking-form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        {errors.submit && (
          <div className="error-message form-error">
            {errors.submit}
          </div>
        )}
        
        <div className="form-section">
          <h3 className="section-title">Trip Details</h3>
          
          <div className="date-section">
            <h4 className="subsection-title">Select Travel Dates</h4>
            {errors.departureDate && <div className="error-message">{errors.departureDate}</div>}
            {errors.returnDate && <div className="error-message">{errors.returnDate}</div>}
            
            <DatePicker
              startDate={bookingData.departureDate}
              endDate={bookingData.returnDate}
              onChange={handleDateChange}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="travelers-section">
            <h4 className="subsection-title">Number of Travelers</h4>
            {errors.travelers && <div className="error-message">{errors.travelers}</div>}
            
            <div className="travelers-input">
              <input
                type="number"
                min="1"
                max={bookingData.accommodation?.capacity || 10}
                value={travelers}
                onChange={handleTravelersChange}
                className={errors.travelers ? 'error' : ''}
              />
              <span className="input-note">
                Maximum capacity: {bookingData.accommodation?.capacity || 'N/A'} travelers
              </span>
            </div>
          </div>
          
          <div className="special-requests-section">
            <h4 className="subsection-title">Special Requests</h4>
            
            <div className="special-requests-input">
              <textarea
                rows="4"
                placeholder="Do you have any special requirements or requests? Let us know here."
                value={specialRequests}
                onChange={handleSpecialRequestsChange}
              ></textarea>
              <span className="input-note">
                Optional: dietary preferences, mobility needs, celebration details, etc.
              </span>
            </div>
          </div>
        </div>
        
        {bookingData.package && (
          <div className="form-section">
            <SeatSelection
              packageData={bookingData.package}
              selectedSeats={selectedSeats}
              onSelectSeats={handleSeatSelection}
            />
          </div>
        )}
        
        <div className="form-section">
          <h3 className="section-title">Booking Summary</h3>
          
          {summary ? (
            <div className="booking-summary">
              <div className="summary-section">
                <h4 className="summary-title">Destination & Accommodation</h4>
                <div className="summary-content">
                  <div className="summary-item">
                    <span className="item-label">Destination:</span>
                    <span className="item-value">{summary.destination}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Accommodation:</span>
                    <span className="item-value">{summary.accommodation}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Package:</span>
                    <span className="item-value">{summary.package} ({summary.packageClass})</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-section">
                <h4 className="summary-title">Travel Dates</h4>
                <div className="summary-content">
                  <div className="summary-item">
                    <span className="item-label">Departure:</span>
                    <span className="item-value">{summary.departureDate}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Return:</span>
                    <span className="item-value">{summary.returnDate}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Duration:</span>
                    <span className="item-value">{summary.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-section">
                <h4 className="summary-title">Pricing</h4>
                <div className="summary-content">
                  <div className="summary-item">
                    <span className="item-label">Travelers:</span>
                    <span className="item-value">{summary.travelers}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Package Price:</span>
                    <span className="item-value">AED {summary.packagePrice.toLocaleString()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="item-label">Accommodation:</span>
                    <span className="item-value">AED {summary.accommodationPrice.toLocaleString()}</span>
                  </div>
                  <div className="summary-item total">
                    <span className="item-label">Total Price:</span>
                    <span className="item-value">AED {summary.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="summary-section">
                  <h4 className="summary-title">Selected Seats</h4>
                  <div className="summary-content">
                    <div className="summary-item">
                      <span className="item-value seat-list">{selectedSeats.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="incomplete-booking">
              <p>Please complete all required booking information to see a summary.</p>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isSubmitting || isCalculatingPrice || !summary}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </button>
          <p className="booking-note">
            By confirming, you agree to our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </p>
        </div>
      </form>
      
      <style jsx="true">{`
        .booking-form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .booking-form {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .form-error {
          margin: 1.5rem;
        }
        
        .error-message {
          color: var(--danger);
          background-color: rgba(239, 68, 68, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .form-section:last-child {
          border-bottom: none;
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .date-section,
        .travelers-section,
        .special-requests-section {
          margin-bottom: 2rem;
        }
        
        .subsection-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--text-light);
        }
        
        .travelers-input {
          display: flex;
          flex-direction: column;
        }
        
        .travelers-input input {
          width: 100px;
          padding: 0.75rem;
          font-size: 1.1rem;
          text-align: center;
          margin-bottom: 0.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
        }
        
        .travelers-input input.error {
          border-color: var(--danger);
        }
        
        .travelers-input input:focus {
          outline: none;
          border-color: var(--secondary);
        }
        
        .input-note {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .special-requests-input textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
          resize: vertical;
          margin-bottom: 0.5rem;
        }
        
        .special-requests-input textarea:focus {
          outline: none;
          border-color: var(--secondary);
        }
        
        .booking-summary {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .summary-section {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .summary-section:last-child {
          border-bottom: none;
        }
        
        .summary-title {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: var(--secondary);
        }
        
        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
        }
        
        .summary-item.total {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
        
        .summary-item.total .item-value {
          color: var(--secondary);
          font-family: var(--font-display);
          font-size: 1.2rem;
        }
        
        .item-label {
          color: var(--text-muted);
        }
        
        .seat-list {
          letter-spacing: 0.05em;
          color: var(--secondary);
        }
        
        .incomplete-booking {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-style: italic;
        }
        
        .form-actions {
          padding: 1.5rem;
          text-align: center;
        }
        
        .submit-btn {
          width: 100%;
          max-width: 300px;
          padding: 1rem;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .booking-note {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .booking-note a {
          color: var(--secondary);
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .summary-item {
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
          }
          
          .summary-item.total {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingForm; {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-section