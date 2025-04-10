'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Box } from '@mui/material';

/**
 * A lightweight food-themed gradient background component
 * Uses CSS gradients and animations for better performance than 3D models
 * 
 * @param {Object} props
 * @param {string} props.theme - Color theme ('fresh', 'warm', 'cool', 'dessert')
 * @param {boolean} props.animate - Whether to animate the gradient
 * @param {number} props.opacity - Opacity of the gradient (0.1-1)
 * @returns {JSX.Element}
 */
const FoodGradientBackground = ({
  theme = 'fresh',
  animate = true,
  opacity = 0.7
}) => {
  // State to manage client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Run once after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Define gradient themes with food-inspired colors
  const gradientThemes = useMemo(() => ({
    fresh: {
      colors: [
        'rgba(120, 224, 143, 0.8)',  // Fresh mint/lettuce green
        'rgba(250, 211, 144, 0.8)',  // Fresh orange/mango
        'rgba(163, 203, 56, 0.8)',   // Fresh lime
      ],
      angle: '135deg'
    },
    warm: {
      colors: [
        'rgba(225, 112, 85, 0.8)',   // Tomato red
        'rgba(250, 177, 160, 0.8)',  // Salmon pink
        'rgba(253, 203, 110, 0.8)',  // Golden honey
      ],
      angle: '45deg'
    },
    cool: {
      colors: [
        'rgba(116, 185, 255, 0.8)',  // Blueberry blue
        'rgba(162, 155, 254, 0.8)',  // Lavender purple
        'rgba(108, 92, 231, 0.8)',   // Grape purple
      ],
      angle: '225deg'
    },
    dessert: {
      colors: [
        'rgba(225, 177, 44, 0.8)',   // Caramel/honey
        'rgba(253, 121, 168, 0.8)',  // Strawberry ice cream
        'rgba(232, 67, 147, 0.8)',   // Raspberry
      ],
      angle: '315deg'
    }
  }), []);

  // Get current theme
  const currentTheme = useMemo(() => 
    gradientThemes[theme] || gradientThemes.fresh
  , [theme, gradientThemes]);

  // Create the CSS for the gradient
  const gradientCSS = useMemo(() => {
    const { colors, angle } = currentTheme;
    return `linear-gradient(${angle}, ${colors.join(', ')})`;
  }, [currentTheme]);

  // Animation keyframes for gradient movement
  const animationCSS = `
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;
  
  // Return a simplified version during server-side rendering
  if (!isClient) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradientCSS,
          opacity,
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <>
      {animate && <style jsx global>{animationCSS}</style>}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradientCSS,
          backgroundSize: animate ? '200% 200%' : '100% 100%',
          animation: animate ? 'gradientShift 15s ease infinite' : 'none',
          opacity,
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default FoodGradientBackground; 