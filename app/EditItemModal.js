// components/EditItemModal.js
import React, {useState} from "react";
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
} from "@mui/material";

const EditItemModal = ({
  open,
  handleClose,
  editingItem,
  setEditingItem,
  handleSave,
  predefinedCategories,
  predefinedUnits,
}) => {
    const handleCategoryChange = (event) => {
        setEditingItem({ ...editingItem, category: event.target.value });
    };

    const handleUnitChange = (event) => {
        setEditingItem({ ...editingItem, unit: event.target.value });
      };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editingItem?.id ? "Edit Item" : "Add Item"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {editingItem?.id
            ? "Edit the details of the item."
            : "Add a new item to the pantry."}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={editingItem?.name || ""}
          onChange={(e) =>
            setEditingItem({ ...editingItem, name: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={editingItem?.quantity || ""}
          onChange={(e) =>
            setEditingItem({ ...editingItem, quantity: e.target.value })
          }
        />
        <FormControl fullWidth margin="dense">
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
        <FormControl fullWidth margin="dense">
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemModal;
