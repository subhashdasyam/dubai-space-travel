import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDestinationById, getDestinationPopularTimes } from '../api/destinations';
import { getAccommodationsByDestination } from '../api/accommodations';
import Loading from '../components/common/Loading';
import { useBooking } from '../hooks/useBooking';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [popularTimes, setPopularTimes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { startBooking } = useBooking();

  // Fetch destination details on component mount
  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch destination details
        const destinationData = await getDestinationById(id);
        setDestination(destinationData);
        
        // Fetch accommodations for this destination
        const accommodationsData = await getAccommodationsByDestination(id);
        setAccommodations(accommodationsData);
        
        // Fetch popular times (only if authenticated)
        try {
          const popularTimesData = await getDestinationPopularTimes(id);
          setPopularTimes(popularTimesData);
        } catch (err) {
          console.log('Could not fetch popular times, may require authentication');
        }
      } catch (err) {
        console.error('Error fetching destination data:', err);
        setError('Failed to load destination details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationData();
  }, [id]);

  const handleBookNow = () => {
    startBooking(destination);
  };

  if (isLoading) {
    return <Loading message="Loading destination details..." />;
  }

  if (error || !destination) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Destination not found'}</p>
          <Link to="/destinations" className="btn btn-primary">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-detail-page">
      <div className="destination-hero" 
        style={{
          backgroundColor: destination.css_style_data?.primaryColor || 'var(--primary-light)',
          backgroundImage: destination.css_style_data?.backgroundGradient
        }}
      >
        <div className="container">
          <h1 className="destination-name">{destination.name}</h1>
          <div className="destination-visual">
            {destination.name === 'Lunar Resort' && (
              <div className="moon-base">
                <div className="moon-surface"></div>
                <div className="moon-crater" style={{ width: '30px', height: '30px', top: '30px', left: '50px' }}></div>
                <div className="moon-crater" style={{ width: '20px', height: '20px', top: '40px', left: '120px' }}></div>
                <div className="moon-crater" style={{ width: '25px', height: '25px', top: '60px', left: '200px' }}></div>
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
        </div>
      </div>

      <div className="container">
        <div className="destination-info-grid">
          <div className="destination-info-card">
            <div className="info-card-content">
              <h3>Overview</h3>
              <p className="destination-description">{destination.description}</p>
              
              <div className="destination-stats">
                <div className="stat-item">
                  <div className="stat-icon distance-icon"></div>
                  <div className="stat-content">
                    <span className="stat-label">Distance from Earth</span>
                    <span className="stat-value">{(destination.distance / 1000).toLocaleString()} km</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon time-icon"></div>
                  <div className="stat-content">
                    <span className="stat-label">Travel Time</span>
                    <span className="stat-value">{Math.ceil(destination.travel_time / 24)} days</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon gravity-icon"></div>
                  <div className="stat-content">
                    <span className="stat-label">Gravity</span>
                    <span className="stat-value">{destination.gravity || 'N/A'} G</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon temperature-icon"></div>
                  <div className="stat-content">
                    <span className="stat-label">Temperature Range</span>
                    <span className="stat-value">
                      {destination.temperature_range 
                        ? `${destination.temperature_range.min}°C to ${destination.temperature_range.max}°C` 
                        : 'Controlled Environment'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="destination-features">
                <h4>Key Features</h4>
                <ul className="features-list">
                  {destination.features.map((feature, index) => (
                    <li key={index} className="feature-item">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="booking-card">
            <div className="booking-card-content">
              <h3>Start Your Journey</h3>
              <div className="price-info">
                <span className="price-label">Starting from</span>
                <span className="price-value">
                  AED {Math.round(15000 * destination.price_factor).toLocaleString()}
                </span>
                <span className="price-note">per person</span>
              </div>
              
              <button 
                onClick={handleBookNow}
                className="btn btn-primary book-btn"
              >
                Book Now
              </button>
              
              {popularTimes && (
                <div className="popular-times">
                  <h4>Popular Travel Times</h4>
                  <div className="popular-times-info">
                    <div className="peak-times">
                      <span className="times-label">Peak Season:</span>
                      <span className="times-value">{popularTimes.peak_months.join(', ')}</span>
                    </div>
                    <div className="off-peak-times">
                      <span className="times-label">Off Peak:</span>
                      <span className="times-value">{popularTimes.off_peak_months.join(', ')}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="booking-note">
                <p>
                  <strong>Note:</strong> All trips include safety training, space suits, and life support systems.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="accommodations-section">
          <h2 className="section-title">Available Accommodations</h2>
          <p className="section-subtitle">Choose from our luxury stays at {destination.name}</p>
          
          <div className="accommodations-grid">
            {accommodations.length > 0 ? (
              accommodations.map((accommodation) => (
                <div key={accommodation.id} className="accommodation-card">
                  <div 
                    className="accommodation-visual"
                    style={{
                      backgroundColor: accommodation.css_style_data?.primaryColor || destination.css_style_data?.secondaryColor || 'var(--primary-light)'
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
                    <ul className="amenities-list">
                      {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                        <li key={index} className="amenity-item">{amenity}</li>
                      ))}
                    </ul>
                    <div className="accommodation-footer">
                      <div className="accommodation-price">
                        <span className="price-value">AED {accommodation.price_per_night.toLocaleString()}</span>
                        <span className="price-period">per night</span>
                      </div>
                      <Link 
                        to={`/accommodations/${accommodation.id}`}
                        className="btn btn-secondary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-accommodations">No accommodations available at this time.</p>
            )}
          </div>
        </div>
        
        <div className="safety-section">
          <h2 className="section-title">Safety Information</h2>
          <div className="safety-content">
            <div className="safety-icon"></div>
            <p>
              Safety is our top priority at Dubai to Stars. All travelers undergo comprehensive 
              training before departure and are equipped with the latest safety technology. 
              Our spacecraft and accommodations are maintained to the highest standards, and 
              our experienced crew is always ready to assist you.
            </p>
            <Link to="/safety" className="btn btn-outline">Learn More About Safety</Link>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .destination-detail-page {
          padding-bottom: 4rem;
        }

        .destination-hero {
          height: 400px;
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .destination-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 30%, var(--primary-dark));
          z-index: 1;
        }

        .destination-hero .container {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .destination-name {
          font-size: 3.5rem;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .destination-visual {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .destination-info-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .destination-info-card,
        .booking-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .info-card-content,
        .booking-card-content {
          padding: 2rem;
        }

        .destination-description {
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .destination-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(20, 184, 166, 0.1);
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* CSS-only stat icons */
        .distance-icon::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 2px;
          background-color: var(--secondary);
          top: 50%;
          left: 10px;
        }

        .distance-icon::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 8px solid var(--secondary);
          top: 14px;
          right: 10px;
        }

        .time-icon::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid var(--secondary);
          border-radius: 50%;
          top: 11px;
          left: 12px;
        }

        .time-icon::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 2px;
          background-color: var(--secondary);
          top: 19px;
          right: 13px;
          transform: rotate(45deg);
        }

        .gravity-icon::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border: 2px solid var(--secondary);
          border-radius: 50%;
          top: 11px;
          left: 11px;
        }

        .gravity-icon::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 8px;
          background-color: var(--secondary);
          top: 20px;
          left: 19px;
        }

        .temperature-icon::before {
          content: '';
          position: absolute;
          width: 8px;
          height: 16px;
          border: 2px solid var(--secondary);
          border-radius: 4px;
          top: 12px;
          left: 16px;
        }

        .temperature-icon::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: var(--secondary);
          border-radius: 50%;
          top: 24px;
          left: 18px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--secondary);
        }

        .destination-features {
          margin-top: 2rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .feature-item {
          position: relative;
          padding-left: 1.5rem;
        }

        .feature-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 8px;
          height: 8px;
          background-color: var(--secondary);
          border-radius: 50%;
        }

        .booking-card-content {
          display: flex;
          flex-direction: column;
        }

        .price-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1.5rem 0;
          text-align: center;
        }

        .price-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .price-value {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary);
          margin-bottom: 0.25rem;
        }

        .price-note {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .book-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          margin: 1rem 0 2rem;
        }

        .popular-times {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background-color: rgba(20, 184, 166, 0.05);
          border-radius: 0.5rem;
        }

        .popular-times h4 {
          margin-bottom: 1rem;
          color: var(--secondary);
        }

        .popular-times-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .times-label {
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .booking-note {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-subtitle {
          text-align: center;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
        }

        .accommodations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .accommodation-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .accommodation-card:hover {
          transform: translateY(-5px);
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
        }

        .accommodation-name {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }

        .accommodation-type {
          color: var(--text-muted);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .amenities-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
        }

        .amenity-item {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .amenity-item::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--secondary);
        }

        .accommodation-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .accommodation-price {
          display: flex;
          flex-direction: column;
        }

        .price-value {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--secondary);
        }

        .price-period {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .no-accommodations {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }

        .safety-section {
          margin-top: 4rem;
          padding: 3rem;
          background-color: rgba(20, 184, 166, 0.05);
          border-radius: 1rem;
          text-align: center;
        }

        .safety-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .safety-icon {
          width: 60px;
          height: 60px;
          background-color: rgba(20, 184, 166, 0.1);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .safety-icon::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid var(--secondary);
          border-radius: 50%;
          top: 15px;
          left: 15px;
        }

        .safety-icon::after {
          content: '!';
          position: absolute;
          font-size: 24px;
          font-weight: 700;
          color: var(--secondary);
          top: 15px;
          left: 26px;
        }

        .safety-content p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .error-container {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .error-container h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--danger);
        }

        .error-container p {
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .destination-info-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .destination-name {
            font-size: 2.5rem;
          }

          .destination-stats {
            grid-template-columns: 1fr;
          }

          .features-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationDetailPage;