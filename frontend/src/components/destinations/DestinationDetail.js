import React from 'react';
import { Link } from 'react-router-dom';

const DestinationDetail = ({ destination, onBookNow }) => {
  if (!destination) {
    return (
      <div className="loading-container">
        <p>Loading destination details...</p>
      </div>
    );
  }

  return (
    <div className="destination-detail">
      <div className="detail-header">
        <h2 className="detail-title">{destination.name}</h2>
        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label">Distance</span>
            <span className="meta-value">{(destination.distance / 1000).toLocaleString()} km</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Travel Time</span>
            <span className="meta-value">{Math.ceil(destination.travel_time / 24)} days</span>
          </div>
          {destination.gravity && (
            <div className="meta-item">
              <span className="meta-label">Gravity</span>
              <span className="meta-value">{destination.gravity} G</span>
            </div>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-description">
          <h3>Overview</h3>
          <p>{destination.description}</p>
        </div>

        <div className="detail-features">
          <h3>Key Features</h3>
          <ul className="features-list">
            {destination.features.map((feature, index) => (
              <li key={index} className="feature-item">{feature}</li>
            ))}
          </ul>
        </div>

        {destination.points_of_interest && (
          <div className="points-of-interest">
            <h3>Points of Interest</h3>
            <div className="points-grid">
              {destination.points_of_interest.map((point, index) => (
                <div key={index} className="point-item">
                  <h4>{point.name}</h4>
                  <p>{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="detail-actions">
        <button onClick={() => onBookNow(destination)} className="btn btn-primary">
          Book Now
        </button>
        <Link to="/destinations" className="btn btn-outline">
          Back to Destinations
        </Link>
      </div>

      <style jsx="true">{`
        .destination-detail {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        .detail-header {
          padding: 2rem;
          background-color: var(--primary-light);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .detail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }
        
        .meta-item {
          display: flex;
          flex-direction: column;
        }
        
        .meta-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .meta-value {
          font-weight: 600;
        }
        
        .detail-content {
          padding: 2rem;
        }
        
        .detail-description {
          margin-bottom: 2rem;
        }
        
        .detail-description h3,
        .detail-features h3,
        .points-of-interest h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .detail-description p {
          line-height: 1.6;
        }
        
        .detail-features {
          margin-bottom: 2rem;
        }
        
        .features-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
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
        
        .points-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .point-item {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .point-item h4 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary);
        }
        
        .detail-actions {
          display: flex;
          gap: 1rem;
          padding: 0 2rem 2rem;
        }
        
        @media (max-width: 768px) {
          .detail-meta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .features-list {
            grid-template-columns: 1fr;
          }
          
          .points-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationDetail;