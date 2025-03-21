import React, { useEffect, useRef } from 'react';

const StarField = () => {
  const starFieldRef = useRef(null);

  useEffect(() => {
    const starField = starFieldRef.current;
    if (!starField) return;

    // Clear any existing stars
    starField.innerHTML = '';

    // Create nebula clouds
    const createNebula = (type, count) => {
      for (let i = 0; i < count; i++) {
        const nebula = document.createElement('div');
        nebula.className = `nebula ${type}`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = 150 + Math.random() * 300;
        
        nebula.style.width = `${size}px`;
        nebula.style.height = `${size}px`;
        nebula.style.left = `${posX}%`;
        nebula.style.top = `${posY}%`;
        
        // Add to star field
        starField.appendChild(nebula);
      }
    };

    // Create stars with different sizes
    const createStars = (className, count) => {
      for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = `star ${className}`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Random animation delay for twinkling
        if (Math.random() > 0.7) {
          star.classList.add(
            Math.random() > 0.5 ? 'twinkle-fast' : 'twinkle-slow'
          );
        }
        
        // Add to star field
        starField.appendChild(star);
      }
    };

    // Create nebulas
    createNebula('pink', 3);
    createNebula('blue', 3);
    createNebula('teal', 2);

    // Create stars
    createStars('small', 150);
    createStars('medium', 100);
    createStars('large', 50);

    // Cleanup function
    return () => {
      starField.innerHTML = '';
    };
  }, []);

  return <div ref={starFieldRef} className="star-field"></div>;
};

export default StarField;