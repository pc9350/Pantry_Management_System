'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

// Create a food model based on a simple shape
const FoodItem = ({ position, scale, color, rotationSpeed, pulsateIntensity, geometry }) => {
  const ref = useRef();
  const [randomRotation] = useState(() => [
    Math.random() * Math.PI, 
    Math.random() * Math.PI, 
    Math.random() * Math.PI
  ]);
  
  useEffect(() => {
    if (ref.current && pulsateIntensity > 0) {
      const baseScale = scale || 1;
      gsap.to(ref.current.scale, {
        x: baseScale * (1 + pulsateIntensity * 0.2),
        y: baseScale * (1 + pulsateIntensity * 0.2),
        z: baseScale * (1 + pulsateIntensity * 0.2),
        duration: 1 + Math.random() * 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [pulsateIntensity, scale]);
  
  useFrame((state, delta) => {
    if (ref.current && rotationSpeed) {
      ref.current.rotation.x += delta * rotationSpeed * 0.5;
      ref.current.rotation.y += delta * rotationSpeed;
      ref.current.rotation.z += delta * rotationSpeed * 0.2;
    }
  });
  
  // Select geometry type based on input or default to sphere
  let geometryObj;
  if (geometry === 'sphere') {
    geometryObj = new THREE.SphereGeometry(1, 32, 16);
  } else if (geometry === 'cube') {
    geometryObj = new THREE.BoxGeometry(1, 1, 1);
  } else if (geometry === 'cone') {
    geometryObj = new THREE.ConeGeometry(0.8, 1.5, 32);
  } else if (geometry === 'torus') {
    geometryObj = new THREE.TorusGeometry(0.7, 0.3, 16, 32);
  } else if (geometry === 'icosahedron') {
    geometryObj = new THREE.IcosahedronGeometry(1, 0);
  } else {
    geometryObj = new THREE.SphereGeometry(1, 32, 16);
  }

  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      position={position}
    >
      <mesh 
        ref={ref} 
        rotation={randomRotation}
        scale={scale || 1}
        castShadow
        receiveShadow
      >
        <primitive object={geometryObj} attach="geometry" />
        <meshStandardMaterial 
          color={color} 
          roughness={0.2} 
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      <Sparkles 
        count={15} 
        scale={3} 
        size={0.2} 
        speed={0.3} 
        color={color}
        opacity={0.5}
      />
    </Float>
  );
};

// Animated text with 3D effects
const AnimatedTitle = ({ text = "PantryPal", position = [0, 0, 0] }) => {
  const ref = useRef();
  const { viewport } = useThree();
  const isMobile = viewport.width < 4; // Responsive adjustment

  useEffect(() => {
    if (ref.current) {
      // Staggered animation for each character
      const chars = ref.current.children;
      gsap.fromTo(
        chars,
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          delay: 0.5
        }
      );
    }
  }, []);

  return (
    <group position={position} ref={ref}>
      {Array.from(text).map((char, i) => (
        <Text
          key={i}
          position={[i * (isMobile ? 0.8 : 1.2) - text.length * (isMobile ? 0.4 : 0.6), 0, 0]}
          fontSize={isMobile ? 0.8 : 1.2}
          color="#ffffff"
          font="/fonts/inter-bold.woff"
          anchorX="center"
          anchorY="middle"
          depthWrite={false}
        >
          {char}
          <meshStandardMaterial 
            color="#4caf50" 
            emissive="#4caf50" 
            emissiveIntensity={1} 
            toneMapped={false} 
          />
        </Text>
      ))}
    </group>
  );
};

// Main 3D scene component
const FoodScene = () => {
  // Create an array of food items with different properties
  const foodItems = [
    { position: [-4, 2, -5], scale: 1.5, color: "#ff6b6b", rotationSpeed: 0.3, pulsateIntensity: 0.7, geometry: 'sphere' },  // Apple/Fruit
    { position: [4, -1, -3], scale: 1.2, color: "#51cf66", rotationSpeed: 0.2, pulsateIntensity: 0.5, geometry: 'cone' },    // Broccoli/Vegetable
    { position: [-3, -2, -2], scale: 1.3, color: "#f8f9fa", rotationSpeed: 0.15, pulsateIntensity: 0.3, geometry: 'cube' },  // Milk/Dairy
    { position: [2.5, 3, -4], scale: 1.1, color: "#fcc419", rotationSpeed: 0.25, pulsateIntensity: 0.6, geometry: 'torus' }, // Bread/Grain
    { position: [0, -3, -5], scale: 1.4, color: "#e64980", rotationSpeed: 0.3, pulsateIntensity: 0.4, geometry: 'cube' },    // Meat
    { position: [-5, 0, -3], scale: 1, color: "#ff922b", rotationSpeed: 0.35, pulsateIntensity: 0.5, geometry: 'icosahedron' }, // Snack
    { position: [5, 1, -6], scale: 1.2, color: "#74c0fc", rotationSpeed: 0.2, pulsateIntensity: 0.8, geometry: 'sphere' },   // Extra item
  ];

  return (
    <>
      {/* Floating 3D text */}
      <AnimatedTitle position={[0, 1, 0]} />
      
      {/* Subtitle */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.5}
        color="#ffffff"
        font="/fonts/inter-medium.woff"
        anchorX="center"
        anchorY="middle"
        depthWrite={false}
        opacity={0.8}
      >
        Manage your pantry in 3D
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.5} 
          toneMapped={false} 
        />
      </Text>
      
      {/* Generate food items */}
      {foodItems.map((item, index) => (
        <FoodItem key={index} {...item} />
      ))}
    </>
  );
};

// Main component with Canvas
const AnimatedHeroClient = ({ height = "70vh" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ 
        height, 
        width: '100%', 
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0 0 30px 30px',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ background: 'radial-gradient(circle at center, #1a4731 0%, #051b11 100%)' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#051b11']} />
        
        <fog attach="fog" args={['#051b11', 5, 30]} />
        
        <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 10, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, 0, -10]} intensity={0.5} color="#4caf50" />
        <pointLight position={[10, 0, -10]} intensity={0.5} color="#ff9800" />
        
        <FoodScene />
        
        <EffectComposer>
          <Bloom
            intensity={1}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            blendFunction={BlendFunction.SCREEN}
          />
          <ChromaticAberration
            offset={[0.0005, 0.0005]}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Overlay gradient at the bottom for smooth transition */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(to top, #f5f5f5, transparent)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </motion.div>
  );
};

export default AnimatedHeroClient; 