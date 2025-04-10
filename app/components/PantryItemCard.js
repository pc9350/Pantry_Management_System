import React from 'react';
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

// Category icons mapping
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
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const CategoryBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: 16,
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[2],
  fontSize: '1.5rem',
  zIndex: 1,
}));

const PantryItemCard = ({ 
  item, 
  onDelete, 
  onEdit,
  onAddToShoppingList,
  onFindRecipes,
  onUseItem
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
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
  let progressColor = 'success.main';
  if (expiryProgress > 70) progressColor = 'error.main';
  else if (expiryProgress > 40) progressColor = 'warning.main';

  const categoryIcon = categoryIcons[item.category] || categoryIcons.Unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <StyledCard>
        <CategoryBadge>
          <span role="img" aria-label={item.category}>
            {categoryIcon}
          </span>
        </CategoryBadge>
        
        {isNew && (
          <Chip
            icon={<NewReleasesIcon />}
            label="New"
            size="small"
            color="secondary"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
            }}
          />
        )}
        
        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
              {item.name}
            </Typography>
            <IconButton
              aria-label="options"
              size="small"
              onClick={handleClick}
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
            <Typography variant="body1" fontWeight="medium">
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
                color: 'primary.main'
              }}
            />
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 0.5 }}>
              Freshness Indicator
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={100 - expiryProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 1,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  bgcolor: progressColor,
                }
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'right', 
                mt: 0.5,
                color: expiryProgress > 70 ? 'error.main' : 'text.secondary'
              }}
            >
              {expiryProgress > 70 ? 'Use soon!' : expiryProgress > 40 ? 'Fresh' : 'Very fresh'}
            </Typography>
          </Box>
        </CardContent>
        
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Tooltip title="Edit item">
            <IconButton size="small" onClick={onEdit} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete item">
            <IconButton size="small" onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </StyledCard>
      
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

export default PantryItemCard; 