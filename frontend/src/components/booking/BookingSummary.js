import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const BookingSummary = ({ bookingData, onConfirm, onBack, isSubmitting }) => {
  const { updateBooking } = useBooking();

  if (!bookingData) {
    return null;
  }

  // Calculate duration in days
  const getDuration = () => {
    if (!bookingData.departureDate || !bookingData.returnDate) {
      return 0;
    }
    
    const departureDate = new Date(bookingData.departureDate);
    const returnDate = new Date(bookingData.returnDate);
    return Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
  };

  const duration = getDuration();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not selected';
    
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Edit booking
  const handleEdit = (section) => {
    updateBooking({ editSection: section });
    onBack();
  };

  return (
    <div className="booking-summary">
      <div className="summary-header">
        <h2 className="summary-title">Your Booking Summary</h2>
        <p className="summary-subtitle">Please review your booking details before confirming</p>
      </div>
      
      <div className="summary-sections">
        <div className="summary-section">
          <div className="section-header">
            <h3 className="section-title">Destination & Accommodation</h3>
            <button 
              className="edit-button"
              onClick={() => handleEdit('destination')}
            >
              Edit
            </button>
          </div>
          <div className="section-content">
            <div className="summary-item">
              <span className="item-label">Destination:</span>
              <span className="item-value">{bookingData.destination?.name || 'Not selected'}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Accommodation:</span>
              <span className="item-value">{bookingData.accommodation?.name || 'Not selected'}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Package:</span>
              <span className="item-value">
                {bookingData.package ? `${bookingData.package.name} (${bookingData.package.class_type})` : 'Not selected'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="summary-section">
          <div className="section-header">
            <h3 className="section-title">Travel Dates</h3>
            <button 
              className="edit-button"
              onClick={() => handleEdit('dates')}
            >
              Edit
            </button>
          </div>
          <div className="section-content">
            <div className="summary-item">
              <span className="item-label">Departure:</span>
              <span className="item-value">{formatDate(bookingData.departureDate)}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Return:</span>
              <span className="item-value">{formatDate(bookingData.returnDate)}</span>
            </div>
            <div className="summary-item">
              <span className="item-label">Duration:</span>
              <span className="item-value">{duration > 0 ? `${duration} days` : 'Not determined'}</span>
            </div>
          </div>
        </div>
        
        <div className="summary-section">
          <div className="section-header">
            <h3 className="section-title">Travelers & Details</h3>
            <button 
              className="edit-button"
              onClick={() => handleEdit('travelers')}
            >
              Edit
            </button>
          </div>
          <div className="section-content">
            <div className="summary-item">
              <span className="item-label">Number of Travelers:</span>
              <span className="item-value">{bookingData.travelers || 1}</span>
            </div>
            {bookingData.selectedSeats && bookingData.selectedSeats.length > 0 && (
              <div className="summary-item">
                <span className="item-label">Selected Seats:</span>
                <span className="item-value">{bookingData.selectedSeats.join(', ')}</span>
              </div>
            )}
            {bookingData.specialRequests && (
              <div className="summary-item special-requests">
                <span className="item-label">Special Requests:</span>
                <span className="item-value">{bookingData.specialRequests}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="summary-section pricing">
          <div className="section-header">
            <h3 className="section-title">Price Summary</h3>
          </div>
          <div className="section-content">
            <div className="summary-item">
              <span className="item-label">Package Price:</span>
              <span className="item-value">
                AED {(bookingData.package?.price * (bookingData.travelers || 1)).toLocaleString()}
              </span>
              <span className="item-detail">
                {bookingData.package?.price.toLocaleString()} × {bookingData.travelers || 1} travelers
              </span>
            </div>
            <div className="summary-item">
              <span className="item-label">Accommodation:</span>
              <span className="item-value">
                AED {(
                  bookingData.accommodation?.price_per_night * 
                  duration * 
                  (bookingData.travelers || 1)
                ).toLocaleString()}
              </span>
              <span className="item-detail">
                {bookingData.accommodation?.price_per_night.toLocaleString()} × {duration} nights × {bookingData.travelers || 1} travelers
              </span>
            </div>
            <div className="summary-item">
              <span className="item-label">Space Visa:</span>
              <span className="item-value">
                AED {(300 * (bookingData.travelers || 1)).toLocaleString()}
              </span>
              <span className="item-detail">
                300 × {bookingData.travelers || 1} travelers
              </span>
            </div>
            <div className="summary-item">
              <span className="item-label">Insurance:</span>
              <span className="item-value">
                AED {(500 * (bookingData.travelers || 1)).toLocaleString()}
              </span>
              <span className="item-detail">
                500 × {bookingData.travelers || 1} travelers
              </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span className="item-label">Total Price:</span>
              <span className="item-value">AED {bookingData.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="summary-actions">
        <button 
          className="btn btn-outline back-btn"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button 
          className="btn btn-primary confirm-btn"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
      
      <div className="summary-note">
        <p>
          By confirming, you agree to our <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
      
      <style jsx="true">{`
        .booking-summary {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .summary-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .summary-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .summary-subtitle {
          color: var(--text-muted);
        }
        
        .summary-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .summary-section {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title {
          margin: 0;
          font-size: 1.2rem;
          color: var(--secondary);
        }
        
        .edit-button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.9rem;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        
        .edit-button:hover {
          color: var(--secondary);
          text-decoration: underline;
        }
        
        .section-content {
          padding: 1.5rem;
        }
        
        .summary-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        .summary-item:last-child {
          margin-bottom: 0;
        }
        
        .item-label {
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .item-value {
          font-weight: 600;
          font-size: 1.1rem;
        }
        
        .item-detail {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }
        
        .special-requests .item-value {
          font-style: italic;
          font-weight: normal;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .summary-section.pricing .summary-item {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          gap: 0.25rem;
        }
        
        .summary-section.pricing .item-detail {
          grid-column: 1 / -1;
          text-align: right;
        }
        
        .summary-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 1rem 0;
        }
        
        .summary-item.total {
          margin-top: 0.5rem;
        }
        
        .summary-item.total .item-label {
          font-size: 1.1rem;
          color: var(--text-light);
        }
        
        .summary-item.total .item-value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--secondary);
        }
        
        .summary-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }
        
        .back-btn,
        .confirm-btn {
          min-width: 150px;
          padding: 0.75rem 1.5rem;
        }
        
        .summary-note {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .summary-note a {
          color: var(--secondary);
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .summary-section.pricing .summary-item {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
          }
          
          .summary-section.pricing .item-value {
            font-size: 1.2rem;
          }
          
          .summary-section.pricing .item-detail {
            text-align: left;
          }
          
          .summary-actions {
            flex-direction: column;
          }
          
          .back-btn,
          .confirm-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingSummary;