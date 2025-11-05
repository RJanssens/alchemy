import { IngredientState } from './ingredient.model';
import { RecipeDiscovery } from './recipe.model';
import { Quest } from './quest.model';
import { AchievementState } from './achievement.model';
import { Equipment, Monster } from './adventure.model';

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
  // Adventure stats
  level: number;
  xp: number;
  xpToNextLevel: number;
  health: number;
  maxHealth: number;
  baseAttack: number;
  baseDefense: number;
  equippedWeapon: string | null; // equipment ID
  equippedArmor: string | null;
  equippedAccessory: string | null;
}

export interface AdventureState {
  isActive: boolean;
  currentMonster: Monster | null;
  combatLog: string[];
  equipmentInventory: string[]; // array of equipment IDs
  monsterDefeated: number;
  totalDistance: number;
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
  adventure: AdventureState;
  stats: GameStats;
  lastSaveTime: number;
}
