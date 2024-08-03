import axios from 'axios';


export const fetchRecipes = async (ingredients) => {
  const ingredientString = ingredients.join(',');
  const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
    params: {
      ingredients: ingredientString,
      number: 5,  // Number of recipes to return
      apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
    }
  });

  const recipeIds = response.data.map(recipe => recipe.id);
  const detailedRecipes = await Promise.all(
    recipeIds.map(id =>
      axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
        }
      })
    )
  );

  return detailedRecipes.map(res => res.data);
};
