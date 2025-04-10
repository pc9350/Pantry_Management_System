"use client";
import React, { useState, useEffect } from "react";
import { db } from "../app/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  InputBase,
  CardMedia,
  Menu,
  MenuItem,
  Modal,
  Chip,
  Divider,
  Fab,
  Tooltip,
  Avatar,
  Grid,
  ListItemIcon,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import { styled, alpha, useTheme, useMediaQuery } from "@mui/material";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditItemModal from "../app/EditItemModal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { fetchRecipes } from "../app/fetchRecipes";
import RecipeModal from "../app/RecipeModal";
import { useRouter } from "next/navigation";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { v4 as uuidv4 } from "uuid";

// Import lightweight design components instead of 3D
import PantryAnalytics from "../app/components/PantryAnalytics";
import FoodPatternBackground from "../app/components/design/FoodPatternBackground";
import FoodGradientBackground from "../app/components/design/FoodGradientBackground";

// Styled components with enhanced visuals
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  backdropFilter: "blur(10px)",
  marginLeft: 0,
  width: "100%",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const TruncatedTypography = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  fontWeight: "bold",
  fontSize: "1.2rem",
});

const IngredientsTypography = styled(Typography)({
  fontSize: "0.9rem",
  margin: "8px 0",
});

const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius * 2,
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  },
  [theme.breakpoints.down("sm")]: {
    height: "auto",
  },
}));

const MainContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  marginTop: -100,
  paddingTop: 0,
  paddingBottom: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginBottom: theme.spacing(4),
  fontWeight: 800,
  "&:after": {
    content: '""',
    position: "absolute",
    width: "60%",
    height: "4px",
    bottom: "-8px",
    left: "0",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
  zIndex: 1000,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  padding: "10px 24px",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const GridContainer = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "30px",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
}));

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (index) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      delay: index * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

// Simplified PantryItemCard component to replace PantryItemCard3D
const PantryItemCard = ({ 
  item, 
  onDelete, 
  onEdit,
  onAddToShoppingList,
  onFindRecipes,
  onUseItem
}) => {
  const categoryEmojis = {
    'Fruit': '🍎',
    'Vegetable': '🥦',
    'Dairy': '🧀',
    'Meat': '🥩',
    'Grain': '🌾',
    'Snack': '🍿',
    'Flour': '🌾',
    'Seeds': '🌱',
    'Spices': '🌶️',
    'Beverages': '🥤',
    'Canned Goods': '🥫',
    'Condiments': '🧂',
    'Frozen': '❄️',
    'Baking Supplies': '🧁',
    'Nuts': '🥜',
    'Oils': '🫒',
    'Pasta': '🍝',
    'Rice': '🍚',
    'Sauces': '🥫',
    'Seafood': '🐟',
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCategoryEmoji = (category) => {
    return categoryEmojis[category] || '🍽️';
  };

  return (
    <Card 
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: '50%',
            fontSize: '2rem',
            mr: 2,
            background: 'rgba(76, 175, 80, 0.1)',
          }}
        >
          {getCategoryEmoji(item.category)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.category}
          </Typography>
        </Box>
        <IconButton 
          aria-label="item-menu" 
          onClick={handleClick}
          size="small"
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { handleClose(); onEdit(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); onAddToShoppingList(); }}>
            <ListItemIcon>
              <ShoppingCartIcon fontSize="small" />
            </ListItemIcon>
            Add to Shopping List
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); onFindRecipes(); }}>
            <ListItemIcon>
              <RestaurantIcon fontSize="small" />
            </ListItemIcon>
            Find Recipes
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); onUseItem(); }}>
            <ListItemIcon>
              <LocalDiningIcon fontSize="small" />
            </ListItemIcon>
            Mark As Used
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleClose(); onDelete(); }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Typography variant="body1" fontWeight="medium">
            {item.quantity} {item.unit}
          </Typography>
          {item.expiryProgress && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 50,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(0, 0, 0, 0.1)',
                  mr: 1,
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    width: `${item.expiryProgress}%`,
                    bgcolor: item.expiryProgress > 70 
                      ? 'error.main' 
                      : item.expiryProgress > 30 
                      ? 'warning.main' 
                      : 'success.main',
                  }}
                />
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<EditIcon />} 
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          startIcon={<RestaurantIcon />} 
          onClick={onFindRecipes}
          color="primary"
        >
          Recipes
        </Button>
      </CardActions>
    </Card>
  );
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const predefinedCategories = [
    "Fruit",
    "Vegetable",
    "Dairy",
    "Meat",
    "Grain",
    "Snack",
    "Flour",
    "Seeds",
    "Spices",
    "Beverages",
    "Canned Goods",
    "Condiments",
    "Frozen",
    "Baking Supplies",
    "Nuts",
    "Oils",
    "Pasta",
    "Rice",
    "Sauces",
    "Seafood",
  ];

  const predefinedUnits = ["kg", "lb", "piece", "cup", "g", "ml", "l"];

  const fetchItems = async () => {
    const itemsCollectionRef = collection(db, "items");
    const itemsCollection = await getDocs(itemsCollectionRef);
    setItems(
      itemsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
    fetchItems();
  };

  const handleClickOpen = (item) => {
    setEditingItem(item || { name: "", quantity: "", category: "", unit: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (editingItem.id) {
      const itemDoc = doc(db, "items", editingItem.id);
      await updateDoc(itemDoc, {
        name: editingItem.name,
        quantity: editingItem.quantity,
        category: editingItem.category,
        unit: editingItem.unit,
      });
    } else {
      await addDoc(collection(db, "items"), {
        name: editingItem.name,
        quantity: editingItem.quantity,
        category: editingItem.category,
        unit: editingItem.unit,
      });
    }
    fetchItems();
    handleClose();
  };

  const handleFetchRecipes = async () => {
    const ingredientList = items.map((item) => item.name);
    const fetchedRecipes = await fetchRecipes(ingredientList);
    setRecipes(fetchedRecipes);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalOpen(true);
  };

  const handleRecipeModalClose = () => {
    setRecipeModalOpen(false);
    setSelectedRecipe(null);
  };

  const clearPantry = async () => {
    const itemsCollectionRef = collection(db, "items");
    const itemsCollection = await getDocs(itemsCollectionRef);
    itemsCollection.docs.forEach(async (document) => {
      await deleteDoc(doc(db, "items", document.id));
    });
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current recipes
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const loadMoreRecipes = () => {
    handleFetchRecipes();
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSearchModalOpen = () => {
    setSearchQuery("");
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsSearchModalOpen(false);
  };

  const handleRefresh = () => {
    fetchItems();
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const handleAddToShoppingList = (item) => {
    // This would be implemented to add items to a shopping list
    console.log("Added to shopping list:", item);
  };

  const handleFindRecipes = (item) => {
    // Find recipes with this ingredient
    console.log("Finding recipes with:", item);
    handleFetchRecipes();
  };

  const handleUseItem = (item) => {
    // Mark item as used
    console.log("Used item:", item);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", pb: 10 }}>
      {/* Ambient background with gradient */}
      <FoodGradientBackground theme="fresh" animate={false} opacity={0.4} />
      
      {/* Hero section with stunning visuals */}
      <Box 
        sx={{ 
          height: '60vh',
          background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0 0 30px 30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          marginBottom: 8
        }}
      >
        {/* Food pattern background with emojis */}
        <FoodPatternBackground category="mixed" density={20} opacity={0.3} />
        
        {/* Hero content */}
        <Box
          sx={{ 
            zIndex: 1, 
            textAlign: 'center', 
            padding: '0 20px',
            position: 'relative'
          }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              color: 'white', 
              fontWeight: 800,
              fontSize: { xs: '3rem', md: '4.5rem' },
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              mb: 2
            }}
          >
            PantryPal
          </Typography>
          
          <Typography 
            variant="h5"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              fontWeight: 400
            }}
          >
            Smart inventory for your kitchen. Reduce waste and discover delicious recipes.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <ActionButton
              variant="contained"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.dark',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
              }}
              startIcon={<AddIcon />}
              onClick={() => handleClickOpen()}
            >
              Add Food Item
            </ActionButton>
            
            <ActionButton
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255, 255, 255, 0.1)' 
                }
              }}
              startIcon={<MenuBookIcon />}
              onClick={handleFetchRecipes}
            >
              Find Recipes
            </ActionButton>
          </Box>
        </Box>
        
        {/* Food category icons in a row at the bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 4 },
            px: 2,
            zIndex: 2
          }}
        >
          {[
            { category: 'fruit', emoji: '🍎', label: 'Fruits' },
            { category: 'vegetable', emoji: '🥦', label: 'Vegetables' },
            { category: 'dairy', emoji: '🧀', label: 'Dairy' },
            { category: 'grain', emoji: '🌾', label: 'Grains' },
            { category: 'meat', emoji: '🥩', label: 'Meat' }
          ].map((item, index) => (
            <Box
              key={item.category}
              sx={{ 
                opacity: 1,
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease, opacity 0.3s ease'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  component="span" 
                  sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
                >
                  {item.emoji}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 'medium',
                    mt: 0.5,
                    fontSize: { xs: '0.7rem', md: '0.8rem' }
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      
      <MainContainer maxWidth="xl" sx={{ marginTop: { xs: 4, md: 0 } }}>
        {/* Main Actions Bar */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 5, 
              borderRadius: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                My Pantry
              </Typography>
              <Chip 
                label={`${items.length} items`} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search items…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Search>
              
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Item
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="primary"
                startIcon={<AddAPhotoIcon />}
                onClick={() => router.push("/ImageCapture")}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Scan Items
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="secondary"
                startIcon={<AnalyticsIcon />}
                onClick={toggleAnalytics}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </ActionButton>
            </Box>
          </Paper>
        </Box>
        
        {/* Analytics Dashboard */}
        {showAnalytics && (
          <Box sx={{ mb: 5, animation: 'fadeIn 0.5s ease-in-out' }}>
            <PantryAnalytics items={items} />
          </Box>
        )}
        
        {/* Pantry Items Grid */}
        <Box sx={{ mb: 6 }}>
          <SectionTitle variant="h4" component="h2">
            Your Food Inventory
          </SectionTitle>
          
          {filteredItems.length > 0 ? (
            <GridContainer>
              {filteredItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{ 
                    height: '100%',
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${index * 0.05}s`
                  }}
                >
                  <PantryItemCard
                    item={{
                      ...item,
                      expiryProgress: Math.random() * 100, // Just for demo
                    }}
                    onDelete={() => deleteItem(item.id)}
                    onEdit={() => handleClickOpen(item)}
                    onAddToShoppingList={() => handleAddToShoppingList(item)}
                    onFindRecipes={() => handleFindRecipes(item)}
                    onUseItem={() => handleUseItem(item)}
                    delay={index}
                  />
                </Box>
              ))}
            </GridContainer>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 4
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No items in your pantry yet
              </Typography>
              <ActionButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
                sx={{ mt: 2 }}
              >
                Add Your First Item
              </ActionButton>
            </Box>
          )}
        </Box>
        
        {/* Recipe Suggestions */}
        {recipes.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <SectionTitle variant="h4" component="h2">
              Recipe Suggestions
            </SectionTitle>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3
            }}>
              {currentRecipes.map((recipe, index) => (
                <Box
                  key={recipe.id}
                  sx={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    transitionDelay: `${index * 0.1}s`
                  }}
                >
                  <CardContainer>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={recipe.image}
                        alt={recipe.title}
                        sx={{ borderRadius: 2 }}
                      />
                      <Chip
                        label={`${recipe.missedIngredientCount > 0 ? 
                          `${Math.round(100 * (recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount)))}% match` : 
                          'Perfect match'}`}
                        color={recipe.missedIngredientCount > 2 ? "warning" : "success"}
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <TruncatedTypography variant="h6">
                        {recipe.title}
                      </TruncatedTypography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                        <RestaurantIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {recipe.readyInMinutes || 30} min • {recipe.servings || 4} servings
                        </Typography>
                      </Box>
                      
                      {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Missing ingredients:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {recipe.missedIngredients.map((ingredient, idx) => (
                              <Chip
                                key={idx}
                                label={ingredient.name}
                                size="small"
                                color="error"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleRecipeClick(recipe)}
                          size="small"
                          sx={{ borderRadius: 2 }}
                        >
                          View Recipe
                        </Button>
                      </Box>
                    </Box>
                  </CardContainer>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <ActionButton
                variant="outlined"
                color="secondary"
                startIcon={<MenuBookIcon />}
                onClick={() => router.push("/recipes")}
              >
                Explore All Recipes
              </ActionButton>
            </Box>
          </Box>
        )}
        
        {/* Quick Actions Floating Button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 4,
            right: 4,
            zIndex: 1000,
            animation: 'fadeIn 1s ease'
          }}
        >
          <StyledFab 
            color="primary" 
            aria-label="quick actions"
            onClick={handleMenu}
          >
            <AddIcon />
          </StyledFab>
        </Box>
      </MainContainer>
      
      {/* Quick Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 200,
            overflow: 'visible',
            mt: -1,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: -5,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <MenuItem onClick={() => {
          handleCloseMenu();
          handleClickOpen();
        }}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add New Item
        </MenuItem>
        <MenuItem onClick={() => {
          handleCloseMenu();
          router.push("/ImageCapture");
        }}>
          <ListItemIcon>
            <AddAPhotoIcon fontSize="small" />
          </ListItemIcon>
          Scan Food Items
        </MenuItem>
        <MenuItem onClick={() => {
          handleCloseMenu();
          handleFetchRecipes();
        }}>
          <ListItemIcon>
            <MenuBookIcon fontSize="small" />
          </ListItemIcon>
          Find Recipes
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleCloseMenu();
          toggleAnalytics();
        }}>
          <ListItemIcon>
            <AnalyticsIcon fontSize="small" />
          </ListItemIcon>
          {showAnalytics ? "Hide Analytics" : "Show Analytics"}
        </MenuItem>
        <MenuItem onClick={() => {
          handleCloseMenu();
          router.push("/food-3d");
        }}>
          <ListItemIcon>
            <LocalDiningIcon fontSize="small" />
          </ListItemIcon>
          3D Food Explorer
        </MenuItem>
      </Menu>
      
      {/* Modals */}
      <EditItemModal
        open={open}
        handleClose={handleClose}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleSave={handleSave}
        predefinedCategories={predefinedCategories}
        predefinedUnits={predefinedUnits}
      />
      
      <RecipeModal
        open={recipeModalOpen}
        handleClose={handleRecipeModalClose}
        recipe={selectedRecipe}
      />
      
      <Modal
        open={isSearchModalOpen}
        onClose={handleSearchModalClose}
        aria-labelledby="search-modal-title"
        aria-describedby="search-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="search-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Search Pantry Items
          </Typography>
          <Search sx={{ mb: 2, width: '100%' }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Enter item name or category..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              fullWidth
            />
          </Search>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button onClick={resetSearch}>Clear</Button>
            <Button 
              variant="contained" 
              onClick={handleSearchModalClose}
              color="primary"
            >
              Search
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
