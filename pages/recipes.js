import React, { useState, useEffect, useCallback } from 'react';
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
import CustomRecipeModal from '../app/components/CustomRecipeModal';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TimerIcon from '@mui/icons-material/Timer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dynamic from 'next/dynamic';
import RefreshIcon from '@mui/icons-material/Refresh';

// Use dynamic import with ssr: false to prevent server-side rendering
const RecipesPageContent = dynamic(() => Promise.resolve(RecipesPageContentComponent), {
  ssr: false,
});

const RecipesPage = () => {
  return <RecipesPageContent />;
};

// Move all component logic to a client-only component
const RecipesPageContentComponent = () => {
  const [pantryItems, setPantryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [customRecipeModalOpen, setCustomRecipeModalOpen] = useState(false);
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
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
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

  // Fetch recipes based on pantry ingredients - define this first to avoid circular dependency
  const handleFetchRecipes = useCallback(async (items) => {
    setLoading(true);
    setError(null);
    
    try {
      const ingredientList = items?.map(item => item.name) || [];
      
      // Check if there are saved recipes we can show first
      const savedRecipesJSON = localStorage.getItem('savedRecipes');
      const localSavedRecipes = savedRecipesJSON ? JSON.parse(savedRecipesJSON) : [];
      
      try {
        // Attempt to fetch from Spoonacular
        const fetchedRecipes = await fetchRecipes(ingredientList);
        setRecipes(fetchedRecipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        
        // If the error appears to be API limit related
        if (err.response && (err.response.status === 402 || err.response.status === 429)) {
          // Show a more specific error message about API limits
          setError('Spoonacular API daily limit reached. Try using the AI Recipe Generator to create custom recipes with your ingredients!');
          
          // Still show any saved recipes
          if (localSavedRecipes.length > 0) {
            setActiveTab('saved');
          }
        } else {
          setError('Failed to fetch recipes. Please try again later.');
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Error in recipe fetching process:', err);
      setError('An unexpected error occurred. Please try again later.');
      setLoading(false);
    }
  }, []); // No dependencies to avoid circular reference

  // Fetch pantry items from Firestore
  const fetchPantryItems = useCallback(async () => {
    try {
      const itemsCollectionRef = collection(db, 'items');
      const itemsSnapshot = await getDocs(itemsCollectionRef);
      const itemsList = itemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPantryItems(itemsList);
      
      // Don't automatically call handleFetchRecipes here
      // Only set loading to false
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pantry items:', err);
      setError('Failed to load pantry items');
      setLoading(false);
    }
  }, []); // Remove handleFetchRecipes from dependency array

  // Modify the loadSavedRecipes function to ensure it's properly loading saved recipes
  const loadSavedRecipes = useCallback(() => {
    try {
      // Only attempt to access localStorage on the client side
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('savedRecipes');
        if (saved) {
          const parsedRecipes = JSON.parse(saved);
          console.log('Loaded saved recipes:', parsedRecipes.length);
          setSavedRecipes(parsedRecipes);
        } else {
          console.log('No saved recipes found in localStorage');
          setSavedRecipes([]);
        }
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      setSavedRecipes([]);
    }
  }, []);

  // Improve the handleTabChange function to ensure it works correctly
  const handleTabChange = (newTab) => {
    console.log(`Switching to tab: ${newTab}`);
    
    if (newTab === 'saved') {
      // Force reload saved recipes when switching to saved tab
      loadSavedRecipes();
    } else if (newTab === 'all' && recipes.length === 0 && !error) {
      handleFetchRecipes(pantryItems);
    }
    
    setActiveTab(newTab);
    
    // Reset current page when switching tabs
    setCurrentPage(1);
  };

  // Improve the useEffect to ensure saved recipes are loaded on initial render
  useEffect(() => {
    fetchPantryItems();
    loadSavedRecipes();
    
    // No automatic API calls here - let the user initiate them
  }, [fetchPantryItems, loadSavedRecipes]); // Remove activeTab dependency

  // Add a new useEffect to handle tab changes
  useEffect(() => {
    // If switching to "all" tab and we need to load recipes
    if (activeTab === 'all' && recipes.length === 0 && !error) {
      // Check if we have pantry items before making the call
      if (pantryItems.length > 0) {
        handleFetchRecipes(pantryItems);
      }
    }
  }, [activeTab, pantryItems.length, recipes.length, error]);

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
  
  // Add function to delete a recipe
  const handleDeleteRecipe = (recipe) => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      try {
        // Remove from saved recipes
        const updatedSavedRecipes = savedRecipes.filter(saved => saved.id !== recipe.id);
        
        // Update state
        setSavedRecipes(updatedSavedRecipes);
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
        }
        
        // Show confirmation message
        alert(`Recipe "${recipe.title}" has been deleted.`);
        
        // If we're now empty, force UI update
        if (updatedSavedRecipes.length === 0 && activeTab === 'saved') {
          setFilteredRecipes([]);
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe. Please try again.");
      }
    }
  };
  
  // Toggle save recipe
  const handleSaveRecipe = (recipe) => {
    try {
      const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
      
      let updatedSavedRecipes;
      if (isSaved) {
        // Remove from saved recipes
        updatedSavedRecipes = savedRecipes.filter(saved => saved.id !== recipe.id);
      } else {
        // Add to saved recipes - ensure we have a complete recipe object
        // with all necessary properties to display without API calls
        const completeRecipe = {
          ...recipe,
          // Ensure essential properties are present
          id: recipe.id || `recipe-${Date.now()}`,
          title: recipe.title || 'Untitled Recipe',
          image: recipe.image || "/recipe-fallback.svg",
          readyInMinutes: recipe.readyInMinutes || 30,
          servings: recipe.servings || 4,
          // If recipe contains missedIngredients, store them directly
          missedIngredientCount: recipe.missedIngredientCount || 0,
          usedIngredientCount: recipe.usedIngredientCount || 0,
          missedIngredients: recipe.missedIngredients || [],
          usedIngredients: recipe.usedIngredients || [],
          // Store instructions
          instructions: recipe.instructions || [],
          analyzedInstructions: recipe.analyzedInstructions || [],
          // Store other details
          diets: recipe.diets || [],
          extendedIngredients: recipe.extendedIngredients || [],
          // Calculate match percentage
          matchPercentage: recipe.matchPercentage || 
            (recipe.missedIngredientCount !== undefined && recipe.usedIngredientCount !== undefined 
              ? Math.round(100 * (recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)))
              : 100)
        };
        
        updatedSavedRecipes = [...savedRecipes, completeRecipe];
      }
      
      setSavedRecipes(updatedSavedRecipes);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };
  
  // Add a debug function for localStorage
  const debugLocalStorage = () => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined') {
        const savedRecipesJSON = localStorage.getItem('savedRecipes');
        console.log('Raw localStorage savedRecipes:', savedRecipesJSON);
        
        if (savedRecipesJSON) {
          try {
            const parsed = JSON.parse(savedRecipesJSON);
            console.log('Parsed savedRecipes:', parsed);
            console.log('Number of saved recipes:', parsed.length);
            
            // If we have saved recipes but the state doesn't reflect it, update state
            if (parsed.length > 0 && savedRecipes.length === 0) {
              console.log('Updating savedRecipes state');
              setSavedRecipes(parsed);
              
              // If we're on the saved tab with no visible recipes, force a filter update
              if (activeTab === 'saved' && filteredRecipes.length === 0) {
                // Force a re-filter
                setTimeout(() => {
                  // Re-trigger the filtering logic by updating a filter
                  setFilters(prev => ({...prev}));
                }, 100);
              }
            }
            
            return parsed.length > 0;
          } catch (e) {
            console.error('Error parsing savedRecipes:', e);
            return false;
          }
        } else {
          console.log('No savedRecipes in localStorage');
          return false;
        }
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return false;
    }
  };

  // Enhance the filterAndPaginateRecipes function to better handle the saved tab
  useEffect(() => {
    // Function to filter and paginate recipes
    const filterAndPaginateRecipes = () => {
      console.log(`Filtering recipes for tab: ${activeTab}`);
      console.log(`savedRecipes.length: ${savedRecipes.length}`);
      console.log(`recipes.length: ${recipes.length}`);
      
      let filtered = activeTab === 'saved' ? savedRecipes : recipes;
      
      console.log(`Initial filtered count: ${filtered.length}`);
      
      // If we're on the saved tab but don't have recipes loaded, try to reload
      if (activeTab === 'saved' && savedRecipes.length === 0) {
        console.log('No saved recipes loaded, attempting to reload from localStorage');
        const hasSavedRecipes = debugLocalStorage();
        
        if (hasSavedRecipes) {
          // We'll let the next effect run handle the update
          console.log('Found saved recipes in localStorage that were not in state');
          return;
        }
      }
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(recipe => 
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply diet type filter
      if (filters.dietType !== 'all') {
        filtered = filtered.filter(recipe => 
          recipe.diets && recipe.diets.includes(filters.dietType)
        );
      }
      
      // Apply cooking time filter
      filtered = filtered.filter(recipe => 
        recipe.readyInMinutes >= filters.cookingTime[0] && 
        recipe.readyInMinutes <= filters.cookingTime[1]
      );
      
      // Apply match percentage filter for non-saved recipes
      if (activeTab !== 'saved' && filters.matchPercentage > 0) {
        filtered = filtered.filter(recipe => 
          recipe.matchPercentage >= filters.matchPercentage
        );
      }
      
      // Important fix: if we're on saved tab and all filters resulted in zero recipes,
      // but we know there are saved recipes, reset the filters and show all saved recipes
      if (activeTab === 'saved' && filtered.length === 0 && savedRecipes.length > 0) {
        console.log('No recipes pass filters, but we have saved recipes. Showing all saved recipes.');
        filtered = savedRecipes;
        
        // Consider auto-resetting filters
        // resetFilters(); // Uncomment this if you want to auto-reset filters
      }
      
      console.log(`Final filtered count: ${filtered.length}`);
      setFilteredRecipes(filtered);
      setTotalPages(Math.ceil(filtered.length / recipesPerPage));
      
      // Ensure current page is valid
      const maxValidPage = Math.max(1, Math.ceil(filtered.length / recipesPerPage));
      if (currentPage > maxValidPage) {
        console.log(`Current page ${currentPage} exceeds max valid page ${maxValidPage}. Resetting to page 1.`);
        setCurrentPage(1);
      }
    };
    
    filterAndPaginateRecipes();
  }, [recipes, savedRecipes, searchQuery, filters, activeTab, recipesPerPage]);
  
  // Fix pagination calculation to ensure we're showing recipes correctly
  // Modify the pagination calculations to ensure we're getting the right slice of recipes
  const calculatePaginationIndexes = () => {
    // Force current page to be valid
    const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }
    
    const lastIndex = validCurrentPage * recipesPerPage;
    const firstIndex = lastIndex - recipesPerPage;
    
    // Safety checks to prevent empty arrays
    if (firstIndex >= filteredRecipes.length) {
      return [0, Math.min(recipesPerPage, filteredRecipes.length)];
    }
    
    return [firstIndex, lastIndex];
  };

  // Use the safe calculation
  const [indexOfFirstRecipe, indexOfLastRecipe] = calculatePaginationIndexes();
  // Calculate current recipes to display
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  
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

  // Open custom recipe modal
  const handleOpenCustomRecipeModal = () => {
    setCustomRecipeModalOpen(true);
  };

  // Improve the handleCustomRecipeSave function to ensure recipe is saved properly
  const handleCustomRecipeSave = (savedRecipe) => {
    console.log('Custom recipe saved:', savedRecipe);
    
    // Reload saved recipes immediately to show the newly saved recipe
    loadSavedRecipes();
    
    // Switch to the saved tab to show the newly saved recipe
    setTimeout(() => {
      handleTabChange('saved');
      // Show success message
      alert(`Recipe "${savedRecipe.title}" has been saved! You can find it in the Saved Recipes tab.`);
    }, 500);
  };

  // Enhance the handleCloseCustomRecipeModal function
  const handleCloseCustomRecipeModal = () => {
    setCustomRecipeModalOpen(false);
    
    // After closing, check if we have saved recipes and reload them
    debugLocalStorage();
    
    // If we're on the saved tab, refresh the list
    if (activeTab === 'saved') {
      loadSavedRecipes();
      // Delay to ensure state is updated
      setTimeout(() => {
        // Force a re-filter by updating a filter
        setFilters(prev => ({...prev}));
      }, 100);
    }
  };

  // Modify the refreshApiStatus function to prioritize AI-generated recipes
  const refreshApiStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import and use the checkApiLimits function
      const { checkApiLimits } = await import("../app/fetchRecipes");
      const apiStatus = await checkApiLimits();
      
      if (apiStatus.limitReached) {
        setError('Spoonacular API daily limit reached! We recommend using our AI-powered recipe generator to create custom recipes with your ingredients. It works with any ingredients you have on hand and creates delicious, unique recipes just for you.');
        
        // Load saved recipes and switch to saved tab if we have any
        loadSavedRecipes();
        
        // Force UI update to show saved recipes
        setTimeout(() => {
          if (savedRecipes.length > 0) {
            setActiveTab('saved');
            console.log(`Switched to saved tab with ${savedRecipes.length} recipes`);
          }
        }, 100);
        
        // Auto-open the custom recipe modal after a short delay
        setTimeout(() => {
          handleOpenCustomRecipeModal();
        }, 1500);
      } else {
        // API is available, fetch recipes
        handleFetchRecipes(pantryItems);
      }
    } catch (err) {
      console.error("Error checking API status:", err);
      setError("Failed to check API status. We recommend trying our AI recipe generator instead!");
      
      // Also try to show saved recipes in case of any error
      loadSavedRecipes();
    } finally {
      setLoading(false);
    }
  };

  // Add a diagnostic component for localStorage issues
  const RecipeStorageDiagnostics = () => {
    const [storageStatus, setStorageStatus] = useState({
      checked: false,
      available: false,
      savedRecipes: null,
      error: null
    });
    
    const checkStorage = () => {
      try {
        if (typeof window === 'undefined') {
          setStorageStatus(prev => ({
            ...prev,
            checked: true,
            error: 'Running in server context, localStorage not available'
          }));
          return;
        }
        
        try {
          // Test localStorage access
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          
          const savedRecipesJSON = localStorage.getItem('savedRecipes');
          let parsedRecipes = null;
          
          if (savedRecipesJSON) {
            try {
              parsedRecipes = JSON.parse(savedRecipesJSON);
              
              if (!Array.isArray(parsedRecipes)) {
                throw new Error('Saved recipes is not an array');
              }
              
              setStorageStatus({
                checked: true,
                available: true,
                savedRecipes: parsedRecipes,
                error: null
              });
            } catch (parseError) {
              setStorageStatus({
                checked: true,
                available: true,
                savedRecipes: null,
                error: `Parse error: ${parseError.message}`
              });
            }
          } else {
            setStorageStatus({
              checked: true,
              available: true,
              savedRecipes: null,
              error: 'No saved recipes found in localStorage'
            });
          }
        } catch (e) {
          setStorageStatus({
            checked: true,
            available: false,
            savedRecipes: null,
            error: `localStorage error: ${e.message}`
          });
        }
      } catch (e) {
        setStorageStatus({
          checked: true,
          error: `Unexpected error: ${e.message}`
        });
      }
    };
    
    const resetStorage = () => {
      try {
        localStorage.setItem('savedRecipes', JSON.stringify([]));
        setStorageStatus(prev => ({
          ...prev,
          savedRecipes: [],
          error: 'Storage reset successfully'
        }));
        
        // Update the app state
        setSavedRecipes([]);
        setFilteredRecipes(activeTab === 'saved' ? [] : filteredRecipes);
        
        // Show success message
        alert('Recipe storage has been reset successfully.');
      } catch (e) {
        setStorageStatus(prev => ({
          ...prev,
          error: `Reset failed: ${e.message}`
        }));
      }
    };
    
    return (
      <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>Recipe Storage Diagnostics</Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              If you're having trouble seeing your saved recipes, this tool can help diagnose and fix storage issues.
            </Typography>
            
            <Button 
              variant="outlined" 
              onClick={checkStorage}
              sx={{ mr: 1, mb: 1 }}
            >
              Check Storage
            </Button>
            
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset your saved recipes? This cannot be undone.')) {
                  resetStorage();
                }
              }}
              sx={{ mr: 1, mb: 1 }}
            >
              Reset Storage
            </Button>
            
            <Button 
              variant="contained"
              color="primary"
              onClick={() => {
                loadSavedRecipes();
                setActiveTab('saved');
                setTimeout(() => {
                  setFilters(prev => ({...prev}));
                }, 100);
              }}
              sx={{ mb: 1 }}
            >
              Reload Saved Recipes
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {storageStatus.checked && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2">Status:</Typography>
                <Typography 
                  variant="body2" 
                  color={storageStatus.available ? 'success.main' : 'error.main'}
                >
                  {storageStatus.available ? 'Available' : 'Not Available'}
                </Typography>
                
                {storageStatus.error && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Error:</Typography>
                    <Typography variant="body2" color="error.main">
                      {storageStatus.error}
                    </Typography>
                  </>
                )}
                
                {storageStatus.savedRecipes && (
                  <>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Saved Recipes: {storageStatus.savedRecipes.length}
                    </Typography>
                    {storageStatus.savedRecipes.length > 0 && (
                      <Box sx={{ maxHeight: 100, overflow: 'auto', mt: 1 }}>
                        {storageStatus.savedRecipes.map((recipe, index) => (
                          <Typography key={index} variant="caption" display="block">
                            {recipe.title || 'Untitled'} (ID: {recipe.id})
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Add a direct recipe display when console logging shows recipes but nothing renders
  useEffect(() => {
    // Debug why recipes aren't showing up
    if (activeTab === 'saved' && savedRecipes.length > 0 && filteredRecipes.length > 0 && currentRecipes.length === 0) {
      console.error("Critical rendering error: Recipes exist but aren't displaying", {
        activeTab,
        savedRecipesCount: savedRecipes.length,
        filteredRecipesCount: filteredRecipes.length,
        currentRecipesCount: currentRecipes.length,
        currentPage,
        totalPages,
        indexOfFirstRecipe,
        indexOfLastRecipe
      });
      
      // Force current page to 1 if it's invalid
      if (currentPage > totalPages || currentPage < 1) {
        setCurrentPage(1);
      }
    }
  }, [activeTab, savedRecipes.length, filteredRecipes.length, currentRecipes.length, currentPage, totalPages]);

  // Create a SafeRecipeList component that ensures recipes are rendered
  const SafeRecipeList = ({ 
    recipes, 
    savedRecipes, 
    activeTab,
    onView,
    onSave,
    onDelete
  }) => {
    if (!recipes || recipes.length === 0) {
      // If we were passed empty recipes but we know there are saved recipes and we're on saved tab
      if (activeTab === 'saved' && savedRecipes && savedRecipes.length > 0) {
        // Directly render the saved recipes as a fallback
        console.log('SafeRecipeList fallback: rendering savedRecipes directly', savedRecipes.length);
        return (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Fallback display: Showing {savedRecipes.length} saved recipes
            </Typography>
            <Grid container spacing={3}>
              {savedRecipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id || `recipe-${Math.random()}`}>
                  <RecipeCard
                    recipe={recipe}
                    onView={onView}
                    onSave={onSave}
                    onDelete={onDelete}
                    saved={true}
                    missingIngredients={[]}
                    showMatchPercentage={false}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        );
      }
      
      return (
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
            No recipes to display
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 'saved' 
              ? "You haven't saved any recipes yet."
              : "Try adjusting your filters or adding more ingredients to your pantry."}
          </Typography>
        </Paper>
      );
    }
    
    // Normal rendering path
    return (
      <Grid container spacing={3}>
        {recipes.map((recipe) => {
          // Check if this recipe is saved
          const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
          
          // Get missing ingredients array
          const missingIngredients = recipe.missedIngredients 
            ? recipe.missedIngredients.map(ingredient => ingredient.name)
            : [];
            
          return (
            <Grid item xs={12} sm={6} md={4} key={recipe.id || `recipe-${Math.random()}`}>
              <RecipeCard
                recipe={recipe}
                onView={onView}
                onSave={onSave}
                onDelete={activeTab === 'saved' ? onDelete : null}
                saved={isSaved}
                missingIngredients={missingIngredients}
                showMatchPercentage={activeTab !== 'saved'}
              />
            </Grid>
          );
        })}
      </Grid>
    );
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
              Discover delicious recipes based on what&apos;s already in your pantry.
            </Typography>
          </Box>
          
          {/* Update API info section to focus on AI recipe generation */}
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="body1" color="text.primary" fontWeight="medium">
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AutoAwesomeIcon color="secondary" />
                      AI-Powered Recipe Generator
                    </Box>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Create custom recipes with any ingredients you have on hand. All recipes are saved locally on your device.
                  </Typography>
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => {
                      loadSavedRecipes();
                      debugLocalStorage();
                      setTimeout(() => {
                        setActiveTab('saved');
                        setCurrentPage(1);
                        setFilters(prev => ({...prev}));
                      }, 100);
                    }}
                    variant="outlined"
                    startIcon={<BookmarkIcon />}
                  >
                    My Saved Recipes ({savedRecipes.length})
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={handleOpenCustomRecipeModal}
                    variant="contained"
                    startIcon={<AutoAwesomeIcon />}
                    sx={{ 
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                        '70%': { boxShadow: '0 0 0 10px rgba(156, 39, 176, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' },
                      },
                    }}
                  >
                    Create New Recipe
                  </Button>
                </Box>
              </Box>
              
              {/* Quick debug section for users who encounter issues */}
              {savedRecipes.length > 0 && activeTab === 'saved' && filteredRecipes.length === 0 && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                  <Typography variant="body2" color="error">
                    You have {savedRecipes.length} saved recipes, but they're not displaying correctly.
                  </Typography>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error" 
                    onClick={() => {
                      console.log('Emergency recipe display fix');
                      debugLocalStorage();
                      setTimeout(() => {
                        setCurrentPage(1);
                        setFilters({
                          dietType: 'all',
                          cookingTime: [0, 120],
                          matchPercentage: 0,
                          includeIngredients: [],
                          excludeIngredients: [],
                        });
                      }, 100);
                    }}
                    sx={{ mt: 1 }}
                  >
                    Fix Display Issue
                  </Button>
                </Box>
              )}
            </Paper>
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
                onClick={() => handleTabChange('all')}
                startIcon={<KitchenIcon />}
              >
                Pantry Recipes
              </Button>
              <Button
                variant={activeTab === 'saved' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handleTabChange('saved')}
                startIcon={<BookmarkIcon />}
              >
                Saved ({savedRecipes.length})
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenCustomRecipeModal}
                startIcon={<AutoAwesomeIcon />}
                sx={{ 
                  ml: { xs: 0, sm: 2 },
                  animation: error?.includes('API daily limit') ? 
                    'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(156, 39, 176, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' },
                  },
                }}
              >
                AI Recipe Generator
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
            <Box sx={{ my: 4 }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              
              <RecipeStorageDiagnostics />
              
              {error.includes('API daily limit') && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    mt: 2,
                    border: '1px dashed',
                    borderColor: 'secondary.main',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <AutoAwesomeIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Meet Your AI Recipe Chef
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      While the Spoonacular API is unavailable, our AI chef can create personalized recipes using your pantry ingredients!
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} sm={6} md={5}>
                      <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          View Saved Recipes
                        </Typography>
                        <Typography variant="body2" paragraph>
                          You can access all your saved recipes, which are stored locally on your device.
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {
                            loadSavedRecipes();
                            debugLocalStorage();
                            setTimeout(() => handleTabChange('saved'), 100);
                          }}
                          startIcon={<BookmarkIcon />}
                          sx={{ mt: 1 }}
                        >
                          My Recipes ({savedRecipes.length})
                        </Button>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={5}>
                      <Paper variant="outlined" sx={{ p: 3, height: '100%', borderColor: 'secondary.main', borderWidth: 2 }}>
                        <Typography variant="h6" gutterBottom color="secondary">
                          AI Recipe Generator
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Tell us what ingredients you have, and our AI chef will create a custom recipe with step-by-step instructions and nutritional info.
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          fullWidth
                          startIcon={<AutoAwesomeIcon />}
                          onClick={handleOpenCustomRecipeModal}
                          sx={{ 
                            mt: 1,
                            animation: 'pulse 1.5s infinite',
                            '@keyframes pulse': {
                              '0%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0.4)' },
                              '70%': { boxShadow: '0 0 0 10px rgba(156, 39, 176, 0)' },
                              '100%': { boxShadow: '0 0 0 0 rgba(156, 39, 176, 0)' },
                            }
                          }}
                        >
                          Create Recipe Now
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </Box>
          ) : filteredRecipes.length === 0 && savedRecipes.length === 0 ? (
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
                  onClick={() => handleTabChange('all')}
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
                  {activeTab === 'saved' 
                    ? `Showing saved recipes (${Math.min(filteredRecipes.length, currentRecipes.length)} of ${filteredRecipes.length})`
                    : `Showing pantry recipes (${Math.min(filteredRecipes.length, currentRecipes.length)} of ${filteredRecipes.length})`
                  }
                </Typography>
                {filteredRecipes.length > 0 && currentRecipes.length === 0 && (
                  <Button 
                    color="primary" 
                    onClick={() => {
                      setCurrentPage(1);
                      setTimeout(() => {
                        // Force re-render of filtered recipes
                        setFilters(prev => ({...prev}));
                      }, 50);
                    }}
                  >
                    Reset Page
                  </Button>
                )}
              </Box>
              
              {/* Use the SafeRecipeList component as a primary renderer */}
              <SafeRecipeList 
                recipes={currentRecipes.length > 0 ? currentRecipes : filteredRecipes.slice(0, recipesPerPage)}
                savedRecipes={savedRecipes}
                activeTab={activeTab}
                onView={handleRecipeClick}
                onSave={handleSaveRecipe}
                onDelete={handleDeleteRecipe}
              />
              
              {/* Show a message if we have filtered recipes but none are displayed due to pagination issues */}
              {filteredRecipes.length > 0 && currentRecipes.length === 0 && (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography color="error">
                    Pagination error detected. Showing {filteredRecipes.length} recipes, but none on current page.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setCurrentPage(1)} 
                    sx={{ mt: 2 }}
                  >
                    Go to First Page
                  </Button>
                </Box>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={totalPages} 
                    page={Math.min(currentPage, totalPages)} // Ensure we never show an invalid page
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
          handleClose={handleRecipeModalClose}
          recipe={selectedRecipe}
          savedRecipes={savedRecipes}
          onTryCustomRecipe={handleOpenCustomRecipeModal}
          onSaveRecipe={handleSaveRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
        
        <CustomRecipeModal
          open={customRecipeModalOpen}
          handleClose={handleCloseCustomRecipeModal}
          pantryItems={pantryItems}
          handleCustomRecipeSave={handleCustomRecipeSave}
        />
      </Box>
    </ThemeProvider>
  );
};

export default RecipesPage; 