import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Zap,
  Timer,
  RotateCcw,
  Unlock,
  Shuffle,
  Star,
  Trophy,
  Lightbulb,
} from 'lucide-react';
import { PUZZLE_LEVELS } from '../../data/levels';
import { GAME_OBJECTS } from '../../data/objects';
import { evaluateLock } from '../../logic/evaluator';
import { SlotTarget } from '../GameBoard/SlotTarget';
import { ObjectTray } from '../GameBoard/ObjectTray';
import { ClueList } from '../Clues/ClueList';
import { HintModal } from '../Hints/HintModal';
import { soundEngine } from '../../services/sound';
import type { Arrangement } from '../../types/logic';
import type { PlayerProgress } from '../../types/game';

interface ChallengeViewProps {
  progress: PlayerProgress;
  onRecordBestTime: (levelId: number, seconds: number) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  progress,
  onRecordBestTime,
}) => {
  const [levelIndex, setLevelIndex] = useState(() => Math.floor(Math.random() * PUZZLE_LEVELS.length));
  const puzzle = PUZZLE_LEVELS[levelIndex];

  const [arrangement, setArrangement] = useState<Arrangement>(() =>
    new Array(puzzle.slotCount).fill(null)
  );
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [hoveredObjects, setHoveredObjects] = useState<string[]>([]);
  const [hoveredSlots, setHoveredSlots] = useState<number[]>([]);

  // Timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isSolved) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSolved]);

  const handlePickNewChallenge = () => {
    soundEngine.playClick();
    const nextIdx = (levelIndex + 1 + Math.floor(Math.random() * (PUZZLE_LEVELS.length - 1))) % PUZZLE_LEVELS.length;
    setLevelIndex(nextIdx);
    const newPuzzle = PUZZLE_LEVELS[nextIdx];
    setArrangement(new Array(newPuzzle.slotCount).fill(null));
    setSelectedObjectId(null);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setAttempts(0);
    setHintsUsed(0);
    setIsSolved(false);
  };

  const handleResetCurrent = () => {
    soundEngine.playClick();
    setArrangement(new Array(puzzle.slotCount).fill(null));
    setSelectedObjectId(null);
  };

  const evalResult = evaluateLock(arrangement, puzzle.constraints, puzzle.slotCount);

  const placedIds = arrangement.filter(Boolean) as string[];
  const unplacedIds = puzzle.availableObjects.filter((id) => !placedIds.includes(id));
  const availableGameObjects = puzzle.availableObjects.map((id) => GAME_OBJECTS[id]);

  const handlePlace = (slotIdx: number, objId: string) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      const cur = next.indexOf(objId);
      if (cur !== -1) next[cur] = null;
      next[slotIdx] = objId;
      return next;
    });
    setSelectedObjectId(null);
  };

  const handleRemove = (slotIdx: number) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setSelectedObjectId(null);
  };

  const handleCheck = () => {
    setAttempts((prev) => prev + 1);

    if (evalResult.solved) {
      soundEngine.playUnlock();
      setIsSolved(true);
      setIsTimerRunning(false);

      if (!progress.settings.reducedMotion) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
        });
      }

      onRecordBestTime(puzzle.id, secondsElapsed);
    } else {
      soundEngine.playError();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const calculateStars = () => {
    if (hintsUsed === 0 && attempts <= 2) return 3;
    if (hintsUsed <= 1 && attempts <= 4) return 2;
    return 1;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col gap-4">
      {/* Header & Stats Bar */}
      <div className="game-card p-3 sm:p-4 border border-game-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-400">
                Challenge Mode
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                Puzzle {puzzle.roomNumber}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {puzzle.name}
            </h2>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Stopwatch */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{formatTime(secondsElapsed)}</span>
          </div>

          {/* Attempts */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <span className="text-slate-500 text-[10px] mr-1">Tries:</span>
            <span className="font-bold">{attempts}</span>
          </div>

          {/* Hints used */}
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono">
            <span className="text-slate-500 text-[10px] mr-1">Hints:</span>
            <span className="font-bold">{hintsUsed}</span>
          </div>

          {/* Shuffle button */}
          <button
            onClick={handlePickNewChallenge}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Pick a random puzzle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout Grid (Board Left + Clues Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Board & Targets (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="game-card p-4 sm:p-5 border border-game-border flex flex-col items-center gap-4">
            {/* Slot Targets */}
            <div className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 py-2">
              {Array.from({ length: puzzle.slotCount }).map((_, slotIdx) => {
                const slotNum = slotIdx + 1;
                const placedId = arrangement[slotIdx];
                const occupiedObj = placedId ? GAME_OBJECTS[placedId] : null;

                return (
                  <SlotTarget
                    key={slotIdx}
                    slotNumber={slotNum}
                    occupiedObject={occupiedObj}
                    selectedObjectId={selectedObjectId}
                    isHighlighted={hoveredSlots.includes(slotNum)}
                    onPlaceObject={handlePlace}
                    onRemoveObject={handleRemove}
                    onSelectObject={(id) => setSelectedObjectId(id)}
                    disabled={isSolved}
                  />
                );
              })}
            </div>

            {/* Staging Inventory Tray */}
            <ObjectTray
              availableObjects={availableGameObjects}
              unplacedObjectIds={unplacedIds}
              selectedObjectId={selectedObjectId}
              highlightedObjectIds={hoveredObjects}
              onSelectObject={(id) => setSelectedObjectId(selectedObjectId === id ? null : id)}
              disabled={isSolved}
            />

            {/* Action Bar */}
            <div className="w-full flex items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={handleResetCurrent}
                disabled={isSolved}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEngine.playHint();
                    setIsHintModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hints ({hintsUsed})</span>
                </button>

                <button
                  onClick={handleCheck}
                  disabled={isSolved}
                  className={`px-4.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                    evalResult.solved
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : evalResult.isComplete
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>{evalResult.solved ? 'Solved! 🔓' : 'Check Lock'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clues */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <ClueList
            evaluations={evalResult.evaluations}
            conceptTag={puzzle.conceptTag}
            discreteMathConcept={puzzle.discreteMathConcept}
            showFormalNotation={false}
            onToggleFormalNotation={() => {}}
            onHoverStart={(objs, slots) => {
              setHoveredObjects(objs);
              if (slots) setHoveredSlots(slots);
            }}
            onHoverEnd={() => {
              setHoveredObjects([]);
              setHoveredSlots([]);
            }}
          />
        </div>
      </div>

      {/* Hints Modal */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={puzzle.hints}
        hintsRevealedCount={hintsUsed}
        onRevealNextHint={() => setHintsUsed((prev) => Math.min(prev + 1, puzzle.hints.length))}
      />

      {/* Solved Overlay */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-sm game-card rounded-2xl p-6 border border-amber-500/40 shadow-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Challenge Solved in {formatTime(secondsElapsed)}
            </h3>

            {/* Star Rating */}
            <div className="flex items-center gap-1 my-2.5">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= calculateStars()
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-slate-300 mb-5 font-mono">
              Attempts: {attempts} • Hints: {hintsUsed}
            </p>

            <button
              onClick={handlePickNewChallenge}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>Next Random Puzzle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
