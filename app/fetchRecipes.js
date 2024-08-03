import axios from 'axios';

const SPOONACULAR_API_KEY = 'YOUR_API_KEY';

export const fetchRecipes = async (ingredients) => {
  const ingredientString = ingredients.join(',');
  const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
    params: {
      ingredients: ingredientString,
      number: 10,  // Number of recipes to return
      apiKey: SPOONACULAR_API_KEY
    }
  });

  const recipeIds = response.data.map(recipe => recipe.id);
  const detailedRecipes = await Promise.all(
    recipeIds.map(id =>
      axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY
        }
      })
    )
  );

  return detailedRecipes.map(res => res.data);
};
