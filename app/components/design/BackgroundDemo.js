'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  CardContent,
  Button
} from '@mui/material';
import FoodPatternBackground from './FoodPatternBackground';
import FoodGradientBackground from './FoodGradientBackground';

/**
 * Demo component that shows both lightweight background options with controls
 */
const BackgroundDemo = () => {
  // State for controlling which background is active
  const [activeBackground, setActiveBackground] = useState('pattern');
  
  // Pattern background settings
  const [patternCategory, setPatternCategory] = useState('fruit');
  const [patternDensity, setPatternDensity] = useState(20);
  const [patternOpacity, setPatternOpacity] = useState(0.4);
  
  // Gradient background settings
  const [gradientTheme, setGradientTheme] = useState('fruits');
  const [gradientAnimated, setGradientAnimated] = useState(true);
  const [gradientOpacity, setGradientOpacity] = useState(0.7);

  // Food categories for pattern background
  const foodCategories = ['fruit', 'vegetable', 'grain', 'meat', 'dairy'];
  
  // Gradient themes
  const gradientThemes = ['fruits', 'vegetables', 'mixed', 'pastel', 'warm'];

  return (
    <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
      {/* Render active background */}
      {activeBackground === 'pattern' && (
        <FoodPatternBackground 
          category={patternCategory} 
          density={patternDensity} 
          opacity={patternOpacity} 
        />
      )}
      
      {activeBackground === 'gradient' && (
        <FoodGradientBackground 
          theme={gradientTheme} 
          animated={gradientAnimated} 
          opacity={gradientOpacity} 
        />
      )}

      {/* Main content */}
      <Card sx={{ 
        mb: 4, 
        backdropFilter: 'blur(5px)', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 3
      }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Food-Themed Background Demo
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Lightweight alternatives to 3D models for better performance
          </Typography>

          <Box sx={{ mb: 4 }}>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">Background Type</FormLabel>
              <ToggleButtonGroup
                value={activeBackground}
                exclusive
                onChange={(e, newValue) => newValue && setActiveBackground(newValue)}
                fullWidth
              >
                <ToggleButton value="pattern">Pattern</ToggleButton>
                <ToggleButton value="gradient">Gradient</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Box>

          {/* Pattern settings */}
          {activeBackground === 'pattern' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Pattern Settings</Typography>
              
              <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                <FormLabel component="legend">Food Category</FormLabel>
                <RadioGroup 
                  row
                  value={patternCategory}
                  onChange={(e) => setPatternCategory(e.target.value)}
                >
                  {foodCategories.map((category) => (
                    <FormControlLabel 
                      key={category} 
                      value={category} 
                      control={<Radio />} 
                      label={category.charAt(0).toUpperCase() + category.slice(1)} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Density: {patternDensity}</Typography>
                <Slider
                  value={patternDensity}
                  onChange={(e, newValue) => setPatternDensity(newValue)}
                  min={5}
                  max={50}
                  step={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Opacity: {patternOpacity}</Typography>
                <Slider
                  value={patternOpacity}
                  onChange={(e, newValue) => setPatternOpacity(newValue)}
                  min={0.1}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </Box>
          )}

          {/* Gradient settings */}
          {activeBackground === 'gradient' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Gradient Settings</Typography>
              
              <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                <FormLabel component="legend">Theme</FormLabel>
                <RadioGroup 
                  row
                  value={gradientTheme}
                  onChange={(e) => setGradientTheme(e.target.value)}
                >
                  {gradientThemes.map((theme) => (
                    <FormControlLabel 
                      key={theme} 
                      value={theme} 
                      control={<Radio />} 
                      label={theme.charAt(0).toUpperCase() + theme.slice(1)} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={gradientAnimated}
                      onChange={() => setGradientAnimated(true)}
                    />
                  }
                  label="Animated"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={!gradientAnimated}
                      onChange={() => setGradientAnimated(false)}
                    />
                  }
                  label="Static"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Opacity: {gradientOpacity}</Typography>
                <Slider
                  value={gradientOpacity}
                  onChange={(e, newValue) => setGradientOpacity(newValue)}
                  min={0.1}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ 
        backdropFilter: 'blur(5px)', 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: 3
      }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Performance Benefits
          </Typography>
          <Typography variant="body1" paragraph>
            • Reduced bundle size compared to 3D models (no three.js dependency)
          </Typography>
          <Typography variant="body1" paragraph>
            • Lower CPU/GPU usage (especially on mobile devices)
          </Typography>
          <Typography variant="body1" paragraph>
            • No waiting for 3D assets to download
          </Typography>
          <Typography variant="body1" paragraph>
            • Smoother animations and interactions
          </Typography>
          <Typography variant="body1" paragraph>
            • Better accessibility with reduced motion options
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BackgroundDemo; 