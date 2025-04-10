import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExportIcon from '@mui/icons-material/IosShare';
import { motion } from 'framer-motion';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const CategoryChip = styled(Chip)(({ theme, category }) => {
  // Different colors for different categories
  const categoryColors = {
    Produce: theme.palette.success.main,
    Dairy: theme.palette.info.main,
    Meat: theme.palette.error.main,
    Bakery: theme.palette.warning.main,
    Pantry: theme.palette.primary.main,
    Frozen: '#9c27b0',
    Other: theme.palette.grey[600],
  };

  return {
    backgroundColor: `${categoryColors[category] || categoryColors.Other}15`,
    color: categoryColors[category] || categoryColors.Other,
    fontWeight: 500,
    borderRadius: 4,
  };
});

const MotionListItem = motion(ListItem);

const ShoppingList = ({ 
  initialItems = [], 
  onAddItem, 
  onRemoveItem, 
  onToggleItem,
  onExport
}) => {
  const [items, setItems] = useState(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Pantry');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('piece');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const categories = ['Produce', 'Dairy', 'Meat', 'Bakery', 'Pantry', 'Frozen', 'Other'];
  const units = ['kg', 'g', 'lb', 'piece', 'cup', 'tbsp', 'tsp', 'can', 'bottle', 'box'];

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        category: newItemCategory,
        quantity: newItemQuantity || '1',
        unit: newItemUnit,
        checked: false,
      };
      
      setItems([...items, newItem]);
      
      if (onAddItem) {
        onAddItem(newItem);
      }
      
      // Reset form
      setNewItemName('');
      setNewItemQuantity('');
      handleCloseDialog();
    }
  };

  const handleToggleItem = (id) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(updatedItems);
    
    if (onToggleItem) {
      const toggledItem = items.find(item => item.id === id);
      onToggleItem({ ...toggledItem, checked: !toggledItem.checked });
    }
  };

  const handleRemoveItem = (id) => {
    const filteredItems = items.filter(item => item.id !== id);
    setItems(filteredItems);
    
    if (onRemoveItem) {
      onRemoveItem(id);
    }
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <StyledPaper elevation={0}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="h2" fontWeight="medium">
            Shopping List
          </Typography>
          <Chip 
            label={items.length} 
            size="small" 
            sx={{ ml: 1, fontWeight: 'bold' }} 
            color="primary"
          />
        </Box>
        <Box>
          <Tooltip title="Export list">
            <IconButton onClick={onExport} color="primary" size="small">
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add item">
            <IconButton onClick={handleOpenDialog} color="primary">
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
        {Object.keys(itemsByCategory).length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Your shopping list is empty. Add items to get started!
            </Typography>
          </Box>
        ) : (
          Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <Box key={category}>
              <Box sx={{ px: 2, py: 1, backgroundColor: 'background.default' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                  {category}
                </Typography>
              </Box>
              <List dense>
                {categoryItems.map((item, index) => (
                  <MotionListItem
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                      borderBottom: index < categoryItems.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      opacity: item.checked ? 0.6 : 1,
                      textDecoration: item.checked ? 'line-through' : 'none',
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.checked}
                        onChange={() => handleToggleItem(item.id)}
                        color="primary"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={`${item.quantity} ${item.unit}`}
                      primaryTypographyProps={{
                        fontWeight: item.checked ? 'normal' : 'medium',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </MotionListItem>
                ))}
              </List>
            </Box>
          ))
        )}
      </Box>
      
      <Divider />
      
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpenDialog}
        >
          Add Item
        </Button>
      </Box>
      
      {/* Add Item Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Add Shopping Item</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Item Name"
              fullWidth
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                margin="dense"
                label="Quantity"
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                sx={{ width: '40%' }}
              />
              
              <FormControl sx={{ width: '60%' }}>
                <InputLabel id="unit-select-label">Unit</InputLabel>
                <Select
                  labelId="unit-select-label"
                  value={newItemUnit}
                  label="Unit"
                  onChange={(e) => setNewItemUnit(e.target.value)}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={newItemCategory}
                label="Category"
                onChange={(e) => setNewItemCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryChip 
                        label={category} 
                        size="small" 
                        category={category}
                        sx={{ mr: 1 }}
                      />
                      {category}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained" 
            color="primary"
            disabled={!newItemName.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default ShoppingList; 