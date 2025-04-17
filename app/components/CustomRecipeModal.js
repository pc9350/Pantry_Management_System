import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Stack,
  useMediaQuery,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PeopleIcon from '@mui/icons-material/People';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImageIcon from '@mui/icons-material/Image';

const difficultyLevels = [
  'Easy',
  'Moderate',
  'Advanced',
];

const mealTypes = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Appetizer',
];

const dietaryPreferences = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Low-Carb',
  'Paleo',
  'Mediterranean',
];

const CustomRecipeModal = ({ open, handleClose, pantryItems = [], handleCustomRecipeSave }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [preferences, setPreferences] = useState('');
  const [difficulty, setDifficulty] = useState('Moderate');
  const [mealType, setMealType] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [recipeSaved, setRecipeSaved] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageOption, setImageOption] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Get available ingredients from pantry (with safety check)
  const availableIngredients = Array.isArray(pantryItems) ? pantryItems.map(item => item.name) : [];

  // Function to validate image URL
  const validateImageUrl = (url) => {
    if (!url) {
      setImageError(null);
      return;
    }
    
    setIsValidatingImage(true);
    setImageError(null);
    
    const img = new Image();
    img.onload = () => {
      setIsValidatingImage(false);
      setImageError(null);
    };
    img.onerror = () => {
      setIsValidatingImage(false);
      setImageError('Image could not be loaded. Please check the URL.');
    };
    img.src = url;
  };

  // Function to handle image URL changes with debounce
  const handleImageUrlChange = (url) => {
    setPreviewImage(url);
    setImageOption(2);
    
    // Debounce validation to avoid too many checks while typing
    if (url) {
      const timeoutId = setTimeout(() => {
        validateImageUrl(url);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleIngredientToggle = (ingredient) => {
    const currentIndex = selectedIngredients.indexOf(ingredient);
    const newSelectedIngredients = [...selectedIngredients];

    if (currentIndex === -1) {
      newSelectedIngredients.push(ingredient);
    } else {
      newSelectedIngredients.splice(currentIndex, 1);
    }

    setSelectedIngredients(newSelectedIngredients);
  };

  const handlePreferenceChange = (event) => {
    setPreferences(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleMealTypeChange = (event) => {
    setMealType(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeSaved(false);

    try {
      const response = await axios.post('/api/generate-recipe', {
        ingredients: selectedIngredients,
        preferences,
        difficulty,
        mealType,
      });

      // Ensure recipe object has all the required properties to avoid errors
      const rawRecipe = response.data;
      
      // Add default values for any missing properties
      const safeRecipe = {
        title: rawRecipe.title || `Custom Recipe with ${selectedIngredients[0]}`,
        cookingTime: rawRecipe.cookingTime || '30 minutes',
        servings: rawRecipe.servings || '4',
        difficulty: rawRecipe.difficulty || difficulty || 'Moderate',
        ingredients: Array.isArray(rawRecipe.ingredients) ? rawRecipe.ingredients : [],
        instructions: Array.isArray(rawRecipe.instructions) ? rawRecipe.instructions : [],
        nutritionalInfo: {
          calories: (rawRecipe.nutritionalInfo && rawRecipe.nutritionalInfo.calories) || 'N/A',
          protein: (rawRecipe.nutritionalInfo && rawRecipe.nutritionalInfo.protein) || 'N/A',
          carbs: (rawRecipe.nutritionalInfo && rawRecipe.nutritionalInfo.carbs) || 'N/A',
          fat: (rawRecipe.nutritionalInfo && rawRecipe.nutritionalInfo.fat) || 'N/A',
        },
        variations: Array.isArray(rawRecipe.variations) ? rawRecipe.variations : [],
      };

      setRecipe(safeRecipe);
      handleNext();
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err.response?.data?.error || 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedIngredients([]);
    setPreferences('');
    setDifficulty('Moderate');
    setMealType('');
    setRecipe(null);
    setError(null);
    setActiveStep(0);
    setRecipeSaved(false);
  };

  // Add a function to categorize recipes and generate appropriate image URLs
  function getRecipeImageUrl(recipe) {
    const { title, ingredients = [] } = recipe;
    const lowerTitle = (title || '').toLowerCase();
    const allText = lowerTitle + ' ' + ingredients.join(' ').toLowerCase();
    
    // Define food categories and their regular expressions
    const categories = [
      { name: 'pasta', regex: /\b(pasta|spaghetti|linguine|fettuccine|macaroni|noodle|lasagna)\b/ },
      { name: 'soup', regex: /\b(soup|stew|broth|chowder)\b/ },
      { name: 'salad', regex: /\b(salad|slaw)\b/ },
      { name: 'chicken', regex: /\b(chicken|poultry)\b/ },
      { name: 'beef', regex: /\b(beef|steak|ground beef|burger)\b/ },
      { name: 'fish', regex: /\b(fish|salmon|tuna|tilapia|cod|seafood|shrimp)\b/ },
      { name: 'vegetarian', regex: /\b(vegetarian|vegan|plant-based)\b/ },
      { name: 'pizza', regex: /\b(pizza|flatbread)\b/ },
      { name: 'sandwich', regex: /\b(sandwich|wrap|panini|burger|toast)\b/ },
      { name: 'dessert', regex: /\b(dessert|cake|cookie|pie|brownie|sweet|chocolate|ice cream)\b/ },
      { name: 'breakfast', regex: /\b(breakfast|oatmeal|pancake|waffle|egg|toast|cereal|hash)\b/ },
      { name: 'rice', regex: /\b(rice|risotto|paella|biryani|pilaf)\b/ },
      { name: 'vegetable', regex: /\b(vegetable|broccoli|spinach|kale|carrot|potato|veggie)\b/ },
      { name: 'fruit', regex: /\b(fruit|apple|banana|berry|orange|fruit salad)\b/ },
      { name: 'smoothie', regex: /\b(smoothie|shake|juice|beverage|drink)\b/ },
      { name: 'bread', regex: /\b(bread|baking|baked|muffin|roll|bun)\b/ },
    ];
    
    // Find matching category
    const matchedCategory = categories.find(category => category.regex.test(allText));
    const category = matchedCategory ? matchedCategory.name : 'food';
    
    // Unsplash collections for food
    const collections = {
      general: 'food-drink',
      pasta: '4226094',
      soup: '3872977',
      salad: '8447859',
      chicken: '8762690',
      beef: '1393273', 
      fish: '3872984',
      vegetarian: '1460123',
      pizza: '9525895',
      sandwich: '2335448',
      dessert: '3887752',
      breakfast: '4926819',
      rice: '8788555',
      vegetable: '4226064',
      fruit: '2114084',
      smoothie: '2310271',
      bread: '8770941',
      food: '7416481'
    };
    
    const collectionId = collections[category] || collections.food;
    return `https://source.unsplash.com/collection/${collectionId}/800x600?${encodeURIComponent(title || category)}`;
  }

  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    // Validate image option
    if (imageOption === 2 && (!previewImage || imageError)) {
      setError('Please provide a valid image URL or select a different image option');
      return;
    }
    
    // Generate a unique ID for the recipe
    const customId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Get image based on the selected option
    let imageUrl;
    if (imageOption === 0) {
      // Auto-generated image based on recipe content
      imageUrl = getRecipeImageUrl(recipe);
    } else if (imageOption === 1) {
      // Generic food placeholder
      imageUrl = '/recipe-placeholder.svg';
    } else if (imageOption === 2 && previewImage) {
      // Custom URL provided by user
      imageUrl = previewImage;
    } else {
      // Fallback to auto-generated if something goes wrong
      imageUrl = getRecipeImageUrl(recipe);
    }
    
    const recipeToSave = {
      ...recipe,
      id: customId,
      image: imageUrl,
      imageType: 'jpg',
      sourceUrl: '#',
      isCustomRecipe: true,
      generatedAt: new Date().toISOString(),
      imageOptionUsed: imageOption // Save which option was used for potential future edits
    };
    
    // Check if it's already saved
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    const isAlreadySaved = savedRecipes.some(recipe => 
      recipe.title === recipeToSave.title && 
      JSON.stringify(recipe.ingredients) === JSON.stringify(recipeToSave.ingredients)
    );
    
    if (!isAlreadySaved) {
      // Add the new recipe to the saved recipes
      savedRecipes.push(recipeToSave);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      
      // Show success message
      setSuccessMessage('Recipe saved successfully!');
      setShowSuccess(true);
      
      // Force a refresh of recipes in parent components
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('storage'));
      }
      
      setRecipeSaved(true);
    } else {
      // Show warning that it's already saved
      setError('This recipe is already saved!');
    }

    // Close the modal after a brief delay to show the success state
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const steps = ['Select Ingredients', 'Customize Recipe', 'View Recipe'];

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? null : handleClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            minHeight: '70vh',
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantMenuIcon />
            <Typography variant="h6">Create Custom Recipe</Typography>
          </Box>
          {!loading && (
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Ingredients from Your Pantry
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose ingredients you'd like to use in your custom recipe.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {availableIngredients.map((ingredient) => (
                  <Chip
                    key={ingredient}
                    label={ingredient}
                    onClick={() => handleIngredientToggle(ingredient)}
                    color={selectedIngredients.includes(ingredient) ? 'primary' : 'default'}
                    variant={selectedIngredients.includes(ingredient) ? 'filled' : 'outlined'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              {selectedIngredients.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Ingredients ({selectedIngredients.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedIngredients.map((ingredient) => (
                      <Chip
                        key={ingredient}
                        label={ingredient}
                        onDelete={() => handleIngredientToggle(ingredient)}
                        color="primary"
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Add Custom Ingredient"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Type and press Enter to add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newIngredient = e.target.value.trim();
                      if (!selectedIngredients.includes(newIngredient)) {
                        setSelectedIngredients([...selectedIngredients, newIngredient]);
                      }
                      e.target.value = '';
                    }
                  }}
                  sx={{ mt: 2 }}
                />
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Customize Your Recipe
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Specify your preferences for the custom recipe.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={mealType}
                      onChange={handleMealTypeChange}
                      label="Meal Type"
                    >
                      <MenuItem value="">Any</MenuItem>
                      {mealTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={difficulty}
                      onChange={handleDifficultyChange}
                      label="Difficulty"
                    >
                      {difficultyLevels.map((level) => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Dietary Preferences</InputLabel>
                    <Select
                      value={preferences}
                      onChange={handlePreferenceChange}
                      label="Dietary Preferences"
                    >
                      <MenuItem value="">None</MenuItem>
                      {dietaryPreferences.map((pref) => (
                        <MenuItem key={pref} value={pref}>{pref}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && recipe && (
            <Box>
              <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                {/* Add image preview */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 200, 
                    borderRadius: 2, 
                    overflow: 'hidden', 
                    mb: 1,
                    position: 'relative'
                  }}
                >
                  {imageOption === 2 && !previewImage ? (
                    // Show placeholder with instructions when custom URL is selected but no URL is provided
                    <Box 
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'grey.100',
                        p: 3,
                        textAlign: 'center'
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Please enter a custom image URL below
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        The image will appear here once a valid URL is provided
                      </Typography>
                    </Box>
                  ) : (
                    // Show the selected image based on option
                    <img 
                      src={imageOption === 0 ? getRecipeImageUrl(recipe) : 
                          imageOption === 1 ? '/recipe-placeholder.svg' : 
                          previewImage}
                      alt={recipe.title}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        // If image fails to load, show error state
                        if (imageOption === 2) {
                          e.target.src = '/recipe-fallback.svg';
                          setImageError('Image could not be loaded');
                        }
                      }}
                    />
                  )}
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      bgcolor: 'rgba(0,0,0,0.6)', 
                      color: 'white', 
                      px: 1, 
                      py: 0.5, 
                      fontSize: '0.75rem',
                      borderTopLeftRadius: 8 
                    }}
                  >
                    {imageOption === 0 ? 'AI Generated Image' : 
                     imageOption === 1 ? 'Placeholder Image' : 
                     'Custom Image URL'}
                  </Box>
                </Box>

                {/* Add image options selector */}
                <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Recipe Image Options
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <Box 
                        onClick={() => setImageOption(0)}
                        sx={{ 
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: imageOption === 0 ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          p: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          bgcolor: imageOption === 0 ? 'primary.light' : 'transparent',
                          opacity: imageOption === 0 ? 1 : 0.7,
                          transition: 'all 0.2s',
                          '&:hover': {
                            opacity: 1,
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 80, 
                            mb: 1, 
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <img 
                            src={getRecipeImageUrl(recipe)} 
                            alt="AI Generated" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="body2" align="center">AI Generated</Typography>
                        <Typography variant="caption" align="center" color="text.secondary">
                          Based on recipe ingredients
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box 
                        onClick={() => setImageOption(1)}
                        sx={{ 
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: imageOption === 1 ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          p: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          bgcolor: imageOption === 1 ? 'primary.light' : 'transparent',
                          opacity: imageOption === 1 ? 1 : 0.7,
                          transition: 'all 0.2s',
                          '&:hover': {
                            opacity: 1,
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 80, 
                            mb: 1, 
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <img 
                            src="/recipe-placeholder.svg" 
                            alt="Placeholder" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="body2" align="center">Placeholder</Typography>
                        <Typography variant="caption" align="center" color="text.secondary">
                          Generic recipe image
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box 
                        onClick={() => setImageOption(2)}
                        sx={{ 
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: imageOption === 2 ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          p: 1,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          bgcolor: imageOption === 2 ? 'primary.light' : 'transparent',
                          opacity: imageOption === 2 ? 1 : 0.7,
                          transition: 'all 0.2s',
                          '&:hover': {
                            opacity: 1,
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: '100%', 
                            height: 80, 
                            mb: 1, 
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'grey.100'
                          }}
                        >
                          {previewImage ? (
                            <img 
                              src={previewImage} 
                              alt="Custom URL" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Enter URL below
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" align="center">Custom URL</Typography>
                        <TextField
                          size="small"
                          placeholder="Paste image URL"
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          value={previewImage || ''}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          error={!!imageError}
                          helperText={imageError}
                          disabled={isValidatingImage}
                          InputProps={{
                            endAdornment: isValidatingImage ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : null,
                          }}
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
                  {recipe.title || 'Custom Recipe'}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                  <Chip icon={<TimerIcon />} label={`${recipe.cookingTime || 'N/A'} cooking time`} variant="outlined" />
                  <Chip icon={<PeopleIcon />} label={`${recipe.servings || '4'} servings`} variant="outlined" />
                  <Chip icon={<LocalDiningIcon />} label={`${recipe.difficulty || 'Moderate'}`} variant="outlined" />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RestaurantIcon color="primary" /> Ingredients
                </Typography>
                <List dense>
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemText primary="No ingredients available" />
                    </ListItem>
                  )}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FastfoodIcon color="primary" /> Instructions
                </Typography>
                <List>
                  {recipe.instructions && recipe.instructions.length > 0 ? (
                    recipe.instructions.map((step, index) => (
                      <ListItem key={index} sx={{ py: 1 }} alignItems="flex-start">
                        <Box sx={{ mr: 2, minWidth: 24, display: 'flex', justifyContent: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {index + 1}.
                          </Typography>
                        </Box>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem sx={{ py: 1 }} alignItems="flex-start">
                      <ListItemText primary="No instructions available" />
                    </ListItem>
                  )}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FitnessCenterIcon color="primary" /> Nutritional Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Calories</Typography>
                      <Typography variant="body1" fontWeight="bold">{recipe.nutritionalInfo?.calories || 'N/A'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Protein</Typography>
                      <Typography variant="body1" fontWeight="bold">{recipe.nutritionalInfo?.protein || 'N/A'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Carbs</Typography>
                      <Typography variant="body1" fontWeight="bold">{recipe.nutritionalInfo?.carbs || 'N/A'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Fat</Typography>
                      <Typography variant="body1" fontWeight="bold">{recipe.nutritionalInfo?.fat || 'N/A'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {recipe.variations && recipe.variations.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RestaurantMenuIcon color="primary" /> Variations
                    </Typography>
                    <List dense>
                      {recipe.variations.map((variation, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText primary={variation} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Paper>
            </Box>
          )}

          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>Creating Your Custom Recipe</Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI chef is working on a delicious recipe with your ingredients...
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          {activeStep > 0 && !loading && (
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
          )}
          
          <Box sx={{ flex: '1 1 auto' }} />
          
          {activeStep === 2 && recipe && (
            <>
              <Button 
                onClick={handleSaveRecipe} 
                color="secondary"
                startIcon={recipeSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                disabled={recipeSaved}
                sx={{ mr: 1 }}
              >
                {recipeSaved ? 'Saved' : 'Save Recipe'}
              </Button>
              <Button onClick={handleReset} disabled={loading}>
                Create Another Recipe
              </Button>
            </>
          )}
          
          {activeStep < 2 && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={activeStep === 1 ? handleGenerateRecipe : handleNext}
              disabled={activeStep === 0 && selectedIngredients.length === 0 || loading}
            >
              {activeStep === 1 ? 'Generate Recipe' : 'Next'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Success message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomRecipeModal; 