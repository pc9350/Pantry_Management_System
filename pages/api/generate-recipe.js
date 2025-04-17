import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const { ingredients, preferences, difficulty, mealType } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of ingredients.' });
    }

    if (!configuration.apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is not configured.' });
    }

    const ingredientsList = ingredients.join(', ');
    const preferencesText = preferences ? `Dietary preferences: ${preferences}. ` : '';
    const difficultyText = difficulty ? `Difficulty level: ${difficulty}. ` : 'Moderate difficulty. ';
    const mealTypeText = mealType ? `Meal type: ${mealType}. ` : '';

    const prompt = `Create a detailed recipe using some or all of these ingredients: ${ingredientsList}. 
${preferencesText}${difficultyText}${mealTypeText}
The recipe should include:
1. A creative name for the dish
2. Cooking time and servings
3. A list of all ingredients with measurements
4. Clear step-by-step cooking instructions
5. Nutritional information (approximate calories and macros)
6. Suggestions for variations or substitutions

Format the response as JSON with the following structure:
{
  "title": "",
  "cookingTime": "",
  "servings": "",
  "difficulty": "",
  "ingredients": ["", "", ...],
  "instructions": ["", "", ...],
  "nutritionalInfo": {
    "calories": "",
    "protein": "",
    "carbs": "",
    "fat": ""
  },
  "variations": ["", "", ...]
}`;

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    let recipe;
    try {
      recipe = JSON.parse(completion.data.choices[0].text.trim());
      
      // Validate required fields and provide defaults if missing
      const validatedRecipe = {
        title: recipe.title || `Recipe with ${ingredients.join(', ')}`,
        cookingTime: recipe.cookingTime || '30 minutes',
        servings: recipe.servings || '4',
        difficulty: recipe.difficulty || difficulty || 'Moderate',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        nutritionalInfo: {
          calories: (recipe.nutritionalInfo && recipe.nutritionalInfo.calories) || 'N/A',
          protein: (recipe.nutritionalInfo && recipe.nutritionalInfo.protein) || 'N/A',
          carbs: (recipe.nutritionalInfo && recipe.nutritionalInfo.carbs) || 'N/A',
          fat: (recipe.nutritionalInfo && recipe.nutritionalInfo.fat) || 'N/A',
        },
        variations: Array.isArray(recipe.variations) ? recipe.variations : [],
      };
      
      return res.status(200).json(validatedRecipe);
    } catch (parseError) {
      console.error('Error parsing recipe JSON:', parseError);
      
      // If JSON parsing fails, create a simplified default recipe
      const defaultRecipe = {
        title: `Custom Recipe with ${ingredients[0]}`,
        cookingTime: '30 minutes',
        servings: '4',
        difficulty: difficulty || 'Moderate',
        ingredients: ingredients.map(ing => `${ing}`),
        instructions: ['Combine all ingredients', 'Cook as desired'],
        nutritionalInfo: {
          calories: 'N/A (unable to calculate)',
          protein: 'N/A',
          carbs: 'N/A',
          fat: 'N/A'
        },
        variations: [`Try adding different spices to enhance flavor`],
        rawText: completion.data.choices[0].text.trim(),
        parseError: "Could not parse response as JSON"
      };
      
      return res.status(200).json(defaultRecipe);
    }
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return res.status(error.response.status).json({
        error: error.response.data.error.message || 'Error calling OpenAI API'
      });
    } else {
      return res.status(500).json({
        error: 'An error occurred during recipe generation'
      });
    }
  }
} 