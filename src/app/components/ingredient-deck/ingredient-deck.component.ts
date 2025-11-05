import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { RecipeService } from '../../services/recipe.service';
import { DataService } from '../../services/data.service';
import { GameState, KettleSlot } from '../../models/game-state.model';
import { Ingredient, IngredientState } from '../../models/ingredient.model';

interface IngredientDisplay {
  ingredient: Ingredient;
  state: IngredientState;
  progress: number; // Local progress calculation
}

@Component({
  selector: 'app-ingredient-deck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-deck.component.html',
  styleUrls: ['./ingredient-deck.component.css']
})
export class IngredientDeckComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  viewMode: 'full' | 'collapsed' = 'full';
  expandedIngredients = new Set<string>();
  private localTimer: any;

  constructor(
    private gameStateService: GameStateService,
    private recipeService: RecipeService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
    });

    // Local timer for progress bars only (doesn't update global state)
    this.localTimer = setInterval(() => {
      // This forces Angular to check for changes in the template
      // but doesn't emit new state
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.localTimer) {
      clearInterval(this.localTimer);
    }
  }

  get visibleIngredients(): IngredientDisplay[] {
    if (!this.gameState) return [];

    return this.dataService.getIngredients()
      .filter(ingredient => {
        const state = this.gameState!.ingredients[ingredient.id];
        // Show base ingredients always, or discovered/in-inventory compounds
        return ingredient.isBase || state.discovered || state.count > 0;
      })
      .map(ingredient => {
        const state = this.gameState!.ingredients[ingredient.id];
        return {
          ingredient,
          state,
          progress: this.calculateProgress(state)
        };
      });
  }

  private calculateProgress(state: IngredientState): number {
    if (!state.isConjuring || state.conjurationDuration === 0) return 0;

    const elapsed = Date.now() - state.conjurationStartTime;
    const progress = Math.min((elapsed / state.conjurationDuration) * 100, 100);
    return progress;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'full' ? 'collapsed' : 'full';
  }

  toggleEnhancements(ingredientId: string): void {
    if (this.expandedIngredients.has(ingredientId)) {
      this.expandedIngredients.delete(ingredientId);
    } else {
      this.expandedIngredients.add(ingredientId);
    }
  }

  isExpanded(ingredientId: string): boolean {
    return this.expandedIngredients.has(ingredientId);
  }

  startConjuration(ingredientId: string): void {
    const state = this.gameState?.ingredients[ingredientId];
    if (!state || state.isConjuring || state.count >= state.maxStorage) return;

    this.gameStateService.startConjuration(ingredientId);
  }

  onDragStart(event: DragEvent, ingredientId: string): void {
    event.dataTransfer?.setData('ingredientId', ingredientId);
  }

  castForXP(ingredient: Ingredient): void {
    if (!this.gameState) return;

    const state = this.gameState.ingredients[ingredient.id];
    if (state.count <= 0) return;

    const confirmed = confirm(`Cast ${ingredient.name} for ${ingredient.baseXpValue * 2} XP?`);
    if (!confirmed) return;

    this.gameStateService.updateState(s => {
      s.ingredients[ingredient.id].count--;
      s.xp.compound += ingredient.baseXpValue * 2;
      s.stats.totalCastCount++;
    });
  }

  toggleAutoConjure(ingredientId: string): void {
    this.gameStateService.updateState(state => {
      const ingredientState = state.ingredients[ingredientId];
      ingredientState.autoConjureEnabled = !ingredientState.autoConjureEnabled;
    });
  }

  purchaseEnhancement(
    ingredientId: string,
    enhancementType: 'storage' | 'speed' | 'successRate' | 'autoConjureSpeed' | 'autoConjureUnlock'
  ): void {
    const cost = this.getEnhancementCost(ingredientId, enhancementType);
    const success = this.gameStateService.purchaseEnhancement(ingredientId, enhancementType, cost);

    if (!success) {
      alert('Not enough Compound XP!');
    }
  }

  getEnhancementCost(ingredientId: string, type: string): number {
    if (!this.gameState) return 0;

    const state = this.gameState.ingredients[ingredientId];
    let level = 0;

    switch (type) {
      case 'storage':
        level = state.storageLevel;
        return Math.floor(10 * Math.pow(1.5, level));
      case 'speed':
        level = state.speedLevel;
        return Math.floor(15 * Math.pow(1.5, level));
      case 'successRate':
        level = state.successRateLevel;
        return Math.floor(20 * Math.pow(1.5, level));
      case 'autoConjureSpeed':
        level = state.autoConjureSpeedLevel;
        return Math.floor(25 * Math.pow(1.5, level));
      case 'autoConjureUnlock':
        return 50;
      default:
        return 0;
    }
  }

  hasUndiscoveredRecipes(ingredientId: string): boolean {
    return this.recipeService.getUndiscoveredRecipesForIngredient(ingredientId) > 0;
  }

  getElementClass(elementType: string): string {
    return `element-${elementType}`;
  }
}
