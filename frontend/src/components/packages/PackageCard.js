import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const PackageCard = ({ packageItem, compareMode = false, isSelected = false, onToggleCompare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateBooking } = useBooking();

  // Handle select package and navigate to booking
  const handleSelectPackage = () => {
    if (compareMode) {
      onToggleCompare(packageItem);
    } else {
      updateBooking({ package: packageItem });
      // Navigate to booking would happen in the parent component if needed
    }
  };

  // Toggle expanded features
  const toggleExpanded = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`package-card ${isSelected ? 'selected' : ''} ${compareMode ? 'compare-mode' : ''}`}
      onClick={compareMode ? handleSelectPackage : undefined}
      style={{
        backgroundColor: packageItem.css_style_data?.primaryColor ? 
          `rgba(${parseInt(packageItem.css_style_data.primaryColor.slice(1, 3), 16)}, ${parseInt(packageItem.css_style_data.primaryColor.slice(3, 5), 16)}, ${parseInt(packageItem.css_style_data.primaryColor.slice(5, 7), 16)}, 0.2)` : 
          'var(--card-bg)'
      }}
    >
      <div className="package-header">
        <h3 className="package-name">{packageItem.name}</h3>
        <span 
          className="package-class"
          style={{
            backgroundColor: packageItem.css_style_data?.secondaryColor || 'var(--secondary)'
          }}
        >
          {packageItem.class_type}
        </span>
      </div>

      <div className="package-content">
        <div className="package-features">
          {packageItem.features.slice(0, isExpanded ? packageItem.features.length : 4).map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-icon">\u2713</span>
              <span>{feature}</span>
            </div>
          ))}
          
          {packageItem.features.length > 4 && (
            <button 
              className="show-more-button"
              onClick={toggleExpanded}
            >
              {isExpanded ? 'Show less' : 'Show more features'}
            </button>
          )}
        </div>
        
        <div className="package-info">
          <div className="package-price">
            <span className="price-value">AED {packageItem.price.toLocaleString()}</span>
            <span className="price-label">per person</span>
          </div>
          
          <div className="package-capacity">
            <span className="capacity-value">Capacity: {packageItem.capacity}</span>
            <span className="capacity-label">travelers</span>
          </div>
        </div>
      </div>
      
      <div className="package-actions">
        {compareMode ? (
          <button className={`btn ${isSelected ? 'btn-secondary' : 'btn-outline'}`}>
            {isSelected ? 'Selected' : 'Select for Comparison'}
          </button>
        ) : (
          <>
            <Link to={`/packages/${packageItem.id}`} className="btn btn-secondary">
              View Details
            </Link>
            <button onClick={handleSelectPackage} className="btn btn-primary">
              Select Package
            </button>
          </>
        )}
      </div>
      
      {/* Package Visual */}
      <div className="package-visual">
        {packageItem.class_type === 'First Class' && (
          <div className="luxury-cabin">
            <div className="cabin-window"></div>
            <div className="cabin-seat"></div>
            <div className="cabin-console"></div>
          </div>
        )}
        
        {packageItem.class_type === 'Business Class' && (
          <div className="business-cabin">
            <div className="cabin-window"></div>
            <div className="cabin-seats">
              <div className="cabin-seat"></div>
              <div className="cabin-seat"></div>
            </div>
          </div>
        )}
        
        {packageItem.class_type === 'Economy Class' && (
          <div className="economy-cabin">
            <div className="cabin-window"></div>
            <div className="cabin-seats">
              <div className="cabin-seat"></div>
              <div className="cabin-seat"></div>
              <div className="cabin-seat"></div>
            </div>
          </div>
        )}
      </div>
      
      {isSelected && compareMode && (
        <div className="selection-indicator">
          <span className="indicator-icon">\u2713</span>
        </div>
      )}
      
      <style jsx="true">{`
        .package-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 2px solid transparent;
        }
        
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .package-card.compare-mode {
          cursor: pointer;
        }
        
        .package-card.selected {
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px var(--secondary), 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .package-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .package-name {
          font-size: 1.3rem;
          margin: 0;
          color: var(--text-light);
        }
        
        .package-class {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        
        .package-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .package-features {
          margin-bottom: 1.5rem;
          flex: 1;
        }
        
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }
        
        .feature-icon {
          color: var(--secondary);
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        
        .show-more-button {
          background: none;
          border: none;
          color: var(--secondary);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0;
          text-align: left;
          width: fit-content;
        }
        
        .show-more-button:hover {
          text-decoration: underline;
        }
        
        .package-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .package-price,
        .package-capacity {
          display: flex;
          flex-direction: column;
        }
        
        .price-value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .price-label,
        .capacity-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .capacity-value {
          font-weight: 600;
        }
        
        .package-actions {
          padding: 0 1.5rem 1.5rem;
          display: flex;
          gap: 1rem;
        }
        
        .package-actions .btn {
          flex: 1;
        }
        
        .package-visual {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 60px;
          height: 60px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        /* Luxury cabin */
        .luxury-cabin {
          width: 80%;
          height: 80%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
        }
        
        .luxury-cabin .cabin-window {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 10px;
          height: 10px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .luxury-cabin .cabin-seat {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 15px;
          background-color: var(--secondary);
          border-radius: 2px;
        }
        
        .luxury-cabin .cabin-console {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 25px;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
        }
        
        /* Business cabin */
        .business-cabin {
          width: 80%;
          height: 80%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
        }
        
        .business-cabin .cabin-window {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 10px;
          height: 10px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .business-cabin .cabin-seats {
          position: absolute;
          bottom: 5px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 5px;
        }
        
        .business-cabin .cabin-seat {
          width: 12px;
          height: 12px;
          background-color: var(--secondary);
          border-radius: 2px;
        }
        
        /* Economy cabin */
        .economy-cabin {
          width: 80%;
          height: 80%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
        }
        
        .economy-cabin .cabin-window {
          position: absolute;
          top: 5px;
          left: 5px;
          width: 8px;
          height: 8px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .economy-cabin .cabin-seats {
          position: absolute;
          bottom: 5px;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 3px;
        }
        
        .economy-cabin .cabin-seat {
          width: 8px;
          height: 8px;
          background-color: var(--secondary);
          border-radius: 2px;
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
        
        @media (max-width: 768px) {
          .package-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageCard;