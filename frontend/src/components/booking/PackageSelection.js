import React, { useState, useEffect } from 'react';
import { getPackages } from '../../api/packages';

const PackageSelection = ({ selectedPackage, onSelectPackage }) => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const packageData = await getPackages();
        setPackages(packageData);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle package selection
  const handleSelectPackage = (pkg) => {
    onSelectPackage(pkg);
  };

  // Toggle expanded details for a package
  const toggleExpanded = (packageId) => {
    setExpanded(expanded === packageId ? null : packageId);
  };

  if (isLoading) {
    return <div className="package-loading">Loading packages...</div>;
  }

  if (error) {
    return <div className="package-error">{error}</div>;
  }

  return (
    <div className="package-selection">
      <h3 className="section-title">Select Travel Package</h3>
      <p className="section-description">
        Choose the travel class that fits your needs and preferences
      </p>
      
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}
            style={{
              backgroundColor: pkg.css_style_data?.primaryColor ? 
                `rgba(${parseInt(pkg.css_style_data.primaryColor.slice(1, 3), 16)}, ${parseInt(pkg.css_style_data.primaryColor.slice(3, 5), 16)}, ${parseInt(pkg.css_style_data.primaryColor.slice(5, 7), 16)}, 0.2)` : 
                'var(--card-bg)'
            }}
          >
            <div className="package-header">
              <h4 className="package-name">{pkg.name}</h4>
              <span 
                className="package-class"
                style={{
                  backgroundColor: pkg.css_style_data?.secondaryColor || 'var(--secondary)'
                }}
              >
                {pkg.class_type}
              </span>
            </div>
            
            <div className="package-content">
              <div className="package-features">
                {pkg.features.slice(0, expanded === pkg.id ? pkg.features.length : 4).map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon" aria-hidden="true">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
                
                {pkg.features.length > 4 && expanded !== pkg.id && (
                  <button 
                    className="show-more-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(pkg.id);
                    }}
                  >
                    Show more features
                  </button>
                )}
                
                {expanded === pkg.id && (
                  <button 
                    className="show-less-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(null);
                    }}
                  >
                    Show less
                  </button>
                )}
              </div>
              
              <div className="package-info">
                <div className="package-price">
                  <span className="price-value">AED {pkg.price.toLocaleString()}</span>
                  <span className="price-label">per person</span>
                </div>
                
                <div className="package-capacity">
                  <span className="capacity-value">Capacity: {pkg.capacity}</span>
                  <span className="capacity-label">travelers</span>
                </div>
              </div>
            </div>
            
            <div className="package-footer">
              <button 
                className={`btn ${selectedPackage?.id === pkg.id ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleSelectPackage(pkg)}
              >
                {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
            
            {/* Package Visual */}
            <div className="package-visual">
              {pkg.class_type === 'First Class' && (
                <div className="luxury-cabin">
                  <div className="cabin-window"></div>
                  <div className="cabin-seat"></div>
                  <div className="cabin-console"></div>
                </div>
              )}
              
              {pkg.class_type === 'Business Class' && (
                <div className="business-cabin">
                  <div className="cabin-window"></div>
                  <div className="cabin-seats">
                    <div className="cabin-seat"></div>
                    <div className="cabin-seat"></div>
                  </div>
                </div>
              )}
              
              {pkg.class_type === 'Economy Class' && (
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
          </div>
        ))}
      </div>
      
      <style jsx="true">{`
        .package-selection {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .section-description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .package-card {
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          border: 2px solid transparent;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .package-card.selected {
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px var(--secondary), 0 10px 25px rgba(0, 0, 0, 0.3);
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
        
        .show-more-button,
        .show-less-button {
          background: none;
          border: none;
          color: var(--secondary);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 0.5rem 0;
          text-align: left;
          width: fit-content;
        }
        
        .show-more-button:hover,
        .show-less-button:hover {
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
        
        .package-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .package-footer .btn {
          width: 100%;
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
        
        .package-loading {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
        }
        
        .package-error {
          text-align: center;
          padding: 2rem;
          color: var(--danger);
          background-color: rgba(239, 68, 68, 0.1);
          border-radius: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .packages-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageSelection;