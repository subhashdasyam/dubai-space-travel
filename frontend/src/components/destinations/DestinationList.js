import React from 'react';
import DestinationCard from './DestinationCard';

const DestinationList = ({ destinations, onBookNow }) => {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="no-destinations">
        <h3>No destinations available</h3>
        <p>Please check back later for exciting space destinations.</p>
      </div>
    );
  }

  return (
    <div className="destinations-grid">
      {destinations.map((destination) => (
        <DestinationCard 
          key={destination.id} 
          destination={destination} 
          onBookNow={onBookNow}
        />
      ))}

      <style jsx="true">{`
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .no-destinations {
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          grid-column: 1 / -1;
        }
        
        .no-destinations h3 {
          margin-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .destinations-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationList;