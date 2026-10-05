import React from 'react';

interface CrystalGlyphProps {
  objectId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CrystalGlyph: React.FC<CrystalGlyphProps> = ({
  objectId,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const dim = sizeMap[size];

  switch (objectId) {
    case 'red':
      // Ruby: Brilliant hexagon crystal cut with reflective facets
      return (
        <svg viewBox="0 0 40 40" className={`${dim} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,2 35,11 35,29 20,38 5,29 5,11" fill="url(#rubyGrad)" stroke="#f43f5e" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="20,8 30,14 30,26 20,32 10,26 10,14" fill="#be123c" opacity="0.85" />
          <polygon points="20,2 35,11 30,14 20,8" fill="#fda4af" opacity="0.5" />
          <polygon points="5,11 20,2 20,8 10,14" fill="#fb7185" opacity="0.6" />
          <polygon points="35,11 35,29 30,26 30,14" fill="#9f1239" opacity="0.8" />
          <polygon points="5,11 5,29 10,26 10,14" fill="#e11d48" opacity="0.7" />
          <polygon points="20,38 35,29 30,26 20,32" fill="#881337" opacity="0.9" />
          <polygon points="20,38 5,29 10,26 20,32" fill="#9f1239" opacity="0.9" />
          <circle cx="16" cy="14" r="2.5" fill="#ffffff" opacity="0.4" />
          <defs>
            <linearGradient id="rubyGrad" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f5e" />
              <stop offset="0.5" stopColor="#e11d48" />
              <stop offset="1" stopColor="#9f1239" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'blue':
      // Sapphire: Classic diamond cut / emerald cut with deep cobalt facets
      return (
        <svg viewBox="0 0 40 40" className={`${dim} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,3 28,3 37,13 20,37 3,13" fill="url(#sapphireGrad)" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="12,3 28,3 32,13 8,13" fill="#93c5fd" opacity="0.45" />
          <polygon points="8,13 32,13 20,37" fill="#1d4ed8" opacity="0.8" />
          <polygon points="3,13 8,13 20,37" fill="#2563eb" opacity="0.6" />
          <polygon points="37,13 32,13 20,37" fill="#1e40af" opacity="0.9" />
          <polygon points="12,3 8,13 3,13" fill="#60a5fa" opacity="0.5" />
          <polygon points="28,3 32,13 37,13" fill="#3b82f6" opacity="0.6" />
          <circle cx="18" cy="11" r="2.5" fill="#ffffff" opacity="0.5" />
          <defs>
            <linearGradient id="sapphireGrad" x1="12" y1="3" x2="20" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="0.5" stopColor="#2563eb" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'green':
      // Emerald: Step emerald cut rectangle with beveled corners
      return (
        <svg viewBox="0 0 40 40" className={`${dim} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,4 30,4 36,10 36,30 30,36 10,36 4,30 4,10" fill="url(#emeraldGrad)" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="13,9 27,9 31,13 31,27 27,31 13,31 9,27 9,13" fill="#047857" opacity="0.85" />
          <polygon points="10,4 30,4 27,9 13,9" fill="#a7f3d0" opacity="0.45" />
          <polygon points="36,10 36,30 31,27 31,13" fill="#065f46" opacity="0.9" />
          <polygon points="10,36 30,36 27,31 13,31" fill="#064e3b" opacity="0.95" />
          <polygon points="4,10 4,30 9,27 9,13" fill="#10b981" opacity="0.6" />
          <circle cx="16" cy="12" r="2.5" fill="#ffffff" opacity="0.5" />
          <defs>
            <linearGradient id="emeraldGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#059669" />
              <stop offset="1" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'yellow':
      // Topaz: Radiant cushion / octagon gem with warm gold facets
      return (
        <svg viewBox="0 0 40 40" className={`${dim} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,3 36,11 36,29 20,37 4,29 4,11" fill="url(#topazGrad)" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="20,10 30,15 30,25 20,30 10,25 10,15" fill="#b45309" opacity="0.8" />
          <polygon points="20,3 36,11 30,15 20,10" fill="#fde68a" opacity="0.5" />
          <polygon points="4,11 20,3 20,10 10,15" fill="#fcd34d" opacity="0.6" />
          <polygon points="36,11 36,29 30,25 30,15" fill="#92400e" opacity="0.85" />
          <polygon points="4,11 4,29 10,25 10,15" fill="#d97706" opacity="0.65" />
          <polygon points="20,37 36,29 30,25 20,30" fill="#78350f" opacity="0.9" />
          <polygon points="20,37 4,29 10,25 20,30" fill="#92400e" opacity="0.9" />
          <circle cx="17" cy="13" r="2.5" fill="#ffffff" opacity="0.5" />
          <defs>
            <linearGradient id="topazGrad" x1="4" y1="3" x2="36" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="0.5" stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'purple':
      // Amethyst: Elongated marquise / prism crystal point
      return (
        <svg viewBox="0 0 40 40" className={`${dim} ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,2 35,14 28,38 12,38 5,14" fill="url(#amethystGrad)" stroke="#c084fc" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="20,10 29,18 24,33 16,33 11,18" fill="#7e22ce" opacity="0.85" />
          <polygon points="20,2 35,14 29,18 20,10" fill="#e9d5ff" opacity="0.45" />
          <polygon points="20,2 5,14 11,18 20,10" fill="#d8b4fe" opacity="0.55" />
          <polygon points="35,14 28,38 24,33 29,18" fill="#581c87" opacity="0.9" />
          <polygon points="5,14 12,38 16,33 11,18" fill="#9333ea" opacity="0.7" />
          <circle cx="17" cy="14" r="2.5" fill="#ffffff" opacity="0.5" />
          <defs>
            <linearGradient id="amethystGrad" x1="5" y1="2" x2="35" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c084fc" />
              <stop offset="0.5" stopColor="#9333ea" />
              <stop offset="1" stopColor="#581c87" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return (
        <div className={`${dim} rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs text-white`}>
          ?
        </div>
      );
  }
};
