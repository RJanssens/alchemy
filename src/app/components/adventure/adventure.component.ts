import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { AdventureService } from '../../services/adventure.service';
import { DataService } from '../../services/data.service';
import { GameState } from '../../models/game-state.model';
import { Equipment } from '../../models/adventure.model';

@Component({
  selector: 'app-adventure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.css']
})
export class AdventureComponent implements OnInit {
  gameState: GameState | null = null;
  selectedTab: 'combat' | 'equipment' = 'combat';

  constructor(
    private gameStateService: GameStateService,
    private adventureService: AdventureService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
    });
  }

  get isAdventuring(): boolean {
    return this.gameState?.adventure.isActive || false;
  }

  get familiar() {
    return this.gameState?.familiar;
  }

  get adventure() {
    return this.gameState?.adventure;
  }

  get currentMonster() {
    return this.adventure?.currentMonster;
  }

  get combatLog(): string[] {
    return this.adventure?.combatLog || [];
  }

  get totalAttack(): number {
    return this.adventureService.getTotalAttack();
  }

  get totalDefense(): number {
    return this.adventureService.getTotalDefense();
  }

  get equippedWeapon(): Equipment | null {
    if (!this.familiar?.equippedWeapon) return null;
    return this.dataService.getEquipmentById(this.familiar.equippedWeapon) || null;
  }

  get equippedArmor(): Equipment | null {
    if (!this.familiar?.equippedArmor) return null;
    return this.dataService.getEquipmentById(this.familiar.equippedArmor) || null;
  }

  get equippedAccessory(): Equipment | null {
    if (!this.familiar?.equippedAccessory) return null;
    return this.dataService.getEquipmentById(this.familiar.equippedAccessory) || null;
  }

  get inventoryEquipment(): Equipment[] {
    if (!this.adventure) return [];
    return this.adventure.equipmentInventory
      .map(id => this.dataService.getEquipmentById(id))
      .filter(e => e !== undefined) as Equipment[];
  }

  startAdventure(): void {
    this.adventureService.startAdventure();
  }

  endAdventure(): void {
    const confirmed = confirm('Are you sure you want to end the adventure?');
    if (confirmed) {
      this.adventureService.endAdventure();
    }
  }

  attack(): void {
    if (!this.currentMonster) return;
    this.adventureService.attack();
  }

  equipItem(equipment: Equipment): void {
    const slot = equipment.type;
    this.adventureService.equipItem(equipment.id, slot);
  }

  unequipSlot(slot: 'weapon' | 'armor' | 'accessory'): void {
    this.adventureService.unequipItem(slot);
  }

  sellEquipment(equipment: Equipment): void {
    const confirmed = confirm(`Sell ${equipment.name} for ${equipment.value} gold?`);
    if (confirmed) {
      this.adventureService.sellEquipment(equipment.id);
    }
  }

  switchTab(tab: 'combat' | 'equipment'): void {
    this.selectedTab = tab;
  }

  getHealthPercentage(): number {
    if (!this.familiar) return 0;
    return (this.familiar.health / this.familiar.maxHealth) * 100;
  }

  getXpPercentage(): number {
    if (!this.familiar) return 0;
    return (this.familiar.xp / this.familiar.xpToNextLevel) * 100;
  }

  getMonsterHealthPercentage(): number {
    if (!this.currentMonster) return 0;
    return (this.currentMonster.health / this.currentMonster.maxHealth) * 100;
  }

  getRarityClass(rarity: string): string {
    return `rarity-${rarity}`;
  }
}
