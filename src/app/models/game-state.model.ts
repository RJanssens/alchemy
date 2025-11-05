import { IngredientState } from './ingredient.model';
import { RecipeDiscovery } from './recipe.model';
import { Quest } from './quest.model';
import { AchievementState } from './achievement.model';

export interface WitchRank {
  name: string;
  icon: string;
  minXp: number;
}

export interface ExperiencePoints {
  fire: number;
  water: number;
  earth: number;
  air: number;
  compound: number;
}

export interface KettleSlot {
  ingredientId: string | null;
}

export interface KettleState {
  slots: KettleSlot[];
  maxSlots: number;
  isMixing: boolean;
  mixProgress: number;
  mixStartTime: number;
  mixDuration: number;
}

export interface FamiliarState {
  lastConsultationTime: number;
  consultationCount: number;
}

export interface GameStats {
  totalSuccessfulMixes: number;
  totalFailedMixes: number;
  totalEnhancementsPurchased: number;
  totalCastCount: number;
  gameStartTime: number;
}

export interface GameState {
  version: number;
  ingredients: { [key: string]: IngredientState };
  xp: ExperiencePoints;
  gold: number;
  kettle: KettleState;
  recipes: { [key: string]: boolean }; // recipeId -> discovered
  recipeHistory: RecipeDiscovery[];
  activeQuest: Quest | null;
  questRefreshTime: number;
  achievements: { [key: string]: AchievementState };
  familiar: FamiliarState;
  stats: GameStats;
  lastSaveTime: number;
}
