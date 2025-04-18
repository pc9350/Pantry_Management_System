// components/EditItemModal.js
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Typography,
  Chip,
  Grid,
  Divider,
  Tooltip,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import FoodLottieAnimation from "./components/lottie/FoodLottieAnimation";
import FoodPatternBackground from "./components/design/FoodPatternBackground";

// Try using a simple Box instead of FoodPatternBackground if imports are causing issues
const SimpleFoodPatternBackground = ({ category, density, opacity }) => {
  const bgColors = {
    fruit: 'rgba(255, 107, 107, 0.05)',
    vegetable: 'rgba(81, 207, 102, 0.05)',
    meat: 'rgba(230, 73, 128, 0.05)',
    dairy: 'rgba(248, 249, 250, 0.05)',
    grain: 'rgba(252, 196, 25, 0.05)',
    mixed: 'rgba(173, 181, 189, 0.05)',
  };
  
  const bgColor = bgColors[category] || bgColors.mixed;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity,
        bgcolor: bgColor,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    />
  );
};

// Simple animated icon fallback
const SimpleFoodAnimation = ({ foodCategory, height, width }) => {
  const foodEmojis = {
    fruit: '🍎',
    vegetable: '🥦',
    meat: '🥩',
    dairy: '🧀',
    grain: '🌾',
    spice: '🌶️',
    pasta: '🍝',
    seafood: '🦐',
    default: '🍽️'
  };
  
  const emoji = foodEmojis[foodCategory] || foodEmojis.default;
  
  return (
    <Box
      sx={{
        height,
        width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '3rem',
        animation: 'pulse 2s infinite ease-in-out',
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      }}
    >
      {emoji}
    </Box>
  );
};

// Icons for categories
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';

// Food category mapping for visuals
const categoryIcons = {
  "Fruit": { icon: '🍎', lottie: 'fruit', pattern: 'fruit', color: '#ff6b6b' },
  "Vegetable": { icon: '🥦', lottie: 'vegetable', pattern: 'vegetable', color: '#51cf66' },
  "Dairy": { icon: '🧀', lottie: 'dairy', pattern: 'dairy', color: '#f8f9fa' },
  "Meat": { icon: '🥩', lottie: 'meat', pattern: 'meat', color: '#e64980' },
  "Grain": { icon: '🌾', lottie: 'grain', pattern: 'grain', color: '#fcc419' },
  "Snack": { icon: '🍿', lottie: 'mixed', pattern: 'mixed', color: '#fd7e14' },
  "Flour": { icon: '🍞', lottie: 'grain', pattern: 'grain', color: '#e9ecef' },
  "Seeds": { icon: '🌱', lottie: 'vegetable', pattern: 'vegetable', color: '#8ce99a' },
  "Spices": { icon: '🌶️', lottie: 'spice', pattern: 'mixed', color: '#ff922b' },
  "Beverages": { icon: '🧃', lottie: 'mixed', pattern: 'mixed', color: '#74c0fc' },
  "Canned Goods": { icon: '🥫', lottie: 'mixed', pattern: 'mixed', color: '#adb5bd' },
  "Condiments": { icon: '🧂', lottie: 'spice', pattern: 'mixed', color: '#ffe066' },
  "Frozen": { icon: '🧊', lottie: 'mixed', pattern: 'mixed', color: '#a5d8ff' },
  "Baking Supplies": { icon: '🍰', lottie: 'dairy', pattern: 'dairy', color: '#f8f9fa' },
  "Nuts": { icon: '🥜', lottie: 'grain', pattern: 'grain', color: '#e5dbcf' },
  "Oils": { icon: '🫒', lottie: 'mixed', pattern: 'mixed', color: '#ffd43b' },
  "Pasta": { icon: '🍝', lottie: 'pasta', pattern: 'grain', color: '#f9d71c' },
  "Rice": { icon: '🍚', lottie: 'grain', pattern: 'grain', color: '#f8f9fa' },
  "Sauces": { icon: '🍯', lottie: 'mixed', pattern: 'mixed', color: '#fa5252' },
  "Seafood": { icon: '🦐', lottie: 'seafood', pattern: 'meat', color: '#ff8787' },
  "Unknown": { icon: '🍽️', lottie: 'default', pattern: 'mixed', color: '#adb5bd' },
};

