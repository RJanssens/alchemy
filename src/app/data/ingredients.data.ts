import { Ingredient } from '../models/ingredient.model';

export const INGREDIENTS: Ingredient[] = [
  // Base Elements
  {
    id: 'fire',
    name: 'Fire',
    description: 'The essence of heat and transformation. Burns with eternal flame.',
    elementType: 'fire',
    isBase: true,
    icon: '🔥',
    baseXpValue: 1,
    baseMixTime: 3000,
    baseSuccessRate: 100
  },
  {
    id: 'water',
    name: 'Water',
    description: 'The essence of flow and adaptability. Pure and cleansing.',
    elementType: 'water',
    isBase: true,
    icon: '💧',
    baseXpValue: 1,
    baseMixTime: 3000,
    baseSuccessRate: 100
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'The essence of stability and growth. Solid and enduring.',
    elementType: 'earth',
    isBase: true,
    icon: '🌍',
    baseXpValue: 1,
    baseMixTime: 3000,
    baseSuccessRate: 100
  },
  {
    id: 'air',
    name: 'Air',
    description: 'The essence of freedom and thought. Light as a breeze.',
    elementType: 'air',
    isBase: true,
    icon: '💨',
    baseXpValue: 1,
    baseMixTime: 3000,
    baseSuccessRate: 100
  },

  // Tier 1 Compounds (2 ingredients)
  {
    id: 'steam',
    name: 'Steam',
    description: 'Water touched by fire, rising upward in ethereal clouds.',
    elementType: 'compound',
    isBase: false,
    icon: '♨️',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },
  {
    id: 'lava',
    name: 'Lava',
    description: 'Earth melted by intense fire, flowing with destructive power.',
    elementType: 'compound',
    isBase: false,
    icon: '🌋',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },
  {
    id: 'smoke',
    name: 'Smoke',
    description: 'Fire carried by air, dancing in wisps of grey.',
    elementType: 'compound',
    isBase: false,
    icon: '💨',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },
  {
    id: 'mud',
    name: 'Mud',
    description: 'Earth mixed with water, soft and moldable.',
    elementType: 'compound',
    isBase: false,
    icon: '🟤',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },
  {
    id: 'dust',
    name: 'Dust',
    description: 'Earth scattered by air, floating particles of matter.',
    elementType: 'compound',
    isBase: false,
    icon: '🌫️',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },
  {
    id: 'mist',
    name: 'Mist',
    description: 'Water suspended in air, a veil of droplets.',
    elementType: 'compound',
    isBase: false,
    icon: '🌫️',
    baseXpValue: 5,
    baseMixTime: 5000,
    baseSuccessRate: 90
  },

  // Tier 2 Compounds (3 ingredients)
  {
    id: 'clay',
    name: 'Clay',
    description: 'Mud dried by air, ready to be shaped and hardened.',
    elementType: 'compound',
    isBase: false,
    icon: '🧱',
    baseXpValue: 15,
    baseMixTime: 8000,
    baseSuccessRate: 75
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Lava cooled by water, forming volcanic glass.',
    elementType: 'compound',
    isBase: false,
    icon: '⬛',
    baseXpValue: 15,
    baseMixTime: 8000,
    baseSuccessRate: 75
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Water falling from air, blessed by clouds.',
    elementType: 'compound',
    isBase: false,
    icon: '🌧️',
    baseXpValue: 15,
    baseMixTime: 8000,
    baseSuccessRate: 75
  },
  {
    id: 'ash',
    name: 'Ash',
    description: 'Fire consuming earth, leaving only grey remains.',
    elementType: 'compound',
    isBase: false,
    icon: '🌑',
    baseXpValue: 15,
    baseMixTime: 8000,
    baseSuccessRate: 75
  },

  // Tier 3 Compounds (Complex recipes)
  {
    id: 'lightning',
    name: 'Lightning',
    description: 'Fire and air colliding with water, pure electric energy.',
    elementType: 'compound',
    isBase: false,
    icon: '⚡',
    baseXpValue: 30,
    baseMixTime: 12000,
    baseSuccessRate: 60
  },
  {
    id: 'crystal',
    name: 'Crystal',
    description: 'Earth purified and compressed, transparent and beautiful.',
    elementType: 'compound',
    isBase: false,
    icon: '💎',
    baseXpValue: 30,
    baseMixTime: 12000,
    baseSuccessRate: 60
  },
  {
    id: 'life',
    name: 'Life',
    description: 'The spark of existence, combining all elements in harmony.',
    elementType: 'compound',
    isBase: false,
    icon: '🌱',
    baseXpValue: 50,
    baseMixTime: 15000,
    baseSuccessRate: 50
  },
  {
    id: 'void',
    name: 'Void',
    description: 'The absence of all elements, darkness incarnate.',
    elementType: 'compound',
    isBase: false,
    icon: '⚫',
    baseXpValue: 50,
    baseMixTime: 15000,
    baseSuccessRate: 50
  },

  // Legendary Compounds
  {
    id: 'philosophers-stone',
    name: "Philosopher's Stone",
    description: 'The ultimate achievement of alchemy, capable of transmuting lead to gold.',
    elementType: 'compound',
    isBase: false,
    icon: '💠',
    baseXpValue: 100,
    baseMixTime: 20000,
    baseSuccessRate: 30
  }
];
