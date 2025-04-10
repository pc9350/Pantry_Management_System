'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress, Switch, FormControlLabel, Tooltip } from '@mui/material';

// Dynamically import components to avoid SSR issues
const Food3DModel = dynamic(() => import('./Food3DModel'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});

const FoodLottieAnimation = dynamic(() => import('../lottie/FoodLottieAnimation'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});

// Loading placeholder component
const LoadingPlaceholder = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%'
    }}
  >
    <CircularProgress size={40} color="primary" />
  </Box>
);

/**
 * Component that adapts to show either 3D models or Lottie animations
 * based on availability and user preference
 */
const FoodModelWrapper = ({
  foodCategory = 'default',
  height = 300,
  width = '100%',
  preferLottie = true, // Default to Lottie animations since 3D models are unavailable
  showToggle = false,
  autoRotate = true,
  enableZoom = false,
  enablePan = false,
  modelScale = 2.5,
  ...otherProps
}) => {
  // Always use Lottie by default, but allow toggle if showToggle is true
  const [useLottie, setUseLottie] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggleChange = (event) => {
    setUseLottie(event.target.checked);
  };

  if (loading) {
    return <LoadingPlaceholder />;
  }

  return (
    <Box sx={{ position: 'relative', height, width }}>
      {/* The main visualization - either 3D model or Lottie animation */}
      {useLottie ? (
        <FoodLottieAnimation 
          foodCategory={foodCategory}
          height={height}
          width={width}
          useLocalFiles={true} // Try to use local Lottie files
          {...otherProps}
        />
      ) : (
        <Food3DModel 
          foodCategory={foodCategory}
          height={height}
          width={width}
          autoRotate={autoRotate}
          enableZoom={enableZoom}
          enablePan={enablePan}
          modelScale={modelScale}
          {...otherProps}
        />
      )}
      
      {/* Show toggle switch if option is enabled */}
      {showToggle && (
        <Tooltip title={useLottie ? "Switch to 3D Model" : "Switch to Animation"}>
          <FormControlLabel
            control={
              <Switch
                checked={useLottie}
                onChange={handleToggleChange}
                color="primary"
                size="small"
              />
            }
            label={useLottie ? "Animation" : "3D Model"}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 1,
              padding: '2px 8px',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.75rem',
              }
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default FoodModelWrapper; 