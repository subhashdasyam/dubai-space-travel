import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import { getDestinations } from '../api/destinations';
import { getAccommodationsByDestination } from '../api/accommodations';
import { createBooking } from '../api/bookings';
import { getDestinationPopularTimes } from '../api/destinations';
import Loading from '../components/common/Loading';
import DatePicker from '../components/booking/DatePicker';
import PackageSelection from '../components/booking/PackageSelection';

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookingData, updateBooking, resetBooking } = useBooking();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [destinations, setDestinations] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [popularTimes, setPopularTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [travelers, setTravelers] = useState(bookingData.travelers || 1);
  const [specialRequests, setSpecialRequests] = useState(bookingData.specialRequests || '');
  
  // Fetch destinations on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const destinationsData = await getDestinations();
        setDestinations(destinationsData);
        
        // If booking already has a destination, fetch its accommodations
        if (bookingData.destination) {
          const accommodationsData = await getAccommodationsByDestination(bookingData.destination.id);
          setAccommodations(accommodationsData);
          
          try {
            const popularTimesData = await getDestinationPopularTimes(bookingData.destination.id);
            setPopularTimes(popularTimesData);
          } catch (err) {
            console.log('Could not fetch popular times');
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load booking data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [bookingData.destination]);
  
  // Handle destination selection
  const handleSelectDestination = async (destination) => {
    try {
      setIsLoading(true);
      
      // Reset accommodation if destination changes
      if (bookingData.destination?.id !== destination.id) {
        updateBooking({
          destination,
          accommodation: null
        });
        
        // Fetch accommodations for this destination
        const accommodationsData = await getAccommodationsByDestination(destination.id);
        setAccommodations(accommodationsData);
        
        // Try to fetch popular times
        try {
          const popularTimesData = await getDestinationPopularTimes(destination.id);
          setPopularTimes(popularTimesData);
        } catch (err) {
          console.log('Could not fetch popular times');
          setPopularTimes(null);
        }
      } else {
        updateBooking({ destination });
      }
    } catch (err) {
      console.error('Error selecting destination:', err);
      setError('Failed to load accommodations for this destination.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle accommodation selection
  const handleSelectAccommodation = (accommodation) => {
    updateBooking({ accommodation });
  };
  
  // Handle package selection
  const handleSelectPackage = (packageData) => {
    updateBooking({ package: packageData });
  };
  
  // Handle date selection
  const handleDateChange = (departureDate, returnDate) => {
    updateBooking({
      departureDate,
      returnDate
    });
  };
  
  // Handle travelers count change
  const handleTravelersChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTravelers(value);
    updateBooking({ travelers: value });
  };
  
  // Handle special requests change
  const handleSpecialRequestsChange = (e) => {
    setSpecialRequests(e.target.value);
    updateBooking({ specialRequests: e.target.value });
  };
  
  // Move to next step
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Move to previous step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if current step is complete
  const isStepComplete = (step) => {
    switch (step) {
      case 1:
        return bookingData.destination !== null;
      case 2:
        return bookingData.accommodation !== null;
      case 3:
        return (
          bookingData.package !== null &&
          bookingData.departureDate !== null &&
          bookingData.returnDate !== null
        );
      case 4:
        return true; // Review step is always complete
      default:
        return false;
    }
  };
  
  // Submit booking
  const handleSubmitBooking = async () => {
    try {
      setIsSubmitting(true);
      
      // Calculate duration in days
      const departureDate = new Date(bookingData.departureDate);
      const returnDate = new Date(bookingData.returnDate);
      const durationDays = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
      
      // Create booking data
      const newBookingData = {
        user_id: user.id,
        departure_date: bookingData.departureDate,
        return_date: bookingData.returnDate,
        destination_id: bookingData.destination.id,
        accommodation_id: bookingData.accommodation.id,
        package_id: bookingData.package.id,
        travelers: bookingData.travelers,
        special_requests: bookingData.specialRequests,
        total_price: bookingData.totalPrice
      };
      
      // Create booking
      const createdBooking = await createBooking(newBookingData);
      
      // Reset booking data
      resetBooking();
      
      // Navigate to success page or dashboard
      navigate('/dashboard', { 
        state: { 
          bookingSuccess: true,
          bookingId: createdBooking.id
        } 
      });
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <Loading message="Loading booking options..." />;
  }
  
  return (
    <div className="booking-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Book Your Space Journey</h1>
          <p className="page-subtitle">
            Follow these steps to book your interstellar adventure
          </p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="booking-progress">
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${isStepComplete(1) ? 'complete' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Destination</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${isStepComplete(2) ? 'complete' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Accommodation</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${isStepComplete(3) ? 'complete' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Travel Details</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${isStepComplete(4) ? 'complete' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Review & Book</div>
            </div>
          </div>
        </div>
        
        <div className="booking-content">
          {/* Step 1: Select Destination */}
          {currentStep === 1 && (
            <div className="booking-step">
              <div className="step-header">
                <h2 className="step-title">Select Your Destination</h2>
                <p className="step-description">
                  Choose from our available space destinations
                </p>
              </div>
              
              <div className="destinations-grid">
                {destinations.map((destination) => (
                  <div 
                    key={destination.id}
                    className={`destination-card ${bookingData.destination?.id === destination.id ? 'selected' : ''}`}
                    onClick={() => handleSelectDestination(destination)}
                  >
                    <div 
                      className="destination-visual"
                      style={{
                        backgroundColor: destination.css_style_data?.primaryColor || 'var(--primary-light)'
                      }}
                    >
                      {destination.name === 'Lunar Resort' && (
                        <div className="moon-base">
                          <div className="moon-surface"></div>
                          <div className="moon-crater" style={{ width: '20px', height: '20px', top: '20px', left: '30px' }}></div>
                          <div className="moon-crater" style={{ width: '15px', height: '15px', top: '25px', left: '80px' }}></div>
                          <div className="moon-dome"></div>
                          <div className="moon-building left"></div>
                          <div className="moon-building right"></div>
                          <div className="moon-antenna left"></div>
                          <div className="moon-antenna right"></div>
                        </div>
                      )}
                      {destination.name === 'Mars Colony' && (
                        <div className="mars-colony">
                          <div className="mars-surface"></div>
                          <div className="mars-dome large"></div>
                          <div className="mars-dome left"></div>
                          <div className="mars-dome right"></div>
                          <div className="mars-tunnel"></div>
                        </div>
                      )}
                      {destination.name === 'Orbital Luxury Station' && (
                        <div className="space-station">
                          <div className="station-core"></div>
                          <div className="station-ring rotate-slow"></div>
                          <div className="station-module top"></div>
                          <div className="station-module bottom"></div>
                          <div className="station-module left"></div>
                          <div className="station-module right"></div>
                          <div className="station-solar-panel left"></div>
                          <div className="station-solar-panel right"></div>
                        </div>
                      )}
                      {destination.name === 'Venus Cloud City' && (
                        <div className="venus-cloud-city">
                          <div className="venus-clouds"></div>
                          <div className="venus-platform"></div>
                          <div className="venus-building central"></div>
                          <div className="venus-building left"></div>
                          <div className="venus-building right"></div>
                          <div className="venus-dome central"></div>
                          <div className="venus-dome left"></div>
                          <div className="venus-dome right"></div>
                          <div className="venus-balloon left"></div>
                          <div className="venus-balloon right"></div>
                        </div>
                      )}
                    </div>
                    <div className="destination-content">
                      <h3 className="destination-name">{destination.name}</h3>
                      <div className="destination-meta">
                        <div className="meta-item">
                          <span className="meta-label">Distance</span>
                          <span className="meta-value">{(destination.distance / 1000).toLocaleString()} km</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Travel Time</span>
                          <span className="meta-value">{Math.ceil(destination.travel_time / 24)} days</span>
                        </div>
                      </div>
                      <p className="destination-description">
                        {destination.description.length > 100
                          ? `${destination.description.substring(0, 100)}...`
                          : destination.description}
                      </p>
                      
                      <button className="btn btn-outline select-btn">
                        {bookingData.destination?.id === destination.id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                    {bookingData.destination?.id === destination.id && (
                      <div className="selection-indicator">
                        <span className="indicator-icon">\u2713</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="step-actions">
                <button 
                  className="btn btn-primary next-btn"
                  disabled={!isStepComplete(1)}
                  onClick={goToNextStep}
                >
                  Continue to Accommodation
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Select Accommodation */}
          {currentStep === 2 && (
            <div className="booking-step">
              <div className="step-header">
                <h2 className="step-title">Select Your Accommodation</h2>
                <p className="step-description">
                  Choose where you'll stay at {bookingData.destination?.name}
                </p>
              </div>
              
              <div className="accommodations-grid">
                {accommodations.length > 0 ? (
                  accommodations.map((accommodation) => (
                    <div 
                      key={accommodation.id}
                      className={`accommodation-card ${bookingData.accommodation?.id === accommodation.id ? 'selected' : ''}`}
                      onClick={() => handleSelectAccommodation(accommodation)}
                    >
                      <div 
                        className="accommodation-visual"
                        style={{
                          backgroundColor: accommodation.css_style_data?.primaryColor || 'var(--primary-light)'
                        }}
                      >
                        <div className="accommodation-rating">
                          <span className="rating-value">{accommodation.rating.toFixed(1)}</span>
                          <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`rating-star ${i < Math.floor(accommodation.rating) ? 'filled' : ''}`}
                              ></span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="accommodation-content">
                        <h3 className="accommodation-name">{accommodation.name}</h3>
                        <p className="accommodation-type">{accommodation.type}</p>
                        <div className="accommodation-amenities">
                          {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                            <div key={index} className="amenity-item">
                              <span className="amenity-icon">\u2713</span>
                              <span className="amenity-name">{amenity}</span>
                            </div>
                          ))}
                          {accommodation.amenities.length > 3 && (
                            <div className="amenity-more">+{accommodation.amenities.length - 3} more</div>
                          )}
                        </div>
                        <div className="accommodation-price">
                          <span className="price-value">AED {accommodation.price_per_night.toLocaleString()}</span>
                          <span className="price-period">per night</span>
                        </div>
                        <div className="accommodation-capacity">
                          <span className="capacity-value">Capacity: {accommodation.capacity}</span>
                          <span className="capacity-period">travelers</span>
                        </div>
                        
                        <button className="btn btn-outline select-btn">
                          {bookingData.accommodation?.id === accommodation.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                      {bookingData.accommodation?.id === accommodation.id && (
                        <div className="selection-indicator">
                          <span className="indicator-icon">\u2713</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-accommodations">
                    <p>No accommodations available for this destination.</p>
                  </div>
                )}
              </div>
              
              <div className="step-actions">
                <button
                  className="btn btn-outline back-btn"
                  onClick={goToPrevStep}
                >
                  Back to Destinations
                </button>
                <button 
                  className="btn btn-primary next-btn"
                  disabled={!isStepComplete(2)}
                  onClick={goToNextStep}
                >
                  Continue to Travel Details
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Travel Details */}
          {currentStep === 3 && (
            <div className="booking-step">
              <div className="step-header">
                <h2 className="step-title">Travel Details</h2>
                <p className="step-description">
                  Select your package, dates, and other details
                </p>
              </div>
              
              <div className="travel-details-grid">
                <div className="travel-details-card">
                  <div className="card-section">
                    <h3 className="section-title">Select Dates</h3>
                    <div className="date-pickers">
                      <div className="date-picker-container">
                        <DatePicker
                          startDate={bookingData.departureDate}
                          endDate={bookingData.returnDate}
                          onChange={handleDateChange}
                          minDate={new Date().toISOString().split('T')[0]}
                          popularTimes={popularTimes}
                        />
                      </div>
                      <div className="date-info">
                        <div className="date-summary">
                          {bookingData.departureDate && bookingData.returnDate && (
                            <>
                              <div className="date-item">
                                <span className="date-label">Departure</span>
                                <span className="date-value">{new Date(bookingData.departureDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="date-item">
                                <span className="date-label">Return</span>
                                <span className="date-value">{new Date(bookingData.returnDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="date-item">
                                <span className="date-label">Duration</span>
                                <span className="date-value">
                                  {Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.departureDate)) / (1000 * 60 * 60 * 24))} days
                                </span>
                              </div>
                            </>
                          )}
                          {(!bookingData.departureDate || !bookingData.returnDate) && (
                            <div className="date-prompt">
                              Please select your departure and return dates
                            </div>
                          )}
                        </div>
                        <div className="date-instructions">
                          <p>
                            <strong>Note:</strong> Departure dates for {bookingData.destination?.name} are available on a weekly basis. All trips include free rescheduling up to 30 days before departure.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-section">
                    <h3 className="section-title">Number of Travelers</h3>
                    <div className="travelers-input">
                      <input
                        type="number"
                        min="1"
                        max={bookingData.accommodation?.capacity || 10}
                        value={travelers}
                        onChange={handleTravelersChange}
                      />
                      <span className="capacity-note">
                        Maximum capacity: {bookingData.accommodation?.capacity || 'N/A'} travelers
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-section">
                    <h3 className="section-title">Special Requests</h3>
                    <div className="special-requests">
                      <textarea
                        placeholder="Do you have any special requests or requirements? Let us know here."
                        value={specialRequests}
                        onChange={handleSpecialRequestsChange}
                        rows={4}
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="travel-package-section">
                  <PackageSelection
                    selectedPackage={bookingData.package}
                    onSelectPackage={handleSelectPackage}
                  />
                </div>
              </div>
              
              <div className="step-actions">
                <button
                  className="btn btn-outline back-btn"
                  onClick={goToPrevStep}
                >
                  Back to Accommodations
                </button>
                <button 
                  className="btn btn-primary next-btn"
                  disabled={!isStepComplete(3)}
                  onClick={goToNextStep}
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review & Book */}
          {currentStep === 4 && (
            <div className="booking-step">
              <div className="step-header">
                <h2 className="step-title">Review & Confirm</h2>
                <p className="step-description">
                  Review your booking details before confirming
                </p>
              </div>
              
              <div className="booking-summary">
                <div className="summary-card">
                  <div className="summary-section">
                    <h3 className="summary-title">Destination</h3>
                    <div className="summary-content destination-summary">
                      <div className="summary-visual">
                        <div 
                          className="destination-miniature"
                          style={{
                            backgroundColor: bookingData.destination?.css_style_data?.primaryColor || 'var(--primary-light)'
                          }}
                        >
                          {bookingData.destination?.name === 'Lunar Resort' && <div className="miniature-moon"></div>}
                          {bookingData.destination?.name === 'Mars Colony' && <div className="miniature-mars"></div>}
                          {bookingData.destination?.name === 'Orbital Luxury Station' && <div className="miniature-station"></div>}
                          {bookingData.destination?.name === 'Venus Cloud City' && <div className="miniature-venus"></div>}
                        </div>
                      </div>
                      <div className="summary-details">
                        <h4 className="summary-name">{bookingData.destination?.name}</h4>
                        <div className="summary-meta">
                          <div className="meta-item">
                            <span className="meta-label">Distance</span>
                            <span className="meta-value">{(bookingData.destination?.distance / 1000).toLocaleString()} km</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Travel Time</span>
                            <span className="meta-value">{Math.ceil(bookingData.destination?.travel_time / 24)} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h3 className="summary-title">Accommodation</h3>
                    <div className="summary-content accommodation-summary">
                      <div className="summary-details">
                        <h4 className="summary-name">{bookingData.accommodation?.name}</h4>
                        <p className="summary-type">{bookingData.accommodation?.type}</p>
                        <div className="accommodation-rate">
                          <span className="rate-value">AED {bookingData.accommodation?.price_per_night.toLocaleString()}</span>
                          <span className="rate-period">per night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h3 className="summary-title">Travel Package</h3>
                    <div className="summary-content package-summary">
                      <div className="summary-details">
                        <h4 className="summary-name">{bookingData.package?.name}</h4>
                        <p className="summary-type">{bookingData.package?.class_type}</p>
                        <div className="package-rate">
                          <span className="rate-value">AED {bookingData.package?.price.toLocaleString()}</span>
                          <span className="rate-period">per person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h3 className="summary-title">Travel Details</h3>
                    <div className="summary-content travel-summary">
                      <div className="travel-dates">
                        <div className="date-item">
                          <span className="date-label">Departure</span>
                          <span className="date-value">{new Date(bookingData.departureDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Return</span>
                          <span className="date-value">{new Date(bookingData.returnDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="date-item">
                          <span className="date-label">Duration</span>
                          <span className="date-value">
                            {Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.departureDate)) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                      </div>
                      <div className="travel-info">
                        <div className="info-item">
                          <span className="info-label">Travelers</span>
                          <span className="info-value">{bookingData.travelers}</span>
                        </div>
                        {bookingData.specialRequests && (
                          <div className="info-item">
                            <span className="info-label">Special Requests</span>
                            <p className="info-value special-requests">{bookingData.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="price-summary-card">
                  <h3 className="price-summary-title">Price Summary</h3>
                  <div className="price-breakdown">
                    <div className="price-item">
                      <span className="price-label">Package Price</span>
                      <span className="price-value">
                        AED {(bookingData.package?.price * bookingData.travelers).toLocaleString()}
                      </span>
                      <span className="price-detail">
                        {bookingData.package?.price.toLocaleString()} � {bookingData.travelers} travelers
                      </span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-label">Accommodation</span>
                      <span className="price-value">
                        AED {(
                          bookingData.accommodation?.price_per_night * 
                          Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.departureDate)) / (1000 * 60 * 60 * 24)) * 
                          bookingData.travelers
                        ).toLocaleString()}
                      </span>
                      <span className="price-detail">
                        {bookingData.accommodation?.price_per_night.toLocaleString()} � {Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.departureDate)) / (1000 * 60 * 60 * 24))} nights � {bookingData.travelers} travelers
                      </span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-label">Space Visa</span>
                      <span className="price-value">
                        AED {(250 * bookingData.travelers).toLocaleString()}
                      </span>
                      <span className="price-detail">
                        250 � {bookingData.travelers} travelers
                      </span>
                    </div>
                    
                    <div className="price-item">
                      <span className="price-label">Travel Insurance</span>
                      <span className="price-value">
                        AED {(500 * bookingData.travelers).toLocaleString()}
                      </span>
                      <span className="price-detail">
                        500 � {bookingData.travelers} travelers
                      </span>
                    </div>
                    
                    <div className="price-divider"></div>
                    
                    <div className="price-total">
                      <span className="total-label">Total</span>
                      <span className="total-value">
                        AED {(
                          bookingData.package?.price * bookingData.travelers +
                          bookingData.accommodation?.price_per_night * 
                          Math.ceil((new Date(bookingData.returnDate) - new Date(bookingData.departureDate)) / (1000 * 60 * 60 * 24)) * 
                          bookingData.travelers +
                          250 * bookingData.travelers +
                          500 * bookingData.travelers
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <button 
                      className="btn btn-primary book-btn"
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                    </button>
                    <p className="booking-note">
                      By confirming, you agree to our <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="step-actions">
                <button
                  className="btn btn-outline back-btn"
                  onClick={goToPrevStep}
                  disabled={isSubmitting}
                >
                  Back to Travel Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx="true">{`
        .booking-page {
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
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .booking-progress {
          margin-bottom: 3rem;
        }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--primary-light);
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
          transition: background-color 0.3s ease;
        }
        
        .step-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        
        .progress-step.active .step-number {
          background-color: var(--secondary);
          color: var(--primary-dark);
        }
        
        .progress-step.active .step-label {
          color: var(--secondary-light);
          font-weight: 600;
        }
        
        .progress-step.complete .step-number {
          background-color: var(--success);
          color: var(--primary-dark);
        }
        
        .progress-line {
          flex: 1;
          height: 2px;
          background-color: var(--primary-light);
          margin: 0 0.5rem;
          position: relative;
          top: -20px;
        }
        
        .booking-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .booking-step {
          animation: fadeIn 0.5s ease;
        }
        
        .step-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .step-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .step-description {
          color: var(--text-muted);
        }
        
        /* Step 1: Destinations */
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .destination-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .destination-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .destination-card.selected {
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px var(--secondary), 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .destination-visual {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .destination-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .destination-name {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text-light);
        }
        
        .destination-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .meta-item {
          display: flex;
          flex-direction: column;
        }
        
        .meta-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .meta-value {
          font-weight: 600;
        }
        
        .destination-description {
          margin-bottom: 1.5rem;
          flex: 1;
        }
        
        .select-btn {
          width: 100%;
        }
        
        .selection-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 30px;
          height: 30px;
          background-color: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-dark);
          font-weight: 600;
        }
        
        /* Step 2: Accommodations */
        .accommodations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .accommodation-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 2px solid transparent;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .accommodation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .accommodation-card.selected {
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px var(--secondary), 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .accommodation-visual {
          height: 180px;
          position: relative;
        }
        
        .accommodation-rating {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .rating-value {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }
        
        .rating-stars {
          display: flex;
          gap: 0.2rem;
        }
        
        .rating-star {
          width: 12px;
          height: 12px;
          position: relative;
        }
        
        .rating-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-right: 6px solid transparent;
          border-bottom: 4px solid var(--text-muted);
          border-left: 6px solid transparent;
          transform: rotate(35deg);
        }
        
        .rating-star::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-right: 6px solid transparent;
          border-bottom: 4px solid var(--text-muted);
          border-left: 6px solid transparent;
          transform: rotate(-35deg);
        }
        
        .rating-star.filled::before,
        .rating-star.filled::after {
          border-bottom-color: var(--secondary);
        }
        
        .accommodation-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .accommodation-name {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--text-light);
        }
        
        .accommodation-type {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        
        .accommodation-amenities {
          margin-bottom: 1.5rem;
        }
        
        .amenity-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .amenity-icon {
          color: var(--secondary);
          margin-right: 0.5rem;
        }
        
        .amenity-more {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .accommodation-price,
        .accommodation-capacity {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }
        
        .price-value {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .price-period,
        .capacity-period {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .capacity-value {
          font-weight: 600;
        }
        
        .no-accommodations {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        /* Step 3: Travel Details */
        .travel-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .travel-details-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .card-section {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .card-section:last-child {
          border-bottom: none;
        }
        
        .section-title {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .date-pickers {
          display: grid;
          grid-template-columns: minmax(250px, 1fr) 1fr;
          gap: 1.5rem;
          align-items: flex-start;
        }
        
        .date-info {
          padding: 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        .date-summary {
          margin-bottom: 1.5rem;
        }
        
        .date-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.75rem;
        }
        
        .date-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .date-value {
          font-weight: 600;
        }
        
        .date-prompt {
          color: var(--text-muted);
          font-style: italic;
        }
        
        .date-instructions p {
          font-size: 0.9rem;
          color: var(--text-muted);
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
        }
        
        .capacity-note {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .special-requests textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
          resize: vertical;
        }
        
        /* Step 4: Review & Book */
        .booking-summary {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .summary-card,
        .price-summary-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
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
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .summary-content {
          display: flex;
          align-items: flex-start;
        }
        
        .summary-visual {
          margin-right: 1.5rem;
        }
        
        .destination-miniature {
          width: 60px;
          height: 60px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .miniature-moon,
        .miniature-mars,
        .miniature-station,
        .miniature-venus {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .miniature-moon {
          background: radial-gradient(circle at 30% 30%, #d1d5db, #9ca3af);
        }
        
        .miniature-mars {
          background: radial-gradient(circle at 30% 30%, #e45f35, #c1440e);
        }
        
        .miniature-station {
          background: rgba(255, 255, 255, 0.1);
          position: relative;
        }
        
        .miniature-station::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid #64748b;
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }
        
        .miniature-venus {
          background: radial-gradient(circle at 30% 30%, #ff9f1c, #f86624);
        }
        
        .summary-details {
          flex: 1;
        }
        
        .summary-name {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        
        .summary-type {
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        
        .accommodation-rate,
        .package-rate {
          display: flex;
          flex-direction: column;
        }
        
        .rate-value {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--secondary);
        }
        
        .rate-period {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .travel-dates {
          width: 100%;
          margin-bottom: 1.5rem;
        }
        
        .travel-info .info-item {
          margin-bottom: 0.75rem;
        }
        
        .info-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .info-value.special-requests {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: 0.5rem;
        }
        
        .price-summary-card {
          padding: 1.5rem;
        }
        
        .price-summary-title {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
          text-align: center;
        }
        
        .price-breakdown {
          margin-bottom: 2rem;
        }
        
        .price-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }
        
        .price-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .price-value {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .price-detail {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .price-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 1.5rem 0;
        }
        
        .price-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .total-label {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .total-value {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .booking-actions {
          text-align: center;
        }
        
        .book-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .booking-note {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .booking-note a {
          color: var(--secondary);
          text-decoration: underline;
        }
        
        .step-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 1024px) {
          .travel-details-grid,
          .booking-summary {
            grid-template-columns: 1fr;
          }
          
          .date-pickers {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .destinations-grid,
          .accommodations-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }
          
          .progress-line {
            width: 2px;
            height: 20px;
            margin: 0;
            top: 0;
          }
          
          .step-actions {
            flex-direction: column;
          }
          
          .step-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;