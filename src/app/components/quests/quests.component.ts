import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { GameState } from '../../models/game-state.model';
import { Quest, QuestOffer } from '../../models/quest.model';
import { INGREDIENTS } from '../../services/data.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.css']
})
export class QuestsComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  availableQuests: QuestOffer[] = [];
  timeRemaining = '';
  private subscription?: Subscription;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
      if (!state.activeQuest) {
        this.generateQuests();
      }
      this.updateTimeRemaining();
    });

    // Update time display every second
    this.subscription = interval(1000).subscribe(() => {
      this.updateTimeRemaining();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get activeQuest(): Quest | null {
    return this.gameState?.activeQuest || null;
  }

  get canRefreshQuests(): boolean {
    if (!this.gameState || this.gameState.activeQuest) return false;
    const timeSinceRefresh = Date.now() - this.gameState.questRefreshTime;
    const oneHour = 60 * 60 * 1000;
    return timeSinceRefresh >= oneHour;
  }

  private generateQuests(): void {
    if (!this.gameState) return;

    this.availableQuests = [];

    // Get discovered ingredients
    const discoveredIngredients = INGREDIENTS.filter(ing => {
      const state = this.gameState!.ingredients[ing.id];
      return state.discovered;
    });

    // Generate 3 random quests
    for (let i = 0; i < 3 && discoveredIngredients.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * discoveredIngredients.length);
      const ingredient = discoveredIngredients.splice(randomIndex, 1)[0];

      const isBase = ingredient.isBase;
      const targetAmount = isBase ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 3) + 2;
      const duration = isBase ? 5 * 60 * 1000 : 10 * 60 * 1000;
      const xpReward = isBase ? targetAmount * 5 : targetAmount * ingredient.baseXpValue * 2;

      this.availableQuests.push({
        targetIngredientId: ingredient.id,
        targetIngredientName: ingredient.name,
        targetAmount,
        duration,
        xpReward
      });
    }
  }

  acceptQuest(quest: QuestOffer): void {
    if (!this.gameState || this.gameState.activeQuest) return;

    const now = Date.now();
    const newQuest: Quest = {
      id: `quest-${now}`,
      targetIngredientId: quest.targetIngredientId,
      targetIngredientName: quest.targetIngredientName,
      targetAmount: quest.targetAmount,
      currentAmount: this.gameState.ingredients[quest.targetIngredientId].count,
      duration: quest.duration,
      startTime: now,
      expiryTime: now + quest.duration,
      xpReward: quest.xpReward,
      isActive: true,
      isCompleted: false
    };

    this.gameStateService.updateState(state => {
      state.activeQuest = newQuest;
    });

    this.availableQuests = [];
  }

  abandonQuest(): void {
    const confirmed = confirm('Are you sure you want to abandon this quest?');
    if (!confirmed) return;

    this.gameStateService.updateState(state => {
      state.activeQuest = null;
      state.questRefreshTime = Date.now();
    });
  }

  refreshQuests(): void {
    if (!this.canRefreshQuests) return;

    this.gameStateService.updateState(state => {
      state.questRefreshTime = Date.now();
    });

    this.generateQuests();
  }

  getProgress(): number {
    if (!this.activeQuest) return 0;
    return Math.min((this.activeQuest.currentAmount / this.activeQuest.targetAmount) * 100, 100);
  }

  private updateTimeRemaining(): void {
    if (!this.activeQuest) return;

    const now = Date.now();
    const remaining = Math.max(0, this.activeQuest.expiryTime - now);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    this.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  }
}
