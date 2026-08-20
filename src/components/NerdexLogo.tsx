import React from 'react';
import { motion } from 'motion/react';

interface NerdexLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  animate?: boolean;
}

export const NerdexLogo: React.FC<NerdexLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  animate = true
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconSizes = isSm ? 'w-7 h-7' : isLg ? 'w-12 h-12' : 'w-8 h-8 sm:w-9 sm:h-9';
  const titleSizes = isSm ? 'text-sm sm:text-base' : isLg ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg';
  const subSizes = isSm ? 'text-[8.5px] sm:text-[9.5px]' : isLg ? 'text-xs sm:text-sm' : 'text-[9px] sm:text-[10.5px]';

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Visual Emblem / Shield with Futuristic 'N' and Doom Arcane Rift */}
      <div className={`relative ${iconSizes} rounded-xl bg-gradient-to-br from-emerald-600 via-[#03060a] to-emerald-950 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.35)] shrink-0 overflow-hidden group-hover:border-emerald-400 transition-all`}>
        
        {/* Arcane Background Glow */}
        <div className="absolute inset-0 bg-radial from-emerald-400/20 via-transparent to-transparent opacity-80 pointer-events-none" />
        
        {/* Stylized Logo Vector: Cyber 'N' + Arcane Mask/Rift Shard */}
        <svg
          className="w-[72%] h-[72%] text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Hood Shard Accent */}
          <path
            d="M20 3L35 11V29L20 37L5 29V11L20 3Z"
            stroke="#10b981"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
          {/* Inner Sharp NERDEX 'N' with Titanium & Arcane Energy */}
          <path
            d="M11 28V12L29 28V12"
            stroke="url(#nerdexGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glowing Central Doom Eye Core */}
          <circle
            cx="20"
            cy="20"
            r="2"
            fill="#34d399"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="nerdexGrad" x1="11" y1="12" x2="29" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#ffffff" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Top Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-emerald-300 rounded-full shadow-[0_0_6px_#34d399]" />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        {/* NERDEX IN HIGH CONTRAST & PROMINENCE */}
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${titleSizes} font-black tracking-[0.14em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-sans`}>
            NERD<span className="text-emerald-400 font-extrabold text-shadow-glow">EX</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
        </div>

        {/* DOOMSDAY IN SLIGHTLY SMALLER SLEEK TRACKING BELOW */}
        {showSubtitle && (
          <div className="flex items-center gap-1 mt-0.5 sm:mt-1 leading-none">
            <span className={`${subSizes} font-mono font-bold tracking-[0.28em] text-emerald-400/90 uppercase`}>
              DOOMSDAY
            </span>
            <span className="text-[7.5px] font-mono text-slate-500 hidden sm:inline tracking-wider">
              • MCU
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
