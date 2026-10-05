import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Unlock,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Trophy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import type { PuzzleLevel, PlayerProgress } from '../../types/game';
import type { Arrangement } from '../../types/logic';
import { GAME_OBJECTS } from '../../data/objects';
import { evaluateLock } from '../../logic/evaluator';
import { LockMechanism } from '../Lock/LockMechanism';
import { SlotTarget } from '../GameBoard/SlotTarget';
import { ObjectTray } from '../GameBoard/ObjectTray';
import { ClueList } from '../Clues/ClueList';
import { HintModal } from '../Hints/HintModal';
import { soundEngine } from '../../services/sound';

interface AdventureViewProps {
  levels: PuzzleLevel[];
  currentLevelIndex: number;
  progress: PlayerProgress;
  onSelectLevelIndex: (index: number) => void;
  onCompleteLevel: (levelId: number, hintsUsed: number, attempts: number) => void;
}

export const AdventureView: React.FC<AdventureViewProps> = ({
  levels,
  currentLevelIndex,
  progress,
  onSelectLevelIndex,
  onCompleteLevel,
}) => {
  const currentLevel = levels[currentLevelIndex] || levels[0];

  // Arrangement state: array of object IDs or null
  const [arrangement, setArrangement] = useState<Arrangement>(() =>
    new Array(currentLevel.slotCount).fill(null)
  );

  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hoveredObjects, setHoveredObjects] = useState<string[]>([]);
  const [hoveredSlots, setHoveredSlots] = useState<number[]>([]);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [showFormalNotation, setShowFormalNotation] = useState(
    progress.settings.showFormalNotation
  );

  // Reset board state when switching levels
  useEffect(() => {
    setArrangement(new Array(currentLevel.slotCount).fill(null));
    setSelectedObjectId(null);
    setHoveredObjects([]);
    setHoveredSlots([]);
    setHintsRevealed(0);
    setAttempts(0);
    setIsUnlocked(false);
    setShowNextOverlay(false);
  }, [currentLevelIndex, currentLevel.slotCount]);

  // Live evaluation of current arrangement against constraints
  const evaluationResult = evaluateLock(
    arrangement,
    currentLevel.constraints,
    currentLevel.slotCount
  );

  // Calculate unplaced objects
  const placedObjectIds = arrangement.filter(Boolean) as string[];
  const unplacedObjectIds = currentLevel.availableObjects.filter(
    (id) => !placedObjectIds.includes(id)
  );

  // Available GameObject definitions
  const availableGameObjects = currentLevel.availableObjects.map(
    (id) => GAME_OBJECTS[id]
  );

  // Place object into a slot
  const handlePlaceObject = (slotIndex: number, objId: string) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      const existingIdx = next.indexOf(objId);
      if (existingIdx !== -1) {
        next[existingIdx] = null;
      }
      next[slotIndex] = objId;
      return next;
    });
    setSelectedObjectId(null);
  };

  // Remove object from a slot
  const handleRemoveObject = (slotIndex: number) => {
    soundEngine.playDrop();
    setArrangement((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setSelectedObjectId(null);
  };

  // Reset current board
  const handleResetBoard = () => {
    soundEngine.playClick();
    setArrangement(new Array(currentLevel.slotCount).fill(null));
    setSelectedObjectId(null);
  };

  // Check / Unlock button handler
  const handleCheckUnlock = () => {
    setAttempts((prev) => prev + 1);

    if (evaluationResult.solved) {
      soundEngine.playUnlock();
      setIsUnlocked(true);

      if (!progress.settings.reducedMotion) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      }

      onCompleteLevel(currentLevel.id, hintsRevealed, attempts + 1);

      setTimeout(() => {
        setShowNextOverlay(true);
      }, 500);
    } else {
      soundEngine.playError();
    }
  };

  const handleNextRoom = () => {
    soundEngine.playClick();
    setShowNextOverlay(false);
    if (currentLevelIndex < levels.length - 1) {
      onSelectLevelIndex(currentLevelIndex + 1);
    }
  };

  const isLevelCompleted = progress.completedLevels.includes(currentLevel.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:py-5 flex flex-col gap-4">
      {/* Top Header & Room Stepper */}
      <div className="game-card p-3 sm:p-4 border border-game-border flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Navigation & Room Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentLevelIndex > 0) {
                soundEngine.playClick();
                onSelectLevelIndex(currentLevelIndex - 1);
              }
            }}
            disabled={currentLevelIndex === 0}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-slate-500 transition-colors"
            title="Previous Room"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-400">
                Room {currentLevel.roomNumber} of {levels.length}
              </span>
              {isLevelCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> Solved
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              {currentLevel.name}
            </h2>
          </div>

          <button
            onClick={() => {
              if (currentLevelIndex < levels.length - 1) {
                soundEngine.playClick();
                onSelectLevelIndex(currentLevelIndex + 1);
              }
            }}
            disabled={currentLevelIndex >= progress.highestUnlockedLevel - 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-slate-500 transition-colors"
            title="Next Room"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Room Progress Stepper */}
        <div className="flex items-center gap-1.5">
          {levels.map((lvl, idx) => {
            const isDone = progress.completedLevels.includes(lvl.id);
            const isCurrent = idx === currentLevelIndex;
            const isUnlockedLvl = idx < progress.highestUnlockedLevel;

            return (
              <button
                key={lvl.id}
                disabled={!isUnlockedLvl}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectLevelIndex(idx);
                }}
                title={`Room ${lvl.roomNumber}: ${lvl.name}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-indigo-400 ring-2 ring-indigo-400 ring-offset-2 ring-offset-game-bg scale-125'
                    : isDone
                    ? 'bg-emerald-400'
                    : isUnlockedLvl
                    ? 'bg-slate-700 hover:bg-slate-500'
                    : 'bg-slate-900 opacity-40 cursor-not-allowed'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Single-Viewport Layout Grid (Board Left + Clues Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column: Puzzle Bench (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="game-card p-4 sm:p-5 border border-game-border flex flex-col items-center gap-4">
            {/* Lock Mechanism Header */}
            <LockMechanism
              isSolved={evaluationResult.solved}
              isComplete={evaluationResult.isComplete}
              satisfiedCluesCount={evaluationResult.satisfiedCount}
              totalCluesCount={evaluationResult.totalCount}
            />

            {/* Slots Area */}
            <div className="w-full py-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                {Array.from({ length: currentLevel.slotCount }).map((_, slotIdx) => {
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
                      onPlaceObject={handlePlaceObject}
                      onRemoveObject={handleRemoveObject}
                      onSelectObject={(objId) => setSelectedObjectId(objId)}
                      disabled={isUnlocked}
                    />
                  );
                })}
              </div>
            </div>

            {/* Staging Inventory Tray */}
            <ObjectTray
              availableObjects={availableGameObjects}
              unplacedObjectIds={unplacedObjectIds}
              selectedObjectId={selectedObjectId}
              highlightedObjectIds={hoveredObjects}
              onSelectObject={(id) => {
                setSelectedObjectId(selectedObjectId === id ? null : id);
              }}
              disabled={isUnlocked}
            />

            {/* Action Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={handleResetBoard}
                disabled={isUnlocked}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Slots</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEngine.playHint();
                    setIsHintModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hints ({hintsRevealed}/{currentLevel.hints.length})</span>
                </button>

                <button
                  onClick={handleCheckUnlock}
                  disabled={isUnlocked}
                  className={`px-4.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                    evaluationResult.solved
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold animate-pulse'
                      : evaluationResult.isComplete
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>{evaluationResult.solved ? 'Unlocked! 🔓' : 'Check Lock'}</span>
                </button>
              </div>
            </div>

            {/* Feedback Banners */}
            {!evaluationResult.isComplete && (
              <div className="w-full py-1.5 px-3 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 text-xs text-center">
                Place all {currentLevel.slotCount} crystals to test the lock.
              </div>
            )}
            {evaluationResult.isComplete && !evaluationResult.solved && (
              <div className="w-full py-2 px-3 rounded-lg bg-rose-950/30 border border-rose-500/35 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  {evaluationResult.violatedIds.length} clue{evaluationResult.violatedIds.length > 1 ? 's' : ''} not satisfied. Check the clues on the right!
                </span>
              </div>
            )}
            {evaluationResult.solved && (
              <div className="w-full py-2 px-3 rounded-lg bg-emerald-950/30 border border-emerald-500/35 text-emerald-300 text-xs text-center flex items-center justify-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>All clues match! The door is ready to open.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dedicated Clues Panel (5 cols, Always Visible!) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <ClueList
            evaluations={evaluationResult.evaluations}
            conceptTag={currentLevel.conceptTag}
            discreteMathConcept={currentLevel.discreteMathConcept}
            showFormalNotation={showFormalNotation}
            onToggleFormalNotation={() => setShowFormalNotation(!showFormalNotation)}
            onHoverStart={(objects, slots) => {
              setHoveredObjects(objects);
              if (slots) setHoveredSlots(slots);
            }}
            onHoverEnd={() => {
              setHoveredObjects([]);
              setHoveredSlots([]);
            }}
          />

          {/* Simple Room Note */}
          <div className="game-card p-3 border border-game-border text-xs text-slate-300">
            <span className="font-semibold text-slate-400 block mb-0.5">Room Note:</span>
            <p className="italic text-slate-400 leading-relaxed">
              "{currentLevel.description}"
            </p>
          </div>
        </div>
      </div>

      {/* 3-Tier Hints Dialog */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hints={currentLevel.hints}
        hintsRevealedCount={hintsRevealed}
        onRevealNextHint={() =>
          setHintsRevealed((prev) => Math.min(prev + 1, currentLevel.hints.length))
        }
      />

      {/* Room Unlock Success Overlay */}
      {showNextOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-pop-in">
          <div className="relative w-full max-w-sm game-card rounded-2xl p-6 border border-emerald-500/40 shadow-2xl text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
              {currentLevel.isVaultLevel ? (
                <Trophy className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6" />
              )}
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {currentLevel.isVaultLevel ? 'Vault Cleared!' : 'Room Solved!'}
            </h3>

            <p className="text-xs text-slate-300 mb-5">
              {currentLevel.isVaultLevel
                ? 'Congratulations! You solved all 10 rooms using logic and deduction.'
                : 'The lock clicks open. You can now advance to the next room.'}
            </p>

            <div className="flex items-center gap-2.5 w-full">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowNextOverlay(false);
                }}
                className="w-1/2 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Stay Here
              </button>

              {currentLevelIndex < levels.length - 1 ? (
                <button
                  onClick={handleNextRoom}
                  className="w-1/2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Next Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setShowNextOverlay(false);
                  }}
                  className="w-1/2 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Completed!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
