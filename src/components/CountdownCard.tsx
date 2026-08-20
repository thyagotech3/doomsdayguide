import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface CountdownCardProps {
  compact?: boolean;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ compact = false }) => {
  // Premiere date in Brazil: December 17, 2026 (UTC-3)
  const targetDate = new Date('2026-12-17T00:00:00-03:00').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (compact) {
    return (
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/60 via-[#03060a] to-[#020407] border border-emerald-500/40 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-slate-300 font-medium">
            Estreia no Brasil: <strong className="text-emerald-400">17 de Dezembro de 2026</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400">
          <span>{timeLeft.days}d</span>
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
          <span className="text-emerald-300 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#06120b] via-[#03060a] to-[#010306] border border-emerald-500/50 p-4 sm:p-5 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10.5px] font-mono uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Contagem Regressiva Oficial Brasil
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">
            17 DE DEZEMBRO DE 2026
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
            Vingadores: Doomsday nos Cinemas Brasileiros
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            O retorno triunfal de Robert Downey Jr. como Victor Von Doom. Prepare-se completando a trilha antes do colapso multiversal!
          </p>
        </div>

        {/* Big Digit Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-slate-800 text-center shadow-inner">
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 leading-none">
              {timeLeft.days}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Dias
            </div>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-slate-800 text-center shadow-inner">
            <div className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Horas
            </div>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-slate-800 text-center shadow-inner">
            <div className="text-xl sm:text-2xl font-black font-mono text-white leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Minutos
            </div>
          </div>

          <div className="p-2 sm:p-3 rounded-xl bg-black/60 border border-emerald-500/40 text-center shadow-inner">
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-300 leading-none animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-emerald-400 uppercase tracking-wider mt-1">
              Segundos
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
