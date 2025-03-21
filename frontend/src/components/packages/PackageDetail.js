import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const PackageDetail = ({ packageData }) => {
  const { updateBooking } = useBooking();

  if (!packageData) {
    return <div className="loading">Loading package details...</div>;
  }

  // Handle select package for booking
  const handleSelectPackage = () => {
    updateBooking({ package: packageData });
  };

  return (
    <div className="package-detail">
      <div className="package-header" style={{
        backgroundColor: packageData.css_style_data?.primaryColor ? 
          `rgba(${parseInt(packageData.css_style_data.primaryColor.slice(1, 3), 16)}, ${parseInt(packageData.css_style_data.primaryColor.slice(3, 5), 16)}, ${parseInt(packageData.css_style_data.primaryColor.slice(5, 7), 16)}, 0.3)` : 
          'var(--primary-light)'
      }}>
        <h2 className="package-name">{packageData.name}</h2>
        <span 
          className="package-class"
          style={{
            backgroundColor: packageData.css_style_data?.secondaryColor || 'var(--secondary)'
          }}
        >
          {packageData.class_type}
        </span>
      </div>
      
      <div className="package-content">
        <div className="package-section">
          <h3 className="section-title">Features & Amenities</h3>
          <div className="features-list">
            {packageData.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {packageData.cabin_layout && (
          <div className="package-section">
            <h3 className="section-title">Cabin Layout</h3>
            <div className="cabin-layout">
              <div className="cabin-layout-visual" style={{
                backgroundImage: `url(${packageData.cabin_layout.visual_url})` 
              }}>
                {/* CSS visual representation of cabin layout */}
                <div className="cabin-visual">
                  {packageData.class_type === 'First Class' && (
                    <div className="luxury-cabin-large">
                      <div className="cabin-windows">
                        <div className="cabin-window"></div>
                        <div className="cabin-window"></div>
                      </div>
                      <div className="cabin-seats">
                        <div className="cabin-seat"></div>
                      </div>
                      <div className="cabin-console"></div>
                    </div>
                  )}
                  
                  {packageData.class_type === 'Business Class' && (
                    <div className="business-cabin-large">
                      <div className="cabin-windows">
                        <div className="cabin-window"></div>
                        <div className="cabin-window"></div>
                      </div>
                      <div className="cabin-seats">
                        <div className="cabin-seat"></div>
                        <div className="cabin-seat"></div>
                      </div>
                    </div>
                  )}
                  
                  {packageData.class_type === 'Economy Class' && (
                    <div className="economy-cabin-large">
                      <div className="cabin-windows">
                        <div className="cabin-window"></div>
                        <div className="cabin-window"></div>
                      </div>
                      <div className="cabin-seats">
                        <div className="cabin-seat"></div>
                        <div className="cabin-seat"></div>
                        <div className="cabin-seat"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="cabin-layout-details">
                <p>{packageData.cabin_layout.description}</p>
                {packageData.cabin_layout.dimensions && (
                  <div className="layout-dimension">
                    <span className="dimension-label">Dimensions:</span>
                    <span className="dimension-value">{packageData.cabin_layout.dimensions}</span>
                  </div>
                )}
                {packageData.cabin_layout.capacity && (
                  <div className="layout-capacity">
                    <span className="capacity-label">Capacity:</span>
                    <span className="capacity-value">{packageData.cabin_layout.capacity} travelers</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {packageData.meal_options && packageData.meal_options.length > 0 && (
          <div className="package-section">
            <h3 className="section-title">Dining Experience</h3>
            <div className="meal-options">
              <ul className="meal-list">
                {packageData.meal_options.map((meal, index) => (
                  <li key={index} className="meal-item">{meal}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {packageData.entertainment && packageData.entertainment.length > 0 && (
          <div className="package-section">
            <h3 className="section-title">Entertainment</h3>
            <div className="entertainment-options">
              <ul className="entertainment-list">
                {packageData.entertainment.map((item, index) => (
                  <li key={index} className="entertainment-item">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="package-summary">
          <div className="price-section">
            <span className="price-label">Price per Person</span>
            <span className="price-value">AED {packageData.price.toLocaleString()}</span>
          </div>
          <div className="package-actions">
            <Link 
              to="/booking" 
              className="btn btn-primary book-btn"
              onClick={handleSelectPackage}
            >
              Book with this Package
            </Link>
            <Link to="/packages" className="btn btn-outline back-btn">
              Back to Packages
            </Link>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .package-detail {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .package-header {
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .package-name {
          font-size: 2rem;
          margin: 0;
          color: var(--text-light);
        }
        
        .package-class {
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        
        .package-content {
          padding: 2rem;
        }
        
        .package-section {
          margin-bottom: 2.5rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }
        
        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
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
        
        .cabin-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .cabin-layout-visual {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          height: 200px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .cabin-visual {
          width: 80%;
          height: 80%;
          position: relative;
        }
        
        /* Luxury cabin visualizations */
        .luxury-cabin-large {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .cabin-windows {
          display: flex;
          justify-content: space-around;
        }
        
        .luxury-cabin-large .cabin-window {
          width: 20px;
          height: 20px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .luxury-cabin-large .cabin-seats {
          display: flex;
          justify-content: center;
        }
        
        .luxury-cabin-large .cabin-seat {
          width: 80px;
          height: 40px;
          background-color: var(--secondary);
          border-radius: 5px;
        }
        
        .luxury-cabin-large .cabin-console {
          height: 10px;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        /* Business cabin visualizations */
        .business-cabin-large {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .business-cabin-large .cabin-window {
          width: 15px;
          height: 15px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .business-cabin-large .cabin-seats {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .business-cabin-large .cabin-seat {
          width: 50px;
          height: 30px;
          background-color: var(--secondary);
          border-radius: 4px;
        }
        
        /* Economy cabin visualizations */
        .economy-cabin-large {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .economy-cabin-large .cabin-window {
          width: 12px;
          height: 12px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50%;
        }
        
        .economy-cabin-large .cabin-seats {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        .economy-cabin-large .cabin-seat {
          width: 30px;
          height: 25px;
          background-color: var(--secondary);
          border-radius: 3px;
        }
        
        .cabin-layout-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .cabin-layout-details p {
          margin-bottom: 1rem;
        }
        
        .layout-dimension,
        .layout-capacity {
          margin-bottom: 0.5rem;
        }
        
        .dimension-label,
        .capacity-label {
          font-weight: 600;
          margin-right: 0.5rem;
        }
        
        .meal-list,
        .entertainment-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .meal-item,
        .entertainment-item {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .meal-item::before,
        .entertainment-item::before {
          content: '•';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--secondary);
          font-size: 1.2rem;
        }
        
        .package-summary {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .price-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .price-label {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        
        .price-value {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .package-actions {
          display: flex;
          gap: 1rem;
        }
        
        .book-btn,
        .back-btn {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .features-list,
          .meal-list,
          .entertainment-list {
            grid-template-columns: 1fr;
          }
          
          .cabin-layout {
            grid-template-columns: 1fr;
          }
          
          .package-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageDetail;