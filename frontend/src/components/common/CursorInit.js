import React, { useEffect, useState } from 'react';

const CursorInit = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile (no custom cursor for mobile)
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // If not mobile, initialize custom cursor
    if (!isMobile) {
      // Create cursor elements
      const cursorContainer = document.createElement('div');
      cursorContainer.className = 'spaceship-cursor';
      document.body.appendChild(cursorContainer);

      const createCursorShip = () => {
        const cursorShip = document.createElement('div');
        cursorShip.className = 'cursor-ship';
        
        const cursorBody = document.createElement('div');
        cursorBody.className = 'cursor-body';
        
        const cursorCockpit = document.createElement('div');
        cursorCockpit.className = 'cursor-cockpit';
        
        const cursorWingLeft = document.createElement('div');
        cursorWingLeft.className = 'cursor-wing left';
        
        const cursorWingRight = document.createElement('div');
        cursorWingRight.className = 'cursor-wing right';
        
        const cursorThrusterLeft = document.createElement('div');
        cursorThrusterLeft.className = 'cursor-thruster left';
        
        const cursorThrusterRight = document.createElement('div');
        cursorThrusterRight.className = 'cursor-thruster right';
        
        const cursorFlameLeft = document.createElement('div');
        cursorFlameLeft.className = 'cursor-flame left';
        
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
        
        return cursorShip;
      };

      // Add the cursor ship to the container
      cursorContainer.appendChild(createCursorShip());

      // Track cursor position
      let mouseX = 0;
      let mouseY = 0;
      let cursorX = 0;
      let cursorY = 0;

      // Create trail elements
      const maxTrails = 5;
      const trailElements = [];

      // Create initial trail elements
      for (let i = 0; i < maxTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = '0';
        document.body.appendChild(trail);
        trailElements.push({
          element: trail,
          x: 0,
          y: 0,
          age: i * 0.1
        });
      }

      // Handle mouse movement
      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Add hover effect on clickable elements
        const target = e.target;
        const isClickable = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.classList.contains('clickable') ||
          target.closest('.clickable');
        
        if (isClickable) {
          cursorContainer.classList.add('hover');
        } else {
          cursorContainer.classList.remove('hover');
        }
        
        // Add input state on form elements
        const isInput = 
          target.tagName === 'INPUT' || 
          target.tagName === 'SELECT' || 
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true';
        
        if (isInput) {
          cursorContainer.classList.add('input');
        } else {
          cursorContainer.classList.remove('input');
        }
      };

      // Handle mouse down/up
      const handleMouseDown = () => {
        cursorContainer.classList.add('click');
      };

      const handleMouseUp = () => {
        cursorContainer.classList.remove('click');
      };

      // Update cursor and trails
      const updateCursor = () => {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        // Update cursor position
        cursorContainer.style.left = `${cursorX}px`;
        cursorContainer.style.top = `${cursorY}px`;
        
        // Update trails with delay
        trailElements.forEach((trail, index) => {
          trail.age += 0.01;
          
          if (trail.age >= 1) {
            trail.age = 0;
            trail.x = cursorX;
            trail.y = cursorY;
            trail.element.style.opacity = '0.6';
          }
          
          const fadeAge = Math.min(trail.age * 2, 1);
          trail.element.style.opacity = (0.6 * (1 - fadeAge)).toString();
          trail.element.style.left = `${trail.x}px`;
          trail.element.style.top = `${trail.y}px`;
        });
        
        requestAnimationFrame(updateCursor);
      };

      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Start animation loop
      requestAnimationFrame(updateCursor);

      // Cleanup function
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('resize', checkMobile);
        
        if (cursorContainer && cursorContainer.parentNode) {
          document.body.removeChild(cursorContainer);
        }
        
        trailElements.forEach(trail => {
          if (trail.element && trail.element.parentNode) {
            document.body.removeChild(trail.element);
          }
        });
      };
    }
    
    // If mobile, add mobile class to body
    if (isMobile) {
      document.body.classList.add('default-cursor');
    } else {
      document.body.classList.remove('default-cursor');
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Component doesn't render anything visible
  return null;
};

export default CursorInit;