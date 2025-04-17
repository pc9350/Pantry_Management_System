import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Button, 
  Rating,
  CardActions,
  Divider,
  Tooltip,
  styled
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 4,
  fontWeight: 500,
  margin: '0 4px 4px 0',
}));

const RecipeCardContainer = styled(motion.div)({
  height: '100%',
  display: 'flex',
});

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const OverlayBadge = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  padding: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: color || theme.palette.secondary.main,
  color: '#FFF',
  fontWeight: 600,
  fontSize: '0.75rem',
  zIndex: 1,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

// Add a badge for AI-generated recipes
const AiBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  padding: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  color: '#FFF',
  fontWeight: 600,
  fontSize: '0.75rem',
  zIndex: 5,
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const RecipeCard = ({ 
  recipe, 
  onView, 
  onSave, 
  saved = false,
  missingIngredients = [],
  showMatchPercentage = true
}) => {
  // Calculate match percentage
  const matchPercentage = recipe.matchPercentage || (recipe.missedIngredientCount 
    ? Math.round(100 * (recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)))
    : 100);
  
  // Format cooking time (in minutes)
  const cookingTime = recipe.readyInMinutes || Math.floor(Math.random() * 30) + 15; // Fallback to random time for demo
  
  // Format serving size
  const servings = recipe.servings || 4; // Fallback to default for demo
  
  // Demo score
  const score = recipe.spoonacularScore ? Math.round(recipe.spoonacularScore / 20) : Math.floor(Math.random() * 3) + 3;

  // Check if this is a custom AI-generated recipe
  const isCustomRecipe = recipe.isCustomGenerated === true;

  return (
    <RecipeCardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard>
        {/* Match percentage badge */}
        {showMatchPercentage && !isCustomRecipe && (
          <OverlayBadge 
            color={matchPercentage > 80 ? '#4caf50' : matchPercentage > 50 ? '#ff9800' : '#f44336'}
          >
            {matchPercentage}% match
          </OverlayBadge>
        )}
        
        {/* Custom recipe badge */}
        {isCustomRecipe && (
          <AiBadge>
            <AutoAwesomeIcon fontSize="inherit" />
            AI Recipe
          </AiBadge>
        )}
        
        {/* Recipe Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={recipe.image}
            alt={recipe.title}
            sx={{ 
              objectFit: 'cover',
              filter: 'brightness(0.9)',
            }}
            onError={(e) => {
              // If image fails to load, use the fallback
              e.target.onerror = null;
              e.target.src = "/recipe-fallback.svg";
            }}
          />
          
          {/* Save button */}
          <IconButton
            aria-label={saved ? 'Unsave recipe' : 'Save recipe'}
            onClick={() => onSave(recipe)}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {saved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          {/* Recipe Title */}
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '3em',
            }}
          >
            {recipe.title}
          </Typography>
          
          {/* Recipe meta information */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {cookingTime} min
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {servings} servings
              </Typography>
            </Box>
            
            <Rating 
              value={score} 
              readOnly 
              size="small"
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
          </Box>
          
          {/* Tags/Diets */}
          {recipe.diets && recipe.diets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {recipe.diets.slice(0, 3).map((diet) => (
                <StyledChip 
                  key={diet} 
                  label={diet} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                />
              ))}
              {recipe.diets.length > 3 && (
                <Tooltip title={recipe.diets.slice(3).join(', ')}>
                  <StyledChip 
                    label={`+${recipe.diets.length - 3}`} 
                    size="small" 
                    variant="outlined"
                  />
                </Tooltip>
              )}
            </Box>
          )}
          
          {/* Missing ingredients */}
          {missingIngredients.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Missing ingredients:
              </Typography>
              <Box>
                {missingIngredients.slice(0, 2).map((ingredient) => (
                  <StyledChip 
                    key={ingredient} 
                    label={ingredient} 
                    size="small" 
                    color="error"
                    variant="outlined"
                  />
                ))}
                {missingIngredients.length > 2 && (
                  <Tooltip title={missingIngredients.slice(2).join(', ')}>
                    <StyledChip 
                      label={`+${missingIngredients.length - 2} more`} 
                      size="small" 
                      color="default"
                      variant="outlined"
                    />
                  </Tooltip>
                )}
              </Box>
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ padding: 2, pt: 1, pb: 1.5 }}>
          <Button 
            variant="text" 
            size="small" 
            startIcon={<ShoppingCartIcon />}
            sx={{ mr: 1 }}
          >
            Add Missing
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            endIcon={<InfoIcon />}
            onClick={() => onView(recipe)}
            sx={{ ml: 'auto' }}
          >
            Details
          </Button>
        </CardActions>
      </StyledCard>
    </RecipeCardContainer>
  );
};

export default RecipeCard; 