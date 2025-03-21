import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccommodationReviews } from '../../api/accommodations';
import { useBooking } from '../../hooks/useBooking';

const AccommodationDetail = ({ accommodation, destination }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { updateBooking } = useBooking();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!accommodation) return;
      
      try {
        setIsLoading(true);
        const response = await getAccommodationReviews(accommodation.id);
        setReviews(response.reviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [accommodation]);

  if (!accommodation) {
    return (
      <div className="loading-container">
        <p>Loading accommodation details...</p>
      </div>
    );
  }

  // Handle booking
  const handleBook = () => {
    updateBooking({
      destination: destination,
      accommodation: accommodation
    });
  };

  return (
    <div className="accommodation-detail">
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
        <div className="accommodation-header">
          <h2 className="accommodation-name">{accommodation.name}</h2>
          <p className="accommodation-type">{accommodation.type}</p>
        </div>
        
        <div className="accommodation-description">
          <p>{accommodation.description}</p>
        </div>
        
        <div className="accommodation-sections">
          <div className="accommodation-section">
            <h3 className="section-title">Amenities</h3>
            <ul className="amenities-list">
              {accommodation.amenities.map((amenity, index) => (
                <li key={index} className="amenity-item">
                  <span className="amenity-icon">✓</span>
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="accommodation-section">
            <h3 className="section-title">Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Price per night</span>
                <span className="detail-value price">AED {accommodation.price_per_night.toLocaleString()}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Capacity</span>
                <span className="detail-value">{accommodation.capacity} travelers</span>
              </div>
              
              {accommodation.gravity_simulation !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Gravity Simulation</span>
                  <span className="detail-value">{accommodation.gravity_simulation ? 'Yes' : 'No'}</span>
                </div>
              )}
              
              {accommodation.view_type && (
                <div className="detail-item">
                  <span className="detail-label">View Type</span>
                  <span className="detail-value">{accommodation.view_type}</span>
                </div>
              )}
              
              {accommodation.oxygen_quality && (
                <div className="detail-item">
                  <span className="detail-label">Oxygen Quality</span>
                  <span className="detail-value">{accommodation.oxygen_quality}</span>
                </div>
              )}
              
              {accommodation.construction_year && (
                <div className="detail-item">
                  <span className="detail-label">Built</span>
                  <span className="detail-value">{accommodation.construction_year}</span>
                </div>
              )}
            </div>
          </div>
          
          {accommodation.room_types && accommodation.room_types.length > 0 && (
            <div className="accommodation-section">
              <h3 className="section-title">Room Types</h3>
              <div className="room-types-grid">
                {accommodation.room_types.map((room, index) => (
                  <div key={index} className="room-type-card">
                    <h4 className="room-type-name">{room.name}</h4>
                    <p className="room-type-description">{room.description}</p>
                    <div className="room-type-price">
                      <span className="price-value">AED {room.price_per_night.toLocaleString()}</span>
                      <span className="price-label">per night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {reviews && reviews.length > 0 && (
            <div className="accommodation-section">
              <h3 className="section-title">Guest Reviews</h3>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-rating">
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`rating-star ${i < Math.floor(review.rating) ? 'filled' : ''}`}
                            ></span>
                          ))}
                        </div>
                        <span className="rating-value">{review.rating.toFixed(1)}</span>
                      </div>
                      <div className="review-meta">
                        <span className="review-author">{review.user_name}</span>
                        <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="accommodation-actions">
          <Link 
            to="/booking" 
            className="btn btn-primary book-btn"
            onClick={handleBook}
          >
            Book Now
          </Link>
          <Link to="/accommodations" className="btn btn-outline back-btn">
            Back to Accommodations
          </Link>
        </div>
      </div>
      
      <style jsx="true">{`
        .accommodation-detail {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .accommodation-visual {
          height: 300px;
          position: relative;
        }
        
        .accommodation-rating {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: rgba(0, 0, 0, 0.7);
          padding: 0.75rem;
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
          font-size: 1.2rem;
        }
        
        .rating-stars {
          display: flex;
          gap: 0.2rem;
        }
        
        .rating-star {
          width: 15px;
          height: 15px;
          position: relative;
        }
        
        .rating-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-right: 7.5px solid transparent;
          border-bottom: 5px solid var(--text-muted);
          border-left: 7.5px solid transparent;
          transform: rotate(35deg);
        }
        
        .rating-star::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-right: 7.5px solid transparent;
          border-bottom: 5px solid var(--text-muted);
          border-left: 7.5px solid transparent;
          transform: rotate(-35deg);
        }
        
        .rating-star.filled::before,
        .rating-star.filled::after {
          border-bottom-color: var(--secondary);
        }
        
        .accommodation-content {
          padding: 2rem;
        }
        
        .accommodation-header {
          margin-bottom: 1.5rem;
        }
        
        .accommodation-name {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .accommodation-type {
          color: var(--text-muted);
          font-size: 1.1rem;
        }
        
        .accommodation-description {
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .accommodation-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--secondary);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }
        
        .amenities-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .amenity-item {
          display: flex;
          align-items: center;
        }
        
        .amenity-icon {
          color: var(--secondary);
          margin-right: 0.5rem;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .detail-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          font-weight: 600;
        }
        
        .detail-value.price {
          color: var(--secondary);
          font-family: var(--font-display);
          font-size: 1.2rem;
        }
        
        .room-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .room-type-card {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .room-type-name {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }
        
        .room-type-description {
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .room-type-price {
          display: flex;
          flex-direction: column;
        }
        
        .price-value {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--secondary);
        }
        
        .price-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .review-card {
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .review-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .review-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .review-author {
          font-weight: 600;
        }
        
        .review-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .review-comment {
          font-style: italic;
        }
        
        .accommodation-actions {
          display: flex;
          gap: 1rem;
        }
        
        .book-btn,
        .back-btn {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .accommodation-visual {
            height: 200px;
          }
          
          .amenities-list,
          .details-grid,
          .room-types-grid {
            grid-template-columns: 1fr;
          }
          
          .review-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .review-meta {
            align-items: flex-start;
          }
          
          .accommodation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AccommodationDetail;