import React, { useState, useEffect } from 'react';
import { getPackages } from '../api/packages';
import Loading from '../components/common/Loading';
import PackageCard from '../components/packages/PackageCard';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClassType, setSelectedClassType] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [packagesToCompare, setPackagesToCompare] = useState([]);
  
  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await getPackages(selectedClassType);
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPackages();
  }, [selectedClassType]);
  
  // Handle class type filter change
  const handleClassFilterChange = (classType) => {
    setSelectedClassType(classType);
    // Reset compare mode when changing filters
    setCompareMode(false);
    setPackagesToCompare([]);
  };
  
  // Toggle package comparison selection
  const togglePackageComparison = (packageItem) => {
    if (compareMode) {
      if (packagesToCompare.some(p => p.id === packageItem.id)) {
        // Remove from comparison
        setPackagesToCompare(packagesToCompare.filter(p => p.id !== packageItem.id));
      } else if (packagesToCompare.length < 3) {
        // Add to comparison (max 3)
        setPackagesToCompare([...packagesToCompare, packageItem]);
      }
    }
  };
  
  // Toggle comparison mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      // Entering comparison mode
      setPackagesToCompare([]);
    }
  };
  
  if (isLoading) {
    return <Loading message="Loading packages..." />;
  }
  
  return (
    <div className="packages-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Travel Packages</h1>
          <p className="page-subtitle">Choose how you want to experience space</p>
        </div>
        
        <div className="packages-controls">
          <div className="class-filters">
            <button 
              className={`filter-btn ${selectedClassType === '' ? 'active' : ''}`}
              onClick={() => handleClassFilterChange('')}
            >
              All Classes
            </button>
            <button 
              className={`filter-btn ${selectedClassType === 'First Class' ? 'active' : ''}`}
              onClick={() => handleClassFilterChange('First Class')}
            >
              First Class
            </button>
            <button 
              className={`filter-btn ${selectedClassType === 'Business Class' ? 'active' : ''}`}
              onClick={() => handleClassFilterChange('Business Class')}
            >
              Business Class
            </button>
            <button 
              className={`filter-btn ${selectedClassType === 'Economy Class' ? 'active' : ''}`}
              onClick={() => handleClassFilterChange('Economy Class')}
            >
              Economy Class
            </button>
          </div>
          
          <button 
            className={`compare-btn ${compareMode ? 'active' : ''}`}
            onClick={toggleCompareMode}
          >
            {compareMode ? 'Exit Compare' : 'Compare Packages'}
          </button>
        </div>
        
        {error ? (
          <div className="error-message">{error}</div>
        ) : packages.length === 0 ? (
          <div className="no-packages">
            <h3>No packages available</h3>
            <p>Please try a different class type or check back later.</p>
          </div>
        ) : (
          <>
            {compareMode && (
              <div className="compare-info">
                <p>
                  Select up to 3 packages to compare. 
                  <span className="selected-count">
                    Selected: {packagesToCompare.length}/3
                  </span>
                </p>
                {packagesToCompare.length >= 2 && (
                  <button className="btn btn-primary go-compare-btn">
                    Compare Selected
                  </button>
                )}
              </div>
            )}
            
            <div className="packages-grid">
              {packages.map((packageItem) => (
                <PackageCard
                  key={packageItem.id}
                  packageItem={packageItem}
                  compareMode={compareMode}
                  isSelected={packagesToCompare.some(p => p.id === packageItem.id)}
                  onToggleCompare={() => togglePackageComparison(packageItem)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <style jsx="true">{`
        .packages-page {
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
        
        .packages-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .class-filters {
          display: flex;
          gap: 1rem;
        }
        
        .filter-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
          color: var(--text-light);
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .filter-btn.active {
          color: var(--secondary);
          background-color: rgba(20, 184, 166, 0.1);
        }
        
        .compare-btn {
          background-color: var(--primary-light);
          color: var(--text-light);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .compare-btn:hover {
          background-color: var(--primary);
        }
        
        .compare-btn.active {
          background-color: var(--secondary);
          color: var(--primary-dark);
        }
        
        .compare-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .selected-count {
          margin-left: 0.5rem;
          font-weight: 600;
          color: var(--secondary);
        }
        
        .packages-grid {
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
        
        .no-packages {
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
          .packages-controls {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .class-filters {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .compare-btn {
            width: 100%;
          }
          
          .compare-info {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PackagesPage;