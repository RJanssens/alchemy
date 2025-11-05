import { Injectable } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { Achievement } from '../models/achievement.model';
import { WitchRank } from '../models/game-state.model';
import { Equipment, Monster, MonsterTemplate } from '../models/adventure.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private ingredients: Ingredient[] = [];
  private recipes: Recipe[] = [];
  private achievements: Achievement[] = [];
  private witchRanks: WitchRank[] = [];
  private equipment: Equipment[] = [];
  private monsterTemplates: MonsterTemplate[] = [];

  private loaded = false;

  async loadAllData(): Promise<void> {
    if (this.loaded) return;

    try {
      const [
        ingredientsData,
        recipesData,
        achievementsData,
        witchRanksData,
        equipmentData,
        monstersData
      ] = await Promise.all([
        fetch('/assets/data/ingredients.json').then(r => r.json()),
        fetch('/assets/data/recipes.json').then(r => r.json()),
        fetch('/assets/data/achievements.json').then(r => r.json()),
        fetch('/assets/data/witch-ranks.json').then(r => r.json()),
        fetch('/assets/data/equipment.json').then(r => r.json()),
        fetch('/assets/data/monsters.json').then(r => r.json())
      ]);

      this.ingredients = ingredientsData;
      this.recipes = recipesData.map((r: any) => ({
        ...r,
        discovered: false
      }));
      this.achievements = achievementsData;
      this.witchRanks = witchRanksData;
      this.equipment = equipmentData;
      this.monsterTemplates = monstersData;

      this.loaded = true;
    } catch (error) {
      console.error('Failed to load game data:', error);
      throw error;
    }
  }

  getIngredients(): Ingredient[] {
    return this.ingredients;
  }

  getIngredient(id: string): Ingredient | undefined {
    return this.ingredients.find(i => i.id === id);
  }

  getRecipes(): Recipe[] {
    return this.recipes;
  }

  getRecipe(id: string): Recipe | undefined {
    return this.recipes.find(r => r.id === id);
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.find(a => a.id === id);
  }

  getWitchRanks(): WitchRank[] {
    return this.witchRanks;
  }

  getEquipment(): Equipment[] {
    return this.equipment;
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find(e => e.id === id);
  }

  getEquipmentByRarity(rarity: string): Equipment[] {
    return this.equipment.filter(e => e.rarity === rarity);
  }

  getMonsterTemplates(): MonsterTemplate[] {
    return this.monsterTemplates;
  }

  getMonsterTemplate(id: string): MonsterTemplate | undefined {
    return this.monsterTemplates.find(m => m.id === id);
  }

  getMonsterTemplateByLevel(level: number): MonsterTemplate | undefined {
    return this.monsterTemplates.find(m => m.level === level);
  }

  createMonsterFromTemplate(template: MonsterTemplate): Monster {
    return {
      ...template,
      health: template.baseHealth,
      maxHealth: template.baseHealth
    };
  }

  getRandomMonster(minLevel: number = 1, maxLevel: number = 15): Monster | null {
    const validTemplates = this.monsterTemplates.filter(
      m => m.level >= minLevel && m.level <= maxLevel
    );

    if (validTemplates.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * validTemplates.length);
    return this.createMonsterFromTemplate(validTemplates[randomIndex]);
  }

  getRandomEquipmentDrop(): Equipment | null {
    // Weight drops by rarity
    const rarityWeights = {
      common: 50,
      uncommon: 25,
      rare: 15,
      epic: 8,
      legendary: 2
    };

    const totalWeight = Object.values(rarityWeights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    let selectedRarity: string = 'common';
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      random -= weight;
      if (random <= 0) {
        selectedRarity = rarity;
        break;
      }
    }

    const equipmentOfRarity = this.getEquipmentByRarity(selectedRarity);
    if (equipmentOfRarity.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * equipmentOfRarity.length);
    return equipmentOfRarity[randomIndex];
  }
}
