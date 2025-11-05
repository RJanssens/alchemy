export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'compound';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  elementType: ElementType;
  isBase: boolean;
  icon: string;
  baseXpValue: number;
  baseMixTime: number; // in milliseconds
  baseSuccessRate: number; // 0-100
}

export interface IngredientState {
  ingredientId: string;
  count: number;
  maxStorage: number;
  discovered: boolean;
  conjurationProgress: number; // 0-100
  isConjuring: boolean;
  conjurationStartTime: number;
  autoConjureEnabled: boolean;
  lastAutoConjureTime: number;

  // Enhancements
  storageLevel: number;
  speedLevel: number;
  successRateLevel: number;
  autoConjureSpeedLevel: number;
  autoConjureUnlocked: boolean;
}

export interface Enhancement {
  type: 'storage' | 'speed' | 'successRate' | 'autoConjureSpeed' | 'autoConjureUnlock';
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effectPerLevel: number;
  maxLevel?: number;
}
