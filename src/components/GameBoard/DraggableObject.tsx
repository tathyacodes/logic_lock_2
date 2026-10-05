import React from 'react';
import type { GameObject } from '../../types/game';
import { CrystalGlyph } from '../shared/CrystalGlyph';
import { soundEngine } from '../../services/sound';

interface DraggableObjectProps {
  object: GameObject;
  isSelected: boolean;
  isHighlighted?: boolean;
  isInSlot?: boolean;
  slotIndex?: number;
  onSelect: (objId: string) => void;
  onDragStart?: (e: React.DragEvent, objId: string) => void;
  disabled?: boolean;
}

export const DraggableObject: React.FC<DraggableObjectProps> = ({
  object,
  isSelected,
  isHighlighted = false,
  isInSlot = false,
  slotIndex,
  onSelect,
  onDragStart,
  disabled = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;
    soundEngine.playPickup();
    e.dataTransfer.setData('text/plain', object.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(e, object.id);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    soundEngine.playPickup();
    onSelect(object.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={`${object.name} - Drag or click to place`}
      className={`relative select-none transition-all duration-150 transform cursor-grab active:cursor-grabbing ${
        isSelected
          ? 'scale-105 ring-2 ring-indigo-400 ring-offset-2 ring-offset-game-bg shadow-lg z-20'
          : 'hover:scale-105 hover:-translate-y-0.5'
      } ${
        isHighlighted
          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-game-bg animate-pulse z-10'
          : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
    >
      {/* Crystal Chassis */}
      <div
        className={`relative flex flex-col items-center justify-center px-3 py-2.5 rounded-xl border bg-gradient-to-b ${
          object.gradient
        } text-white shadow-md border-white/20 min-w-[70px] sm:min-w-[80px] min-h-[74px] sm:min-h-[82px] transition-all`}
      >
        {/* Faceted Vector SVG Gem */}
        <CrystalGlyph objectId={object.id} size="lg" className="drop-shadow-md mb-1" />

        {/* Crystal Label */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-center truncate max-w-[72px] text-white/95">
          {object.name.replace(' Crystal', '')}
        </span>

        {/* Slot tag if placed */}
        {isInSlot && slotIndex !== undefined && (
          <span className="absolute -top-1.5 -right-1.5 text-[9px] font-mono font-bold w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center shadow">
            {slotIndex}
          </span>
        )}
      </div>
    </div>
  );
};
