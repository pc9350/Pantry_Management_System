'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';

/**
 * A lightweight food-themed pattern background component that renders
 * using pure CSS for better performance compared to 3D models.
 * 
 * @param {Object} props
 * @param {string} props.category - Food category ('fruit', 'vegetable', 'grain', 'meat', 'dairy', 'mixed')
 * @param {number} props.density - Number of pattern elements (5-50)
 * @param {number} props.opacity - Opacity of the pattern (0.1-1)
 * @returns {JSX.Element}
 */
const FoodPatternBackground = ({ 
  category = 'fruit', 
  density = 20, 
  opacity = 0.4 
}) => {
  // State to manage client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Run once after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Define pattern elements for each food category
  const patternElements = useMemo(() => {
    const elements = {
      fruit: [
        '🍎', '🍌', '🍊', '🍓', '🍇', '🍉', '🍋', '🍍', '🥭', '🍑'
      ],
      vegetable: [
        '🥦', '🥕', '🌽', '🍅', '🥬', '🥒', '🍆', '🥔', '🌶️', '🧄'
      ],
      grain: [
        '🍞', '🥖', '🥐', '🥞', '🍚', '🍜', '🌾', '🥯', '🥨', '🌮'
      ],
      meat: [
        '🍗', '🥩', '🍖', '🥓', '🍔', '🌭', '🍤', '🍳', '🥚', '🍲'
      ],
      dairy: [
        '🧀', '🥛', '🍦', '🧁', '🧈', '🍨', '🍰', '🍮', '🥧', '🧉'
      ],
      mixed: [
        '🍎', '🥦', '🍞', '🍗', '🧀', '🍌', '🥕', '🥖', '🥩', '🥛'
      ]
    };
    
    return elements[category] || elements.mixed;
  }, [category]);

  // Generate random positions for pattern elements
  const patternItems = useMemo(() => {
    // Don't generate items during server-side rendering
    if (!isClient) return [];
    
    const items = [];
    const seed = category + density; // Create a deterministic seed
    
    for (let i = 0; i < density; i++) {
      // Use a more deterministic approach for random values
      // This creates a pseudo-random number based on i and seed
      const pseudoRandom1 = Math.abs(Math.sin(i * seed.length)) % 1;
      const pseudoRandom2 = Math.abs(Math.cos(i * (seed.length + 1))) % 1;
      const pseudoRandom3 = Math.abs(Math.sin(i * (seed.length + 2))) % 1;
      
      const elementIndex = Math.floor(pseudoRandom1 * patternElements.length);
      const element = patternElements[elementIndex];
      const scale = 0.5 + pseudoRandom2 * 1.5; // Random size between 0.5 and 2
      
      items.push({
        element,
        x: `${pseudoRandom1 * 100}%`,
        y: `${pseudoRandom2 * 100}%`,
        scale,
        rotation: `${pseudoRandom3 * 360}deg`,
        animationDelay: `${pseudoRandom3 * 20}s`
      });
    }
    
    return items;
  }, [patternElements, density, category, isClient]);

  // CSS for floating animation
  const floatingAnimationStyle = `
    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(10px, 10px) rotate(5deg);
      }
      50% {
        transform: translate(0, 20px) rotate(0deg);
      }
      75% {
        transform: translate(-10px, 10px) rotate(-5deg);
      }
      100% {
        transform: translate(0, 0) rotate(0deg);
      }
    }
  `;

  // Return an empty div during server-side rendering to avoid hydration issues
  if (!isClient) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        opacity,
        pointerEvents: 'none', // Ensure pattern doesn't interfere with user interactions
      }}
    >
      <style jsx global>{floatingAnimationStyle}</style>
      
      {patternItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            fontSize: `${item.scale * 2}rem`,
            transform: `rotate(${item.rotation})`,
            animation: 'float 20s infinite ease-in-out',
            animationDelay: item.animationDelay,
            userSelect: 'none',
            opacity: opacity * 1.5, // Slightly boosted opacity for elements
            filter: 'blur(1px)',
          }}
        >
          {item.element}
        </Box>
      ))}
    </Box>
  );
};

export default FoodPatternBackground; 