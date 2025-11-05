import { Achievement } from '../models/achievement.model';

export const ACHIEVEMENTS: Achievement[] = [
  // Discovery Category
  {
    id: 'ach-first-discovery',
    name: 'First Discovery',
    description: 'Discover your first recipe',
    icon: '🔍',
    category: 'discovery',
    requirementType: 'discoveries',
    requirementValue: 1,
    bonusType: 'xpMultiplier',
    bonusValue: 1.05,
    isHidden: false
  },
  {
    id: 'ach-apprentice-scholar',
    name: 'Apprentice Scholar',
    description: 'Discover 5 recipes',
    icon: '📚',
    category: 'discovery',
    requirementType: 'discoveries',
    requirementValue: 5,
    bonusType: 'xpMultiplier',
    bonusValue: 1.1,
    isHidden: false
  },
  {
    id: 'ach-master-scholar',
    name: 'Master Scholar',
    description: 'Discover 10 recipes',
    icon: '📖',
    category: 'discovery',
    requirementType: 'discoveries',
    requirementValue: 10,
    bonusType: 'xpMultiplier',
    bonusValue: 1.2,
    isHidden: false
  },

  // Creation Category
  {
    id: 'ach-novice-alchemist',
    name: 'Novice Alchemist',
    description: 'Successfully mix 10 ingredients',
    icon: '⚗️',
    category: 'creation',
    requirementType: 'successfulMixes',
    requirementValue: 10,
    bonusType: 'successRate',
    bonusValue: 2,
    isHidden: false
  },
  {
    id: 'ach-skilled-alchemist',
    name: 'Skilled Alchemist',
    description: 'Successfully mix 50 ingredients',
    icon: '🧪',
    category: 'creation',
    requirementType: 'successfulMixes',
    requirementValue: 50,
    bonusType: 'successRate',
    bonusValue: 5,
    isHidden: false
  },
  {
    id: 'ach-master-craftsman',
    name: 'Master Craftsman',
    description: 'Successfully mix 200 ingredients',
    icon: '👨‍🔬',
    category: 'creation',
    requirementType: 'successfulMixes',
    requirementValue: 200,
    bonusType: 'successRate',
    bonusValue: 10,
    isHidden: false
  },

  // Mastery Category
  {
    id: 'ach-first-upgrade',
    name: 'First Upgrade',
    description: 'Purchase your first enhancement',
    icon: '⬆️',
    category: 'mastery',
    requirementType: 'enhancements',
    requirementValue: 1,
    bonusType: 'storage',
    bonusValue: 5,
    isHidden: false
  },
  {
    id: 'ach-enhancement-enthusiast',
    name: 'Enhancement Enthusiast',
    description: 'Purchase 10 enhancements',
    icon: '💫',
    category: 'mastery',
    requirementType: 'enhancements',
    requirementValue: 10,
    bonusType: 'storage',
    bonusValue: 10,
    isHidden: false
  },
  {
    id: 'ach-perfectionist',
    name: 'Perfectionist',
    description: 'Purchase 50 enhancements',
    icon: '✨',
    category: 'mastery',
    requirementType: 'enhancements',
    requirementValue: 50,
    bonusType: 'conjurationTime',
    bonusValue: 10,
    isHidden: false
  },

  // Alchemy Category
  {
    id: 'ach-apprentice-rank',
    name: 'Apprentice Alchemist',
    description: 'Reach 50 total XP',
    icon: '🎓',
    category: 'alchemy',
    requirementType: 'totalXp',
    requirementValue: 50,
    bonusType: 'xpMultiplier',
    bonusValue: 1.05,
    isHidden: false
  },
  {
    id: 'ach-journeyman-rank',
    name: 'Journeyman Alchemist',
    description: 'Reach 200 total XP',
    icon: '🏅',
    category: 'alchemy',
    requirementType: 'totalXp',
    requirementValue: 200,
    bonusType: 'xpMultiplier',
    bonusValue: 1.1,
    isHidden: false
  },
  {
    id: 'ach-adept-rank',
    name: 'Adept Alchemist',
    description: 'Reach 500 total XP',
    icon: '🏆',
    category: 'alchemy',
    requirementType: 'totalXp',
    requirementValue: 500,
    bonusType: 'xpMultiplier',
    bonusValue: 1.15,
    isHidden: false
  },
  {
    id: 'ach-master-rank',
    name: 'Master Alchemist',
    description: 'Reach 1000 total XP',
    icon: '👑',
    category: 'alchemy',
    requirementType: 'totalXp',
    requirementValue: 1000,
    bonusType: 'xpMultiplier',
    bonusValue: 1.25,
    isHidden: false
  },
  {
    id: 'ach-kettle-expander',
    name: 'Kettle Expander',
    description: 'Expand kettle to 4 slots',
    icon: '🪣',
    category: 'alchemy',
    requirementType: 'kettleSize',
    requirementValue: 4,
    bonusType: 'xpMultiplier',
    bonusValue: 1.1,
    isHidden: false
  },
  {
    id: 'ach-grand-cauldron',
    name: 'Grand Cauldron',
    description: 'Expand kettle to 6 slots',
    icon: '🫖',
    category: 'alchemy',
    requirementType: 'kettleSize',
    requirementValue: 6,
    bonusType: 'xpMultiplier',
    bonusValue: 1.2,
    isHidden: false
  },
  {
    id: 'ach-sacrifice',
    name: 'Willing Sacrifice',
    description: 'Cast 10 ingredients for XP',
    icon: '✨',
    category: 'alchemy',
    requirementType: 'castCount',
    requirementValue: 10,
    bonusType: 'xpMultiplier',
    bonusValue: 1.05,
    isHidden: false
  },
  {
    id: 'ach-familiar-friend',
    name: 'Familiar Friend',
    description: 'Consult your familiar 5 times',
    icon: '🐈',
    category: 'alchemy',
    requirementType: 'familiarConsultations',
    requirementValue: 5,
    bonusType: 'xpMultiplier',
    bonusValue: 1.05,
    isHidden: false
  },
  {
    id: 'ach-philosophers-stone',
    name: 'Magnum Opus',
    description: 'Create the Philosopher\'s Stone',
    icon: '💠',
    category: 'alchemy',
    requirementType: 'discoveries',
    requirementValue: 15,
    bonusType: 'xpMultiplier',
    bonusValue: 2.0,
    isHidden: true
  }
];
