import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';

const PackageComparison = ({ packages }) => {
  const { updateBooking } = useBooking();

  if (!packages || packages.length === 0) {
    return (
      <div className="no-packages">
        <h3>No packages to compare</h3>
        <p>Please select packages to compare.</p>
        <Link to="/packages" className="btn btn-primary">
          Back to Packages
        </Link>
      </div>
    );
  }

  // Handle select package
  const handleSelectPackage = (packageItem) => {
    updateBooking({ package: packageItem });
  };

  // Group all features from all packages
  const allFeatures = [...new Set(
    packages.flatMap(pkg => pkg.features)
  )];

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2 className="comparison-title">Package Comparison</h2>
        <p className="comparison-subtitle">Compare features and prices to find your perfect package</p>
      </div>
      
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-column">Features</th>
              {packages.map(pkg => (
                <th key={pkg.id} className="package-column">
                  <div className="package-header">
                    <h3 className="package-name">{pkg.name}</h3>
                    <span 
                      className="package-class"
                      style={{
                        backgroundColor: pkg.css_style_data?.secondaryColor || 'var(--secondary)'
                      }}
                    >
                      {pkg.class_type}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="price-row">
              <td>Price</td>
              {packages.map(pkg => (
                <td key={`${pkg.id}-price`} className="price-cell">
                  <span className="price-value">AED {pkg.price.toLocaleString()}</span>
                  <span className="price-label">per person</span>
                </td>
              ))}
            </tr>
            <tr>
              <td>Capacity</td>
              {packages.map(pkg => (
                <td key={`${pkg.id}-capacity`}>
                  {pkg.capacity} travelers
                </td>
              ))}
            </tr>
            {allFeatures.map((feature, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{feature}</td>
                {packages.map(pkg => (
                  <td key={`${pkg.id}-${index}`}>
                    {pkg.features.includes(feature) ? (
                      <span className="feature-included">✓</span>
                    ) : (
                      <span className="feature-not-included">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="actions-row">
              <td></td>
              {packages.map(pkg => (
                <td key={`${pkg.id}-action`}>
                  <Link 
                    to="/booking" 
                    className="btn btn-primary select-btn"
                    onClick={() => handleSelectPackage(pkg)}
                  >
                    Select Package
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="comparison-footer">
        <Link to="/packages" className="btn btn-outline back-btn">
          Back to All Packages
        </Link>
      </div>
      
      <style jsx="true">{`
        .comparison-container {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
        }
        
        .comparison-header {
          padding: 2rem;
          text-align: center;
          background-color: var(--primary-light);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .comparison-subtitle {
          color: var(--text-muted);
        }
        
        .comparison-table-wrapper {
          overflow-x: auto;
          padding: 1rem;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comparison-table th {
          background-color: rgba(0, 0, 0, 0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .feature-column {
          text-align: left;
          min-width: 200px;
        }
        
        .package-column {
          min-width: 200px;
        }
        
        .package-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .package-name {
          font-size: 1.2rem;
          margin: 0;
        }
        
        .package-class {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        
        .price-row {
          background-color: rgba(255, 255, 255, 0.05);
          font-weight: 600;
        }
        
        .price-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .price-value {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--secondary);
        }
        
        .price-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: normal;
        }
        
        .even-row {
          background-color: rgba(255, 255, 255, 0.02);
        }
        
        .odd-row {
          background-color: transparent;
        }
        
        .feature-included {
          color: var(--secondary);
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .feature-not-included {
          color: var(--text-muted);
        }
        
        .actions-row td {
          padding-top: 1.5rem;
          border-bottom: none;
        }
        
        .select-btn {
          width: 100%;
        }
        
        .comparison-footer {
          padding: 1.5rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .back-btn {
          min-width: 200px;
        }
        
        .no-packages {
          text-align: center;
          padding: 3rem;
        }
        
        .no-packages h3 {
          margin-bottom: 1rem;
        }
        
        .no-packages p {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .comparison-table {
            width: 100%;
            min-width: 600px;
          }
          
          .comparison-table th,
          .comparison-table td {
            padding: 0.75rem;
          }
          
          .feature-column {
            min-width: 150px;
          }
          
          .package-column {
            min-width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageComparison;