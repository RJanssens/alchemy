import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from './services/game-state.service';
import { GameState } from './models/game-state.model';
import { WITCH_RANKS } from './data/witch-ranks.data';
import { KettleComponent } from './components/kettle/kettle.component';
import { IngredientDeckComponent } from './components/ingredient-deck/ingredient-deck.component';
import { GrimoireComponent } from './components/grimoire/grimoire.component';
import { QuestsComponent } from './components/quests/quests.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { DialogComponent } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    KettleComponent,
    IngredientDeckComponent,
    GrimoireComponent,
    QuestsComponent,
    AchievementsComponent,
    DialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gameState: GameState | null = null;
  showAchievements = false;
  showSettings = false;

  constructor(public gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
    });
  }

  get currentRank() {
    const totalXp = this.gameStateService.getTotalXP();
    let rank = WITCH_RANKS[0];

    for (const r of WITCH_RANKS) {
      if (totalXp >= r.minXp) {
        rank = r;
      } else {
        break;
      }
    }

    return rank;
  }

  get totalXP(): number {
    return this.gameStateService.getTotalXP();
  }

  get currentXP(): number {
    return this.gameState?.xp.compound || 0;
  }

  get gold(): number {
    return this.gameState?.gold || 0;
  }

  get achievementCount(): number {
    if (!this.gameState) return 0;
    return Object.values(this.gameState.achievements).filter(a => a.unlocked).length;
  }

  get totalAchievements(): number {
    if (!this.gameState) return 0;
    return Object.keys(this.gameState.achievements).length;
  }

  toggleAchievements(): void {
    this.showAchievements = !this.showAchievements;
  }

  async resetGame(): Promise<void> {
    const confirmed = confirm('Are you sure you want to reset the game? All progress will be lost!');
    if (confirmed) {
      this.gameStateService.resetGame();
    }
  }
}
