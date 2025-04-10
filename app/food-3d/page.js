'use client';

import React from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import FoodGallery from '../components/3d/FoodGallery';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Food3DPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box 
          sx={{ 
            py: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF9A8B 0%, #FF6B95 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              PantryPal 3D Food Explorer
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 800, mb: 4 }}
            >
              Explore common pantry items in stunning 3D. Learn about their nutritional value and visualize portion sizes to make healthier meal choices.
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              component={Link}
              href="/"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mb: 4 }}
            >
              Back to Home
            </Button>
          </motion.div>
        </Box>
        
        {/* Main Gallery Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Paper 
            elevation={3}
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              mb: 6,
              backgroundColor: 'background.paper'
            }}
          >
            <FoodGallery title="Explore Nutritious Foods in 3D" />
          </Paper>
        </motion.div>
        
        {/* Info Section */}
        <Box sx={{ py: 4, mb: 6 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
              Why Visualize Food in 3D?
            </Typography>
          </motion.div>
          
          <Grid 
            container
            spacing={4}
          >
            {[
              {
                title: "Better Understanding of Portions",
                content: "Visualizing food in 3D helps you better understand appropriate portion sizes, making it easier to maintain a balanced diet."
              },
              {
                title: "Nutritional Education",
                content: "Interactive 3D models combined with nutrition facts create a more engaging way to learn about the foods you eat every day."
              },
              {
                title: "Meal Planning Assistance",
                content: "Use these 3D visualizations to help plan balanced meals and understand the nutritional composition of different food combinations."
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8 + (index * 0.1) 
                  }}
                  whileHover={{ y: -10 }}
                >
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.content}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Paper
            elevation={4}
            sx={{ 
              p: 4, 
              mb: 8, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
              Ready to explore more features?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
              PantryPal offers many more tools to help you manage your kitchen, plan meals, and eat healthier. Check out our other features!
            </Typography>
            <Button 
              component={Link}
              href="/"
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.dark',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Explore PantryPal
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </motion.div>
  );
} 