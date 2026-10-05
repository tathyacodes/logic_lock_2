import React, { useState, useEffect } from 'react';
import type { GameMode, PlayerProgress } from './types/game';
import { PUZZLE_LEVELS } from './data/levels';
import { storageService } from './services/storage';
import { soundEngine } from './services/sound';
import { Navbar } from './components/Navigation/Navbar';
import { HomeScreen } from './components/Home/HomeScreen';
import { AdventureView } from './components/Adventure/AdventureView';
import { DiscoveryLabView } from './components/DiscoveryLab/DiscoveryLabView';
import { ChallengeView } from './components/Challenge/ChallengeView';
import { SettingsModal } from './components/Settings/SettingsModal';
import { Lock } from 'lucide-react';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [progress, setProgress] = useState<PlayerProgress>(() => storageService.loadProgress());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync sound mute setting with sound engine
  useEffect(() => {
    soundEngine.setMuted(!progress.settings.soundEnabled);
  }, [progress.settings.soundEnabled]);

  const handleUpdateSettings = (newSettings: PlayerProgress['settings']) => {
    const updated = {
      ...progress,
      settings: newSettings,
    };
    setProgress(updated);
    storageService.saveProgress(updated);
  };

  const handleResetProgress = () => {
    const fresh = storageService.resetProgress();
    setProgress(fresh);
    setCurrentLevelIndex(0);
  };

  const handleCompleteLevel = (levelId: number, hintsUsed: number, attempts: number) => {
    const updated = storageService.markLevelCompleted(levelId, hintsUsed, attempts);
    setProgress(updated);
  };

  const handleRecordChallengeBestTime = (levelId: number, seconds: number) => {
    const prevBest = progress.challengeBestTimes[levelId];
    if (prevBest === undefined || seconds < prevBest) {
      const updated = {
        ...progress,
        challengeBestTimes: {
          ...progress.challengeBestTimes,
          [levelId]: seconds,
        },
      };
      setProgress(updated);
      storageService.saveProgress(updated);
    }
  };

  const handleToggleSound = () => {
    handleUpdateSettings({
      ...progress.settings,
      soundEnabled: !progress.settings.soundEnabled,
    });
  };

  return (
    <div className="min-h-screen game-backdrop flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        progress={progress}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={handleToggleSound}
      />

      {/* Main Game Screen */}
      <main className="flex-1 flex flex-col">
        {currentMode === 'home' && (
          <HomeScreen
            progress={progress}
            onSelectMode={(mode) => setCurrentMode(mode)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentMode === 'adventure' && (
          <AdventureView
            levels={PUZZLE_LEVELS}
            currentLevelIndex={currentLevelIndex}
            progress={progress}
            onSelectLevelIndex={(idx) => setCurrentLevelIndex(idx)}
            onCompleteLevel={handleCompleteLevel}
          />
        )}

        {currentMode === 'lab' && <DiscoveryLabView />}

        {currentMode === 'challenge' && (
          <ChallengeView
            progress={progress}
            onRecordBestTime={handleRecordChallengeBestTime}
          />
        )}
      </main>

      {/* Settings Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
      />

      {/* Clean Educational Footer */}
      <footer className="w-full border-t border-game-border bg-game-bg/80 backdrop-blur-sm py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">Logic Lock</span>
            <span>• An Educational Puzzle Game</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Discrete Mathematics Discovery</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hidden sm:inline text-slate-400">Propositions • Connectives • Equivalence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
