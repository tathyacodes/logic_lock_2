import type { GameObject } from '../types/game';

export interface CrystalVisual {
  id: string;
  name: string;
  shortName: string;
  colorName: string;
  colorHex: string;
  accentColor: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  shape: 'ruby' | 'sapphire' | 'emerald' | 'topaz' | 'amethyst' | 'star' | 'key';
}

export const GAME_OBJECTS: Record<string, GameObject> = {
  red: {
    id: 'red',
    name: 'Red Crystal',
    symbol: 'Ruby',
    colorName: 'Ruby Red',
    colorHex: '#e11d48',
    accentGlow: 'rgba(225, 29, 72, 0.45)',
    gradient: 'from-rose-500 via-rose-600 to-rose-800',
    borderClass: 'border-rose-400',
    badgeBg: 'bg-rose-950/70 text-rose-300 border-rose-500/40',
  },
  blue: {
    id: 'blue',
    name: 'Blue Crystal',
    symbol: 'Sapphire',
    colorName: 'Sapphire Blue',
    colorHex: '#2563eb',
    accentGlow: 'rgba(37, 99, 235, 0.45)',
    gradient: 'from-blue-500 via-blue-600 to-indigo-800',
    borderClass: 'border-blue-400',
    badgeBg: 'bg-blue-950/70 text-blue-300 border-blue-500/40',
  },
  green: {
    id: 'green',
    name: 'Green Crystal',
    symbol: 'Emerald',
    colorName: 'Emerald Green',
    colorHex: '#059669',
    accentGlow: 'rgba(5, 150, 105, 0.45)',
    gradient: 'from-emerald-400 via-emerald-600 to-emerald-800',
    borderClass: 'border-emerald-400',
    badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
  },
  yellow: {
    id: 'yellow',
    name: 'Yellow Crystal',
    symbol: 'Topaz',
    colorName: 'Amber Yellow',
    colorHex: '#d97706',
    accentGlow: 'rgba(217, 119, 6, 0.45)',
    gradient: 'from-amber-400 via-amber-500 to-amber-700',
    borderClass: 'border-amber-400',
    badgeBg: 'bg-amber-950/70 text-amber-300 border-amber-500/40',
  },
  purple: {
    id: 'purple',
    name: 'Purple Crystal',
    symbol: 'Amethyst',
    colorName: 'Amethyst Violet',
    colorHex: '#9333ea',
    accentGlow: 'rgba(147, 51, 234, 0.45)',
    gradient: 'from-purple-400 via-purple-600 to-purple-800',
    borderClass: 'border-purple-400',
    badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
  },
  star: {
    id: 'star',
    name: 'Gold Star',
    symbol: 'Star',
    colorName: 'Golden Star',
    colorHex: '#eab308',
    accentGlow: 'rgba(234, 179, 8, 0.45)',
    gradient: 'from-yellow-300 via-amber-400 to-amber-600',
    borderClass: 'border-yellow-400',
    badgeBg: 'bg-yellow-950/70 text-yellow-300 border-yellow-500/40',
  },
  key: {
    id: 'key',
    name: 'Silver Key',
    symbol: 'Key',
    colorName: 'Key Silver',
    colorHex: '#0284c7',
    accentGlow: 'rgba(2, 132, 199, 0.45)',
    gradient: 'from-sky-400 via-sky-600 to-blue-800',
    borderClass: 'border-sky-400',
    badgeBg: 'bg-sky-950/70 text-sky-300 border-sky-500/40',
  },
};
