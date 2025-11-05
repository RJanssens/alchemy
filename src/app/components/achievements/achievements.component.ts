import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { GameState } from '../../models/game-state.model';
import { Achievement, AchievementState, AchievementCategory } from '../../models/achievement.model';
import { ACHIEVEMENTS } from '../../data/achievements.data';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  gameState: GameState | null = null;
  activeTab: AchievementCategory = 'discovery';
  categories: AchievementCategory[] = ['discovery', 'creation', 'mastery', 'alchemy'];

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
      this.updateAchievementProgress();
    });
  }

  get filteredAchievements(): { achievement: Achievement; state: AchievementState }[] {
    if (!this.gameState) return [];

    return ACHIEVEMENTS
      .filter(ach => ach.category === this.activeTab)
      .map(achievement => ({
        achievement,
        state: this.gameState!.achievements[achievement.id]
      }));
  }

  switchTab(category: AchievementCategory): void {
    this.activeTab = category;
  }

  closeModal(): void {
    this.close.emit();
  }

  getProgress(achievement: Achievement, state: AchievementState): number {
    return Math.min((state.progress / achievement.requirementValue) * 100, 100);
  }

  isVisible(achievement: Achievement, state: AchievementState): boolean {
    if (!achievement.isHidden) return true;

    // Check if prerequisite is met
    if (achievement.prerequisiteAchievementId) {
      const prereqState = this.gameState?.achievements[achievement.prerequisiteAchievementId];
      return prereqState?.unlocked || false;
    }

    return state.unlocked;
  }

  private updateAchievementProgress(): void {
    if (!this.gameState) return;

    const totalXp = this.gameStateService.getTotalXP();
    const discoveryCount = this.gameState.recipeHistory.length;

    this.gameStateService.updateState(state => {
      ACHIEVEMENTS.forEach(achievement => {
        const achState = state.achievements[achievement.id];
        let currentProgress = 0;

        switch (achievement.requirementType) {
          case 'totalXp':
            currentProgress = totalXp;
            break;
          case 'discoveries':
            currentProgress = discoveryCount;
            break;
          case 'successfulMixes':
            currentProgress = state.stats.totalSuccessfulMixes;
            break;
          case 'enhancements':
            currentProgress = state.stats.totalEnhancementsPurchased;
            break;
          case 'kettleSize':
            currentProgress = state.kettle.maxSlots;
            break;
          case 'castCount':
            currentProgress = state.stats.totalCastCount;
            break;
          case 'familiarConsultations':
            currentProgress = state.familiar.consultationCount;
            break;
        }

        achState.progress = currentProgress;

        // Unlock if requirement met
        if (!achState.unlocked && currentProgress >= achievement.requirementValue) {
          achState.unlocked = true;
          achState.unlockedDate = new Date();
        }
      });
    });
  }

  getBonusDescription(achievement: Achievement): string {
    const value = achievement.bonusValue;
    switch (achievement.bonusType) {
      case 'xpMultiplier':
        return `${value}x XP multiplier`;
      case 'storage':
        return `+${value} storage to all ingredients`;
      case 'conjurationTime':
        return `-${value}% conjuration time`;
      case 'successRate':
        return `+${value}% success rate`;
      default:
        return '';
    }
  }
}
