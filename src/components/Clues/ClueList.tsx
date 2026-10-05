import React from 'react';
import { ListChecks, Code, BookOpen } from 'lucide-react';
import type { ConstraintEvaluation } from '../../types/logic';
import { ClueCard } from './ClueCard';

interface ClueListProps {
  evaluations: ConstraintEvaluation[];
  conceptTag?: string;
  discreteMathConcept?: string;
  showFormalNotation: boolean;
  onToggleFormalNotation: () => void;
  onHoverStart: (objects: string[], slots?: number[]) => void;
  onHoverEnd: () => void;
}

export const ClueList: React.FC<ClueListProps> = ({
  evaluations,
  conceptTag,
  discreteMathConcept,
  showFormalNotation,
  onToggleFormalNotation,
  onHoverStart,
  onHoverEnd,
}) => {
  return (
    <div className="w-full game-card p-4 sm:p-4.5 border border-game-border flex flex-col gap-3">
      {/* Clues Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider">
            Clues ({evaluations.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {conceptTag && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {conceptTag}
            </span>
          )}

          <button
            onClick={onToggleFormalNotation}
            className={`text-[11px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
              showFormalNotation
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle formal mathematical notation"
          >
            <Code className="w-3 h-3" />
            <span>Math Form</span>
          </button>
        </div>
      </div>

      {/* Discrete Math Concept Banner (if toggled) */}
      {discreteMathConcept && showFormalNotation && (
        <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs">
          <span className="font-bold text-indigo-300">Underlying Principle:</span> {discreteMathConcept}
        </div>
      )}

      {/* Clue cards */}
      <div className="flex flex-col gap-2">
        {evaluations.map((evaluation, idx) => (
          <ClueCard
            key={evaluation.constraintId}
            evaluation={evaluation}
            index={idx}
            showFormalNotation={showFormalNotation}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>

      {/* Subtle interaction guidance */}
      <div className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-800/80">
        Hover a clue to highlight the crystals and slots it refers to.
      </div>
    </div>
  );
};
