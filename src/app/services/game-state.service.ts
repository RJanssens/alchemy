import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { GameState, ExperiencePoints, KettleState } from '../models/game-state.model';
import { IngredientState, Ingredient } from '../models/ingredient.model';
import { Quest } from '../models/quest.model';
import { AchievementState } from '../models/achievement.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly SAVE_KEY = 'alchemist-game-save';
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  private gameState$: BehaviorSubject<GameState>;

  constructor(private dataService: DataService) {
    this.gameState$ = new BehaviorSubject<GameState>(this.loadGame() || this.createNewGame());

    // Auto-save every 30 seconds
    interval(this.AUTO_SAVE_INTERVAL).subscribe(() => {
      this.saveGame();
    });

    // Update timers every 250ms (reduced frequency to prevent UI flickering)
    interval(250).subscribe(() => {
      this.updateTimers();
    });
  }

  getState(): Observable<GameState> {
    return this.gameState$.asObservable();
  }

  getCurrentState(): GameState {
    return this.gameState$.value;
  }

  updateState(updater: (state: GameState) => void): void {
    const currentState = this.gameState$.value;
    updater(currentState);
    this.gameState$.next({ ...currentState });
  }

  private createNewGame(): GameState {
    const ingredients: { [key: string]: IngredientState } = {};

    // Initialize all ingredients
    this.dataService.getIngredients().forEach(ingredient => {
      ingredients[ingredient.id] = {
        ingredientId: ingredient.id,
        count: 0,
        maxStorage: ingredient.isBase ? 20 : 10,
        discovered: ingredient.isBase,
        conjurationProgress: 0,
        isConjuring: false,
        conjurationStartTime: 0,
        autoConjureEnabled: false,
        lastAutoConjureTime: 0,
        storageLevel: 0,
        speedLevel: 0,
        successRateLevel: 0,
        autoConjureSpeedLevel: 0,
        autoConjureUnlocked: false
      };
    });

    const achievements: { [key: string]: AchievementState } = {};
    this.dataService.getAchievements().forEach(achievement => {
      achievements[achievement.id] = {
        achievementId: achievement.id,
        unlocked: false,
        progress: 0
      };
    });

    const recipes: { [key: string]: boolean } = {};
    this.dataService.getRecipes().forEach(recipe => {
      recipes[recipe.id] = false;
    });

    return {
      version: 1,
      ingredients,
      xp: {
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        compound: 0
      },
      gold: 0,
      kettle: {
        slots: [{ ingredientId: null }, { ingredientId: null }],
        maxSlots: 2,
        isMixing: false,
        mixProgress: 0,
        mixStartTime: 0,
        mixDuration: 0
      },
      recipes,
      recipeHistory: [],
      activeQuest: null,
      questRefreshTime: Date.now(),
      achievements,
      familiar: {
        lastConsultationTime: 0,
        consultationCount: 0,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        health: 50,
        maxHealth: 50,
        baseAttack: 10,
        baseDefense: 5,
        equippedWeapon: null,
        equippedArmor: null,
        equippedAccessory: null
      },
      adventure: {
        isActive: false,
        currentMonster: null,
        combatLog: [],
        equipmentInventory: [],
        monsterDefeated: 0,
        totalDistance: 0
      },
      stats: {
        totalSuccessfulMixes: 0,
        totalFailedMixes: 0,
        totalEnhancementsPurchased: 0,
        totalCastCount: 0,
        gameStartTime: Date.now()
      },
      lastSaveTime: Date.now()
    };
  }

  private updateTimers(): void {
    const state = this.getCurrentState();
    let hasUpdates = false;

    // Update conjuration progress
    Object.keys(state.ingredients).forEach(ingredientId => {
      const ingredientState = state.ingredients[ingredientId];
      const ingredient = this.dataService.getIngredient(ingredientId);

      if (ingredient && ingredientState.isConjuring) {
        const elapsed = Date.now() - ingredientState.conjurationStartTime;
        const duration = this.getConjurationTime(ingredient, ingredientState);
        const progress = Math.min((elapsed / duration) * 100, 100);

        if (progress >= 100) {
          // Conjuration complete
          this.completeConjuration(ingredientId);
          hasUpdates = true;
        } else {
          // Only update if progress changed by at least 1%
          const progressDiff = Math.abs(ingredientState.conjurationProgress - progress);
          if (progressDiff >= 1) {
            ingredientState.conjurationProgress = Math.floor(progress);
            hasUpdates = true;
          }
        }
      }
    });

    // Update mixing progress
    if (state.kettle.isMixing) {
      const elapsed = Date.now() - state.kettle.mixStartTime;
      const progress = Math.min((elapsed / state.kettle.mixDuration) * 100, 100);

      if (progress >= 100) {
        // Mixing complete
        this.completeMixing();
        hasUpdates = true;
      } else {
        // Only update if progress changed by at least 1%
        const progressDiff = Math.abs(state.kettle.mixProgress - progress);
        if (progressDiff >= 1) {
          state.kettle.mixProgress = Math.floor(progress);
          hasUpdates = true;
        }
      }
    }

    // Update quest timer
    if (state.activeQuest && !state.activeQuest.isCompleted) {
      const now = Date.now();
      if (now >= state.activeQuest.expiryTime) {
        // Quest expired
        state.activeQuest = null;
        state.questRefreshTime = now;
        hasUpdates = true;
      }
    }

    if (hasUpdates) {
      this.gameState$.next({ ...state });
    }
  }

  private completeConjuration(ingredientId: string): void {
    this.updateState(state => {
      const ingredientState = state.ingredients[ingredientId];
      if (ingredientState.count < ingredientState.maxStorage) {
        ingredientState.count++;
      }
      ingredientState.isConjuring = false;
      ingredientState.conjurationProgress = 0;

      // Award XP
      const ingredient = this.dataService.getIngredient(ingredientId);
      if (ingredient) {
        this.addXP(state, ingredient.elementType, ingredient.baseXpValue);
      }
    });
  }

  private completeMixing(): void {
    // This is called from RecipeService
  }

  private getConjurationTime(ingredient: Ingredient, state: IngredientState): number {
    let time = ingredient.baseMixTime;
    // Apply speed upgrades (5% per level)
    time *= Math.pow(0.95, state.speedLevel);
    // Apply achievement bonuses
    // TODO: Apply achievement bonuses
    return time;
  }

  private addXP(state: GameState, elementType: string, amount: number): void {
    if (elementType in state.xp) {
      (state.xp as any)[elementType] += amount;
    }
  }

  getTotalXP(): number {
    const xp = this.getCurrentState().xp;
    return xp.fire + xp.water + xp.earth + xp.air + xp.compound;
  }

  saveGame(): void {
    const state = this.getCurrentState();
    state.lastSaveTime = Date.now();
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(state));
  }

  loadGame(): GameState | null {
    const saved = localStorage.getItem(this.SAVE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load save game', e);
        return null;
      }
    }
    return null;
  }

  resetGame(): void {
    localStorage.removeItem(this.SAVE_KEY);
    this.gameState$.next(this.createNewGame());
  }

  // Ingredient operations
  startConjuration(ingredientId: string): void {
    this.updateState(state => {
      const ingredientState = state.ingredients[ingredientId];
      if (!ingredientState.isConjuring && ingredientState.count < ingredientState.maxStorage) {
        ingredientState.isConjuring = true;
        ingredientState.conjurationStartTime = Date.now();
        ingredientState.conjurationProgress = 0;
      }
    });
  }

  addIngredient(ingredientId: string, amount: number = 1): void {
    this.updateState(state => {
      const ingredientState = state.ingredients[ingredientId];
      ingredientState.count = Math.min(ingredientState.count + amount, ingredientState.maxStorage);

      // Discover ingredient
      if (!ingredientState.discovered) {
        ingredientState.discovered = true;
      }
    });
  }

  removeIngredient(ingredientId: string, amount: number = 1): boolean {
    const state = this.getCurrentState();
    const ingredientState = state.ingredients[ingredientId];

    if (ingredientState.count >= amount) {
      this.updateState(s => {
        s.ingredients[ingredientId].count -= amount;
      });
      return true;
    }
    return false;
  }

  addXPToState(elementType: string, amount: number): void {
    this.updateState(state => {
      this.addXP(state, elementType, amount);
    });
  }

  addGold(amount: number): void {
    this.updateState(state => {
      state.gold += amount;
    });
  }

  spendGold(amount: number): boolean {
    const state = this.getCurrentState();
    if (state.gold >= amount) {
      this.updateState(s => {
        s.gold -= amount;
      });
      return true;
    }
    return false;
  }

  purchaseEnhancement(ingredientId: string, enhancementType: string, cost: number): boolean {
    const state = this.getCurrentState();
    if (state.xp.compound >= cost) {
      this.updateState(s => {
        s.xp.compound -= cost;
        const ingredientState = s.ingredients[ingredientId];

        switch (enhancementType) {
          case 'storage':
            ingredientState.storageLevel++;
            ingredientState.maxStorage += 5;
            break;
          case 'speed':
            ingredientState.speedLevel++;
            break;
          case 'successRate':
            ingredientState.successRateLevel++;
            break;
          case 'autoConjureSpeed':
            ingredientState.autoConjureSpeedLevel++;
            break;
          case 'autoConjureUnlock':
            ingredientState.autoConjureUnlocked = true;
            break;
        }

        s.stats.totalEnhancementsPurchased++;
      });
      return true;
    }
    return false;
  }

  expandKettle(cost: number): boolean {
    const state = this.getCurrentState();
    if (state.xp.compound >= cost && state.kettle.maxSlots < 6) {
      this.updateState(s => {
        s.xp.compound -= cost;
        s.kettle.maxSlots++;
        s.kettle.slots.push({ ingredientId: null });
      });
      return true;
    }
    return false;
  }
}
