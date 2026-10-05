import React from 'react';
import { CrystalGlyph } from './CrystalGlyph';
import { GAME_OBJECTS } from '../../data/objects';

interface CrystalBadgeProps {
  objectId: string;
  className?: string;
}

export const CrystalBadge: React.FC<CrystalBadgeProps> = ({ objectId, className = '' }) => {
  const obj = GAME_OBJECTS[objectId];
  if (!obj) return <span>{objectId}</span>;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${obj.badgeBg} ${className}`}
    >
      <CrystalGlyph objectId={objectId} size="sm" />
      <span>{obj.name.replace(' Crystal', '')}</span>
    </span>
  );
};
