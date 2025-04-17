import axios from 'axios';

/**
 * Spoonacular API has the following limits on the free plan:
 * - 150 points per day
 * - Rate limit of 10 requests per minute
 * 
 * The findByIngredients endpoint costs ~0.01 points per result
 * The recipe information endpoint costs ~0.1 points per recipe
 * 
 * When limits are reached, consider using the AI recipe generator as an alternative.
 */

// Check if we've hit the Spoonacular API limits
export const checkApiLimits = async () => {
  try {
    // Make a small test request
    const response = await axios.get(`https://api.spoonacular.com/recipes/random`, {
      params: {
        number: 1,
        apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY,
      }
    });
    
    // Get the headers that Spoonacular returns with quota info
    const quotaUsed = response.headers['x-api-quota-used'];
    const quotaLeft = response.headers['x-api-quota-left'];
    const requestsRemaining = response.headers['x-ratelimit-requests-remaining'] || 'unknown';
    const requestsLimit = response.headers['x-ratelimit-requests-limit'] || 'unknown';
    const dailyRequestsLeft = response.headers['x-ratelimit-tinyrequests-remaining'] || 'unknown';
    const resultsLeft = response.headers['x-ratelimit-results-remaining'] || 'unknown';
    
    // Get timestamp for reset time
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const resetTime = tomorrow.toISOString();

    return {
      limitReached: false,
      quotaUsed: quotaUsed || '0',
      quotaLeft: quotaLeft || 'unknown',
      requestsRemaining: requestsRemaining,
      requestsLimit: requestsLimit,
      dailyRequestsLeft: dailyRequestsLeft,
      resultsLeft: resultsLeft,
      resetTime: resetTime,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    // If we get a 402 Payment Required or 429 Too Many Requests, we've hit the limit
    if (err.response && (err.response.status === 402 || err.response.status === 429)) {
      // Get reset time (next midnight UTC)
      const currentDate = new Date();
      const tomorrow = new Date(currentDate);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const resetTime = tomorrow.toISOString();
      
      return {
        limitReached: true,
        error: err.response.data.message || 'API limit reached',
        resetTime: resetTime,
        timestamp: new Date().toISOString(),
      };
    }
    
    // For other errors, we're not sure
    return { 
      limitReached: false, 
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
};

export const fetchRecipes = async (ingredients) => {
  const ingredientString = ingredients.join(',');
  const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
    params: {
      ingredients: ingredientString,
      number: 6,  // Number of recipes to return
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
