import React, { useState } from 'react';
import { Settings as SettingsIcon, Volume2, VolumeX, Eye, RotateCcw, X, AlertTriangle } from 'lucide-react';
import type { PlayerProgress } from '../../types/game';
import { soundEngine } from '../../services/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onUpdateSettings: (newSettings: PlayerProgress['settings']) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateSettings,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    soundEngine.playClick();
    const nextVal = !progress.settings.soundEnabled;
    soundEngine.setMuted(!nextVal);
    onUpdateSettings({
      ...progress.settings,
      soundEnabled: nextVal,
    });
  };

  const handleToggleReducedMotion = () => {
    soundEngine.playClick();
    onUpdateSettings({
      ...progress.settings,
      reducedMotion: !progress.settings.reducedMotion,
    });
  };

  const handleToggleMathNotation = () => {
    soundEngine.playClick();
    onUpdateSettings({
      ...progress.settings,
      showFormalNotation: !progress.settings.showFormalNotation,
    });
  };

  const handleExecuteReset = () => {
    soundEngine.playClick();
    onResetProgress();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-sm game-card rounded-2xl p-6 border border-slate-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">
            Game Settings
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-5">
          {/* Sound Toggle */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {progress.settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Sound Effects</span>
                <span className="text-[11px] text-slate-400">Crystal placement & unlock tones</span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                progress.settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  progress.settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400">Disables confetti animations</span>
              </div>
            </div>

            <button
              onClick={handleToggleReducedMotion}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                progress.settings.reducedMotion ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  progress.settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Math Formal Notation Toggle */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-amber-400 font-mono font-bold text-xs px-1">∀x</span>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Formal Math View</span>
                <span className="text-[11px] text-slate-400">Shows formula badges under clues</span>
              </div>
            </div>

            <button
              onClick={handleToggleMathNotation}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer ${
                progress.settings.showFormalNotation ? 'bg-amber-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  progress.settings.showFormalNotation ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-3 border-t border-slate-800">
          {!confirmReset ? (
            <button
              onClick={() => {
                soundEngine.playClick();
                setConfirmReset(true);
              }}
              className="w-full py-2 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Progress</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-center flex flex-col gap-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Reset all cleared rooms back to Room 1?</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="w-1/2 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="w-1/2 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
