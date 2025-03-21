import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <div className="spaceship-loader">
        <div className="spaceship">
          <div className="body"></div>
          <div className="cockpit"></div>
          <div className="wing left"></div>
          <div className="wing right"></div>
          <div className="thruster left"></div>
          <div className="thruster right"></div>
          <div className="flame left"></div>
          <div className="flame right"></div>
        </div>
        <div className="stars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`star star-${i + 1}`}></div>
          ))}
        </div>
      </div>
      <p className="loading-message">{message}</p>

      <style jsx="true">{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          width: 100%;
        }

        .spaceship-loader {
          position: relative;
          width: 200px;
          height: 200px;
          margin-bottom: 2rem;
        }

        .spaceship {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 30px;
          animation: float 3s ease-in-out infinite;
        }

        .body {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 12px;
          background: linear-gradient(90deg, #64748b, #94a3b8, #64748b);
          border-radius: 10px 10px 0 0;
        }

        .cockpit {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 8px;
          background-color: rgba(14, 165, 233, 0.7);
          border: 1px solid #0ea5e9;
          border-radius: 50% 50% 0 0;
        }

        .wing {
          position: absolute;
          top: 45%;
          width: 12px;
          height: 6px;
          background-color: #475569;
          border-radius: 2px;
        }

        .wing.left {
          left: 10%;
          transform: skewY(-15deg);
        }

        .wing.right {
          right: 10%;
          transform: skewY(15deg);
        }

        .thruster {
          position: absolute;
          bottom: 10%;
          width: 6px;
          height: 8px;
          background-color: #475569;
          border-radius: 0 0 50% 50%;
        }

        .thruster.left {
          left: 35%;
        }

        .thruster.right {
          right: 35%;
        }

        .flame {
          position: absolute;
          bottom: -100%;
          width: 4px;
          height: 20px;
          background: linear-gradient(to bottom, #f97316, #f59e0b, #fbbf24);
          border-radius: 0 0 50% 50%;
          filter: blur(1px);
          animation: thruster-pulse 0.3s ease-in-out infinite;
        }

        .flame.left {
          left: 36%;
        }

        .flame.right {
          right: 36%;
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: #fff;
          border-radius: 50%;
          animation: star-move 3s linear infinite;
        }

        .loading-message {
          font-family: var(--font-display);
          font-size: 1.2rem;
          color: var(--secondary-light);
          text-align: center;
        }

        /* Position stars randomly */
        ${[...Array(20)].map((_, i) => `
          .star-${i + 1} {
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
            width: ${1 + Math.random() * 2}px;
            height: ${1 + Math.random() * 2}px;
            opacity: ${0.5 + Math.random() * 0.5};
          }
        `).join('')}

        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-50%, -60%);
          }
        }

        @keyframes thruster-pulse {
          0%, 100% {
            height: 20px;
            opacity: 0.8;
          }
          50% {
            height: 25px;
            opacity: 1;
          }
        }

        @keyframes star-move {
          0% {
            transform: translateY(-100px);
          }
          100% {
            transform: translateY(200px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;