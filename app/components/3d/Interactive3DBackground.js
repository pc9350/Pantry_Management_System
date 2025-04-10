'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Empty placeholder for server-side rendering
const LoadingPlaceholder = ({ height = '100%', width = '100%' }) => {
  return (
    <Box 
      sx={{ 
        height, 
        width, 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

// Dynamically import the client-side implementation with SSR disabled
const Interactive3DBackgroundClient = dynamic(
  () => import('./Interactive3DBackgroundClient'),
  {
    ssr: false,
    loading: LoadingPlaceholder
  }
);

// Main wrapper component
const Interactive3DBackground = (props) => {
  return <Interactive3DBackgroundClient {...props} />;
};

export default Interactive3DBackground; 