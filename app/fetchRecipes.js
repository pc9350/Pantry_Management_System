import axios from 'axios';

const SPOONACULAR_API_KEY = 'fdc4893c7fc74c5d9ed47e683564aa9c';

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
