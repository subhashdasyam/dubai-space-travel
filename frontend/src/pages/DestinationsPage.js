import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../api/destinations';
import Loading from '../components/common/Loading';
import { useBooking } from '../hooks/useBooking';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { startBooking } = useBooking();

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleStartBooking = (destination) => {
    startBooking(destination);
  };

  if (isLoading) {
    return <Loading message="Loading destinations..." />;
  }

  return (
    <div className="destinations-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Space Destinations</h1>
          <p className="page-subtitle">
            Explore the most exciting locations in our solar system
          </p>
        </div>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="destinations-grid">
            {destinations.map((destination) => (
              <div key={destination.id} className="destination-card">
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
                  <div className="destination-stats">
                    <div className="stat">
                      <span className="stat-label">Distance</span>
                      <span className="stat-value">{(destination.distance / 1000).toLocaleString()} km</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Travel Time</span>
                      <span className="stat-value">{Math.ceil(destination.travel_time / 24)} days</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Accommodations</span>
                      <span className="stat-value">{destination.accommodations_count}</span>
                    </div>
                  </div>
                  <div className="destination-features">
                    {destination.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="destination-description">
                    {destination.description.length > 150
                      ? `${destination.description.substring(0, 150)}...`
                      : destination.description}
                  </p>
                  <div className="destination-actions">
                    <Link
                      to={`/destinations/${destination.id}`}
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleStartBooking(destination)}
                      className="btn btn-primary"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        .destinations-page {
          padding: 6rem 0 4rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 4rem;
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
          text-align: center;
          color: var(--danger);
          padding: 2rem;
          background-color: rgba(239, 68, 68, 0.1);
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .destination-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .destination-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .destination-visual {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .destination-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .destination-name {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }

        .destination-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--secondary);
        }

        .destination-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .feature-tag {
          background-color: rgba(20, 184, 166, 0.1);
          color: var(--secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .destination-description {
          margin-bottom: 1.5rem;
          flex: 1;
          line-height: 1.6;
        }

        .destination-actions {
          display: flex;
          gap: 1rem;
        }

        .destination-actions .btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .destinations-grid {
            grid-template-columns: 1fr;
          }

          .destination-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationsPage;