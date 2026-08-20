import React from 'react';
import { motion } from 'motion/react';

interface DoomMaskEmblemProps {
  onInteract?: () => void;
}

export const DoomMaskEmblem: React.FC<DoomMaskEmblemProps> = ({ onInteract }) => {
  return (
    <div
      onClick={onInteract}
      className="relative flex items-center justify-center cursor-pointer select-none group py-2 sm:py-4 my-1"
      id="doom-center-emblem"
    >
      {/* ========================================================================= */}
      {/* GLOWING ORBITING PLANETS AROUND THE EMBLEM (NEUTRAL TONES) */}
      {/* ========================================================================= */}

      {/* Orbit Track 1: Outer Planet (Titanium / Silver Planet) */}
      <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-slate-500/20 border-dashed pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          {/* Planet 1: Titanium / Silver */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-slate-200 via-slate-400 to-slate-800 border border-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-center justify-center">
              {/* Continental Neutral Swirl Detail */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-100/70 blur-[0.5px]" />
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
            </div>
            <span className="text-[7px] sm:text-[8px] font-mono font-bold text-slate-300 mt-0.5 tracking-tighter opacity-80 whitespace-nowrap drop-shadow">
              616
            </span>
          </div>
        </motion.div>
      </div>

      {/* Orbit Track 2: Counter-Rotating Planet (Platinum / Zinc Planet) */}
      <div className="absolute w-48 h-48 sm:w-70 sm:h-70 rounded-full border border-slate-600/20 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          {/* Planet 2: Platinum / Zinc */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-zinc-100 via-zinc-400 to-zinc-900 border border-zinc-300 shadow-[0_0_10px_rgba(228,228,231,0.4)] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-slate-200/80" />
            </div>
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-zinc-300 mt-0.5 tracking-tighter opacity-80 whitespace-nowrap drop-shadow">
              838
            </span>
          </div>
        </motion.div>
      </div>

      {/* Orbit Track 3: Intermediate Planet (Pearl / Moon Planet) */}
      <div className="absolute w-42 h-42 sm:w-60 sm:h-60 rounded-full border border-slate-700/25 border-dotted pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          {/* Planet 3: Pearl / Moon Shard */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-tr from-slate-100 via-slate-400 to-slate-800 border border-slate-200 shadow-[0_0_8px_rgba(203,213,225,0.35)] flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-white animate-pulse" />
            </div>
            <span className="text-[6px] sm:text-[7px] font-mono font-bold text-slate-400 mt-0.5 tracking-tighter opacity-80 whitespace-nowrap drop-shadow">
              BW
            </span>
          </div>
        </motion.div>
      </div>

      {/* Orbit Track 4: Inner Shimmering Satellite (Silver Spark) */}
      <div className="absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full border border-slate-700/20 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          {/* Planet 4: Silver Spark Satellite */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2">
            <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-100 border border-white shadow-[0_0_10px_rgba(255,255,255,0.7)]">
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Latverian Arcane Radial Glow Backdrop */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
      />

      {/* Main Multi-ring Emblem Architecture */}
      <div className="w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-emerald-500/30 flex items-center justify-center relative transition-all duration-300 group-hover:border-emerald-500/60 shadow-[0_0_30px_rgba(0,0,0,0.85)] z-10">
        {/* Top Glowing Diode */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full blur-[2px] opacity-80 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>

        {/* Second Titanium Ring */}
        <div className="w-38 h-38 sm:w-56 sm:h-56 rounded-full border border-slate-400/20 flex items-center justify-center">
          {/* Inner Core */}
          <div className="w-34 h-34 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-emerald-950/70 via-[#040906] to-emerald-900/40 border-2 sm:border-[3px] border-slate-400/90 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)] relative overflow-hidden group-hover:border-slate-200 transition-all duration-300 px-2 pt-1 pb-2">
            
            {/* 1. Central Doom Titanium & Hood Mask Icon (Shifted Upwards) */}
            <div className="relative -mt-1 sm:-mt-2 mb-0.5 flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-11 h-11 sm:w-15 sm:h-15 flex items-center justify-center"
              >
                <svg
                  className="w-full h-full drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Green Hood Outline */}
                  <path
                    d="M12 95 C10 65, 18 20, 50 10 C82 20, 90 65, 88 95 C78 95, 70 88, 65 88 C50 92, 35 88, 12 95 Z"
                    fill="#064e3b"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  {/* Inner Hood Dark Void */}
                  <path
                    d="M22 88 C20 60, 26 28, 50 22 C74 28, 80 60, 78 88 C70 82, 60 84, 50 84 C40 84, 30 82, 22 88 Z"
                    fill="#02140d"
                  />
                  {/* Titanium Metallic Face Plate */}
                  <path
                    d="M30 42 C30 36, 40 34, 50 34 C60 34, 70 36, 70 42 C72 58, 68 76, 50 82 C32 76, 28 58, 30 42 Z"
                    fill="url(#metalGradSleek)"
                    stroke="#cbd5e1"
                    strokeWidth="1.8"
                  />
                  {/* Eye Slits with Glowing Emerald Energy */}
                  <path
                    d="M35 48 L44 50 L44 54 L36 53 Z"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                  <path
                    d="M65 48 L56 50 L56 54 L64 53 Z"
                    fill="#10b981"
                    className="animate-pulse"
                  />
                  {/* Nose and cheek */}
                  <path
                    d="M50 48 L50 62 M47 62 L53 62"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Mouth Grille */}
                  <rect x="42" y="68" width="16" height="2" rx="1" fill="#0f172a" />
                  <rect x="44" y="72" width="12" height="2" rx="1" fill="#0f172a" />
                  <rect x="46" y="76" width="8" height="1.8" rx="0.9" fill="#0f172a" />
                  
                  <circle cx="32" cy="85" r="2.5" fill="#e2e8f0" stroke="#064e3b" />
                  <circle cx="68" cy="85" r="2.5" fill="#e2e8f0" stroke="#064e3b" />

                  <defs>
                    <linearGradient id="metalGradSleek" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="35%" stopColor="#94a3b8" />
                      <stop offset="70%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#e2e8f0" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </div>

            {/* 2. PREPARE-SE PARA (Below Mask, Above DOOMSDAY) */}
            <div className="text-[7px] sm:text-[8.5px] text-emerald-400 font-mono font-bold tracking-[0.24em] uppercase drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] mt-0.5 mb-0.5 leading-tight text-center">
              PREPARE-SE PARA
            </div>

            {/* 3. Prominent DOOMSDAY */}
            <div className="text-center px-1 select-none leading-tight">
              <div className="text-base sm:text-xl font-black leading-none tracking-[0.14em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-sans">
                DOOMS<span className="text-emerald-400 font-extrabold">DAY</span>
              </div>
            </div>

            {/* Titanium Glowing Divider */}
            <div className="mt-1 w-8 sm:w-10 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full shadow-[0_0_6px_#10b981]" />
          </div>
        </div>
      </div>
    </div>
  );
};
