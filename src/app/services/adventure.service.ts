import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { DataService } from './data.service';
import { Equipment, Monster, CombatResult } from '../models/adventure.model';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {
  constructor(
    private gameState: GameStateService,
    private dataService: DataService
  ) {}

  startAdventure(): void {
    const state = this.gameState.getCurrentState();

    if (state.adventure.isActive) return;

    // Reset familiar health
    this.gameState.updateState(s => {
      s.familiar.health = s.familiar.maxHealth;
      s.adventure.isActive = true;
      s.adventure.combatLog = ['🐈 Your familiar enters the astral plane...'];
    });

    // Encounter first monster
    this.encounterMonster();
  }

  endAdventure(): void {
    this.gameState.updateState(state => {
      state.adventure.isActive = false;
      state.adventure.currentMonster = null;
      state.adventure.combatLog.push('🏠 Your familiar returns home.');
    });
  }

  encounterMonster(): void {
    const state = this.gameState.getCurrentState();
    const familiarLevel = state.familiar.level;

    // Get a random monster based on familiar level
    const minLevel = Math.max(1, familiarLevel - 2);
    const maxLevel = Math.min(15, familiarLevel + 3);

    const monster = this.dataService.getRandomMonster(minLevel, maxLevel);

    if (!monster) return;

    this.gameState.updateState(s => {
      s.adventure.currentMonster = monster;
      s.adventure.combatLog.push(`⚔️ A wild ${monster.icon} ${monster.name} appears! (Level ${monster.level})`);
    });
  }

  attack(): CombatResult | null {
    const state = this.gameState.getCurrentState();
    const monster = state.adventure.currentMonster;

    if (!monster) return null;

    // Calculate familiar's total attack and defense
    const familiarAttack = this.calculateFamiliarAttack(state.familiar);
    const familiarDefense = this.calculateFamiliarDefense(state.familiar);

    // Calculate damage dealt to monster
    const damageDealt = Math.max(1, familiarAttack - monster.defense);

    // Calculate damage taken from monster
    const damageTaken = Math.max(0, monster.attack - familiarDefense);

    // Update monster health
    monster.health -= damageDealt;

    let result: CombatResult;
    let victory = false;
    let xpGained = 0;
    let goldGained = 0;
    let equipmentDropped: Equipment | null = null;

    if (monster.health <= 0) {
      // Monster defeated!
      victory = true;
      xpGained = monster.xpReward;
      goldGained = monster.goldReward;

      // Check for equipment drop
      const dropRoll = Math.random() * 100;
      if (dropRoll <= monster.equipmentDropChance) {
        equipmentDropped = this.dataService.getRandomEquipmentDrop();
      }

      this.gameState.updateState(s => {
        s.adventure.combatLog.push(`💥 You dealt ${damageDealt} damage!`);
        s.adventure.combatLog.push(`✨ ${monster.name} defeated!`);
        s.adventure.combatLog.push(`📈 Gained ${xpGained} XP and ${goldGained} gold`);

        if (equipmentDropped) {
          s.adventure.combatLog.push(`🎁 Dropped: ${equipmentDropped.icon} ${equipmentDropped.name}`);
          s.adventure.equipmentInventory.push(equipmentDropped.id);
        }

        // Award XP and gold
        s.familiar.xp += xpGained;
        s.gold += goldGained;
        s.adventure.monsterDefeated++;
        s.adventure.totalDistance += monster.level * 10;
        s.adventure.currentMonster = null;

        // Check for level up
        while (s.familiar.xp >= s.familiar.xpToNextLevel) {
          this.levelUpFamiliar(s.familiar);
          s.adventure.combatLog.push(`🎉 Familiar reached level ${s.familiar.level}!`);
        }
      });

      result = {
        victory: true,
        xpGained,
        goldGained,
        equipmentDropped,
        damageDealt,
        damageTaken: 0 // Monster dies before counter-attacking
      };

      // Encounter next monster after a delay
      setTimeout(() => {
        if (this.gameState.getCurrentState().adventure.isActive) {
          this.encounterMonster();
        }
      }, 1500);

    } else {
      // Monster survives and counter-attacks
      this.gameState.updateState(s => {
        s.adventure.combatLog.push(`💥 You dealt ${damageDealt} damage! (${monster.health}/${monster.maxHealth} HP)`);

        if (damageTaken > 0) {
          s.familiar.health -= damageTaken;
          s.adventure.combatLog.push(`💔 You took ${damageTaken} damage! (${s.familiar.health}/${s.familiar.maxHealth} HP)`);

          // Check if familiar was defeated
          if (s.familiar.health <= 0) {
            s.familiar.health = 0;
            s.adventure.combatLog.push('☠️ Your familiar was defeated!');
            s.adventure.combatLog.push('🏥 Returning home to recover...');
            s.adventure.isActive = false;
            s.adventure.currentMonster = null;

            // Restore health after defeat
            setTimeout(() => {
              this.gameState.updateState(state => {
                state.familiar.health = state.familiar.maxHealth;
              });
            }, 3000);
          }
        }
      });

      result = {
        victory: false,
        xpGained: 0,
        goldGained: 0,
        equipmentDropped: null,
        damageDealt,
        damageTaken
      };
    }

    // Trim combat log to last 15 messages
    this.gameState.updateState(s => {
      if (s.adventure.combatLog.length > 15) {
        s.adventure.combatLog = s.adventure.combatLog.slice(-15);
      }
    });

    return result;
  }

  private calculateFamiliarAttack(familiar: any): number {
    let attack = familiar.baseAttack + (familiar.level * 2);

    // Add weapon bonus
    if (familiar.equippedWeapon) {
      const weapon = this.dataService.getEquipmentById(familiar.equippedWeapon);
      if (weapon) attack += weapon.attack;
    }

    // Add armor bonus
    if (familiar.equippedArmor) {
      const armor = this.dataService.getEquipmentById(familiar.equippedArmor);
      if (armor) attack += armor.attack;
    }

    // Add accessory bonus
    if (familiar.equippedAccessory) {
      const accessory = this.dataService.getEquipmentById(familiar.equippedAccessory);
      if (accessory) attack += accessory.attack;
    }

    return attack;
  }

  private calculateFamiliarDefense(familiar: any): number {
    let defense = familiar.baseDefense + (familiar.level * 1);

    // Add weapon bonus
    if (familiar.equippedWeapon) {
      const weapon = this.dataService.getEquipmentById(familiar.equippedWeapon);
      if (weapon) defense += weapon.defense;
    }

    // Add armor bonus
    if (familiar.equippedArmor) {
      const armor = this.dataService.getEquipmentById(familiar.equippedArmor);
      if (armor) defense += armor.defense;
    }

    // Add accessory bonus
    if (familiar.equippedAccessory) {
      const accessory = this.dataService.getEquipmentById(familiar.equippedAccessory);
      if (accessory) defense += accessory.defense;
    }

    return defense;
  }

  private levelUpFamiliar(familiar: any): void {
    familiar.xp -= familiar.xpToNextLevel;
    familiar.level++;
    familiar.xpToNextLevel = Math.floor(100 * Math.pow(1.5, familiar.level - 1));
    familiar.maxHealth += 10;
    familiar.health = familiar.maxHealth; // Full heal on level up
    familiar.baseAttack += 2;
    familiar.baseDefense += 1;
  }

  equipItem(equipmentId: string, slot: 'weapon' | 'armor' | 'accessory'): boolean {
    const equipment = this.dataService.getEquipmentById(equipmentId);
    if (!equipment || equipment.type !== slot) return false;

    const state = this.gameState.getCurrentState();

    // Check if in inventory
    if (!state.adventure.equipmentInventory.includes(equipmentId)) return false;

    this.gameState.updateState(s => {
      // Unequip current item (add back to inventory)
      const currentEquipped = slot === 'weapon' ? s.familiar.equippedWeapon :
                             slot === 'armor' ? s.familiar.equippedArmor :
                             s.familiar.equippedAccessory;

      if (currentEquipped && !s.adventure.equipmentInventory.includes(currentEquipped)) {
        s.adventure.equipmentInventory.push(currentEquipped);
      }

      // Equip new item
      if (slot === 'weapon') s.familiar.equippedWeapon = equipmentId;
      else if (slot === 'armor') s.familiar.equippedArmor = equipmentId;
      else s.familiar.equippedAccessory = equipmentId;

      // Remove from inventory
      const index = s.adventure.equipmentInventory.indexOf(equipmentId);
      if (index > -1) {
        s.adventure.equipmentInventory.splice(index, 1);
      }
    });

    return true;
  }

  unequipItem(slot: 'weapon' | 'armor' | 'accessory'): void {
    this.gameState.updateState(s => {
      const equippedId = slot === 'weapon' ? s.familiar.equippedWeapon :
                        slot === 'armor' ? s.familiar.equippedArmor :
                        s.familiar.equippedAccessory;

      if (equippedId) {
        // Add to inventory
        s.adventure.equipmentInventory.push(equippedId);

        // Clear slot
        if (slot === 'weapon') s.familiar.equippedWeapon = null;
        else if (slot === 'armor') s.familiar.equippedArmor = null;
        else s.familiar.equippedAccessory = null;
      }
    });
  }

  sellEquipment(equipmentId: string): boolean {
    const equipment = this.dataService.getEquipmentById(equipmentId);
    if (!equipment) return false;

    const state = this.gameState.getCurrentState();
    const index = state.adventure.equipmentInventory.indexOf(equipmentId);
    if (index === -1) return false;

    this.gameState.updateState(s => {
      s.adventure.equipmentInventory.splice(index, 1);
      s.gold += equipment.value;
    });

    return true;
  }

  getTotalAttack(): number {
    const state = this.gameState.getCurrentState();
    return this.calculateFamiliarAttack(state.familiar);
  }

  getTotalDefense(): number {
    const state = this.gameState.getCurrentState();
    return this.calculateFamiliarDefense(state.familiar);
  }
}
