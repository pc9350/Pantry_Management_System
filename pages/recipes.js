import React, { useState, useEffect } from 'react';
import { db } from '../app/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';
import { fetchRecipes } from '../app/fetchRecipes';
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Chip,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  Divider,
  useMediaQuery,
} from '@mui/material';
import Navbar from '../app/components/Navbar';
import RecipeCard from '../app/components/RecipeCard';
import RecipeModal from '../app/RecipeModal';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FilterListIcon from '@mui/icons-material/FilterList';

const RecipesPage = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    dietType: 'all',
    cookingTime: [0, 60],
    matchPercentage: 0,
    includeIngredients: [],
    excludeIngredients: [],
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [recipesPerPage] = useState(9);
  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Common diet types
  const dietTypes = [
    { value: 'all', label: 'All Diets' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'ketogenic', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'whole30', label: 'Whole30' },
  ];

  // Fetch pantry items from Firestore
  useEffect(() => {
    const fetchPantryItems = async () => {
      try {
        const itemsCollectionRef = collection(db, 'items');
        const itemsSnapshot = await getDocs(itemsCollectionRef);
        const itemsList = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPantryItems(itemsList);
        
        if (itemsList.length > 0) {
          // Automatically fetch recipes based on pantry ingredients
          handleFetchRecipes(itemsList);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching pantry items:', err);
        setError('Failed to load pantry items');
        setLoading(false);
      }
    };

    fetchPantryItems();
    
    // Load saved recipes from localStorage
    const loadSavedRecipes = () => {
      const saved = localStorage.getItem('savedRecipes');
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      }
    };
    
    loadSavedRecipes();
  }, []);

  // Fetch recipes based on pantry ingredients
  const handleFetchRecipes = async (items = pantryItems) => {
    setLoading(true);
    setError(null);
    
    try {
      const ingredientList = items.map(item => item.name);
      const fetchedRecipes = await fetchRecipes(ingredientList);
      setRecipes(fetchedRecipes);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Please try again later.');
      setLoading(false);
    }
  };

  // Handle recipe card click
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalOpen(true);
  };
  
  // Handle recipe modal close
  const handleRecipeModalClose = () => {
    setRecipeModalOpen(false);
    setSelectedRecipe(null);
  };
  
  // Toggle save recipe
  const handleSaveRecipe = (recipe) => {
    const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
    
    let updatedSavedRecipes;
    if (isSaved) {
      updatedSavedRecipes = savedRecipes.filter(saved => saved.id !== recipe.id);
    } else {
      updatedSavedRecipes = [...savedRecipes, recipe];
    }
    
    setSavedRecipes(updatedSavedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
  };
  
  // Filter and search recipes
  const filteredRecipes = React.useMemo(() => {
    let filtered = activeTab === 'saved' ? savedRecipes : recipes;
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(query) || 
        (recipe.diets && recipe.diets.some(diet => diet.toLowerCase().includes(query)))
      );
    }
    
    // Diet type filter
    if (filters.dietType !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.diets && recipe.diets.some(diet => diet.toLowerCase() === filters.dietType)
      );
    }
    
    // Cooking time filter
    filtered = filtered.filter(recipe => {
      const cookingTime = recipe.readyInMinutes || 30; // Default to 30 min if not specified
      return cookingTime >= filters.cookingTime[0] && cookingTime <= filters.cookingTime[1];
    });
    
    // Match percentage filter (only for recipes from pantry items)
    if (activeTab !== 'saved' && filters.matchPercentage > 0) {
      filtered = filtered.filter(recipe => {
        const matchPercentage = recipe.missedIngredientCount 
          ? Math.round(100 * (recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)))
          : 100;
        return matchPercentage >= filters.matchPercentage;
      });
    }
    
    return filtered;
  }, [recipes, savedRecipes, searchQuery, filters, activeTab]);
  
  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };
  
  // Toggle filters panel
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      dietType: 'all',
      cookingTime: [0, 60],
      matchPercentage: 0,
      includeIngredients: [],
      excludeIngredients: [],
    });
    setSearchQuery('');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Recipe Recommendations
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover delicious recipes based on what's already in your pantry.
            </Typography>
          </Box>
          
          {/* Tabs and Search */}
          <Box sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={activeTab === 'all' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('all')}
                startIcon={<KitchenIcon />}
              >
                Pantry Recipes
              </Button>
              <Button
                variant={activeTab === 'saved' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('saved')}
                startIcon={<BookmarkIcon />}
              >
                Saved ({savedRecipes.length})
              </Button>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              width: { xs: '100%', md: 'auto' },
              alignItems: 'center'
            }}>
              <TextField
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{ 
                  flexGrow: 1,
                  maxWidth: { xs: '100%', md: 300 }
                }}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={toggleFilters}
                startIcon={<TuneIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {filtersOpen ? 'Hide Filters' : 'Filters'}
              </Button>
            </Box>
          </Box>
          
          {/* Filters panel */}
          {filtersOpen && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" fontWeight="medium">
                  Filter Recipes
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="diet-filter-label">Diet Type</InputLabel>
                    <Select
                      labelId="diet-filter-label"
                      value={filters.dietType}
                      label="Diet Type"
                      onChange={(e) => setFilters({ ...filters, dietType: e.target.value })}
                    >
                      {dietTypes.map((diet) => (
                        <MenuItem key={diet.value} value={diet.value}>
                          {diet.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography id="cooking-time-slider" gutterBottom>
                    Cooking Time (minutes)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Slider
                      value={filters.cookingTime}
                      onChange={(e, newValue) => setFilters({ ...filters, cookingTime: newValue })}
                      valueLabelDisplay="auto"
                      min={0}
                      max={120}
                      step={5}
                      sx={{ mx: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                      {filters.cookingTime[0]} - {filters.cookingTime[1]} min
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography id="match-slider" gutterBottom>
                    Pantry Match Percentage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RestaurantIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Slider
                      value={filters.matchPercentage}
                      onChange={(e, newValue) => setFilters({ ...filters, matchPercentage: newValue })}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100}
                      step={10}
                      disabled={activeTab === 'saved'}
                      sx={{ mx: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 50 }}>
                      {filters.matchPercentage}%+
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="text" 
                  onClick={resetFilters}
                  sx={{ mr: 1 }}
                >
                  Reset Filters
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={toggleFilters}
                >
                  Apply Filters
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Recipes list */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 4 }}>
              {error}
            </Alert>
          ) : filteredRecipes.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'background.paper',
                my: 4
              }}
            >
              <Typography variant="h6" gutterBottom>
                No recipes found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {activeTab === 'saved' 
                  ? "You haven't saved any recipes yet."
                  : "Try adjusting your filters or adding more ingredients to your pantry."}
              </Typography>
              
              {activeTab === 'saved' ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setActiveTab('all')}
                >
                  Browse Recommendations
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {currentRecipes.map((recipe) => {
                  // Check if this recipe is saved
                  const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
                  
                  // Get missing ingredients array
                  const missingIngredients = recipe.missedIngredients 
                    ? recipe.missedIngredients.map(ingredient => ingredient.name)
                    : [];
                    
                  return (
                    <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                      <RecipeCard
                        recipe={recipe}
                        onView={handleRecipeClick}
                        onSave={handleSaveRecipe}
                        saved={isSaved}
                        missingIngredients={missingIngredients}
                        showMatchPercentage={activeTab !== 'saved'}
                      />
                    </Grid>
                  );
                })}
              </Grid>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={currentPage}
                    onChange={handlePageChange} 
                    color="primary"
                    size={isSmallScreen ? "small" : "medium"}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      
        {/* Recipe detail modal */}
        <RecipeModal
          open={recipeModalOpen}
          onClose={handleRecipeModalClose}
          recipe={selectedRecipe}
          pantryItems={pantryItems}
        />
      </Box>
    </ThemeProvider>
  );
};

export default RecipesPage; 