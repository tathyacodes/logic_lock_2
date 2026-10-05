import React from 'react';
import { Check, X, Circle, Code2 } from 'lucide-react';
import type { ConstraintEvaluation } from '../../types/logic';
import { CrystalGlyph } from '../shared/CrystalGlyph';

interface ClueCardProps {
  evaluation: ConstraintEvaluation;
  index: number;
  showFormalNotation: boolean;
  onHoverStart: (objects: string[], slots?: number[]) => void;
  onHoverEnd: () => void;
}

export const ClueCard: React.FC<ClueCardProps> = ({
  evaluation,
  index,
  showFormalNotation,
  onHoverStart,
  onHoverEnd,
}) => {
  const isSatisfied = evaluation.satisfied;

  return (
    <div
      onMouseEnter={() => onHoverStart(evaluation.involvedObjects, evaluation.involvedSlots)}
      onMouseLeave={onHoverEnd}
      className={`relative p-3 sm:p-3.5 rounded-xl border transition-all duration-150 group cursor-pointer ${
        isSatisfied
          ? 'bg-emerald-950/20 border-emerald-500/35 hover:border-emerald-400 hover:bg-emerald-950/30'
          : 'bg-game-surface border-slate-800 hover:border-slate-600 hover:bg-game-card'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator Icon */}
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5 transition-colors ${
            isSatisfied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          {isSatisfied ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <X className="w-3.5 h-3.5 text-rose-400 stroke-[2.5]" />
          )}
        </div>

        {/* Clue Text & Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clue {index + 1}
            </span>

            {/* Small referenced crystals preview */}
            <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
              {evaluation.involvedObjects.map((objId) => (
                <CrystalGlyph key={objId} objectId={objId} size="sm" />
              ))}
            </div>
          </div>

          {/* Natural Clue Text */}
          <p
            className={`text-xs sm:text-sm font-medium leading-relaxed ${
              isSatisfied ? 'text-emerald-100' : 'text-slate-200'
            }`}
          >
            {evaluation.message}
          </p>

          {/* Optional Discrete Mathematics Formal Notation */}
          {showFormalNotation && evaluation.formalNotation && (
            <div className="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
              <Code2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              <span className="truncate">{evaluation.formalNotation}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
