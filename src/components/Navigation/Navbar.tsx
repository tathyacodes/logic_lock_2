import React from 'react';
import { Lock, Compass, FlaskConical, Zap, Settings as SettingsIcon, Volume2, VolumeX, Home } from 'lucide-react';
import type { GameMode, PlayerProgress } from '../../types/game';
import { soundEngine } from '../../services/sound';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  progress: PlayerProgress;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  progress,
  onOpenSettings,
  onToggleSound,
}) => {
  const completedCount = progress.completedLevels.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-game-border bg-game-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onSelectMode('home');
          }}
          className="flex items-center gap-2.5 group text-left cursor-pointer transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:border-indigo-400 transition-colors">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-base tracking-tight">
                Logic Lock
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Puzzle Adventure
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('home');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'home'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Home</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('adventure');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'adventure'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Adventure</span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 hidden sm:inline">
              {completedCount}/10
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('lab');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'lab'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Discovery Lab</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('challenge');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentMode === 'challenge'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Challenge</span>
          </button>
        </nav>

        {/* Sound & Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleSound();
            }}
            title={progress.settings.soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {progress.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            title="Settings"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
