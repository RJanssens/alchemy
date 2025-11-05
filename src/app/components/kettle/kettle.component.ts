import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { RecipeService } from '../../services/recipe.service';
import { GameState, KettleSlot } from '../../models/game-state.model';
import { INGREDIENTS } from '../../data/ingredients.data';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-kettle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kettle.component.html',
  styleUrls: ['./kettle.component.css']
})
export class KettleComponent implements OnInit {
  gameState: GameState | null = null;
  dragOverSlotIndex: number | null = null;
  resultMessage = '';
  suggestedIngredient: Ingredient | null = null;

  constructor(
    private gameStateService: GameStateService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
      this.updateSuggestion();
    });
  }

  get kettleSlots(): KettleSlot[] {
    return this.gameState?.kettle.slots || [];
  }

  get canMix(): boolean {
    if (!this.gameState) return false;
    if (this.gameState.kettle.isMixing) return false;

    const hasIngredients = this.kettleSlots.some(slot => slot.ingredientId !== null);
    return hasIngredients;
  }

  get mixProgress(): number {
    return this.gameState?.kettle.mixProgress || 0;
  }

  get isMixing(): boolean {
    return this.gameState?.kettle.isMixing || false;
  }

  getIngredient(ingredientId: string | null): Ingredient | null {
    if (!ingredientId) return null;
    return INGREDIENTS.find(i => i.id === ingredientId) || null;
  }

  onDragOver(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    this.dragOverSlotIndex = slotIndex;
  }

  onDragLeave(): void {
    this.dragOverSlotIndex = null;
  }

  onDrop(event: DragEvent, slotIndex: number): void {
    event.preventDefault();
    this.dragOverSlotIndex = null;

    const ingredientId = event.dataTransfer?.getData('ingredientId');
    if (!ingredientId || !this.gameState) return;

    // Check if ingredient is available
    const ingredientState = this.gameState.ingredients[ingredientId];
    if (!ingredientState || ingredientState.count <= 0) return;

    // Check if slot is empty
    if (this.kettleSlots[slotIndex].ingredientId !== null) return;

    // Add to kettle and remove from inventory
    this.gameStateService.updateState(state => {
      state.kettle.slots[slotIndex].ingredientId = ingredientId;
      state.ingredients[ingredientId].count--;
    });

    this.updateSuggestion();
  }

  removeFromKettle(slotIndex: number): void {
    const slot = this.kettleSlots[slotIndex];
    if (!slot.ingredientId) return;

    const ingredientId = slot.ingredientId;

    this.gameStateService.updateState(state => {
      // Return to inventory if space available
      const ingredientState = state.ingredients[ingredientId];
      if (ingredientState.count < ingredientState.maxStorage) {
        ingredientState.count++;
      }

      // Clear slot
      state.kettle.slots[slotIndex].ingredientId = null;
    });

    this.updateSuggestion();
  }

  startMixing(): void {
    if (!this.canMix || !this.gameState) return;

    const ingredients = this.kettleSlots
      .map(slot => slot.ingredientId)
      .filter(id => id !== null) as string[];

    const result = this.recipeService.startMixing(ingredients);
    this.resultMessage = result.message;

    if (!result.success) {
      // Clear message after 3 seconds
      setTimeout(() => {
        this.resultMessage = '';
      }, 3000);
    } else {
      this.resultMessage = '';
    }

    this.updateSuggestion();
  }

  consultFamiliar(): void {
    if (!this.gameState) return;

    const cost = this.getFamiliarConsultationCost();
    const totalXp = this.gameStateService.getTotalXP();

    if (totalXp < cost) {
      this.resultMessage = 'Not enough total XP to consult familiar!';
      setTimeout(() => (this.resultMessage = ''), 3000);
      return;
    }

    const ingredients = this.kettleSlots
      .map(slot => slot.ingredientId)
      .filter(id => id !== null) as string[];

    const suggestion = this.recipeService.getSuggestedIngredient(ingredients);

    if (suggestion) {
      this.suggestedIngredient = this.getIngredient(suggestion);
      this.gameStateService.updateState(state => {
        state.familiar.lastConsultationTime = Date.now();
        state.familiar.consultationCount++;
      });

      setTimeout(() => {
        this.suggestedIngredient = null;
      }, 5000);
    } else {
      this.resultMessage = 'Your familiar has no suggestions for these ingredients.';
      setTimeout(() => (this.resultMessage = ''), 3000);
    }
  }

  getFamiliarConsultationCost(): number {
    if (!this.gameState) return 0;

    const lastConsultation = this.gameState.familiar.lastConsultationTime;
    const now = Date.now();
    const timeSinceConsultation = now - lastConsultation;
    const thirtyMinutes = 30 * 60 * 1000;

    if (timeSinceConsultation >= thirtyMinutes) {
      return 0;
    }

    const totalXp = this.gameStateService.getTotalXP();
    const percentageRemaining = 1 - timeSinceConsultation / thirtyMinutes;
    return Math.floor(totalXp * percentageRemaining);
  }

  expandKettle(): void {
    if (!this.gameState) return;

    const cost = this.getKettleExpansionCost();
    if (this.gameState.xp.compound < cost) {
      this.resultMessage = 'Not enough Compound XP!';
      setTimeout(() => (this.resultMessage = ''), 3000);
      return;
    }

    if (this.gameState.kettle.maxSlots >= 6) {
      this.resultMessage = 'Kettle is already at maximum size!';
      setTimeout(() => (this.resultMessage = ''), 3000);
      return;
    }

    this.gameStateService.expandKettle(cost);
    this.resultMessage = 'Kettle expanded!';
    setTimeout(() => (this.resultMessage = ''), 3000);
  }

  getKettleExpansionCost(): number {
    if (!this.gameState) return 0;
    const currentSlots = this.gameState.kettle.maxSlots;
    return Math.pow(2, currentSlots) * 10; // 40, 80, 160, 320, ...
  }

  private updateSuggestion(): void {
    // Update suggestion when kettle changes
    if (this.suggestedIngredient) {
      const ingredients = this.kettleSlots
        .map(slot => slot.ingredientId)
        .filter(id => id !== null) as string[];

      const suggestion = this.recipeService.getSuggestedIngredient(ingredients);
      if (!suggestion) {
        this.suggestedIngredient = null;
      }
    }
  }
}
