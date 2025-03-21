import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings, getBookingById, cancelBooking } from '../../api/bookings';

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const allBookings = await getUserBookings();
        
        // Sort bookings into categories
        const now = new Date();
        const upcomingBookings = [];
        const pastBookings = [];
        const canceledBookings = [];
        
        allBookings.forEach(booking => {
          const departureDate = new Date(booking.departure_date);
          
          if (booking.status === 'Cancelled') {
            canceledBookings.push(booking);
          } else if (departureDate > now) {
            upcomingBookings.push(booking);
          } else {
            pastBookings.push(booking);
          }
        });
        
        // Sort by departure date
        upcomingBookings.sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date));
        pastBookings.sort((a, b) => new Date(b.departure_date) - new Date(a.departure_date));
        canceledBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        setBookings({
          upcoming: upcomingBookings,
          past: pastBookings,
          canceled: canceledBookings
        });
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate countdown
  const calculateCountdown = (departureDate) => {
    const now = new Date();
    const departure = new Date(departureDate);
    const diffTime = Math.max(0, departure - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsCanceling(true);
      await cancelBooking(bookingToCancel.id);
      
      // Update bookings
      setBookings(prev => {
        const updatedUpcoming = prev.upcoming.filter(
          booking => booking.id !== bookingToCancel.id
        );
        
        return {
          ...prev,
          upcoming: updatedUpcoming,
          canceled: [
            { ...bookingToCancel, status: 'Cancelled' },
            ...prev.canceled
          ]
        };
      });
      
      // Clear booking to cancel
      setBookingToCancel(null);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="booking-history">
      <div className="history-header">
        <h2 className="history-title">Your Bookings</h2>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming ({bookings.upcoming.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => handleTabChange('past')}
        >
          Past ({bookings.past.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'canceled' ? 'active' : ''}`}
          onClick={() => handleTabChange('canceled')}
        >
          Canceled ({bookings.canceled.length})
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="bookings-list">
        {bookings[activeTab].length === 0 ? (
          <div className="no-bookings">
            <p>
              {activeTab === 'upcoming' && "You don't have any upcoming trips."}
              {activeTab === 'past' && "You haven't taken any space trips yet."}
              {activeTab === 'canceled' && "You don't have any canceled bookings."}
            </p>
            {activeTab === 'upcoming' && (
              <Link to="/destinations" className="btn btn-primary">
                Book a Trip
              </Link>
            )}
          </div>
        ) : (
          bookings[activeTab].map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-destination">
                  <h3 className="destination-name">{booking.destination_name || booking.destination_id}</h3>
                  <span className="booking-status">{booking.status}</span>
                </div>
                <div className="booking-dates">
                  <div className="date-range">
                    <span className="date-start">{formatDate(booking.departure_date)}</span>
                    <span className="date-separator">\u2192</span>
                    <span className="date-end">{formatDate(booking.return_date)}</span>
                  </div>
                  
                  {activeTab === 'upcoming' && (
                    <div className="countdown">
                      <span className="countdown-value">{calculateCountdown(booking.departure_date)}</span>
                      <span className="countdown-label">days until launch</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="booking-details">
                <div className="detail-column">
                  <div className="detail-item">
                    <span className="detail-label">Accommodation</span>
                    <span className="detail-value">{booking.accommodation_name || booking.accommodation_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Package</span>
                    <span className="detail-value">{booking.package_name || booking.package_id}</span>
                  </div>
                </div>
                
                <div className="detail-column">
                  <div className="detail-item">
                    <span className="detail-label">Travelers</span>
                    <span className="detail-value">{booking.travelers}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Price</span>
                    <span className="detail-value price">AED {booking.total_price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-actions">
                <Link 
                  to={`/bookings/${booking.id}`} 
                  className="btn btn-secondary btn-sm"
                >
                  View Details
                </Link>
                
                {activeTab === 'upcoming' && (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setBookingToCancel(booking)}
                  >
                    Cancel Booking
                  </button>
                )}
                
                {activeTab === 'past' && (
                  <button className="btn btn-outline btn-sm">
                    Book Again
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Cancel Booking Confirmation Modal */}
      {bookingToCancel && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Cancel Booking</h3>
              <button 
                className="modal-close"
                onClick={() => setBookingToCancel(null)}
                aria-label="Close"
              >
                �
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your booking to {bookingToCancel.destination_name || bookingToCancel.destination_id}?</p>
              <p className="modal-note">
                <strong>Note:</strong> Cancellation policy applies. You may be eligible for a partial refund depending on how close your departure date is.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setBookingToCancel(null)}
                disabled={isCanceling}
              >
                Keep Booking
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancelBooking}
                disabled={isCanceling}
              >
                {isCanceling ? 'Canceling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .booking-history {
          width: 100%;
        }
        
        .history-header {
          margin-bottom: 1.5rem;
        }
        
        .history-title {
          font-size: 1.8rem;
          color: var(--secondary-light);
          margin-bottom: 0.5rem;
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1.5rem;
        }
        
        .tab-button {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
          position: relative;
          transition: color 0.3s ease;
        }
        
        .tab-button::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--secondary);
          transition: width 0.3s ease;
        }
        
        .tab-button:hover {
          color: var(--text-light);
        }
        
        .tab-button.active {
          color: var(--secondary);
        }
        
        .tab-button.active::after {
          width: 100%;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .no-bookings {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 2rem;
          border-radius: 0.5rem;
          text-align: center;
        }
        
        .no-bookings p {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
        }
        
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .booking-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-left: 4px solid transparent;
        }
        
        .booking-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .booking-header {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .booking-destination {
          display: flex;
          flex-direction: column;
        }
        
        .destination-name {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }
        
        .booking-status {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          background-color: var(--secondary);
          color: var(--primary-dark);
        }
        
        .booking-dates {
          text-align: right;
        }
        
        .date-range {
          margin-bottom: 0.5rem;
        }
        
        .date-separator {
          margin: 0 0.5rem;
          color: var(--text-muted);
        }
        
        .countdown {
          display: flex;
          flex-direction: column;
        }
        
        .countdown-value {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .countdown-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .booking-details {
          display: flex;
          padding: 1.5rem;
        }
        
        .detail-column {
          flex: 1;
        }
        
        .detail-item {
          margin-bottom: 1rem;
        }
        
        .detail-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          font-weight: 600;
        }
        
        .detail-value.price {
          color: var(--secondary);
          font-family: var(--font-display);
        }
        
        .booking-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 0 1.5rem 1.5rem;
        }
        
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-container {
          background-color: var(--card-bg);
          border-radius: 1rem;
          width: 100%;
          max-width: 500px;
          animation: zoomIn 0.3s ease;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-title {
          margin: 0;
          font-size: 1.3rem;
        }
        
        .modal-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-note {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          font-size: 0.9rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .btn-danger {
          background-color: var(--danger);
          color: white;
        }
        
        .btn-danger:hover {
          background-color: rgba(239, 68, 68, 0.8);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @media (max-width: 768px) {
          .booking-header {
            flex-direction: column;
          }
          
          .booking-destination {
            margin-bottom: 1rem;
          }
          
          .booking-dates {
            text-align: left;
          }
          
          .booking-details {
            flex-direction: column;
          }
          
          .detail-column:first-child {
            margin-bottom: 1rem;
          }
          
          .booking-actions {
            flex-direction: column;
          }
          
          .booking-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingHistory;