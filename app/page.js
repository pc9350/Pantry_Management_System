"use client";
import { useState, useEffect } from "react";
import { db } from "./firebase";
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
  Grid,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditItemModal from "./EditItemModal";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { fetchRecipes } from "./fetchRecipes";
import RecipeModal from "./RecipeModal";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
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
    // vertical padding + font size from searchIcon
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

const CardContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  height: "100%",
  overflow: "hidden",
  paddingBottom: "16px",
});

const TruncatedTypography = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2, // Show only 2 lines
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
  height: "500px", // Adjust the height as needed
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
  border: "1px solid #ddd",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)",
  },
}));


const CardFooter = styled("div")({
  marginTop: "auto",
  paddingTop: "8px",
});

const GridContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // Three columns
  gridTemplateRows: "repeat(2, auto)", // Two rows
  gridAutoRows: "auto",
  gap: "25px", // Space between cards
  alignItems: "center",
});

const GridItem = styled("div")(({ position }) => ({
  gridColumn: "span 1",
}));

const TruncatedListItem = styled("li")({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1, // Adjust the number of lines to show here
  WebkitBoxOrient: "vertical",
  listStyleType: "disc",
});

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
    const deletePromises = itemsCollection.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    fetchItems();
  };

  useEffect(() => {
    clearPantry();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMoreRecipes = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const displayedRecipes = recipes.slice(0, currentPage * recipesPerPage);

  return (
    <Box sx={{ flexGrow: 1}}>
    <AppBar position="static" sx={{ m: 0, p: 0, width: "100%" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <KitchenIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pantry Management System
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4}}>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4" gutterBottom>
              Welcome to Your Pantry
            </Typography>
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              onClick={() => handleClickOpen(null)}
            >
              <AddIcon /> Add Item
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="pantry items table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.category}</TableCell>
                    <TableCell align="right">{item.unit}</TableCell>
                    <TableCell align="right">
                      <EditIcon
                        sx={{ marginRight: "10px" }}
                        onClick={() => handleClickOpen(item)}
                        style={{ cursor: "pointer" }}
                      />
                      <DeleteIcon
                        onClick={() => deleteItem(item.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleFetchRecipes}
              size="medium"
            >
              Suggest Recipes
            </Button>
          </Box>
        </Stack>
      </Container>
      <Container sx={{ marginTop: 4, marginBottom: 4 }}>
  <GridContainer>
    {displayedRecipes.map((recipe, index) => (
      <GridItem key={recipe.id}>
        <CardContainer onClick={() => handleRecipeClick(recipe)}>
          <CardContent>
            <Box>
              <TruncatedTypography variant="h6">{recipe.title}</TruncatedTypography>
              <CardMedia
                component="img"
                image={recipe.image}
                alt={recipe.title}
                style={{ width: '100%', height: 'auto' }}
              />
            </Box>
            <Box>
              <IngredientsTypography variant="body1">
                <strong>Ingredients:</strong>
              </IngredientsTypography>
              <ul>
                {recipe.extendedIngredients.slice(0, 3).map((ingredient, idx) => (
                  <li key={`${ingredient.id}-${idx}`}>{ingredient.original}</li>
                ))}
                {recipe.extendedIngredients.length > 3 && <li>...</li>}
              </ul>
            </Box>
            {/* <CardFooter>
              <Button variant="contained" color="primary" onClick={() => handleRecipeClick(recipe)}>
                View Details
              </Button>
            </CardFooter> */}
          </CardContent>
        </CardContainer>
      </GridItem>
    ))}
  </GridContainer>
  {displayedRecipes.length < recipes.length && (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      <Button variant="outlined" color="secondary" onClick={loadMoreRecipes}>
        Load More
      </Button>
    </Box>
  )}
</Container>

      <RecipeModal
        open={recipeModalOpen}
        handleClose={handleRecipeModalClose}
        recipe={selectedRecipe}
      />
      <EditItemModal
        open={open}
        handleClose={handleClose}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        handleSave={handleSave}
        predefinedCategories={predefinedCategories}
        predefinedUnits={predefinedUnits}
      />
    </Box>
  );
}
