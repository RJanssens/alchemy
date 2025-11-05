import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DataService } from './app/services/data.service';
import { importProvidersFrom } from '@angular/core';

// Load game data before bootstrapping
async function bootstrap() {
  const dataService = new DataService();

  try {
    await dataService.loadAllData();
    console.log('Game data loaded successfully');

    await bootstrapApplication(AppComponent, {
      providers: [
        provideAnimations(),
        { provide: DataService, useValue: dataService }
      ]
    });
  } catch (error) {
    console.error('Failed to load game data:', error);
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #1e1e2e;
        color: #e0e0e0;
        font-family: sans-serif;
        flex-direction: column;
        gap: 20px;
      ">
        <h1>Failed to Load Game Data</h1>
        <p>Please refresh the page to try again.</p>
        <button onclick="location.reload()" style="
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background: #8a2be2;
          color: white;
          border: none;
          border-radius: 6px;
        ">Refresh</button>
      </div>
    `;
  }
}

bootstrap().catch(err => console.error(err));
