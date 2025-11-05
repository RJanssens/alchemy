export type AchievementCategory = 'discovery' | 'creation' | 'mastery' | 'alchemy';

export type AchievementRequirementType =
  | 'totalXp'
  | 'discoveries'
  | 'successfulMixes'
  | 'enhancements'
  | 'kettleSize'
  | 'castCount'
  | 'familiarConsultations';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirementType: AchievementRequirementType;
  requirementValue: number;
  bonusType: 'xpMultiplier' | 'storage' | 'conjurationTime' | 'successRate';
  bonusValue: number;
  isHidden: boolean;
  prerequisiteAchievementId?: string;
}

export interface AchievementState {
  achievementId: string;
  unlocked: boolean;
  progress: number;
  unlockedDate?: Date;
}
