import React, { useState } from 'react';

const SeatSelection = ({ packageData, selectedSeats, onSelectSeats }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  if (!packageData) {
    return <div className="loading">Loading seat map...</div>;
  }

  // Determine seat layout based on package class
  const getTotalRows = () => {
    switch (packageData.class_type) {
      case 'First Class':
        return 4;
      case 'Business Class':
        return 6;
      case 'Economy Class':
        return 10;
      default:
        return 8;
    }
  };

  const getSeatsPerRow = () => {
    switch (packageData.class_type) {
      case 'First Class':
        return 2;
      case 'Business Class':
        return 3;
      case 'Economy Class':
        return 6;
      default:
        return 4;
    }
  };

  const isSeatAvailable = (rowIndex, seatIndex) => {
    // This would typically check against a real availability API
    // For now, just make some seats unavailable as an example
    if (packageData.class_type === 'First Class') {
      return !(rowIndex === 0 && seatIndex === 0);
    } else if (packageData.class_type === 'Business Class') {
      return !(rowIndex === 1 && seatIndex === 1);
    } else {
      // Economy - make some random seats unavailable
      return !((rowIndex === 2 && seatIndex === 3) || 
               (rowIndex === 5 && seatIndex === 2) || 
               (rowIndex === 7 && seatIndex === 4));
    }
  };

  const generateSeatLabel = (rowIndex, seatIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex); // A, B, C, etc.
    return `${rowLabel}${seatIndex + 1}`;
  };

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatLabel = generateSeatLabel(rowIndex, seatIndex);
    
    if (!isSeatAvailable(rowIndex, seatIndex)) {
      return; // Seat is not available
    }
    
    let newSelectedSeats;
    
    if (selectedSeats.includes(seatLabel)) {
      // Deselect the seat
      newSelectedSeats = selectedSeats.filter(seat => seat !== seatLabel);
    } else {
      // Select the seat
      newSelectedSeats = [...selectedSeats, seatLabel];
    }
    
    onSelectSeats(newSelectedSeats);
  };

  const handleSeatHover = (rowIndex, seatIndex) => {
    if (isSeatAvailable(rowIndex, seatIndex)) {
      setHoveredSeat(generateSeatLabel(rowIndex, seatIndex));
    }
  };

  const rows = getTotalRows();
  const seatsPerRow = getSeatsPerRow();

  return (
    <div className="seat-selection">
      <h3 className="seat-selection-title">Select Your Seats</h3>
      
      <div className="cabin-info">
        <p>Cabin Class: <span className="cabin-class">{packageData.class_type}</span></p>
        <div className="seat-legend">
          <div className="legend-item">
            <div className="seat-example available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat-example selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat-example unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
      
      <div className="spacecraft-map">
        <div className="cockpit"></div>
        
        <div className="cabin">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
              
              {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                const seatLabel = generateSeatLabel(rowIndex, seatIndex);
                const isAvailable = isSeatAvailable(rowIndex, seatIndex);
                const isSelected = selectedSeats.includes(seatLabel);
                const isHovered = hoveredSeat === seatLabel;
                
                // Add aisle for Economy class
                const isAisle = packageData.class_type === 'Economy Class' && seatIndex === 2;
                
                return (
                  <React.Fragment key={seatIndex}>
                    <div 
                      className={`seat ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      onMouseEnter={() => handleSeatHover(rowIndex, seatIndex)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      title={isAvailable ? seatLabel : `Seat ${seatLabel} is unavailable`}
                    >
                      <span className="seat-label">{seatLabel}</span>
                    </div>
                    {isAisle && <div className="aisle"></div>}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="exit-row">
          <div className="exit left">EXIT</div>
          <div className="exit right">EXIT</div>
        </div>
      </div>
      
      <div className="selected-seats-summary">
        <h4>Selected Seats:</h4>
        {selectedSeats.length > 0 ? (
          <div className="selected-list">
            {selectedSeats.join(', ')}
          </div>
        ) : (
          <div className="no-seats-selected">No seats selected</div>
        )}
      </div>
      
      <style jsx="true">{`
        .seat-selection {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .seat-selection-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .cabin-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .cabin-class {
          color: var(--secondary);
          font-weight: 600;
        }
        
        .seat-legend {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .seat-example {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        
        .seat-example.available {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .seat-example.selected {
          background-color: var(--secondary);
        }
        
        .seat-example.unavailable {
          background-color: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.3);
        }
        
        .spacecraft-map {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 600px;
          margin: 0 auto 2rem;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 1rem;
          padding: 2rem 1rem;
          position: relative;
        }
        
        .cockpit {
          width: 100px;
          height: 50px;
          background-color: rgba(14, 165, 233, 0.2);
          border: 1px solid rgba(14, 165, 233, 0.5);
          border-radius: 50% 50% 0 0;
          margin-bottom: 1rem;
        }
        
        .cabin {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        .seat-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
        }
        
        .row-label {
          width: 20px;
          text-align: center;
          font-weight: 600;
          color: var(--text-muted);
        }
        
        .seat {
          width: ${props => props.packageData?.class_type === 'First Class' ? '50px' : props.packageData?.class_type === 'Business Class' ? '40px' : '30px'};
          height: ${props => props.packageData?.class_type === 'First Class' ? '50px' : props.packageData?.class_type === 'Business Class' ? '40px' : '30px'};
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .seat.available {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
        }
        
        .seat.available:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .seat.selected {
          background-color: var(--secondary);
          color: var(--primary-dark);
          font-weight: 600;
          box-shadow: 0 0 10px rgba(20, 184, 166, 0.5);
        }
        
        .seat.hovered:not(.selected) {
          background-color: rgba(20, 184, 166, 0.3);
        }
        
        .seat.unavailable {
          background-color: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.3);
          cursor: not-allowed;
          color: rgba(255, 255, 255, 0.3);
        }
        
        .seat-label {
          font-size: 0.8rem;
        }
        
        .aisle {
          width: 20px;
        }
        
        .exit-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        
        .exit {
          padding: 0.25rem 0.5rem;
          background-color: rgba(239, 68, 68, 0.2);
          border: 1px solid var(--danger);
          color: var(--danger);
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: 3px;
        }
        
        .selected-seats-summary {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 0.5rem;
        }
        
        .selected-seats-summary h4 {
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .selected-list {
          font-weight: 600;
          color: var(--secondary);
          letter-spacing: 0.05em;
        }
        
        .no-seats-selected {
          color: var(--text-muted);
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .cabin-info {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .seat {
            width: ${props => props.packageData?.class_type === 'First Class' ? '40px' : props.packageData?.class_type === 'Business Class' ? '35px' : '25px'};
            height: ${props => props.packageData?.class_type === 'First Class' ? '40px' : props.packageData?.class_type === 'Business Class' ? '35px' : '25px'};
          }
          
          .seat-label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SeatSelection;