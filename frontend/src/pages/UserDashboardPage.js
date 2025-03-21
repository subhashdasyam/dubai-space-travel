import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserBookings, getBookingById, cancelBooking } from '../api/bookings';
import { getTravelRecommendations } from '../api/ai';
import Loading from '../components/common/Loading';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(
    location.state?.bookingSuccess || false
  );
  const [successBookingId, setSuccessBookingId] = useState(
    location.state?.bookingId || null
  );
  const [bookingToCancel, setBookingToCancel] = useState(null);

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
        
        // Clear location state
        window.history.replaceState({}, document.title);
        
        // Fetch specific booking if success message is shown
        if (successBookingId) {
          try {
            const bookingDetails = await getBookingById(successBookingId);
            setSuccessBookingId(bookingDetails.id);
          } catch (err) {
            console.error('Error fetching successful booking:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setIsAiLoading(true);
        
        // Get personalized recommendations using AI
        const preferredDest = user.preferences?.preferred_destinations || [];
        const budget = user.preferences?.budget_range || { min: 10000, max: 50000 };
        
        const userPreferences = {
          name: user.name,
          experience_level: user.preferences?.has_space_experience ? 'Experienced' : 'Beginner',
          preferred_destinations: preferredDest.length > 0 ? preferredDest : ['Any'],
          budget: `${budget.min} - ${budget.max} AED`,
          preferred_accommodation_types: user.preferences?.preferred_accommodation_types || ['Any']
        };
        
        const aiResponse = await getTravelRecommendations(userPreferences);
        setRecommendations(aiResponse.recommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setRecommendations('Sorry, we couldn\'t generate personalized recommendations at this time. Please try again later.');
      } finally {
        setIsAiLoading(false);
      }
    };
    
    fetchBookings();
    fetchRecommendations();
  }, [user, successBookingId, location.state]);

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
    }
  };

  // Close success message
  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessBookingId(null);
  };

  if (isLoading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Your Space Dashboard</h1>
          <p className="page-subtitle">
            Manage your space travel bookings and preferences
          </p>
        </div>
        
        {showSuccessMessage && (
          <div className="success-message">
            <div className="success-icon">
              <span className="icon-check">✓</span>
            </div>
            <div className="success-content">
              <h3>Booking Confirmed!</h3>
              <p>Your space journey has been successfully booked. Prepare for an out-of-this-world experience!</p>
            </div>
            <button 
              className="close-button"
              onClick={closeSuccessMessage}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="bookings-section">
              <div className="bookings-header">
                <h2 className="section-title">Your Bookings</h2>
                <div className="bookings-tabs">
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
              </div>
              
              <div className="bookings-content">
                {bookings[activeTab].length === 0 ? (
                  <div className="no-bookings">
                    <div className="no-bookings-icon">
                      {activeTab === 'upcoming' && <div className="icon-calendar"></div>}
                      {activeTab === 'past' && <div className="icon-history"></div>}
                      {activeTab === 'canceled' && <div className="icon-cancel"></div>}
                    </div>
                    <p className="no-bookings-text">
                      {activeTab === 'upcoming' && "You don't have any upcoming space trips."}
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
                  <div className="bookings-list">
                    {bookings[activeTab].map((booking) => (
                      <div 
                        key={booking.id} 
                        className={`booking-card ${successBookingId === booking.id ? 'highlight' : ''}`}
                      >
                        <div className="booking-header">
                          <div className="booking-destination">
                            <h3 className="destination-name">{booking.destination_name}</h3>
                            <span className="booking-status">{booking.status}</span>
                          </div>
                          <div className="booking-dates">
                            <div className="date-range">
                              <span className="date-start">{formatDate(booking.departure_date)}</span>
                              <span className="date-separator">→</span>
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
                              <span className="detail-value">{booking.accommodation_name}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Package</span>
                              <span className="detail-value">{booking.package_name}</span>
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="dashboard-sidebar">
            <div className="user-profile-card">
              <div className="user-profile-header">
                <div className="user-avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="user-info">
                  <h3 className="user-name">{user?.name}</h3>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{bookings.upcoming.length + bookings.past.length}</span>
                  <span className="stat-label">Total Trips</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{bookings.upcoming.length}</span>
                  <span className="stat-label">Upcoming</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{bookings.past.length}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              
              <div className="profile-actions">
                <Link to="/profile" className="btn btn-outline btn-block">
                  Edit Profile
                </Link>
              </div>
            </div>
            
            <div className="recommendations-card">
              <h3 className="card-title">Personalized Recommendations</h3>
              
              {isAiLoading ? (
                <div className="ai-loading">
                  <div className="ai-loading-icon">
                    <div className="spinner"></div>
                  </div>
                  <p>Generating recommendations...</p>
                </div>
              ) : (
                <div className="recommendations-content">
                  <p>{recommendations}</p>
                </div>
              )}
              
              <div className="recommendations-footer">
                <Link to="/destinations" className="btn btn-secondary btn-block">
                  Explore Destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Booking Modal */}
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
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel your booking to {bookingToCancel.destination_name}?</p>
              <p className="modal-note">
                <strong>Note:</strong> Cancellation policy applies. You may be eligible for a partial refund depending on how close your departure date is.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setBookingToCancel(null)}
              >
                Keep Booking
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .dashboard-page {
          padding: 6rem 0 4rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .page-title {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .page-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .success-message {
          display: flex;
          align-items: center;
          background-color: rgba(16, 185, 129, 0.1);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
          animation: slideDown 0.5s ease;
        }
        
        .success-icon {
          width: 40px;
          height: 40px;
          background-color: var(--success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .icon-check {
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .success-content {
          flex: 1;
        }
        
        .success-content h3 {
          margin-bottom: 0.5rem;
          color: var(--success);
        }
        
        .close-button {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 2rem;
        }
        
        .bookings-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .bookings-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
        
        .no-bookings {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 0;
          text-align: center;
        }
        
        .no-bookings-icon {
          width: 60px;
          height: 60px;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .icon-calendar,
        .icon-history,
        .icon-cancel {
          width: 30px;
          height: 30px;
          position: relative;
        }
        
        .icon-calendar::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--text-muted);
          border-radius: 2px;
          top: 5px;
          left: 5px;
        }
        
        .icon-calendar::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 2px;
          background-color: var(--text-muted);
          top: 10px;
          left: 7px;
        }
        
        .icon-history::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--text-muted);
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }
        
        .icon-history::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-top: 2px solid var(--text-muted);
          border-right: 2px solid var(--text-muted);
          top: 10px;
          left: 15px;
          transform: rotate(45deg);
        }
        
        .icon-cancel::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          border: 2px solid var(--text-muted);
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }
        
        .icon-cancel::after {
          content: '×';
          position: absolute;
          font-size: 18px;
          color: var(--text-muted);
          top: 3px;
          left: 10px;
        }
        
        .no-bookings-text {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
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
        
        .booking-card.highlight {
          border-left-color: var(--success);
          box-shadow: 0 0 0 1px var(--success), 0 10px 25px rgba(0, 0, 0, 0.3);
          animation: pulse 2s infinite;
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
        
        .user-profile-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .user-profile-header {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .user-avatar {
          width: 60px;
          height: 60px;
          background-color: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-dark);
          margin-right: 1rem;
        }
        
        .user-name {
          font-size: 1.3rem;
          margin-bottom: 0.25rem;
        }
        
        .user-email {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .profile-stats {
          display: flex;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-item {
          flex: 1;
          text-align: center;
        }
        
        .stat-value {
          display: block;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .profile-actions {
          padding: 1.5rem;
        }
        
        .btn-block {
          display: block;
          width: 100%;
        }
        
        .recommendations-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .card-title {
          font-size: 1.2rem;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin: 0;
        }
        
        .ai-loading {
          padding: 2rem;
          text-align: center;
        }
        
        .ai-loading-icon {
          margin-bottom: 1rem;
        }
        
        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--secondary);
          border-radius: 50%;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        
        .recommendations-content {
          padding: 1.5rem;
          min-height: 150px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .recommendations-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
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
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          70% {
            box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .booking-header {
            flex-direction: column;
          }
          
          .booking-destination {
            margin-bottom: 1rem;
          }
          
          .booking-dates {
            text-align: left;
          }
        }
        
        @media (max-width: 768px) {
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

export default UserDashboardPage;