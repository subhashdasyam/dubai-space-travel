import React, { useEffect, useState } from 'react';

const SpaceshipCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [trails, setTrails] = useState([]);
  const [trailId, setTrailId] = useState(0);

  useEffect(() => {
    // Create cursor container if it doesn't exist
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'spaceship-cursor';
    document.body.appendChild(cursorContainer);

    // Create cursor components
    const createCursorElements = () => {
      // Ship container
      const cursorShip = document.createElement('div');
      cursorShip.className = 'cursor-ship';
      
      // Ship body
      const cursorBody = document.createElement('div');
      cursorBody.className = 'cursor-body';
      
      // Ship cockpit
      const cursorCockpit = document.createElement('div');
      cursorCockpit.className = 'cursor-cockpit';
      
      // Left wing
      const cursorWingLeft = document.createElement('div');
      cursorWingLeft.className = 'cursor-wing left';
      
      // Right wing
      const cursorWingRight = document.createElement('div');
      cursorWingRight.className = 'cursor-wing right';
      
      // Left thruster
      const cursorThrusterLeft = document.createElement('div');
      cursorThrusterLeft.className = 'cursor-thruster left';
      
      // Right thruster
      const cursorThrusterRight = document.createElement('div');
      cursorThrusterRight.className = 'cursor-thruster right';
      
      // Left flame
      const cursorFlameLeft = document.createElement('div');
      cursorFlameLeft.className = 'cursor-flame left';
      
      // Right flame
      const cursorFlameRight = document.createElement('div');
      cursorFlameRight.className = 'cursor-flame right';
      
      // Add components to ship
      cursorShip.appendChild(cursorBody);
      cursorShip.appendChild(cursorCockpit);
      cursorShip.appendChild(cursorWingLeft);
      cursorShip.appendChild(cursorWingRight);
      cursorShip.appendChild(cursorThrusterLeft);
      cursorShip.appendChild(cursorThrusterRight);
      cursorShip.appendChild(cursorFlameLeft);
      cursorShip.appendChild(cursorFlameRight);
      
      // Add ship to container
      cursorContainer.appendChild(cursorShip);
    };

    createCursorElements();

    // Mouse move handler
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Update cursor position
      cursorContainer.style.left = `${e.clientX}px`;
      cursorContainer.style.top = `${e.clientY}px`;
      
      // Add new trail for significant movements
      if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5) {
        const newTrail = {
          id: trailId,
          x: e.clientX,
          y: e.clientY,
          timeCreated: Date.now()
        };
        
        setTrails(prev => [...prev, newTrail]);
        setTrailId(prevId => prevId + 1);
      }
    };

    // Mouse hover handler
    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('clickable');
      
      setIsHovering(isClickable);
      
      if (isClickable) {
        cursorContainer.classList.add('clickable');
      } else {
        cursorContainer.classList.remove('clickable');
      }
    };

    // Focus handler for inputs
    const handleFocus = (e) => {
      const target = e.target;
      const isInput = 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA';
      
      setIsInputFocused(isInput);
      
      if (isInput) {
        cursorContainer.classList.add('input');
      } else {
        cursorContainer.classList.remove('input');
      }
    };

    // Focus out handler
    const handleBlur = () => {
      setIsInputFocused(false);
      cursorContainer.classList.remove('input');
    };

    // Mouse down handler
    const handleMouseDown = () => {
      setIsClicking(true);
      cursorContainer.classList.add('click');
    };

    // Mouse up handler
    const handleMouseUp = () => {
      setIsClicking(false);
      cursorContainer.classList.remove('click');
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);

    // Handle hover state
    if (isHovering) {
      cursorContainer.classList.add('hover');
    } else {
      cursorContainer.classList.remove('hover');
    }

    // Clean up trails after they've existed for a while
    const trailCleanupInterval = setInterval(() => {
      const now = Date.now();
      setTrails(prev => prev.filter(trail => now - trail.timeCreated < 1000));
    }, 200);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      clearInterval(trailCleanupInterval);
      
      if (cursorContainer && cursorContainer.parentNode) {
        document.body.removeChild(cursorContainer);
      }
      
      // Remove any lingering trails
      trails.forEach(trail => {
        const trailElement = document.getElementById(`trail-${trail.id}`);
        if (trailElement && trailElement.parentNode) {
          document.body.removeChild(trailElement);
        }
      });
    };
  }, [isHovering, isClicking, isInputFocused, trails, trailId]);

  // Create trail elements
  useEffect(() => {
    // Create and update trail elements
    trails.forEach(trail => {
      let trailElement = document.getElementById(`trail-${trail.id}`);
      
      if (!trailElement) {
        trailElement = document.createElement('div');
        trailElement.id = `trail-${trail.id}`;
        trailElement.className = 'cursor-trail';
        document.body.appendChild(trailElement);
      }
      
      trailElement.style.left = `${trail.x}px`;
      trailElement.style.top = `${trail.y}px`;
      
      // Fade in
      setTimeout(() => {
        trailElement.style.opacity = '0.6';
      }, 10);
      
      // Fade out and remove
      setTimeout(() => {
        trailElement.style.opacity = '0';
        
        setTimeout(() => {
          if (trailElement && trailElement.parentNode) {
            document.body.removeChild(trailElement);
          }
        }, 500);
      }, 500);
    });
  }, [trails]);

  // Component doesn't render anything visible directly
  return null;
};

export default SpaceshipCursor;