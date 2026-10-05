import React from 'react';
import { Lock, Unlock, CheckCircle2, AlertCircle } from 'lucide-react';

interface LockMechanismProps {
  isSolved: boolean;
  isComplete: boolean;
  satisfiedCluesCount: number;
  totalCluesCount: number;
}

export const LockMechanism: React.FC<LockMechanismProps> = ({
  isSolved,
  isComplete,
  satisfiedCluesCount,
  totalCluesCount,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2 px-1 w-full select-none">
      {/* Physical Lock Graphic + Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex flex-col items-center">
          {/* Shackle */}
          <div
            className={`w-7 h-5 rounded-t-full border-[3.5px] transition-all duration-500 ${
              isSolved
                ? 'border-emerald-400 -translate-y-2.5 -rotate-16 origin-bottom-left'
                : 'border-slate-400 border-b-0'
            }`}
          />
          {/* Lock Body */}
          <div
            className={`-mt-1 w-10 h-9 rounded-lg border flex items-center justify-center transition-all ${
              isSolved
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {isSolved ? (
              <Unlock className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight ${
                isSolved ? 'text-emerald-400' : 'text-slate-100'
              }`}
            >
              {isSolved ? 'Room Unlocked' : 'Door Lock'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isSolved
              ? 'All clues are satisfied'
              : isComplete
              ? 'Crystals placed — ready to test'
              : 'Arrange the crystals to match the clues'}
          </p>
        </div>
      </div>

      {/* Clues Match Badge */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          isSolved
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
            : satisfiedCluesCount === totalCluesCount
            ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
            : 'bg-slate-900/60 text-slate-400 border-slate-800'
        }`}
      >
        {isSolved ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
        )}
        <span>
          {satisfiedCluesCount} of {totalCluesCount} clues matched
        </span>
      </div>
    </div>
  );
};
