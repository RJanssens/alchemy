# Alchemist

An incremental/idle alchemy game built with Angular 18.

## Overview

**Alchemist** is an incremental game where players start as novice alchemists who conjure base elemental ingredients (Fire, Water, Earth, Air) and combine them in a cauldron to discover new compound ingredients. The game features a progression system with experience points, enhancements, achievements, and quests.

## Core Features

- **Conjure** base ingredients (Fire, Water, Earth, Air)
- **Mix** ingredients in the cauldron to create compounds
- **Discover** new recipes through experimentation
- **Upgrade** ingredients with enhancements (storage, speed, auto-conjure)
- **Complete** quests for bonus experience
- **Unlock** achievements for permanent bonuses
- **Progress** through witch ranks based on total XP
- **Prestige** system (coming soon)
- **Adventure Mode** with familiar (coming soon)

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Game Mechanics

### Resources

- **Ingredients**: Prima materiae can be conjured automatically, compound ingredients are mixed in the cauldron
- **Experience Points**: Used to upgrade witch skills and purchase enhancements
- **Gold**: To buy better equipment for the familiar (coming soon)

### Witch Ranks

Progress through 9 witch ranks based on total XP:
- Novice Apprentice (0 XP)
- Apprentice Alchemist (50 XP)
- Journeyman Alchemist (200 XP)
- Adept Alchemist (500 XP)
- Master Alchemist (1000 XP)
- Grand Master (2500 XP)
- Archmage (5000 XP)
- Legendary Sage (10000 XP)
- Eternal Philosopher (25000+ XP)

## License

MIT
