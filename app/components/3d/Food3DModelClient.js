'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

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

// Enhanced fallback shape when model loading fails
const FallbackShape = ({ foodCategory, scale = 1, autoRotate = true, rotationSpeed = 0.005 }) => {
  const mesh = useRef();
  const color = getFoodColor(foodCategory);
  
  // Handle rotation animation
  useFrame((state, delta) => {
    if (autoRotate && mesh.current) {
      mesh.current.rotation.y += rotationSpeed;
      mesh.current.rotation.x += rotationSpeed * 0.3;
    }
  });

  // Different shapes based on category
  const renderShape = () => {
    switch(foodCategory) {
      case 'fruit':
        return <sphereGeometry args={[1, 32, 32]} />; // Round for fruits
      case 'vegetable':
        return <cylinderGeometry args={[0.7, 0.7, 1.5, 16]} />; // Cylindrical for vegetables
      case 'meat':
        return <boxGeometry args={[1.2, 0.8, 0.4]} />; // Flat rectangle for meats
      case 'dairy':
        return <cylinderGeometry args={[0.7, 0.7, 0.5, 16]} />; // Short cylinder for dairy
      case 'grain':
        return <icosahedronGeometry args={[1, 1]} />; // Complex shape for grains
      case 'seafood':
        return <torusGeometry args={[0.7, 0.3, 16, 32]} />; // Ring for seafood
      case 'pasta':
        return <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />; // Complex curve for pasta
      case 'spice':
        return <dodecahedronGeometry args={[0.8, 0]} />; // Twelve-sided for spices
      default:
        return <boxGeometry args={[1, 1, 1]} />; // Default cube
    }
  };
  
  return (
    <mesh ref={mesh} scale={scale * 0.5}>
      {renderShape()}
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
};

// Always use fallback shapes instead of trying to load missing models
const FoodModel = ({ 
  foodCategory, 
  autoRotate = true, 
  rotationSpeed = 0.005, 
  scale = 2.5,
  position = [0, 0, 0]
}) => {
  const group = useRef();
  
  // Handle rotation animation if needed for container group
  useFrame((state, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += rotationSpeed * 0.5;
    }
  });
  
  return (
    <group ref={group} position={position}>
      <FallbackShape 
        foodCategory={foodCategory} 
        scale={scale} 
        autoRotate={false} // We'll handle rotation at group level
        rotationSpeed={rotationSpeed}
      />
    </group>
  );
};

// Main 3D scene component
const Food3DScene = ({ 
  foodCategory, 
  autoRotate,
  rotationSpeed,
  enableZoom,
  enablePan,
  modelScale
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
    >
      {/* Environment and lighting */}
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[0, -5, 0]} intensity={0.3} />
      
      {/* The 3D model with error handling */}
      <FoodModel 
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
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={enableZoom}
        enablePan={enablePan}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};

// Client-side only component
const Food3DModelClient = ({ 
  foodCategory, 
  autoRotate = true,
  rotationSpeed = 0.005,
  enableZoom = false,
  enablePan = false,
  modelScale = 2.5
}) => {
  return (
    <Suspense fallback={null}>
      <Food3DScene
        foodCategory={foodCategory}
        autoRotate={autoRotate}
        rotationSpeed={rotationSpeed}
        enableZoom={enableZoom}
        enablePan={enablePan}
        modelScale={modelScale}
      />
    </Suspense>
  );
};

export default Food3DModelClient; 