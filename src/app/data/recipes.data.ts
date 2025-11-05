import { Recipe } from '../models/recipe.model';

export const RECIPES: Recipe[] = [
  // Tier 1 - Two base elements
  {
    id: 'recipe-steam',
    resultIngredientId: 'steam',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'water', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-lava',
    resultIngredientId: 'lava',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'earth', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-smoke',
    resultIngredientId: 'smoke',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'air', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-mud',
    resultIngredientId: 'mud',
    requiredIngredients: [
      { ingredientId: 'water', amount: 1 },
      { ingredientId: 'earth', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-dust',
    resultIngredientId: 'dust',
    requiredIngredients: [
      { ingredientId: 'earth', amount: 1 },
      { ingredientId: 'air', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-mist',
    resultIngredientId: 'mist',
    requiredIngredients: [
      { ingredientId: 'water', amount: 1 },
      { ingredientId: 'air', amount: 1 }
    ],
    discovered: false
  },

  // Tier 2 - Three ingredients
  {
    id: 'recipe-clay',
    resultIngredientId: 'clay',
    requiredIngredients: [
      { ingredientId: 'mud', amount: 1 },
      { ingredientId: 'air', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-obsidian',
    resultIngredientId: 'obsidian',
    requiredIngredients: [
      { ingredientId: 'lava', amount: 1 },
      { ingredientId: 'water', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-rain',
    resultIngredientId: 'rain',
    requiredIngredients: [
      { ingredientId: 'mist', amount: 1 },
      { ingredientId: 'water', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-ash',
    resultIngredientId: 'ash',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'dust', amount: 1 }
    ],
    discovered: false
  },

  // Tier 3 - Complex combinations
  {
    id: 'recipe-lightning',
    resultIngredientId: 'lightning',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'air', amount: 1 },
      { ingredientId: 'water', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-crystal',
    resultIngredientId: 'crystal',
    requiredIngredients: [
      { ingredientId: 'earth', amount: 2 },
      { ingredientId: 'water', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-life',
    resultIngredientId: 'life',
    requiredIngredients: [
      { ingredientId: 'fire', amount: 1 },
      { ingredientId: 'water', amount: 1 },
      { ingredientId: 'earth', amount: 1 },
      { ingredientId: 'air', amount: 1 }
    ],
    discovered: false
  },
  {
    id: 'recipe-void',
    resultIngredientId: 'void',
    requiredIngredients: [
      { ingredientId: 'ash', amount: 2 },
      { ingredientId: 'obsidian', amount: 1 }
    ],
    discovered: false
  },

  // Legendary
  {
    id: 'recipe-philosophers-stone',
    resultIngredientId: 'philosophers-stone',
    requiredIngredients: [
      { ingredientId: 'life', amount: 1 },
      { ingredientId: 'crystal', amount: 1 },
      { ingredientId: 'lightning', amount: 1 }
    ],
    discovered: false
  }
];
