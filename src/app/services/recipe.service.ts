import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Recipe, RecipeDiscovery } from '../models/recipe.model';
import { Ingredient } from '../models/ingredient.model';
import { RECIPES } from '../data/recipes.data';
import { INGREDIENTS } from '../data/ingredients.data';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private gameState: GameStateService) {}

  findMatchingRecipe(kettleIngredients: string[]): Recipe | null {
    // Create a map of ingredient counts in kettle
    const kettleMap = new Map<string, number>();
    kettleIngredients.forEach(id => {
      if (id) {
        kettleMap.set(id, (kettleMap.get(id) || 0) + 1);
      }
    });

    // Find matching recipe
    for (const recipe of RECIPES) {
      const recipeMap = new Map<string, number>();
      recipe.requiredIngredients.forEach(req => {
        recipeMap.set(req.ingredientId, req.amount);
      });

      // Check if maps match exactly
      if (this.mapsEqual(kettleMap, recipeMap)) {
        return recipe;
      }
    }

    return null;
  }

  private mapsEqual(map1: Map<string, number>, map2: Map<string, number>): boolean {
    if (map1.size !== map2.size) return false;

    for (const [key, value] of map1) {
      if (map2.get(key) !== value) return false;
    }

    return true;
  }

  startMixing(kettleIngredients: string[]): { success: boolean; message: string } {
    const state = this.gameState.getCurrentState();

    if (state.kettle.isMixing) {
      return { success: false, message: 'Already mixing!' };
    }

    const recipe = this.findMatchingRecipe(kettleIngredients);

    if (!recipe) {
      // No recipe found - instant failure with consolation XP
      this.handleFailedMix(kettleIngredients, null);
      return { success: false, message: 'No recipe found! Ingredients lost, but gained consolation XP.' };
    }

    // Recipe found - start mixing
    const resultIngredient = INGREDIENTS.find(i => i.id === recipe.resultIngredientId);
    if (!resultIngredient) {
      return { success: false, message: 'Invalid recipe!' };
    }

    // Calculate mixing time
    const ingredientState = state.ingredients[recipe.resultIngredientId];
    let mixTime = resultIngredient.baseMixTime;

    // Apply speed bonuses
    if (ingredientState) {
      mixTime *= Math.pow(0.95, ingredientState.speedLevel);
    }

    this.gameState.updateState(s => {
      s.kettle.isMixing = true;
      s.kettle.mixStartTime = Date.now();
      s.kettle.mixDuration = mixTime;
      s.kettle.mixProgress = 0;
    });

    // Schedule completion
    setTimeout(() => {
      this.completeMixing(recipe, resultIngredient!);
    }, mixTime);

    return { success: true, message: `Mixing ${resultIngredient.name}...` };
  }

  private completeMixing(recipe: Recipe, resultIngredient: Ingredient): void {
    const state = this.gameState.getCurrentState();

    // Calculate success chance
    const ingredientState = state.ingredients[recipe.resultIngredientId];
    let successChance = resultIngredient.baseSuccessRate;

    if (ingredientState) {
      successChance += ingredientState.successRateLevel * 2; // +2% per level
    }

    // TODO: Apply achievement bonuses

    // Roll for success
    const roll = Math.random() * 100;
    const success = roll <= successChance;

    // Clear kettle
    const usedIngredients = [...state.kettle.slots.map(s => s.ingredientId).filter(id => id !== null)] as string[];

    this.gameState.updateState(s => {
      s.kettle.isMixing = false;
      s.kettle.mixProgress = 0;
      s.kettle.slots.forEach(slot => (slot.ingredientId = null));
    });

    if (success) {
      this.handleSuccessfulMix(recipe, resultIngredient);
    } else {
      this.handleFailedMix(usedIngredients, recipe);
    }
  }

  private handleSuccessfulMix(recipe: Recipe, resultIngredient: Ingredient): void {
    this.gameState.updateState(state => {
      // Add result ingredient
      const ingredientState = state.ingredients[recipe.resultIngredientId];
      if (ingredientState.count < ingredientState.maxStorage) {
        ingredientState.count++;
      }

      // Discover ingredient and recipe
      ingredientState.discovered = true;
      state.recipes[recipe.id] = true;

      // Award XP
      state.xp.compound += resultIngredient.baseXpValue;

      // Update stats
      state.stats.totalSuccessfulMixes++;

      // Update/create recipe history
      let discovery = state.recipeHistory.find(d => d.recipeId === recipe.id);
      if (!discovery) {
        discovery = {
          recipeId: recipe.id,
          ingredientId: resultIngredient.id,
          ingredientName: resultIngredient.name,
          formula: recipe.requiredIngredients.map(req => {
            const ing = INGREDIENTS.find(i => i.id === req.ingredientId);
            return ing?.icon || '?';
          }),
          discoveryDate: new Date(),
          successfulCreations: 0,
          failedAttempts: 0,
          totalAttempts: 0
        };
        state.recipeHistory.unshift(discovery);
      }

      discovery.successfulCreations++;
      discovery.totalAttempts++;

      // Update quest progress
      if (state.activeQuest && state.activeQuest.targetIngredientId === resultIngredient.id) {
        state.activeQuest.currentAmount++;

        if (state.activeQuest.currentAmount >= state.activeQuest.targetAmount) {
          // Quest completed!
          state.xp.compound += state.activeQuest.xpReward;
          state.activeQuest.isCompleted = true;
          state.activeQuest = null;
          state.questRefreshTime = Date.now();
        }
      }
    });
  }

  private handleFailedMix(usedIngredients: string[], recipe: Recipe | null): void {
    this.gameState.updateState(state => {
      // Award consolation XP (1 XP per ingredient)
      state.xp.compound += usedIngredients.length;

      // Update stats
      state.stats.totalFailedMixes++;

      // Update recipe history if recipe exists
      if (recipe) {
        let discovery = state.recipeHistory.find(d => d.recipeId === recipe.id);
        if (discovery) {
          discovery.failedAttempts++;
          discovery.totalAttempts++;
        }
      }
    });
  }

  getSuggestedIngredient(kettleIngredients: string[]): string | null {
    // Find recipes that could be completed with one more ingredient
    const kettleMap = new Map<string, number>();
    kettleIngredients.filter(id => id !== null).forEach(id => {
      kettleMap.set(id!, (kettleMap.get(id!) || 0) + 1);
    });

    for (const recipe of RECIPES) {
      const recipeMap = new Map<string, number>();
      recipe.requiredIngredients.forEach(req => {
        recipeMap.set(req.ingredientId, req.amount);
      });

      // Check if kettle ingredients are a subset of recipe
      let missing: string | null = null;
      let matches = 0;

      for (const [ingredientId, amount] of recipeMap) {
        const kettleAmount = kettleMap.get(ingredientId) || 0;
        if (kettleAmount < amount) {
          if (missing === null && kettleAmount === amount - 1) {
            missing = ingredientId;
            matches++;
          } else {
            missing = null;
            break;
          }
        } else if (kettleAmount === amount) {
          matches++;
        } else {
          missing = null;
          break;
        }
      }

      if (missing && matches === recipeMap.size) {
        return missing;
      }
    }

    return null;
  }

  getUndiscoveredRecipesForIngredient(ingredientId: string): number {
    const state = this.gameState.getCurrentState();
    let count = 0;

    RECIPES.forEach(recipe => {
      if (!state.recipes[recipe.id]) {
        const hasIngredient = recipe.requiredIngredients.some(req => req.ingredientId === ingredientId);
        if (hasIngredient) {
          count++;
        }
      }
    });

    return count;
  }
}
