'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  Tab,
  Tabs,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
// import AnimatedHero from '../components/3d/AnimatedHero';
import ParticleBackground from '../components/3d/ParticleBackground';
import Food3DModel from '../components/3d/Food3DModel';
import PantryItemCard3D from '../components/3d/PantryItemCard3D';
import { motion } from 'framer-motion';

// Simple hero replacement to avoid framer-motion-3d dependency
const SimpleHero = () => {
  return (
    <Box 
      sx={{ 
        height: '100%',
        width: '100%', 
        background: 'linear-gradient(135deg, #1a4731 0%, #051b11 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating 3D models */}
      <Box sx={{ position: 'absolute', top: '30%', left: '10%' }}>
        <Food3DModel foodCategory="fruit" height={150} width={150} />
      </Box>
      <Box sx={{ position: 'absolute', top: '20%', right: '15%' }}>
        <Food3DModel foodCategory="vegetable" height={150} width={150} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '35%', left: '25%' }}>
        <Food3DModel foodCategory="meat" height={150} width={150} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '25%', right: '25%' }}>
        <Food3DModel foodCategory="dairy" height={150} width={150} />
      </Box>
      
      {/* Text overlay */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          zIndex: 10,
          width: '100%',
          px: 3
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            sx={{ 
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '4rem' }
            }}
          >
            PantryPal 3D
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography 
            variant="h5"
            sx={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.5rem' }
            }}
          >
            Explore your pantry in stunning interactive 3D
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

const Showcase3D = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [demoItems, setDemoItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulated mock data
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: 'Apples',
        category: 'Fruit',
        quantity: 5,
        unit: 'pcs',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        name: 'Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'gallon',
        expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        name: 'Broccoli',
        category: 'Vegetable',
        quantity: 2,
        unit: 'pcs',
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 4,
        name: 'Chicken Breast',
        category: 'Meat',
        quantity: 1,
        unit: 'lb',
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 5,
        name: 'Rice',
        category: 'Grain',
        quantity: 2,
        unit: 'kg',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        id: 6,
        name: 'Pasta',
        category: 'Pasta',
        quantity: 3,
        unit: 'boxes',
        expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
      },
    ];
    
    setDemoItems(mockItems);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDemoAction = () => {
    console.log('Demo action triggered');
    // This would trigger some action in a real app
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      overflow: 'hidden',
      pb: 10
    }}>
      {/* Background particles */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0.6
      }}>
        <ParticleBackground />
      </Box>
      
      {/* Hero section */}
      <Box sx={{ 
        height: isMobile ? '60vh' : '80vh', 
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SimpleHero />
        
        <Box sx={{ 
          position: 'absolute',
          bottom: theme.spacing(4),
          width: '100%',
          textAlign: 'center'
        }}>
          <Fade in={isLoaded} timeout={1000}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              sx={{ 
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: '0 8px 30px rgba(0, 100, 0, 0.2)',
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1b5e20, #388e3c)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 40px rgba(0, 100, 0, 0.3)',
                },
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              onClick={() => document.getElementById('showcase-content').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore 3D Features
            </Button>
          </Fade>
        </Box>
      </Box>
      
      {/* Showcase content */}
      <Container id="showcase-content" maxWidth="lg" sx={{ pt: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 6,
            textAlign: 'center',
          }}
        >
          PantryPal 3D Showcase
        </Typography>
        
        <Paper 
          elevation={24}
          sx={{ 
            p: 3, 
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
            sx={{ 
              mb: 4,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3,
              },
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateY(-2px)',
                }
              }
            }}
          >
            <Tab label="3D Food Models" />
            <Tab label="3D Pantry Cards" />
            <Tab label="Interactive Background" />
          </Tabs>
          
          <Divider sx={{ mb: 4 }} />
          
          {/* 3D Food Models */}
          {activeTab === 0 && (
            <Fade in={activeTab === 0} timeout={800}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                  Interactive 3D Food Models
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Our 3D food models bring your pantry items to life. Each food category has its own unique model with realistic proportions and textures. The models are procedurally generated and interactive - try clicking on them!
                </Typography>
                
                <Grid container spacing={4}>
                  {['Fruit', 'Vegetable', 'Dairy', 'Meat', 'Grain', 'Pasta'].map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category}>
                      <Slide direction="up" in={isLoaded} timeout={500 + Math.random() * 500}>
                        <Paper 
                          elevation={8}
                          sx={{ 
                            p: 2, 
                            height: 250, 
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(5px)',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                            },
                            transition: 'transform 0.3s, box-shadow 0.3s',
                          }}
                        >
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            {category}
                          </Typography>
                          <Box sx={{ height: 180, width: '100%', mt: 2 }}>
                            <Food3DModel category={category} autoRotate={true} />
                          </Box>
                        </Paper>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
          
          {/* 3D Pantry Cards */}
          {activeTab === 1 && (
            <Fade in={activeTab === 1} timeout={800}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                  3D Enhanced Pantry Cards
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  Our 3D pantry cards elevate how you view and interact with your pantry inventory. Each card features depth effects, responsive animations, and integrated 3D models. Hover or tap to see them in action!
                </Typography>
                
                <Grid container spacing={4}>
                  {demoItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Slide direction="up" in={isLoaded} timeout={300 * (index + 1)}>
                        <Box>
                          <PantryItemCard3D
                            item={item}
                            onDelete={() => console.log(`Delete ${item.name}`)}
                            onEdit={() => console.log(`Edit ${item.name}`)}
                            onAddToShoppingList={() => console.log(`Add ${item.name} to shopping list`)}
                            onFindRecipes={() => console.log(`Find recipes for ${item.name}`)}
                            onUseItem={() => console.log(`Use ${item.name}`)}
                            delay={index}
                          />
                        </Box>
                      </Slide>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
          
          {/* Interactive Background */}
          {activeTab === 2 && (
            <Fade in={activeTab === 2} timeout={800}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                  Interactive Particle Background
                </Typography>
                <Typography variant="body1" paragraph>
                  Our interactive particle background creates an immersive food-themed environment throughout the app. The particles respond to your mouse movements and simulate a dynamic food ecosystem.
                </Typography>
                
                <Box sx={{ 
                  height: 400, 
                  position: 'relative', 
                  borderRadius: 4,
                  overflow: 'hidden',
                  mb: 4,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}>
                  <ParticleBackground particleCount={isMobile ? 100 : 200} />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: 2,
                    p: 3,
                    maxWidth: 400,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Move Your Cursor!
                    </Typography>
                    <Typography variant="body2">
                      The particles will respond to your cursor movements, creating a dynamic food-themed environment.
                    </Typography>
                  </Box>
                </Box>
                
                <Box textAlign="center" mt={6}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleDemoAction}
                    sx={{ 
                      borderRadius: 30,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      boxShadow: '0 8px 30px rgba(0, 100, 0, 0.2)',
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1b5e20, #388e3c)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 40px rgba(0, 100, 0, 0.3)',
                      },
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                  >
                    Experience in Full Screen
                  </Button>
                </Box>
              </Box>
            </Fade>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Showcase3D; 