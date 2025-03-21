import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate time left
  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  // Update countdown every second
  useEffect(() => {
    // Return early if the countdown is already completed
    if (isCompleted) return;
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Check if countdown has completed
      if (new Date(targetDate) <= new Date()) {
        clearInterval(timer);
        setIsCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate, isCompleted, onComplete]);

  // Format number with leading zero
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="countdown-timer">
      <div className="countdown-units">
        <div className="countdown-unit">
          <div className="unit-value">{formatNumber(timeLeft.days)}</div>
          <div className="unit-label">Days</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="unit-value">{formatNumber(timeLeft.hours)}</div>
          <div className="unit-label">Hours</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="unit-value">{formatNumber(timeLeft.minutes)}</div>
          <div className="unit-label">Minutes</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <div className="unit-value">{formatNumber(timeLeft.seconds)}</div>
          <div className="unit-label">Seconds</div>
        </div>
      </div>
      
      <div className="countdown-target">
        <div className="target-label">Departure:</div>
        <div className="target-date">{new Date(targetDate).toLocaleString()}</div>
      </div>
      
      <style jsx="true">{`
        .countdown-timer {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          animation: pulse 2s infinite;
        }
        
        .countdown-units {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .unit-value {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--secondary);
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          min-width: 3rem;
          text-align: center;
        }
        
        .unit-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        
        .countdown-separator {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: -0.5rem;
        }
        
        .countdown-target {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .target-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .target-date {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--accent-light);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow: 0 5px 20px rgba(20, 184, 166, 0.3);
          }
          100% {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
        }
        
        @media (max-width: 768px) {
          .countdown-units {
            flex-wrap: wrap;
          }
          
          .unit-value {
            font-size: 1.5rem;
            min-width: 2.5rem;
          }
          
          .countdown-separator {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .countdown-units {
            gap: 0.25rem;
          }
          
          .unit-value {
            font-size: 1.2rem;
            min-width: 2rem;
            padding: 0.4rem 0.5rem;
          }
          
          .countdown-separator {
            font-size: 1.2rem;
            margin-top: -0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;