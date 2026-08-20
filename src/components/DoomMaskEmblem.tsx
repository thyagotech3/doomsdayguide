import React from 'react';
import { motion } from 'motion/react';

interface DoomMaskEmblemProps {
  onInteract?: () => void;
}

export const DoomMaskEmblem: React.FC<DoomMaskEmblemProps> = ({ onInteract }) => {
  return (
    <div
      onClick={onInteract}
      className="relative flex items-center justify-center cursor-pointer select-none group py-1 sm:py-3"
      id="doom-center-emblem"
    >
      {/* Outer Rotating Energy Ring 1 - Emerald Dashed */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full border border-emerald-500/20 border-dashed pointer-events-none"
      />

      {/* Outer Rotating Counter Ring 2 - Slate Titanium Dotted */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-slate-500/25 border-dotted pointer-events-none"
      />

      {/* Latverian Arcane Radial Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-40 h-40 sm:w-60 sm:h-60 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none"
      />

      {/* Main Sleek Multi-ring Architecture */}
      <div className="w-44 h-44 sm:w-64 sm:h-64 rounded-full border border-emerald-500/30 flex items-center justify-center relative transition-all duration-300 group-hover:border-emerald-500/60 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        {/* Top Glowing Diode from Theme */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full blur-[2px] opacity-80 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>

        {/* Second Ring */}
        <div className="w-38 h-38 sm:w-56 sm:h-56 rounded-full border border-slate-400/20 flex items-center justify-center">
          {/* Inner Core */}
          <div className="w-34 h-34 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-emerald-950/60 via-[#040906] to-emerald-900/30 border-2 sm:border-[3px] border-slate-400/90 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)] relative overflow-hidden group-hover:border-slate-200 transition-all duration-300 p-2">
            
            {/* Top Protocol Tag */}
            <div className="text-[7.5px] sm:text-[9px] text-emerald-400 font-bold tracking-[0.25em] uppercase mb-0.5 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]">
              INITIALIZE PROTOCOL
            </div>

            {/* Central Typography & Icon */}
            <div className="relative my-0 flex flex-col items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-9 h-9 sm:w-13 sm:h-13 flex items-center justify-center"
              >
                <svg
                  className="w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
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

            {/* High-contrast Headline from Design */}
            <div className="text-[11px] sm:text-sm font-black text-center leading-tight tracking-tighter text-slate-100 px-1 mt-0.5 uppercase">
              PREPARE-SE PARA<br />
              <span className="text-emerald-400 font-extrabold text-xs sm:text-base tracking-wider drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                DOOMSDAY
              </span>
            </div>

            {/* Titanium Divider Line */}
            <div className="mt-1 w-6 h-[1.5px] bg-slate-400/80 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
