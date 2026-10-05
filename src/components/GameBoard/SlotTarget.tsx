import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { GameObject } from '../../types/game';
import { DraggableObject } from './DraggableObject';
import { soundEngine } from '../../services/sound';

interface SlotTargetProps {
  slotNumber: number; // 1-indexed (1, 2, 3...)
  occupiedObject?: GameObject | null;
  selectedObjectId: string | null;
  isHighlighted?: boolean;
  onPlaceObject: (slotIndex: number, objectId: string) => void;
  onRemoveObject: (slotIndex: number) => void;
  onSelectObject: (objectId: string) => void;
  disabled?: boolean;
}

export const SlotTarget: React.FC<SlotTargetProps> = ({
  slotNumber,
  occupiedObject,
  selectedObjectId,
  isHighlighted = false,
  onPlaceObject,
  onRemoveObject,
  onSelectObject,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    const objectId = e.dataTransfer.getData('text/plain');
    if (objectId) {
      soundEngine.playDrop();
      onPlaceObject(slotNumber - 1, objectId);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (selectedObjectId) {
      soundEngine.playDrop();
      onPlaceObject(slotNumber - 1, selectedObjectId);
    } else if (occupiedObject) {
      soundEngine.playPickup();
      onSelectObject(occupiedObject.id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Slot label */}
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-[11px] font-semibold text-slate-400">
          Slot {slotNumber}
        </span>
      </div>

      {/* Target Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative flex items-center justify-center w-22 sm:w-26 h-26 sm:h-30 rounded-xl transition-all duration-150 border-2 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/15 scale-102 shadow-md'
            : isHighlighted
            ? 'border-amber-400 bg-amber-500/10 shadow-md animate-pulse'
            : occupiedObject
            ? 'border-slate-700 bg-game-surface shadow-sm'
            : 'border-dashed border-slate-700/80 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/70'
        } ${selectedObjectId ? 'cursor-pointer hover:border-indigo-400' : ''}`}
      >
        {occupiedObject ? (
          <div className="relative group">
            <DraggableObject
              object={occupiedObject}
              isSelected={selectedObjectId === occupiedObject.id}
              isInSlot={true}
              slotIndex={slotNumber}
              onSelect={onSelectObject}
              disabled={disabled}
            />

            {/* Quick remove button */}
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick();
                  onRemoveObject(slotNumber - 1);
                }}
                title="Remove crystal"
                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-600 flex items-center justify-center shadow-md opacity-80 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 p-2 pointer-events-none select-none text-center">
            <div className="w-7 h-7 rounded-full border border-slate-700 flex items-center justify-center mb-1 text-slate-500 font-mono text-xs font-bold">
              {slotNumber}
            </div>
            <span className="text-[10px] text-slate-400">
              {selectedObjectId ? 'Click to place' : 'Empty'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
