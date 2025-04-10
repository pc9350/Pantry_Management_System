'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

// Simple particles implementation without instancing
const SimpleParticles = ({ count = 100, colors }) => {
  // Generate random particles data
  const particles = useMemo(() => {
    const colorOptions = colors || ['#4caf50', '#ff9800', '#ff6b6b', '#f8f9fa', '#fcc419'];
    
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ],
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      scale: Math.random() * 0.4 + 0.1,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: Math.random() * 0.02 + 0.01
    }));
  }, [count, colors]);
  
  return (
    <group>
      {particles.map((particle, i) => (
        <Particle 
          key={i} 
          position={particle.position} 
          color={particle.color} 
          scale={particle.scale} 
          rotation={particle.rotation}
          speed={particle.speed}
        />
      ))}
    </group>
  );
};

// Individual particle with animation
const Particle = ({ position, color, scale, rotation, speed }) => {
  const meshRef = useRef();
  
  // Simple animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.5;
      meshRef.current.rotation.y += speed;
      
      // Subtle position animation
      const t = state.clock.elapsedTime;
      meshRef.current.position.y += Math.sin(t * speed * 10) * 0.01;
      meshRef.current.position.x += Math.cos(t * speed * 8) * 0.01;
    }
  });
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={rotation}
    >
      <sphereGeometry args={[scale, 16, 16]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        metalness={0.8}
      />
    </mesh>
  );
};

// Canvas component with three.js scene
const ParticleCanvas = ({ particleCount, particleColors }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <SimpleParticles count={particleCount} colors={particleColors} />
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0} 
          luminanceSmoothing={0.9} 
          height={300}
          intensity={0.5}
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </Canvas>
  );
};

// Main component for client-side rendering
const ParticleBackgroundClient = ({ 
  particleCount = 80,
  particleColors = ['#ff6b6b', '#4caf50', '#2196f3', '#f48fb1', '#ffeb3b'],
  height = '100%',
  width = '100%',
  opacity = 0.2
}) => {
  return (
    <Box 
      sx={{ 
        height, 
        width, 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: -1,
        opacity
      }}
    >
      <ParticleCanvas 
        particleCount={particleCount}
        particleColors={particleColors}
      />
    </Box>
  );
};

export default ParticleBackgroundClient; 