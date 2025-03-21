import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="error-title">Page Lost in Space</h1>
          <p className="error-description">
            Oops! It seems like the page you're looking for has drifted off into the cosmos. Our space engineers are working on retrieving it.
          </p>
          
          <div className="spaceship-animation">
            <div className="astronaut">
              <div className="astronaut-helmet"></div>
              <div className="astronaut-body"></div>
              <div className="astronaut-backpack"></div>
              <div className="astronaut-leg left"></div>
              <div className="astronaut-leg right"></div>
              <div className="astronaut-arm left"></div>
              <div className="astronaut-arm right"></div>
            </div>
            <div className="planets">
              <div className="planet"></div>
              <div className="planet-ring"></div>
              <div className="small-planet one"></div>
              <div className="small-planet two"></div>
              <div className="small-planet three"></div>
              <div className="stars">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`star star-${i + 1}`}></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
            <Link to="/destinations" className="btn btn-outline">
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
        }
        
        .not-found-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .error-code {
          font-family: var(--font-display);
          font-size: 8rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 1rem;
          background: linear-gradient(120deg, var(--secondary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }
        
        .error-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .error-description {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        .spaceship-animation {
          position: relative;
          width: 100%;
          height: 300px;
          margin-bottom: 2rem;
        }
        
        .astronaut {
          position: absolute;
          width: 50px;
          height: 80px;
          left: 50%;
          top: 40%;
          transform: translate(-50%, -50%);
          animation: float 15s ease-in-out infinite;
        }
        
        .astronaut-helmet {
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          top: 0;
          left: 10px;
          z-index: 2;
        }
        
        .astronaut-helmet::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 10px;
          background-color: rgba(14, 165, 233, 0.7);
          border-radius: 50% 50% 0 0;
          top: 10px;
          left: 5px;
        }
        
        .astronaut-body {
          position: absolute;
          width: 40px;
          height: 35px;
          background-color: white;
          border-radius: 8px;
          top: 25px;
          left: 5px;
          z-index: 1;
        }
        
        .astronaut-backpack {
          position: absolute;
          width: 20px;
          height: 25px;
          background-color: #94a3b8;
          border-radius: 5px;
          top: 25px;
          left: 15px;
          z-index: 0;
        }
        
        .astronaut-arm {
          position: absolute;
          width: 8px;
          height: 20px;
          background-color: white;
          border-radius: 4px;
          top: 30px;
          z-index: 1;
        }
        
        .astronaut-arm.left {
          left: 0;
          transform: rotate(-15deg);
          animation: wave 2s ease-in-out infinite;
        }
        
        .astronaut-arm.right {
          right: 0;
          transform: rotate(15deg);
        }
        
        .astronaut-leg {
          position: absolute;
          width: 10px;
          height: 20px;
          background-color: white;
          border-radius: 4px;
          top: 55px;
          z-index: 1;
        }
        
        .astronaut-leg.left {
          left: 10px;
        }
        
        .astronaut-leg.right {
          right: 10px;
        }
        
        .planets {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .planet {
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(circle at 30% 30%, var(--space-planet-earth), #0d47a1);
          border-radius: 50%;
          bottom: 30px;
          right: 30%;
          z-index: 0;
        }
        
        .planet-ring {
          position: absolute;
          width: 150px;
          height: 30px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          bottom: 65px;
          right: calc(30% - 25px);
          transform: rotate(30deg);
          z-index: 0;
        }
        
        .small-planet {
          position: absolute;
          border-radius: 50%;
          z-index: 0;
        }
        
        .small-planet.one {
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, var(--space-planet-mars), #c1440e);
          top: 80px;
          left: 30%;
        }
        
        .small-planet.two {
          width: 15px;
          height: 15px;
          background: radial-gradient(circle at 30% 30%, #a1c4fd, #c2e9fb);
          top: 60%;
          left: 20%;
        }
        
        .small-planet.three {
          width: 25px;
          height: 25px;
          background: radial-gradient(circle at 30% 30%, #ABABAE, #74747a);
          top: 40%;
          right: 25%;
        }
        
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
        }
        
        /* Position stars randomly */
        ${[...Array(20)].map((_, i) => `
          .star-${i + 1} {
            width: ${1 + Math.random() * 3}px;
            height: ${1 + Math.random() * 3}px;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${1 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s;
          }
        `).join('')}
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%);
          }
          25% {
            transform: translate(-40%, -60%);
          }
          50% {
            transform: translate(-60%, -50%);
          }
          75% {
            transform: translate(-50%, -40%);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: rotate(-15deg);
          }
          50% {
            transform: rotate(-45deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        
        @media (max-width: 768px) {
          .error-code {
            font-size: 6rem;
          }
          
          .error-title {
            font-size: 2rem;
          }
          
          .spaceship-animation {
            height: 250px;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .action-buttons .btn {
            width: 100%;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;