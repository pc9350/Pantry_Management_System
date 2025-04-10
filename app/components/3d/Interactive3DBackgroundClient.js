'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Box } from '@mui/material';
import * as THREE from 'three';

// Particle component for creating individual particles
const Particle = ({ position, color, size, speed }) => {
  const meshRef = useRef();
  const initialPosition = useMemo(() => [...position], [position]);
  
  // Animation loop for particles
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Make particles float up slowly with slight horizontal movement
      meshRef.current.position.y += speed * delta;
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime * speed) * 0.01;
      meshRef.current.position.z += Math.cos(state.clock.elapsedTime * speed) * 0.01;
      
      // Reset position when particle moves too far up
      if (meshRef.current.position.y > 15) {
        meshRef.current.position.set(
          initialPosition[0] + (Math.random() * 2 - 1),
          initialPosition[1] - 20,
          initialPosition[2] + (Math.random() * 2 - 1)
        );
      }
      
      // Rotate particles slowly
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
};

// Main particles system component
const ParticleSystem = ({ count = 100, colors = ['#ff5c5c', '#4caf50', '#2196f3', '#ffeb3b'] }) => {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20, 
        (Math.random() - 0.5) * 20, 
        (Math.random() - 0.5) * 10
      ],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 0.3 + 0.1
    }));
  }, [count, colors]);

  return (
    <group>
      {particles.map((particle) => (
        <Particle 
          key={particle.id}
          position={particle.position}
          color={particle.color}
          size={particle.size}
          speed={particle.speed}
        />
      ))}
    </group>
  );
};

// Camera control with mouse movement
const CameraController = ({ sensitivity = 0.05 }) => {
  const cameraRef = useRef();
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cameraRef.current) {
        // Calculate normalized mouse position
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Apply subtle camera rotation based on mouse position
        cameraRef.current.rotation.y = x * sensitivity;
        cameraRef.current.rotation.x = y * sensitivity;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sensitivity]);
  
  useFrame(({ camera }) => {
    if (cameraRef.current) {
      // Smooth camera movement
      camera.position.lerp(new THREE.Vector3(0, 0, 10), 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  
  return <group ref={cameraRef} />;
};

// Main component
const Interactive3DBackgroundClient = ({ 
  particleCount = 80,
  particleColors = ['#ff6b6b', '#4caf50', '#2196f3', '#f48fb1', '#ffeb3b'],
  height = '100%',
  width = '100%',
  sensitivity = 0.05
}) => {
  return (
    <Box 
      sx={{ 
        height, 
        width, 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080010']} />
        <fog attach="fog" args={['#080010', 10, 30]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <ParticleSystem 
          count={particleCount} 
          colors={particleColors} 
        />
        
        <CameraController sensitivity={sensitivity} />
        
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.8}
          />
        </EffectComposer>
      </Canvas>
    </Box>
  );
};

export default Interactive3DBackgroundClient; 