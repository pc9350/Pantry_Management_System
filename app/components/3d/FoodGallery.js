'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  IconButton, 
  useMediaQuery,
  Chip,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FoodModelWrapper from './FoodModelWrapper';

// Sample food items data (would be fetched from API in a real app)
const SAMPLE_FOOD_ITEMS = [
  {
    id: 1,
    name: 'Apple',
    category: 'fruit',
    nutrition: {
      calories: 95,
      protein: '0.5g',
      carbs: '25g',
      fat: '0.3g',
      fiber: '4g',
      vitamins: ['Vitamin C', 'Vitamin K']
    }
  },
  {
    id: 2,
    name: 'Broccoli',
    category: 'vegetable',
    nutrition: {
      calories: 55,
      protein: '3.7g',
      carbs: '11g',
      fat: '0.6g',
      fiber: '5g',
      vitamins: ['Vitamin C', 'Vitamin K', 'Folate']
    }
  },
  {
    id: 3,
    name: 'Chicken Breast',
    category: 'meat',
    nutrition: {
      calories: 165,
      protein: '31g',
      carbs: '0g',
      fat: '3.6g',
      fiber: '0g',
      vitamins: ['Vitamin B6', 'Niacin']
    }
  },
  {
    id: 4,
    name: 'Cheddar Cheese',
    category: 'dairy',
    nutrition: {
      calories: 113,
      protein: '7g',
      carbs: '0.4g',
      fat: '9g',
      fiber: '0g',
      vitamins: ['Vitamin A', 'Calcium', 'Vitamin B12']
    }
  },
  {
    id: 5,
    name: 'Whole Grain Bread',
    category: 'grain',
    nutrition: {
      calories: 81,
      protein: '4g',
      carbs: '15g',
      fat: '1.1g',
      fiber: '2g',
      vitamins: ['B Vitamins', 'Iron', 'Selenium']
    }
  },
  {
    id: 6,
    name: 'Salmon Fillet',
    category: 'seafood',
    nutrition: {
      calories: 208,
      protein: '20g',
      carbs: '0g',
      fat: '13g',
      fiber: '0g',
      vitamins: ['Vitamin D', 'B Vitamins', 'Omega-3']
    }
  },
  {
    id: 7,
    name: 'Cinnamon',
    category: 'spice',
    nutrition: {
      calories: 6,
      protein: '0.1g',
      carbs: '2g',
      fat: '0.1g',
      fiber: '1.4g',
      vitamins: ['Manganese', 'Calcium']
    }
  },
  {
    id: 8,
    name: 'Pasta',
    category: 'pasta',
    nutrition: {
      calories: 158,
      protein: '5.8g',
      carbs: '31g',
      fat: '0.9g',
      fiber: '1.8g',
      vitamins: ['B Vitamins', 'Iron', 'Folate']
    }
  }
];

// Individual food card component
const FoodCard = ({ food, onClick, isSelected }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Toggle nutrition info overlay
  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: isSelected ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={isSelected ? 8 : 3}
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          cursor: 'pointer',
          border: isSelected ? '2px solid #4caf50' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Food Visualization - Using FoodModelWrapper instead of Food3DModel */}
        <Box sx={{ height: 200, overflow: 'hidden' }}>
          <FoodModelWrapper 
            foodCategory={food.category} 
            height={200}
            autoRotate={true}
            showToggle={true}
            preferLottie={false}
          />
        </Box>
        
        {/* Food Name */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {food.name}
          </Typography>
          <Chip 
            label={food.category.charAt(0).toUpperCase() + food.category.slice(1)} 
            size="small" 
            color="primary"
            variant="outlined"
          />
          
          {/* Info button */}
          <IconButton
            size="small"
            onClick={handleInfoClick}
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.7)' }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Nutrition Information Overlay */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.95)',
              zIndex: 10,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" component="h4">Nutrition Facts</Typography>
              <IconButton size="small" onClick={handleInfoClick}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 1 }} />
            
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Calories:</strong> {food.nutrition.calories}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Protein:</strong> {food.nutrition.protein}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Carbs:</strong> {food.nutrition.carbs}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Fat:</strong> {food.nutrition.fat}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Fiber:</strong> {food.nutrition.fiber}
            </Typography>
            
            <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
              <strong>Vitamins & Minerals:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {food.nutrition.vitamins.map((vitamin, index) => (
                <Chip key={index} label={vitamin} size="small" variant="outlined" />
              ))}
            </Box>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

// Main FoodGallery component
const FoodGallery = ({ title = "Discover Food in 3D" }) => {
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [visibleFoodItems, setVisibleFoodItems] = useState([]);
  const theme = useTheme();
  
  // Responsive design
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Determine cards per row based on screen size
  const getGridSize = () => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    return 4; // default for larger screens
  };
  
  // Initial loading of items
  useEffect(() => {
    setVisibleFoodItems(SAMPLE_FOOD_ITEMS);
  }, []);
  
  // Handle food item selection
  const handleFoodSelect = (foodId) => {
    setSelectedFoodId(foodId === selectedFoodId ? null : foodId);
  };

  return (
    <Box sx={{ py: 4, px: 2 }}>
      {/* Gallery Title */}
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          mb: 4
        }}
      >
        {title}
      </Typography>
      
      {/* Food Cards Grid */}
      <Grid container spacing={3}>
        {visibleFoodItems.map((food) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={food.id}>
            <FoodCard 
              food={food} 
              onClick={() => handleFoodSelect(food.id)} 
              isSelected={food.id === selectedFoodId}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            color="primary" 
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'primary.light', color: 'white' } 
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton 
            color="primary" 
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'primary.light', color: 'white' } 
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
};

export default FoodGallery; 