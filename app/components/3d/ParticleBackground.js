'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';

// Particle component
const Particles = ({ count = 400, mouse }) => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  // Generate positions for instanced particles
  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    const foodColors = [
      '#4caf50', // Green (primary)
      '#ff9800', // Orange (secondary)
      '#ff6b6b', // Red (fruits)
      '#f8f9fa', // White (dairy)
      '#fcc419', // Yellow (grains)
      '#51cf66', // Light green (vegetables)
    ];

    for (let i = 0; i < count; i++) {
      const randomColor = foodColors[Math.floor(Math.random() * foodColors.length)];
      color.set(randomColor).convertSRGBToLinear();
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, [count]);

  // Update particles position on animation frame
  useFrame((state) => {
    if (mesh.current) {
      particles.forEach((particle, i) => {
        let { factor, speed, xFactor, yFactor, zFactor } = particle;
        
        // Time variables for smooth movement
        const t = factor + state.clock.elapsedTime * speed;
        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.max(1.5, Math.cos(t) * 5);
        
        // Mouse interaction
        if (mouse.current) {
          const x = (mouse.current[0] - 0.5) * 2;
          const y = (mouse.current[1] - 0.5) * 2;
          particle.mx += (x - particle.mx) * 0.01;
          particle.my += (y - particle.my) * 0.01;
        }
        
        // Set each dummy object's position and scale
        dummy.position.set(
          (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
          (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
          (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
        );
        dummy.scale.set(s * 0.15, s * 0.15, s * 0.15);
        dummy.updateMatrix();
        
        // Apply to instanced mesh
        mesh.current.setMatrixAt(i, dummy.matrix);
      });
      
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial 
        roughness={0.5} 
        metalness={0.8}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      >
        <instancedBufferAttribute 
          attach="attributes-color" 
          args={[colorArray, 3]} 
        />
      </meshStandardMaterial>
    </instancedMesh>
  );
};

// Main canvas component - client side only
const ParticleCanvas = ({ particleCount, particleColors, sensitivity, mouse }) => {
  return (
    <Canvas 
      dpr={[1, 2]} 
      camera={{ position: [0, 0, 15], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      <Particles count={particleCount} mouse={mouse} />
      
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0} 
          luminanceSmoothing={0.9} 
          height={300}
          intensity={0.5}
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
      
      <motion.group
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <group position={[0, 0, 0]} />
      </motion.group>
    </Canvas>
  );
};

// Loading placeholder 
const LoadingPlaceholder = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'transparent'
      }}
    />
  );
};

// Dynamically import the component with SSR disabled
const ParticleBackgroundClient = dynamic(
  () => import('./ParticleBackgroundClient'),
  {
    ssr: false,
    loading: LoadingPlaceholder
  }
);

// Main component wrapper that only renders on client
const ParticleBackground = (props) => {
  return <ParticleBackgroundClient {...props} />;
};

export default ParticleBackground; 