const EditItemModal = ({
  open,
  handleClose,
  editingItem,
  setEditingItem,
  handleSave,
  predefinedCategories,
  predefinedUnits,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentCategory, setCurrentCategory] = useState(editingItem?.category || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update current category when editingItem changes
  useEffect(() => {
    if (editingItem?.category) {
      setCurrentCategory(editingItem.category);
    } else {
      setCurrentCategory("");
    }
  }, [editingItem]);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCurrentCategory(newCategory);
    setEditingItem({ ...editingItem, category: newCategory });
  };

  const handleUnitChange = (event) => {
    setEditingItem({ ...editingItem, unit: event.target.value });
  };

  const onSave = () => {
    setIsSubmitting(true);
    handleSave();
  };

  // Get category visual data
  const categoryVisual = categoryIcons[currentCategory] || categoryIcons.Unknown;

  // Calculate if form is valid to enable the save button
  const isFormValid = 
    editingItem?.name && 
    editingItem?.category && 
    !isNaN(parseFloat(editingItem?.quantity)) && 
    editingItem?.unit &&
    !isSubmitting;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          height: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '100%', sm: '90vh' },
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}>
        {/* Food pattern background based on selected category */}
        <SimpleFoodPatternBackground
          category={categoryVisual.pattern} 
          density={10} 
          opacity={0.15} 
        />
        
        {/* Header */}
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2.5,
          flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: theme.palette.primary.main,
                mr: 1.5,
                width: 32,
                height: 32,
              }}
            >
              {editingItem?.id ? <EditIcon /> : <AddCircleIcon />}
            </Avatar>
            <Typography variant="h6" component="span">
              {editingItem?.id ? "Edit Food Item" : "Add New Food Item"}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            pt: { xs: 3, sm: 4 },
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          <Grid container spacing={3}>
            {!isMobile && (
              <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Box sx={{ 
                  p: 1, 
                  height: 130, 
                  width: 130, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                }}>
                  <SimpleFoodAnimation 
                    foodCategory={categoryVisual.lottie} 
                    height={100} 
                    width={100} 
                  />
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12} sm={isMobile ? 12 : 8}>
              {isMobile && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 2,
                }}>
                  <Box sx={{ 
                    p: 1, 
                    height: 100, 
                    width: 100, 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <SimpleFoodAnimation 
                      foodCategory={categoryVisual.lottie} 
                      height={80} 
                      width={80} 
                    />
                  </Box>
                </Box>
              )}
              
              <DialogContentText sx={{ mb: 2.5 }}>
                {editingItem?.id
                  ? "Update the details of this food item."
                  : "Add a new food item to your pantry."}
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                label="Food Name"
                type="text"
                fullWidth
                value={editingItem?.name || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                sx={{ mb: 2.5 }}
                variant="outlined"
                InputProps={{
                  startAdornment: currentCategory && (
                    <Box sx={{ mr: 1, fontSize: '1.2rem' }}>
                      {categoryIcons[currentCategory]?.icon || '🍽️'}
                    </Box>
                  ),
                }}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    label="Quantity"
                    type="number"
                    fullWidth
                    value={editingItem?.quantity || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quantity: e.target.value })
                    }
                    variant="outlined"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="dense" variant="outlined">
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={editingItem?.unit || ""}
                      onChange={handleUnitChange}
                      label="Unit"
                    >
                      {predefinedUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
            Food Category
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {predefinedCategories.map((category) => {
              const isSelected = category === currentCategory;
              const catVisual = categoryIcons[category] || categoryIcons.Unknown;
              
              return (
                <Chip
                  key={category}
                  label={category}
                  icon={<Box component="span" sx={{ fontSize: '1.1rem', ml: 0.5 }}>{catVisual.icon}</Box>}
                  onClick={() => {
                    setEditingItem({ ...editingItem, category });
                    setCurrentCategory(category);
                  }}
                  color={isSelected ? "primary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{ 
                    borderRadius: 1.5,
                    px: 0.5,
                    fontWeight: isSelected ? 500 : 400,
                    '& .MuiChip-label': { pl: 0.5 },
                  }}
                />
              );
            })}
          </Box>
          
          <FormControl fullWidth margin="dense" variant="outlined" sx={{ display: 'none' }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={editingItem?.category || ""}
              onChange={handleCategoryChange}
              label="Category"
            >
              {predefinedCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 2, sm: 2 },
          justifyContent: 'space-between',
          bgcolor: theme.palette.background.paper,
          borderTop: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
        }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            variant="contained"
            color="primary"
            disabled={!isFormValid}
            sx={{ 
              px: 3,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Saving..." : (editingItem?.id ? "Update Item" : "Add to Pantry")}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditItemModal;
