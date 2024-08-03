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
} from '@mui/material';
import Image from 'next/image';

const RecipeModal = ({ open, handleClose, recipe }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      {recipe && (
        <>
          <DialogTitle>{recipe.title}</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" mb={2}>
              <Image src={recipe.image} alt={recipe.title} width={500} height={300} style={{ width: '50%', height: 'auto' }} />
            </Box>
            <DialogContentText component="div">
              <Typography variant="h6">Ingredients</Typography>
              <Box component="div">
                <ul>
                  {recipe.extendedIngredients.map(ingredient => (
                    <li key={ingredient.id}>{ingredient.original}</li>
                  ))}
                </ul>
              </Box>
              <Typography variant="h6">Instructions</Typography>
              <Box component="div">
                <ol>
                  {recipe.analyzedInstructions[0]?.steps.map(step => (
                    <li key={step.number}>{step.step}</li>
                  ))}
                </ol>
              </Box>
              <Typography variant="body1">
                <strong>Servings:</strong> {recipe.servings}
              </Typography>
              <Typography variant="body1">
                <strong>Ready in:</strong> {recipe.readyInMinutes} minutes
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default RecipeModal;
