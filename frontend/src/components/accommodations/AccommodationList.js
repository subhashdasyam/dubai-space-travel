import React from 'react';
import AccommodationCard from './AccommodationCard';

const AccommodationList = ({ accommodations, isSelectable = false, selectedAccommodation = null, onSelectAccommodation }) => {
  if (!accommodations || accommodations.length === 0) {
    return (
      <div className="no-accommodations">
        <h3>No accommodations available</h3>
        <p>Please try different search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="accommodations-grid">
      {accommodations.map((accommodation) => (
        <AccommodationCard 
          key={accommodation.id} 
          accommodation={accommodation}
          isSelectable={isSelectable}
          isSelected={selectedAccommodation?.id === accommodation.id}
          onSelect={onSelectAccommodation}
        />
      ))}

      <style jsx="true">{`
        .accommodations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .no-accommodations {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        .no-accommodations h3 {
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .accommodations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AccommodationList;