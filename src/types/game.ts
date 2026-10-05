import type { ConstraintDefinition } from './logic';

export interface GameObject {
  id: string;
  name: string;
  symbol: string;
  colorName: string;
  colorHex: string;
  accentGlow: string;
  gradient: string;
  borderClass: string;
  badgeBg: string;
}

export interface PuzzleLevel {
  id: number;
  slug: string;
  name: string;
  roomNumber: number;
  facilitySector: string;
  description: string;
  storyNote: string;
  slotCount: number;
  availableObjects: string[]; // IDs of GameObjects
  constraints: ConstraintDefinition[];
  hints: string[]; // 3-tier hints: [general guidance, more specific, direct placement hint]
  conceptTag: string;
  discreteMathConcept: string;
  isVaultLevel?: boolean;
}

export type GameMode = 'adventure' | 'lab' | 'challenge' | 'home';

export interface LabLockComparison {
  id: string;
  title: string;
  subtitle: string;
  objects: string[];
  slotCount: number;
  lockA: {
    name: string;
    description: string;
    constraints: ConstraintDefinition[];
    formalRule?: string;
  };
  lockB: {
    name: string;
    description: string;
    constraints: ConstraintDefinition[];
    formalRule?: string;
  };
  discreteMathInsight: {
    concept: string;
    ruleName: string;
    formula: string;
    explanation: string;
    isActuallyEquivalent: boolean;
  };
}

export interface PlayerProgress {
  highestUnlockedLevel: number;
  completedLevels: number[];
  levelStats: Record<number, {
    attempts: number;
    hintsUsed: number;
    solvedAt?: string;
  }>;
  challengeBestTimes: Record<string, number>;
  settings: {
    soundEnabled: boolean;
    reducedMotion: boolean;
    showFormalNotation: boolean;
  };
}
