import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const DestinationCard = ({ destination }) => {
  const { startBooking } = useBooking();

  // Handle booking this destination
  const handleBookNow = (e) => {
    e.preventDefault();
    startBooking(destination);
  };

  return (
    <div className="destination-card">
      <div 
        className="destination-visual"
        style={{
          backgroundColor: destination.css_style_data?.primaryColor || 'var(--primary-light)'
        }}
      >
        {/* Render destination CSS art based on name */}
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
          {destination.description.length > 120
            ? `${destination.description.substring(0, 120)}...`
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
            onClick={handleBookNow}
            className="btn btn-primary"
          >
            Book Now
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .destination-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .destination-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .destination-visual {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
          color: var(--secondary-light);
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
        
        .destination-actions {
          display: flex;
          gap: 1rem;
        }
        
        .destination-actions .btn {
          flex: 1;
        }
        
        @media (max-width: 480px) {
          .destination-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationCard;