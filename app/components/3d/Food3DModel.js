'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Food model that will be loaded and rendered
const Model = ({ 
  foodCategory, 
  autoRotate = true, 
  rotationSpeed = 0.005, 
  scale = 2.5,
  position = [0, 0, 0]
}) => {
  const group = useRef();
  const modelPaths = {
    fruit: '/models/apple.glb',
    vegetable: '/models/broccoli.glb',
    meat: '/models/chicken.glb',
    dairy: '/models/cheese.glb',
    grain: '/models/bread.glb',
    seafood: '/models/salmon.glb',
    spice: '/models/cinnamon.glb',
    pasta: '/models/pasta.glb',
    // Default model if category doesn't match
    default: '/models/apple.glb'
  };

  // Select the model path based on category or use default
  const modelPath = modelPaths[foodCategory] || modelPaths.default;
  
  // State for handling model loading errors
  const [modelError, setModelError] = useState(false);
  const [sceneObj, setSceneObj] = useState(null);
  
  // Load the model outside of render conditions
  useEffect(() => {
    try {
      // Attempt to load the model
      const loadModel = async () => {
        try {
          const gltf = await useGLTF.load(modelPath);
          setSceneObj(gltf.scene);
          setModelError(false);
        } catch (error) {
          console.warn(`Error loading model for ${foodCategory}:`, error);
          setModelError(true);
        }
      };
      
      loadModel();
    } catch (error) {
      console.warn(`Error in model loading effect for ${foodCategory}:`, error);
      setModelError(true);
    }
  }, [foodCategory, modelPath]);
  
  // Handle rotation animation - always call this hook
  useFrame((state, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += rotationSpeed;
    }
  });

  // Render based on the loading state
  if (modelError) {
    // Fallback cube if model loading failed
    return (
      <group ref={group} position={position}>
        <mesh scale={scale * 0.5}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={getFoodColor(foodCategory)} />
        </mesh>
      </group>
    );
  }
  
  if (!sceneObj) {
    // Return empty group while loading
    return <group ref={group} position={position} />;
  }
  
  // Successfully loaded model
  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={sceneObj} />
    </group>
  );
};

// Helper function to get color based on food category
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

// Loading fallback component
const LoadingFallback = () => (
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

// Canvas component separated for client-side rendering only
const Food3DModelCanvas = ({ 
  foodCategory, 
  height, 
  autoRotate,
  rotationSpeed,
  enableZoom,
  enablePan,
  modelScale 
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ borderRadius: 'inherit' }}
    >
      {/* Environment lighting */}
      <Environment preset="studio" />
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light for shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Fill light from the bottom */}
      <directionalLight position={[0, -5, 0]} intensity={0.3} />
      
      {/* The 3D model */}
      <Model 
        foodCategory={foodCategory} 
        autoRotate={autoRotate} 
        rotationSpeed={rotationSpeed}
        scale={modelScale}
      />
      
      {/* Ground shadow */}
      <ContactShadows
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
        opacity={0.6}
        width={10}
        height={10}
        blur={1}
        far={4}
      />
      
      {/* Controls for interaction */}
      <OrbitControls 
        enableZoom={enableZoom}
        enablePan={enablePan}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};

// Dynamically import the actual implementation with SSR disabled
const Food3DModelClient = dynamic(
  () => import('./Food3DModelClient'),
  {
    ssr: false,
    loading: LoadingFallback
  }
);

// Main wrapper component
const Food3DModel = (props) => {
  return (
    <Box
      sx={{
        height: props.height || 300,
        width: props.width || '100%',
        position: 'relative',
        borderRadius: 'inherit'
      }}
    >
      <Food3DModelClient {...props} />
    </Box>
  );
};

export default Food3DModel;

// Preload models to improve performance
if (typeof window !== 'undefined') {
  // Only preload on client side
  useGLTF.preload('/models/apple.glb');
  useGLTF.preload('/models/broccoli.glb');
  useGLTF.preload('/models/chicken.glb');
  useGLTF.preload('/models/cheese.glb');
  useGLTF.preload('/models/bread.glb');
  useGLTF.preload('/models/salmon.glb');
  useGLTF.preload('/models/cinnamon.glb');
  useGLTF.preload('/models/pasta.glb');
} 