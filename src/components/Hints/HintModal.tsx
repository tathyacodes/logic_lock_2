import React from 'react';
import { Lightbulb, ChevronRight, X, Sparkles, HelpCircle } from 'lucide-react';
import { soundEngine } from '../../services/sound';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: string[];
  hintsRevealedCount: number;
  onRevealNextHint: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hints,
  hintsRevealedCount,
  onRevealNextHint,
}) => {
  if (!isOpen) return null;

  const hintLabels = [
    { title: 'Hint 1: General Direction', desc: 'A helpful nudge without giving away the answer.' },
    { title: 'Hint 2: Key Deduction', desc: 'Rules out an impossible slot or links two pieces.' },
    { title: 'Hint 3: Direct Placement', desc: 'Tells you exactly where a crystal belongs.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-md game-card rounded-2xl p-6 border border-slate-700 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Puzzle Hints
            </h3>
            <p className="text-xs text-slate-400">
              Step-by-step clues to help you find the solution.
            </p>
          </div>
        </div>

        {/* 3 Tier Hints List */}
        <div className="space-y-2.5 mb-6">
          {hints.map((hintText, index) => {
            const isRevealed = index < hintsRevealedCount;
            const meta = hintLabels[index] || { title: `Hint ${index + 1}`, desc: '' };

            return (
              <div
                key={index}
                className={`p-3.5 rounded-xl border transition-all ${
                  isRevealed
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-100'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    {isRevealed ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    {meta.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                    {isRevealed ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                {isRevealed ? (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1.5 font-medium leading-relaxed">
                    {hintText}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-1">
                    {meta.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Unlocked: {hintsRevealedCount} of {hints.length}
          </span>

          <div className="flex items-center gap-2">
            {hintsRevealedCount < hints.length ? (
              <button
                onClick={() => {
                  soundEngine.playHint();
                  onRevealNextHint();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm hover:scale-102 active:scale-98"
              >
                <span>Unlock Next Hint</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-medium">
                All hints unlocked
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
