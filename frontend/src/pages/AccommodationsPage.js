import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAccommodations } from '../api/accommodations';
import { getDestinations } from '../api/destinations';
import AccommodationCard from '../components/accommodations/AccommodationCard';
import Loading from '../components/common/Loading';

const AccommodationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accommodations, setAccommodations] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    destination_id: searchParams.get('destination_id') || '',
    type: searchParams.get('type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_rating: searchParams.get('min_rating') || ''
  });
  
  // Extract unique accommodation types for filter
  const accommodationTypes = [...new Set(accommodations.map(acc => acc.type))];
  
  // Fetch accommodations and destinations on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch destinations for filter
        const destinationsData = await getDestinations();
        setDestinations(destinationsData);
        
        // Prepare filter params
        const params = {};
        if (filters.destination_id) params.destination_id = filters.destination_id;
        if (filters.type) params.type = filters.type;
        if (filters.min_price) params.min_price = Number(filters.min_price);
        if (filters.max_price) params.max_price = Number(filters.max_price);
        if (filters.min_rating) params.min_rating = Number(filters.min_rating);
        
        // Fetch accommodations with filters
        const accommodationsData = await getAccommodations(params);
        setAccommodations(accommodationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [filters.destination_id, filters.type, filters.min_price, filters.max_price, filters.min_rating]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update URL search params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    setSearchParams(newSearchParams);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      destination_id: '',
      type: '',
      min_price: '',
      max_price: '',
      min_rating: ''
    });
    setSearchParams({});
  };
  
  if (isLoading) {
    return <Loading message="Loading accommodations..." />;
  }
  
  return (
    <div className="accommodations-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Space Accommodations</h1>
          <p className="page-subtitle">Find your perfect stay among the stars</p>
        </div>
        
        <div className="accommodations-layout">
          <div className="filters-sidebar">
            <div className="filters-card">
              <h2 className="filters-title">Filters</h2>
              
              <div className="filter-group">
                <label htmlFor="destination_id">Destination</label>
                <select 
                  id="destination_id" 
                  name="destination_id" 
                  value={filters.destination_id}
                  onChange={handleFilterChange}
                >
                  <option value="">All Destinations</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="type">Accommodation Type</label>
                <select 
                  id="type" 
                  name="type" 
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {accommodationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="min_price">Min Price (AED)</label>
                <input 
                  type="number" 
                  id="min_price" 
                  name="min_price" 
                  value={filters.min_price}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="max_price">Max Price (AED)</label>
                <input 
                  type="number" 
                  id="max_price" 
                  name="max_price" 
                  value={filters.max_price}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="min_rating">Min Rating</label>
                <select 
                  id="min_rating" 
                  name="min_rating" 
                  value={filters.min_rating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
              
              <button 
                className="btn btn-outline clear-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="accommodations-content">
            {error ? (
              <div className="error-message">{error}</div>
            ) : accommodations.length === 0 ? (
              <div className="no-results">
                <h3>No accommodations found</h3>
                <p>Try adjusting your filters to see more options.</p>
                <button 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="accommodations-grid">
                {accommodations.map((accommodation) => (
                  <AccommodationCard 
                    key={accommodation.id} 
                    accommodation={accommodation} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .accommodations-page {
          padding: 6rem 0 4rem;
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .page-title {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .page-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .accommodations-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }
        
        .filters-sidebar {
          position: sticky;
          top: calc(var(--header-height) + 2rem);
          height: fit-content;
        }
        
        .filters-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .filters-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .filter-group {
          margin-bottom: 1.5rem;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .filter-group select,
        .filter-group input {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
        }
        
        .clear-btn {
          width: 100%;
          margin-top: 1rem;
        }
        
        .accommodations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 2rem;
          border-radius: 0.5rem;
          text-align: center;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        
        .no-results h3 {
          margin-bottom: 1rem;
        }
        
        .no-results p {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
        }
        
        @media (max-width: 1024px) {
          .accommodations-layout {
            grid-template-columns: 1fr;
          }
          
          .filters-sidebar {
            position: static;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AccommodationsPage;