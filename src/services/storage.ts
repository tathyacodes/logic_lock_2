import type { PlayerProgress } from '../types/game';

const STORAGE_KEY = 'LOGIC_LOCK_SAVE_DATA_V1';

const DEFAULT_PROGRESS: PlayerProgress = {
  highestUnlockedLevel: 1,
  completedLevels: [],
  levelStats: {},
  challengeBestTimes: {},
  settings: {
    soundEnabled: true,
    reducedMotion: false,
    showFormalNotation: false,
  },
};

export const storageService = {
  loadProgress(): PlayerProgress {
    try {
      if (typeof window === 'undefined') return DEFAULT_PROGRESS;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        settings: {
          ...DEFAULT_PROGRESS.settings,
          ...(parsed.settings || {}),
        },
      };
    } catch (e) {
      console.warn('Failed to load player progress from localStorage', e);
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: PlayerProgress): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save player progress', e);
    }
  },

  markLevelCompleted(levelId: number, hintsUsed: number, attempts: number): PlayerProgress {
    const progress = this.loadProgress();
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
    }
    const nextLevel = levelId + 1;
    if (nextLevel > progress.highestUnlockedLevel && nextLevel <= 10) {
      progress.highestUnlockedLevel = nextLevel;
    }

    progress.levelStats[levelId] = {
      attempts: (progress.levelStats[levelId]?.attempts || 0) + attempts,
      hintsUsed: Math.max(progress.levelStats[levelId]?.hintsUsed || 0, hintsUsed),
      solvedAt: new Date().toISOString(),
    };

    this.saveProgress(progress);
    return progress;
  },

  resetProgress(): PlayerProgress {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  },
};
