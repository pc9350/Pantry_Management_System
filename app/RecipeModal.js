import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  Grid,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  Avatar,
} from '@mui/material';
import Image from 'next/image';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImageIcon from '@mui/icons-material/Image';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { pink, green, blue, orange } from '@mui/material/colors';

// Helper function to parse instructions from text
const parseInstructions = (instructionsText) => {
  if (!instructionsText) return [];
  
  // Check if the text contains HTML tags (common in Spoonacular recipes)
  if (instructionsText.includes('<li>')) {
    // Extract text from list items using regex
    const liRegex = /<li>(.*?)<\/li>/g;
    const matches = [...instructionsText.matchAll(liRegex)];
    
    if (matches.length > 0) {
      return matches.map(match => match[1].trim());
    }
  }
  
  // Default splitting by numbered pattern or line breaks if no HTML is found
  return instructionsText
    .split(/\n|\r|\d+\.\s+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Helper function to sanitize text and remove HTML tags
const sanitizeText = (text) => {
  if (!text) return '';
  return text.replace(/<\/?[^>]+(>|$)/g, '');
};

const RecipeModal = ({ open, handleClose, recipe, onTryCustomRecipe, onSaveRecipe, savedRecipes = [] }) => {
  if (!recipe) return null;
  
  // Check if this is a custom AI-generated recipe
  const isCustomRecipe = recipe.isCustomRecipe || recipe.isCustomGenerated;
  
  // Check if this recipe is already saved
  const isAlreadySaved = Array.isArray(savedRecipes) && 
    savedRecipes.some(saved => saved.id === recipe.id);
  
  const recipeTags = [];
  
  if (recipe.vegetarian) recipeTags.push('Vegetarian');
  if (recipe.vegan) recipeTags.push('Vegan');
  if (recipe.glutenFree) recipeTags.push('Gluten-Free');
  if (recipe.dairyFree) recipeTags.push('Dairy-Free');
  
  // Parse instructions if they're in text format
  const instructions = typeof recipe.instructions === 'string' 
    ? parseInstructions(recipe.instructions) 
    : recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 
      ? recipe.analyzedInstructions[0].steps.map(step => step.step)
      : Array.isArray(recipe.instructions) ? recipe.instructions : [];
      
  // Get ingredients list - handle both custom and API recipes
  const ingredients = Array.isArray(recipe.extendedIngredients) 
    ? recipe.extendedIngredients.map(ing => ing.original || ing.originalString || ing.name)
    : Array.isArray(recipe.ingredients) 
      ? recipe.ingredients 
      : [];

  // Make sure ingredients don't have HTML tags
  const cleanIngredients = ingredients.map(sanitizeText);

  // Helper function to determine recipe source
  const getRecipeSource = (recipe) => {
    if (recipe.isCustomRecipe || recipe.isCustomGenerated) {
      return 'AI-Generated';
    } else if (recipe.sourceName) {
      return recipe.sourceName;
    } else if (recipe.creditsText) {
      return recipe.creditsText;
    } else {
      return 'Spoonacular API';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={300}
          image={recipe.image || '/recipe-placeholder.svg'}
          alt={recipe.title}
          sx={{ 
            objectFit: 'cover',
            filter: 'brightness(0.85)',
          }}
        />
        
        {isCustomRecipe && (
          <Box 
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(156, 39, 176, 0.85)',
              color: 'white',
              px: 2,
              py: 0.75,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <AutoAwesomeIcon />
            <Typography variant="subtitle2" fontWeight="bold">
              AI-Generated
            </Typography>
          </Box>
        )}
        
        <Box 
          sx={{
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0,
            p: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {recipe.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {recipe.readyInMinutes && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">{recipe.readyInMinutes} min</Typography>
              </Box>
            )}
            
            {recipe.servings && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <RestaurantIcon fontSize="small" />
                <Typography variant="body2">{recipe.servings} servings</Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <RestaurantMenuIcon fontSize="small" />
              <Typography variant="body2">{getRecipeSource(recipe)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="h6" component="h2" sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                color: pink[700],
                gap: 1
              }}>
                <Box component="span" sx={{ 
                  display: 'inline-flex', 
                  bgcolor: pink[50], 
                  p: 0.75, 
                  borderRadius: '50%'
                }}>
                  <RestaurantIcon fontSize="small" />
                </Box>
                Ingredients
              </Typography>
              
              <List disablePadding dense>
                {cleanIngredients.map((ingredient, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: pink[700] }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={ingredient} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            
            {recipeTags.length > 0 && (
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 'medium', color: blue[700] }}>
                  Dietary Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {recipeTags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      color={
                        tag === 'Vegetarian' || tag === 'Vegan' ? 'success' :
                        tag === 'Gluten-Free' ? 'info' : 
                        tag === 'Dairy-Free' ? 'secondary' : 'default'
                      }
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} sm={7}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" component="h2" sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                color: green[700],
                gap: 1
              }}>
                <Box component="span" sx={{ 
                  display: 'inline-flex', 
                  bgcolor: green[50], 
                  p: 0.75, 
                  borderRadius: '50%'
                }}>
                  <RestaurantMenuIcon fontSize="small" />
                </Box>
                Instructions
              </Typography>
              
              <List>
                {instructions.map((step, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ py: 1.5 }}>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: green[100], 
                        color: green[800],
                        width: 32, 
                        height: 32, 
                        fontSize: 16,
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={sanitizeText(step)} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2, flexWrap: 'wrap' }}>
          {recipe.readyInMinutes && (
            <Chip icon={<TimerIcon />} label={`${recipe.readyInMinutes} minutes`} variant="outlined" />
          )}
          {recipe.servings && (
            <Chip icon={<RestaurantIcon />} label={`${recipe.servings} servings`} variant="outlined" />
          )}
          {recipe.diets && recipe.diets.length > 0 && recipe.diets[0] !== "" && (
            <Chip label={recipe.diets[0]} color="primary" variant="outlined" />
          )}
          <Box flexGrow={1} />
          {onSaveRecipe && !isAlreadySaved && (
            <Button
              variant="outlined"
              startIcon={<BookmarkIcon />}
              size="small"
              onClick={() => onSaveRecipe(recipe)}
            >
              Save Recipe
            </Button>
          )}
        </Box>
        
        {/* Nutritional information for AI-generated recipes */}
        {isCustomRecipe && recipe.nutritionalInfo && (
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" component="h2" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: orange[700],
              gap: 1
            }}>
              <Box component="span" sx={{ 
                display: 'inline-flex', 
                bgcolor: orange[50], 
                p: 0.75, 
                borderRadius: '50%'
              }}>
                <ImageIcon fontSize="small" />
              </Box>
              Nutritional Information
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                <Grid item xs={6} sm={3} key={key}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="caption" color="text.secondary" component="div" sx={{ textTransform: 'capitalize' }}>
                      {key}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {/* Variations section for AI-generated recipes */}
        {isCustomRecipe && recipe.variations && recipe.variations.length > 0 && (
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" component="h2" sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center',
              color: blue[700],
              gap: 1
            }}>
              <Box component="span" sx={{ 
                display: 'inline-flex', 
                bgcolor: blue[50], 
                p: 0.75, 
                borderRadius: '50%'
              }}>
                <AutoAwesomeIcon fontSize="small" />
              </Box>
              Variations
            </Typography>
            
            <List>
              {recipe.variations.map((variation, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: blue[700] }} />
                  </ListItemIcon>
                  <ListItemText primary={variation} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
        
        {/* Promote AI recipes if this isn't already an AI recipe */}
        {!isCustomRecipe && onTryCustomRecipe && (
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 3, 
              p: 2, 
              borderRadius: 2, 
              bgcolor: 'rgba(156, 39, 176, 0.05)',
              border: '1px dashed',
              borderColor: 'secondary.main'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AutoAwesomeIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Try Our AI Recipe Generator
              </Typography>
            </Box>
            <Typography variant="body2" paragraph sx={{ mb: 1 }}>
              Get personalized recipe recommendations based on your pantry ingredients!
            </Typography>
            <Button 
              color="secondary" 
              size="small" 
              variant="outlined"
              onClick={onTryCustomRecipe}
              startIcon={<AutoAwesomeIcon />}
            >
              Create Custom Recipe
            </Button>
          </Paper>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeModal;
