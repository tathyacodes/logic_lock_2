import React, { useState } from 'react';
import {
  Lock,
  Play,
  FlaskConical,
  Zap,
  HelpCircle,
  Compass,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import type { GameMode, PlayerProgress } from '../../types/game';
import { CrystalGlyph } from '../shared/CrystalGlyph';
import { soundEngine } from '../../services/sound';

interface HomeScreenProps {
  progress: PlayerProgress;
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onSelectMode,
  onOpenSettings,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const completedCount = progress.completedLevels.length;

  return (
    <div className="relative min-h-[calc(100vh-3.75rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="relative max-w-2xl w-full flex flex-col items-center text-center">
        {/* Crystal Cluster Icon Graphic */}
        <div className="flex items-center gap-2 mb-5">
          <CrystalGlyph objectId="red" size="md" className="transform -rotate-12" />
          <CrystalGlyph objectId="blue" size="lg" className="transform scale-110" />
          <CrystalGlyph objectId="green" size="md" className="transform rotate-12" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
          Logic Lock
        </h1>

        <p className="text-base sm:text-lg text-slate-300 font-medium mb-2.5">
          Solve the clues. Open the doors.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-7 leading-relaxed">
          Each room has a sealed lock. Arrange the colorful crystals according to the logic clues to open the door and advance to the next chamber.
        </p>

        {/* Primary Mode Buttons */}
        <div className="w-full max-w-sm flex flex-col gap-2.5 mb-7">
          {/* PLAY ADVENTURE */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('adventure');
            }}
            className="w-full py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-md transition-all hover:scale-101 active:scale-99 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Play className="w-4 h-4 fill-white" />
              <span>Play Adventure</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-200 border border-indigo-400/30">
              Room {progress.highestUnlockedLevel}/10
            </span>
          </button>

          {/* DISCOVERY LAB */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('lab');
            }}
            className="w-full py-3 px-5 rounded-xl bg-game-card hover:bg-game-cardHover border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>Discovery Lab</span>
            </div>
            <span className="text-xs text-purple-300">
              Compare 2 Locks
            </span>
          </button>

          {/* CHALLENGE MODE */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectMode('challenge');
            }}
            className="w-full py-3 px-5 rounded-xl bg-game-card hover:bg-game-cardHover border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Challenge Replay</span>
            </div>
            <span className="text-xs text-amber-300">
              Timed Practice
            </span>
          </button>
        </div>

        {/* Secondary Utility Controls */}
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowHowToPlay(true);
            }}
            className="text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>How to Play</span>
          </button>

          <span className="text-slate-700">•</span>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSettings();
            }}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Settings
          </button>
        </div>

        {/* Progression Overview Card */}
        <div className="mt-8 w-full max-w-md game-card p-3 border border-slate-800 flex items-center justify-around text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Rooms Cleared</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{completedCount} / 10</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">Current Level</span>
            <span className="text-lg font-bold text-slate-200 font-mono">
              Room {progress.highestUnlockedLevel}
            </span>
          </div>
        </div>
      </div>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-lg game-card rounded-2xl p-6 border border-slate-700 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                How to Play Logic Lock
              </h3>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowHowToPlay(false);
                }}
                className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">
                  1. Read the Clues
                </h4>
                <p className="text-slate-300">
                  Each door has rules. Some tell you the order of two crystals ("Red is before Blue"), some tell you where a crystal cannot go, and later clues use <strong>OR</strong> and <strong>IF–THEN</strong> conditions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">
                  2. Move the Crystals
                </h4>
                <p className="text-slate-300">
                  You can <strong>drag and drop</strong> crystals into the numbered slots, or <strong>click a crystal</strong> to select it and then click a slot to place it.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-indigo-300 mb-1">
                  3. Check the Lock
                </h4>
                <p className="text-slate-300">
                  Click <strong>Check Lock</strong>. Green checkmarks show which clues match your arrangement. If a clue is red, check its explanation and adjust your crystals!
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowHowToPlay(false);
                  onSelectMode('adventure');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Playing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
