export interface Quest {
  id: string;
  targetIngredientId: string;
  targetIngredientName: string;
  targetAmount: number;
  currentAmount: number;
  duration: number; // in milliseconds
  startTime: number;
  expiryTime: number;
  xpReward: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface QuestOffer {
  targetIngredientId: string;
  targetIngredientName: string;
  targetAmount: number;
  duration: number;
  xpReward: number;
}
