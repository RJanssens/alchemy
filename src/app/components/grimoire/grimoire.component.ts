import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../../services/game-state.service';
import { RecipeDiscovery } from '../../models/recipe.model';
import { GameState } from '../../models/game-state.model';

@Component({
  selector: 'app-grimoire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grimoire.component.html',
  styleUrls: ['./grimoire.component.css']
})
export class GrimoireComponent implements OnInit {
  gameState: GameState | null = null;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.gameStateService.getState().subscribe(state => {
      this.gameState = state;
    });
  }

  get discoveries(): RecipeDiscovery[] {
    return this.gameState?.recipeHistory || [];
  }

  getSuccessRate(discovery: RecipeDiscovery): number {
    if (discovery.totalAttempts === 0) return 0;
    return Math.round((discovery.successfulCreations / discovery.totalAttempts) * 100);
  }

  formatDate(date: Date): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
