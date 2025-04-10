'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Chip, 
  Tooltip,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Tilt from 'react-parallax-tilt';
import FoodModelWrapper from './FoodModelWrapper';

// Category icons mapping (same as in the original PantryItemCard)
const categoryIcons = {
  Fruit: '🍎',
  Vegetable: '🥦',
  Dairy: '🥛',
  Meat: '🥩',
  Grain: '🌾',
  Snack: '🍪',
  Flour: '🍞',
  Seeds: '🌱',
  Spices: '🌶️',
  Beverages: '🥤',
  'Canned Goods': '🥫',
  Condiments: '🧂',
  Frozen: '❄️',
  'Baking Supplies': '🧁',
  Nuts: '🥜',
  Oils: '🫒',
  Pasta: '🍝',
  Rice: '🍚',
  Sauces: '🍯',
  Seafood: '🐟',
  Unknown: '❓'
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  overflow: 'visible',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  right: 20,
  width: 50,
  height: 50,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  fontSize: '1.7rem',
  zIndex: 1,
  transform: 'rotate(10deg)',
}));

const GlowingProgress = styled(LinearProgress)(({ theme, progresscolor }) => ({
  height: 10,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    background: `linear-gradient(to right, ${progresscolor}, ${progresscolor}cc)`,
    boxShadow: `0 0 10px ${progresscolor}aa`,
  },
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
}));

// Helper function to convert category names to lowercase and simplify them for 3D model mapping
const getLowerCaseCategory = (category) => {
  // Map pantry item categories to 3D model categories
  const categoryMap = {
    'Fruit': 'fruit',
    'Vegetable': 'vegetable',
    'Vegetables': 'vegetable',
    'Meat': 'meat',
    'Poultry': 'meat',
    'Dairy': 'dairy',
    'Grain': 'grain',
    'Grains': 'grain',
    'Bread': 'grain',
    'Seafood': 'seafood',
    'Fish': 'seafood',
    'Spices': 'spice',
    'Spice': 'spice',
    'Herbs': 'spice',
    'Pasta': 'pasta',
    'Noodles': 'pasta',
    // Add more mappings as needed
  };

  // If there's a direct mapping, use it
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Otherwise, try to find a partial match
  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Default to fruit if no match is found
  return 'default';
};

const PantryItemCard3D = ({ 
  item, 
  onDelete, 
  onEdit,
  onAddToShoppingList,
  onFindRecipes,
  onUseItem,
  delay = 0
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Mock expiry progress (in a real app, this would be calculated based on item expiry date)
  const expiryProgress = Math.random() * 100;
  const isNew = Math.random() > 0.8; // Just for demo purposes
  
  // Determine progress color
  let progressColor = '#4caf50'; // success
  if (expiryProgress > 70) progressColor = '#f44336'; // error
  else if (expiryProgress > 40) progressColor = '#ff9800'; // warning

  const categoryIcon = categoryIcons[item.category] || categoryIcons.Unknown;

  // GSAP animation for the glowing effect when hovered
  React.useEffect(() => {
    if (cardRef.current && isHovered) {
      gsap.to(cardRef.current, {
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(76, 175, 80, 0.3)`,
        duration: 0.5
      });
    } else if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        duration: 0.5
      });
    }
  }, [isHovered]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        type: 'spring',
        stiffness: 100 
      }}
      style={{ height: '100%' }}
      whileHover={{ scale: isExpanded ? 1 : 1.02 }}
    >
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        scale={1}
        transitionSpeed={1000}
        gyroscope={true}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="white"
        glarePosition="all"
      >
        <StyledCard 
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <motion.div
            animate={{ 
              rotate: isHovered ? [0, 5, 0] : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <CategoryBadge>
              <span role="img" aria-label={item.category}>
                {categoryIcon}
              </span>
            </CategoryBadge>
          </motion.div>
          
          {/* 3D Model Viewer */}
          <Box sx={{ 
            height: 150, 
            width: '100%', 
            position: 'relative', 
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          }}>
            <FoodModelWrapper 
              foodCategory={getLowerCaseCategory(item.category)}
              height={150}
              width="100%"
              autoRotate={true}
              showToggle={false}
              preferLottie={false}
            />
          </Box>
          
          {isNew && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Chip
                icon={<NewReleasesIcon />}
                label="New"
                size="small"
                color="secondary"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              />
            </motion.div>
          )}
          
          <CardContent sx={{ flexGrow: 1, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(45deg, #388e3c, #4caf50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {item.name}
                </Typography>
              </motion.div>
              <IconButton
                aria-label="options"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e);
                }}
                sx={{ 
                  mt: -1, 
                  mr: -1,
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Quantity
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight="medium"
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '4px',
                  px: 1,
                  py: 0.5,
                }}
              >
                {item.quantity} {item.unit}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category
              </Typography>
              <Chip 
                label={item.category} 
                size="small"
                sx={{ 
                  fontWeight: 500,
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: 'primary.main',
                  boxShadow: isHovered ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none',
                  transition: 'box-shadow 0.3s ease',
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
                Freshness Indicator
              </Typography>
              <GlowingProgress 
                variant="determinate" 
                value={100 - expiryProgress} 
                progresscolor={progressColor}
                sx={{ 
                  height: 10, 
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'right', 
                  mt: 0.5,
                  color: expiryProgress > 70 ? 'error.main' : 'text.secondary',
                  fontWeight: expiryProgress > 70 ? 'bold' : 'normal',
                  animation: expiryProgress > 70 ? 'pulse 2s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 },
                  }
                }}
              >
                {expiryProgress > 70 ? 'Use soon!' : expiryProgress > 40 ? 'Fresh' : 'Very fresh'}
              </Typography>
            </Box>
          </CardContent>
          
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              p: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
            }}
          >
            <Tooltip title="Edit item">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }} 
                  color="primary"
                  sx={{ boxShadow: isHovered ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none' }}
                >
                  <EditIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
            
            <Tooltip title="Find recipes">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFindRecipes();
                  }} 
                  color="primary"
                  sx={{ boxShadow: isHovered ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none' }}
                >
                  <MenuBookIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
            
            <Tooltip title="Add to shopping list">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToShoppingList();
                  }} 
                  color="primary"
                  sx={{ boxShadow: isHovered ? '0 0 10px rgba(76, 175, 80, 0.3)' : 'none' }}
                >
                  <AddShoppingCartIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
            
            <Tooltip title="Delete item">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }} 
                  color="error"
                  sx={{ boxShadow: isHovered ? '0 0 10px rgba(244, 67, 54, 0.3)' : 'none' }}
                >
                  <DeleteIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>
        </StyledCard>
      </Tilt>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(5px)',
          }
        }}
      >
        <MenuItem onClick={() => { handleClose(); onEdit(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit Item
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onFindRecipes(); }}>
          <ListItemIcon>
            <MenuBookIcon fontSize="small" />
          </ListItemIcon>
          Find Recipes
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onUseItem(); }}>
          <ListItemIcon>
            <RestaurantIcon fontSize="small" />
          </ListItemIcon>
          Use Item
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onAddToShoppingList(); }}>
          <ListItemIcon>
            <AddShoppingCartIcon fontSize="small" />
          </ListItemIcon>
          Add to Shopping List
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); onDelete(); }} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete Item
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default PantryItemCard3D; 