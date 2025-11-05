export interface Recipe {
  id: string;
  resultIngredientId: string;
  requiredIngredients: { ingredientId: string; amount: number }[];
  discovered: boolean;
}

export interface RecipeDiscovery {
  recipeId: string;
  ingredientId: string;
  ingredientName: string;
  formula: string[];
  discoveryDate: Date;
  successfulCreations: number;
  failedAttempts: number;
  totalAttempts: number;
}
