import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../api/destinations';
import BurjKhalifaArt from '../components/common/BurjKhalifaArt';
import Loading from '../components/common/Loading';

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const data = await getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (isLoading) {
    return <Loading message="Preparing for launch..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title appear">Dubai to Stars</h1>
            <p className="hero-subtitle appear-delay-1">
              Experience Luxury Space Travel from the World's First Space Hub
            </p>
            <div className="hero-cta appear-delay-2">
              <Link to="/destinations" className="btn btn-primary">
                Explore Destinations
              </Link>
              <Link to="/booking" className="btn btn-outline">
                Book Now
              </Link>
            </div>
          </div>
          <div className="hero-visual appear-delay-3">
            <div className="dubai-art">
              <BurjKhalifaArt height={400} />
            </div>
            <div className="spaceship-art">
              <div className="spaceship-container float">
                <div className="spaceship">
                  <div className="ship-body"></div>
                  <div className="ship-cockpit"></div>
                  <div className="ship-wing left"></div>
                  <div className="ship-wing right"></div>
                  <div className="ship-thruster left"></div>
                  <div className="ship-thruster middle"></div>
                  <div className="ship-thruster right"></div>
                  <div className="ship-flame left"></div>
                  <div className="ship-flame middle"></div>
                  <div className="ship-flame right"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-line"></div>
      </section>

      {/* Destinations Preview Section */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Discover our most sought-after space experiences</p>
          </div>

          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="destinations-grid">
              {destinations.slice(0, 3).map((destination) => (
                <div key={destination.id} className="destination-card">
                  <div 
                    className="destination-visual"
                    style={{
                      backgroundColor: destination.css_style_data?.primaryColor || 'var(--primary-light)'
                    }}
                  >
                    {destination.name === 'Lunar Resort' && (
                      <div className="moon-base">
                        <div className="moon-surface"></div>
                        <div className="moon-crater" style={{ width: '20px', height: '20px', top: '20px', left: '30px' }}></div>
                        <div className="moon-crater" style={{ width: '15px', height: '15px', top: '25px', left: '80px' }}></div>
                        <div className="moon-dome"></div>
                        <div className="moon-building left"></div>
                        <div className="moon-building right"></div>
                        <div className="moon-antenna left"></div>
                        <div className="moon-antenna right"></div>
                      </div>
                    )}
                    {destination.name === 'Mars Colony' && (
                      <div className="mars-colony">
                        <div className="mars-surface"></div>
                        <div className="mars-dome large"></div>
                        <div className="mars-dome left"></div>
                        <div className="mars-dome right"></div>
                        <div className="mars-tunnel"></div>
                      </div>
                    )}
                    {destination.name === 'Orbital Luxury Station' && (
                      <div className="space-station">
                        <div className="station-core"></div>
                        <div className="station-ring rotate-slow"></div>
                        <div className="station-module top"></div>
                        <div className="station-module bottom"></div>
                        <div className="station-module left"></div>
                        <div className="station-module right"></div>
                        <div className="station-solar-panel left"></div>
                        <div className="station-solar-panel right"></div>
                      </div>
                    )}
                    {destination.name === 'Venus Cloud City' && (
                      <div className="venus-cloud-city">
                        <div className="venus-clouds"></div>
                        <div className="venus-platform"></div>
                        <div className="venus-building central"></div>
                        <div className="venus-building left"></div>
                        <div className="venus-building right"></div>
                        <div className="venus-dome central"></div>
                        <div className="venus-dome left"></div>
                        <div className="venus-dome right"></div>
                        <div className="venus-balloon left"></div>
                        <div className="venus-balloon right"></div>
                      </div>
                    )}
                  </div>
                  <div className="destination-content">
                    <h3 className="destination-name">{destination.name}</h3>
                    <p className="destination-info">
                      <span className="distance">{(destination.distance / 1000).toLocaleString()} km</span>
                      <span className="separator">•</span>
                      <span className="travel-time">{Math.ceil(destination.travel_time / 24)} days</span>
                    </p>
                    <p className="destination-description">
                      {destination.description.length > 100
                        ? `${destination.description.substring(0, 100)}...`
                        : destination.description}
                    </p>
                    <Link to={`/destinations/${destination.id}`} className="btn btn-secondary">
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-container">
            <Link to="/destinations" className="btn btn-outline view-all-btn">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Dubai to Stars</h2>
            <p className="section-subtitle">The premier gateway to space tourism</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-luxury"></div>
              </div>
              <h3 className="feature-title">Unparalleled Luxury</h3>
              <p className="feature-description">
                Experience space travel with the comfort and elegance that Dubai is known for.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-safety"></div>
              </div>
              <h3 className="feature-title">Safety First</h3>
              <p className="feature-description">
                Our state-of-the-art technology ensures the safest journey beyond Earth.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-destinations"></div>
              </div>
              <h3 className="feature-title">Exotic Destinations</h3>
              <p className="feature-description">
                From lunar resorts to Mars colonies, explore the most fascinating places in our solar system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-concierge"></div>
              </div>
              <h3 className="feature-title">Personal Space Concierge</h3>
              <p className="feature-description">
                Our AI-powered concierge service is available 24/7 to ensure your journey exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Space Traveler Experiences</h2>
            <p className="section-subtitle">Hear from our pioneering customers</p>
          </div>

          <div className="testimonials-slider">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  "The view of Earth from the Lunar Resort was absolutely breathtaking. The Dubai to Stars team made sure every moment was perfect. Worth every dirham!"
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <p className="author-name">Sheikh Mohammed</p>
                  <p className="author-trip">Lunar Resort, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Experience the Stars?</h2>
            <p className="cta-text">
              Book your journey today and be among the first to experience luxury space travel.
            </p>
            <div className="cta-buttons">
              <Link to="/booking" className="btn btn-primary">
                Book Now
              </Link>
              <Link to="/destinations" className="btn btn-outline">
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .hero-section {
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
          padding: 2rem 0;
        }

        .hero-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-title {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--text-muted);
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
        }

        .hero-visual {
          position: relative;
          width: 500px;
          height: 500px;
        }

        .dubai-art {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .spaceship-art {
          position: absolute;
          top: 20%;
          left: 30%;
          z-index: 2;
        }

        .spaceship-container {
          width: 120px;
          height: 50px;
          transform: rotate(-15deg);
        }

        .spaceship {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            var(--secondary), 
            var(--accent), 
            var(--secondary), 
            transparent
          );
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .destinations-section {
          padding: 5rem 0;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .destination-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .destination-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .destination-visual {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .destination-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .destination-name {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--secondary-light);
        }

        .destination-info {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .separator {
          margin: 0 0.5rem;
        }

        .destination-description {
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .view-all-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .features-section {
          padding: 5rem 0;
          background-color: rgba(28, 30, 60, 0.3);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          text-align: center;
          padding: 2rem;
          background-color: rgba(12, 15, 28, 0.5);
          border-radius: 1rem;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(20, 184, 166, 0.1);
          border-radius: 50%;
        }

        .feature-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }

        .feature-description {
          color: var(--text-muted);
        }

        /* CSS-only feature icons */
        .icon-luxury {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .icon-luxury::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 15px;
          border: 3px solid var(--secondary);
          border-radius: 50% 50% 0 0;
          border-bottom: none;
          top: 10px;
          left: 5px;
        }

        .icon-luxury::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          background-color: var(--secondary);
          border-radius: 50%;
          bottom: 5px;
          left: 12.5px;
        }

        .icon-safety {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .icon-safety::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 30px;
          border: 3px solid var(--secondary);
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }

        .icon-safety::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 3px;
          background-color: var(--secondary);
          top: 18.5px;
          left: 10px;
          transform: rotate(45deg);
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }

        .icon-destinations {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .icon-destinations::before {
          content: '';
          position: absolute;
          width: 25px;
          height: 25px;
          border: 3px solid var(--secondary);
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }

        .icon-destinations::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border: 3px solid var(--secondary);
          border-radius: 50%;
          bottom: 5px;
          right: 5px;
        }

        .icon-concierge {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .icon-concierge::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 15px;
          border: 3px solid var(--secondary);
          border-radius: 5px 5px 0 0;
          top: 5px;
          left: 10px;
        }

        .icon-concierge::after {
          content: '';
          position: absolute;
          width: 30px;
          height: 15px;
          border: 3px solid var(--secondary);
          border-radius: 5px;
          bottom: 5px;
          left: 5px;
        }

        .testimonials-section {
          padding: 5rem 0;
        }

        .testimonials-slider {
          max-width: 800px;
          margin: 0 auto;
        }

        .testimonial-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .testimonial-content {
          margin-bottom: 1.5rem;
        }

        .testimonial-text {
          font-size: 1.1rem;
          line-height: 1.6;
          font-style: italic;
          position: relative;
        }

        .testimonial-text::before,
        .testimonial-text::after {
          content: '"';
          color: var(--secondary);
          font-size: 2rem;
          line-height: 0;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
        }

        .author-avatar {
          width: 50px;
          height: 50px;
          background-color: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--primary-dark);
          margin-right: 1rem;
        }

        .author-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-trip {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .cta-section {
          padding: 5rem 0;
        }

        .cta-container {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          border-radius: 1rem;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .cta-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }

        .cta-text {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .hero-container {
            flex-direction: column;
            text-align: center;
          }

          .hero-content {
            margin-bottom: 3rem;
          }

          .hero-title {
            font-size: 3rem;
          }

          .hero-cta {
            justify-content: center;
          }

          .hero-visual {
            width: 100%;
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .cta-title {
            font-size: 2rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .hero-cta {
            flex-direction: column;
            width: 100%;
          }

          .hero-cta .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;