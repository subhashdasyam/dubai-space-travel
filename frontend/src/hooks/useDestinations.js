import React from 'react';

/**
 * BurjKhalifaArt Component - A CSS-only artistic representation of the Burj Khalifa
 * @param {Object} props
 * @param {number} props.height - The height of the Burj Khalifa art in pixels
 */
const BurjKhalifaArt = ({ height = 400 }) => {
  // Calculate proportional sizes based on the provided height
  const baseWidth = Math.round(height * 0.2);
  const baseHeight = Math.round(height * 0.08);
  const bodyWidth = Math.round(height * 0.1);
  const bodyHeight = Math.round(height * 0.6);
  const middleWidth = Math.round(height * 0.06);
  const middleHeight = Math.round(height * 0.2);
  const spireWidth = Math.round(height * 0.012);
  const spireHeight = Math.round(height * 0.12);
  const antennaWidth = Math.round(height * 0.004);
  const antennaHeight = Math.round(height * 0.04);

  return (
    <div className="burj-khalifa-container" style={{ height: `${height}px`, width: `${baseWidth * 2}px` }}>
      {/* Base of the building */}
      <div 
        className="burj-base" 
        style={{ 
          width: `${baseWidth}px`, 
          height: `${baseHeight}px`, 
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      ></div>
      
      {/* Main body of the building */}
      <div 
        className="burj-body" 
        style={{ 
          width: `${bodyWidth}px`, 
          height: `${bodyHeight}px`,
          bottom: `${baseHeight}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        {/* Left wing */}
        <div 
          className="burj-wing left" 
          style={{ 
            width: `${bodyWidth * 0.8}px`, 
            height: `${bodyHeight * 0.85}px`,
            bottom: 0,
            left: `-${bodyWidth * 0.8}px`
          }}
        ></div>
        
        {/* Right wing */}
        <div 
          className="burj-wing right" 
          style={{ 
            width: `${bodyWidth * 0.8}px`, 
            height: `${bodyHeight * 0.85}px`,
            bottom: 0,
            right: `-${bodyWidth * 0.8}px`
          }}
        ></div>
      </div>
      
      {/* Middle section of the building */}
      <div 
        className="burj-middle" 
        style={{ 
          width: `${middleWidth}px`, 
          height: `${middleHeight}px`,
          bottom: `${baseHeight + bodyHeight}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      ></div>
      
      {/* Spire */}
      <div 
        className="burj-spire" 
        style={{ 
          width: `${spireWidth}px`, 
          height: `${spireHeight}px`,
          bottom: `${baseHeight + bodyHeight + middleHeight}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      ></div>
      
      {/* Antenna */}
      <div 
        className="burj-antenna" 
        style={{ 
          width: `${antennaWidth}px`, 
          height: `${antennaHeight}px`,
          bottom: `${baseHeight + bodyHeight + middleHeight + spireHeight}px`,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      ></div>
      
      {/* Building lights */}
      <div 
        className="burj-lights" 
        style={{ 
          width: '100%', 
          height: `${bodyHeight + baseHeight}px`,
          bottom: 0,
          left: 0
        }}
      >
        {/* Dynamically generate random lights */}
        {[...Array(40)].map((_, i) => {
          const top = Math.random() * 95;
          const left = Math.random() * 100;
          const size = 1 + Math.random() * 1;
          const delay = Math.random() * 5;
          
          return (
            <div 
              key={i} 
              className="burj-light" 
              style={{ 
                top: `${top}%`, 
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`
              }}
            ></div>
          );
        })}
      </div>

      <style jsx="true">{`
        .burj-khalifa-container {
          position: relative;
          margin: 0 auto;
        }
        
        .burj-base {
          position: absolute;
          background-color: #9ca3af;
          border-radius: 10px 10px 0 0;
        }
        
        .burj-body {
          position: absolute;
          background: linear-gradient(180deg, #64748b 0%, #334155 100%);
        }
        
        .burj-wing {
          position: absolute;
          background: linear-gradient(180deg, #64748b 0%, #334155 100%);
        }
        
        .burj-middle {
          position: absolute;
          background: linear-gradient(180deg, #64748b 0%, #334155 100%);
        }
        
        .burj-spire {
          position: absolute;
          background: linear-gradient(180deg, #f1f5f9 0%, #94a3b8 100%);
        }
        
        .burj-antenna {
          position: absolute;
          background-color: #cbd5e1;
        }
        
        .burj-lights {
          position: absolute;
          pointer-events: none;
        }
        
        .burj-light {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: twinkle 3s infinite alternate;
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default BurjKhalifaArt;