export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  icon: string;
  attack: number;
  defense: number;
  value: number; // gold value
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Monster {
  id: string;
  name: string;
  icon: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
  equipmentDropChance: number; // 0-100
}

export interface FamiliarStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  health: number;
  maxHealth: number;
  baseAttack: number;
  baseDefense: number;
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    accessory: Equipment | null;
  };
}

export interface AdventureState {
  isActive: boolean;
  currentDistance: number; // in pixels or units
  currentMonster: Monster | null;
  combatLog: string[];
  familiar: FamiliarStats;
  inventory: Equipment[];
  autoAdventureEnabled: boolean;
}

export interface CombatResult {
  victory: boolean;
  xpGained: number;
  goldGained: number;
  equipmentDropped: Equipment | null;
  damageDealt: number;
  damageTaken: number;
}
