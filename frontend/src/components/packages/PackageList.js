import React from 'react';
import PackageCard from './PackageCard';

/**
 * Renders a list of travel packages
 * 
 * @param {Object} props
 * @param {Array} props.packages - The list of package objects to display
 * @param {boolean} props.compareMode - Whether the component is in comparison mode
 * @param {Array} props.selectedPackages - List of selected packages for comparison
 * @param {Function} props.onToggleCompare - Function to handle toggling package selection for comparison
 */
const PackageList = ({ 
  packages, 
  compareMode = false, 
  selectedPackages = [], 
  onToggleCompare 
}) => {
  if (!packages || packages.length === 0) {
    return (
      <div className="no-packages">
        <h3>No packages available</h3>
        <p>Please try different search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="packages-grid">
      {packages.map((packageItem) => (
        <PackageCard
          key={packageItem.id}
          packageItem={packageItem}
          compareMode={compareMode}
          isSelected={selectedPackages.some(p => p.id === packageItem.id)}
          onToggleCompare={() => onToggleCompare(packageItem)}
        />
      ))}
      
      <style jsx="true">{`
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .no-packages {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        .no-packages h3 {
          margin-bottom: 1rem;
        }
        
        .no-packages p {
          color: var(--text-muted);
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

export default PackageList;