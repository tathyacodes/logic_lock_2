import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRightLeft,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { LAB_EXPERIMENTS } from '../../data/labLocks';
import { GAME_OBJECTS } from '../../data/objects';
import { compareLocks } from '../../logic/equivalence';
import { evaluateLock } from '../../logic/evaluator';
import { SlotTarget } from '../GameBoard/SlotTarget';
import { ObjectTray } from '../GameBoard/ObjectTray';
import { CrystalGlyph } from '../shared/CrystalGlyph';
import { soundEngine } from '../../services/sound';
import type { Arrangement } from '../../types/logic';

export const DiscoveryLabView: React.FC = () => {
  const [selectedExpIndex, setSelectedExpIndex] = useState(0);
  const experiment = LAB_EXPERIMENTS[selectedExpIndex];

  // Active testing arrangement for student's custom test
  const [arrangement, setArrangement] = useState<Arrangement>(() =>
    new Array(experiment.slotCount).fill(null)
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [testRun, setTestRun] = useState(false);

  // When experiment changes, reset test arrangement
  const handleSelectExperiment = (idx: number) => {
    soundEngine.playClick();
    setSelectedExpIndex(idx);
    const exp = LAB_EXPERIMENTS[idx];
    setArrangement(new Array(exp.slotCount).fill(null));
    setSelectedObjectId(null);
    setTestRun(false);
  };

  // Perform full mathematical equivalence analysis using logic engine
  const comparison = compareLocks(
    experiment.objects,
    experiment.lockA.constraints,
    experiment.lockB.constraints,
    experiment.slotCount,
    {
      concept: experiment.discreteMathInsight.concept,
      ruleName: experiment.discreteMathInsight.ruleName,
      formalRule: experiment.discreteMathInsight.formula,
    }
  );

  // Evaluate current user arrangement on both Lock A and Lock B
  const evalA = evaluateLock(arrangement, experiment.lockA.constraints, experiment.slotCount);
  const evalB = evaluateLock(arrangement, experiment.lockB.constraints, experiment.slotCount);

  // Object mapping
  const availableGameObjects = experiment.objects.map((id) => GAME_OBJECTS[id]);
  const placedIds = arrangement.filter(Boolean) as string[];
  const unplacedIds = experiment.objects.filter((id) => !placedIds.includes(id));

  const handlePlace = (slotIndex: number, objId: string) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      const curIdx = next.indexOf(objId);
      if (curIdx !== -1) next[curIdx] = null;
      next[slotIndex] = objId;
      return next;
    });
    setSelectedObjectId(null);
    setTestRun(true);
  };

  const handleRemove = (slotIndex: number) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setSelectedObjectId(null);
  };

  const handleApplyCounterexample = (ceArrangement: string[]) => {
    soundEngine.playClick();
    setArrangement([...ceArrangement]);
    setSelectedObjectId(null);
    setTestRun(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col gap-4">
      {/* Header & Experiment Tabs */}
      <div className="game-card p-4 sm:p-5 border border-game-border flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                Discovery Lab — Logical Equivalence
              </h2>
              <p className="text-xs text-slate-400">
                Compare two locks to see if they accept the exact same crystal arrangements.
              </p>
            </div>
          </div>
        </div>

        {/* Experiment Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {LAB_EXPERIMENTS.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => handleSelectExperiment(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                idx === selectedExpIndex
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>Exp {idx + 1}: {exp.discreteMathInsight.concept}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Dual Lock Comparison (Lock A vs Lock B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOCK A CARD */}
        <div className="game-card p-4 sm:p-4.5 border border-game-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800">
                Lock A
              </span>
              {testRun && evalA.isComplete && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    evalA.solved
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {evalA.solved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {evalA.solved ? 'Accepts' : 'Rejects'}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-slate-100 mb-1">
              {experiment.lockA.name}
            </h3>
            <p className="text-xs text-slate-300 mb-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
              "{experiment.lockA.description}"
            </p>

            <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/30 p-2 rounded border border-indigo-500/20">
              <span className="font-semibold text-indigo-400">Math Rule:</span> {experiment.lockA.formalRule || 'P'}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Valid arrangements:</span>
            <span className="font-bold text-indigo-400 font-mono text-sm">{comparison.lockASolutionCount}</span>
          </div>
        </div>

        {/* LOCK B CARD */}
        <div className="game-card p-4 sm:p-4.5 border border-game-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800">
                Lock B
              </span>
              {testRun && evalB.isComplete && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                    evalB.solved
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {evalB.solved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {evalB.solved ? 'Accepts' : 'Rejects'}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-slate-100 mb-1">
              {experiment.lockB.name}
            </h3>
            <p className="text-xs text-slate-300 mb-2.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
              "{experiment.lockB.description}"
            </p>

            <div className="text-[11px] font-mono text-purple-300 bg-purple-950/30 p-2 rounded border border-purple-500/20">
              <span className="font-semibold text-purple-400">Math Rule:</span> {experiment.lockB.formalRule || 'Q'}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Valid arrangements:</span>
            <span className="font-bold text-purple-400 font-mono text-sm">{comparison.lockBSolutionCount}</span>
          </div>
        </div>
      </div>

      {/* Live Testing Bench */}
      <div className="game-card p-4 sm:p-5 border border-game-border flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Testing Bench: Test Any Crystal Arrangement
            </h3>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              setArrangement(new Array(experiment.slotCount).fill(null));
              setSelectedObjectId(null);
              setTestRun(false);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear Bench
          </button>
        </div>

        {/* Slot Targets */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-1">
          {Array.from({ length: experiment.slotCount }).map((_, slotIdx) => {
            const slotNum = slotIdx + 1;
            const placedId = arrangement[slotIdx];
            const occupiedObj = placedId ? GAME_OBJECTS[placedId] : null;

            return (
              <SlotTarget
                key={slotIdx}
                slotNumber={slotNum}
                occupiedObject={occupiedObj}
                selectedObjectId={selectedObjectId}
                onPlaceObject={handlePlace}
                onRemoveObject={handleRemove}
                onSelectObject={(id) => setSelectedObjectId(id)}
              />
            );
          })}
        </div>

        {/* Object Tray */}
        <ObjectTray
          availableObjects={availableGameObjects}
          unplacedObjectIds={unplacedIds}
          selectedObjectId={selectedObjectId}
          highlightedObjectIds={[]}
          onSelectObject={(id) => setSelectedObjectId(selectedObjectId === id ? null : id)}
        />
      </div>

      {/* Solution-Set Comparison Dashboard */}
      <div className="game-card p-4 sm:p-5 border border-game-border flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
            Solution-Set Comparison
          </h3>
        </div>

        {/* Count Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-500/20 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Lock A Valid</span>
            <span className="text-xl font-bold text-indigo-400 font-mono">{comparison.lockASolutionCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Lock B Valid</span>
            <span className="text-xl font-bold text-purple-400 font-mono">{comparison.lockBSolutionCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Common (Both)</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{comparison.commonCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20 text-center">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Differences</span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              {comparison.onlyACount + comparison.onlyBCount}
            </span>
          </div>
        </div>

        {/* Equivalence Verdict or Counterexample */}
        {comparison.isEquivalent ? (
          <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/35 text-emerald-200 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-300 mb-0.5">
                Conclusion: Logically Equivalent!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Both Lock A and Lock B accept exactly the same set of arrangements.
                In Discrete Mathematics, when two sets of conditions allow the exact same solutions, they are <strong className="text-emerald-300">logically equivalent</strong>.
              </p>
              <div className="mt-1.5 text-xs font-mono font-bold text-emerald-400">
                Rule: {experiment.discreteMathInsight.formula}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/35 text-amber-200 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300 mb-0.5">
                  Counterexample Found! (Not Equivalent)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  These two locks do not behave the same. We found an arrangement that works for one lock but fails the other.
                  In mathematics, a single counterexample proves two rules are not equivalent!
                </p>
              </div>
            </div>

            {comparison.counterexample && (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-300">Counterexample:</span>
                  <div className="flex items-center gap-1.5">
                    {comparison.counterexample.arrangement.map((id, i) => (
                      <span key={i} className="flex items-center" title={GAME_OBJECTS[id]?.name}>
                        <CrystalGlyph objectId={id} size="sm" />
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleApplyCounterexample(comparison.counterexample!.arrangement)}
                  className="px-3 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-colors"
                >
                  Load into Test Bench
                </button>
              </div>
            )}

            {comparison.counterexample && (
              <p className="text-xs text-amber-300/90 italic">
                {comparison.counterexample.explanation}
              </p>
            )}
          </div>
        )}

        {/* Explanation */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mathematical Explanation</span>
          </div>
          <p>{experiment.discreteMathInsight.explanation}</p>
        </div>
      </div>
    </div>
  );
};
