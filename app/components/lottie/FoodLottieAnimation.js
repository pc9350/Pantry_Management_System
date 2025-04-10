'use client';

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Define mapping between food categories and local Lottie animations
const localAnimations = {
  fruit: '/lottie/fruit_animation.json',
  vegetable: '/lottie/vegetable_animation.json',
  meat: '/lottie/meat_animation.json',
  dairy: '/lottie/dairy_animation.json',
  grain: '/lottie/grain_animation.json',
  seafood: '/lottie/seafood_animation.json',
  spice: '/lottie/spice_animation.json',
  pasta: '/lottie/pasta_animation.json',
  // Fallback animation if category doesn't match
  default: '/lottie/default_food_animation.json'
};

// Define remote animations from CDN
const remoteAnimations = {
  // Free Lottie animations from LottieFiles.com
  fruit: 'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
  vegetable: 'https://assets7.lottiefiles.com/packages/lf20_dudmkdsj.json',
  meat: 'https://assets4.lottiefiles.com/packages/lf20_qs1edps7.json',
  dairy: 'https://assets9.lottiefiles.com/packages/lf20_FOrRqZ.json',
  grain: 'https://assets2.lottiefiles.com/packages/lf20_phfzmvtt.json',
  seafood: 'https://assets7.lottiefiles.com/packages/lf20_jnu3k1m5.json',
  spice: 'https://assets4.lottiefiles.com/packages/lf20_k9wsvmf1.json',
  pasta: 'https://assets2.lottiefiles.com/packages/lf20_ifaky8wr.json',
  default: 'https://assets6.lottiefiles.com/packages/lf20_ysduybqg.json'
};

// Get appropriate color for fallback based on food category
const getFoodColor = (category) => {
  const colorMap = {
    fruit: '#ff6b6b',
    vegetable: '#51cf66',
    meat: '#e64980',
    dairy: '#f8f9fa',
    grain: '#fcc419',
    seafood: '#74c0fc',
    spice: '#ff922b',
    pasta: '#ffb300',
    default: '#adb5bd'
  };
  
  return colorMap[category] || colorMap.default;
};

// Fallback component when all animations fail to load
const FallbackComponent = ({ foodCategory, height }) => {
  return (
    <Box
      sx={{
        height: height || 300,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
        borderRadius: 'inherit',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{ 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          backgroundColor: getFoodColor(foodCategory),
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}
      />
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mt: 2,
          fontWeight: 'bold'
        }}
      >
        {foodCategory.charAt(0).toUpperCase() + foodCategory.slice(1)}
      </Typography>
    </Box>
  );
};

// Loading indicator
const LoadingComponent = () => (
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

// Main component
const FoodLottieAnimation = ({ 
  foodCategory = 'default', 
  height = 300,
  width = '100%',
  loop = true,
  autoplay = true,
  useLocalFiles = false,
  style = {}
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animationPath, setAnimationPath] = useState(null);
  const [usingLocalFile, setUsingLocalFile] = useState(useLocalFiles);

  useEffect(() => {
    // Reset states when food category changes
    setLoading(true);
    setError(false);
    
    // Start with either remote or local animations based on the prop
    const initialAnimationMap = useLocalFiles ? localAnimations : remoteAnimations;
    const selectedAnimation = initialAnimationMap[foodCategory] || initialAnimationMap.default;
    
    setAnimationPath(selectedAnimation);
    setUsingLocalFile(useLocalFiles);
    setLoading(false);
  }, [foodCategory, useLocalFiles]);

  const handleAnimationError = () => {
    // If remote animation fails and we're not already using local file, try local file
    if (!usingLocalFile) {
      console.log(`Remote animation failed for ${foodCategory}, trying local fallback`);
      const localFallback = localAnimations[foodCategory] || localAnimations.default;
      setAnimationPath(localFallback);
      setUsingLocalFile(true);
      return;
    }
    
    // If we're already using local file and it still fails, show the fallback component
    console.error(`Failed to load both remote and local animations for category: ${foodCategory}`);
    setError(true);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <FallbackComponent foodCategory={foodCategory} height={height} />;
  }

  return (
    <Box
      sx={{
        height,
        width,
        position: 'relative',
        borderRadius: 'inherit',
        overflow: 'hidden',
        ...style
      }}
    >
      <Lottie
        animationData={typeof animationPath === 'object' ? animationPath : undefined}
        path={typeof animationPath === 'string' ? animationPath : undefined}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        onError={handleAnimationError}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice'
        }}
      />
    </Box>
  );
};

export default FoodLottieAnimation; 