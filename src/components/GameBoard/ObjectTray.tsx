import React from 'react';
import type { GameObject } from '../../types/game';
import { DraggableObject } from './DraggableObject';

interface ObjectTrayProps {
  availableObjects: GameObject[];
  unplacedObjectIds: string[];
  selectedObjectId: string | null;
  highlightedObjectIds: string[];
  onSelectObject: (objectId: string) => void;
  disabled?: boolean;
}

export const ObjectTray: React.FC<ObjectTrayProps> = ({
  availableObjects,
  unplacedObjectIds,
  selectedObjectId,
  highlightedObjectIds,
  onSelectObject,
  disabled = false,
}) => {
  const unplacedObjects = availableObjects.filter((obj) =>
    unplacedObjectIds.includes(obj.id)
  );

  return (
    <div className="w-full game-card p-3.5 sm:p-4 border border-game-border flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Available Crystals ({unplacedObjects.length})
        </h3>
        <span className="text-[11px] text-slate-400">
          {selectedObjectId
            ? 'Crystal selected — tap a slot or drag to place'
            : 'Click or drag a crystal into a slot'}
        </span>
      </div>

      <div className="min-h-[82px] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-2 rounded-xl bg-slate-900/40 border border-slate-800">
        {unplacedObjects.length === 0 ? (
          <div className="text-center py-2 text-slate-400 text-xs font-medium">
            All crystals are in slots. Check your clues to see if they match!
          </div>
        ) : (
          unplacedObjects.map((obj) => (
            <DraggableObject
              key={obj.id}
              object={obj}
              isSelected={selectedObjectId === obj.id}
              isHighlighted={highlightedObjectIds.includes(obj.id)}
              onSelect={onSelectObject}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
};
