import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const AccommodationCard = ({ accommodation, isSelectable = false, isSelected = false, onSelect = null }) => {
  const { updateBooking } = useBooking();

  // Handle select accommodation
  const handleSelect = () => {
    if (isSelectable && onSelect) {
      onSelect(accommodation);
    } else if (isSelectable) {
      updateBooking({ accommodation });
    }
  };

  return (
    <div 
      className={`accommodation-card ${isSelectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={isSelectable ? handleSelect : undefined}
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
              <span className="amenity-icon">✓</span>
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
        <div className="accommodation-footer">
          {isSelectable ? (
            <button className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`}>
              {isSelected ? 'Selected' : 'Select'}
            </button>
          ) : (
            <Link 
              to={`/accommodations/${accommodation.id}`}
              className="btn btn-primary"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
      {isSelected && (
        <div className="selection-indicator">
          <span className="indicator-icon">✓</span>
        </div>
      )}

      <style jsx="true">{`
        .accommodation-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 2px solid transparent;
        }
        
        .accommodation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .accommodation-card.selectable {
          cursor: pointer;
        }
        
        .accommodation-card.selected {
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px var(--secondary), 0 15px 30px rgba(0, 0, 0, 0.3);
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
          color: var(--secondary-light);
        }
        
        .accommodation-type {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        
        .accommodation-amenities {
          margin-bottom: 1.5rem;
          flex: 1;
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
        
        .accommodation-price {
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
        
        .price-period {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .accommodation-footer {
          margin-top: auto;
        }
        
        .accommodation-footer .btn {
          width: 100%;
        }
        
        .selection-indicator {
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 30px;
          height: 30px;
          background-color: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-dark);
          font-weight: 600;
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default AccommodationCard;